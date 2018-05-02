package com.ruisitech.bi.service.portal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.init.TemplateManager;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ext.engine.view.context.grid.PageInfo;
import com.ruisi.ext.engine.view.context.gridreport.GridCell;
import com.ruisi.ext.engine.view.context.gridreport.GridReportContext;
import com.ruisi.ext.engine.view.context.gridreport.GridReportContextImpl;
import com.ruisitech.bi.entity.portal.CompParamDto;
import com.ruisitech.bi.entity.portal.GridColDto;
import com.ruisitech.bi.entity.portal.GridQuery;
import com.ruisitech.bi.service.bireport.BaseCompService;
import com.ruisitech.bi.service.bireport.ModelCacheService;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class GridService extends BaseCompService {
	
	public final static String deftMvId = "mv.portal.gridReport";
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
	
	@Autowired
	private DataControlInterface dataControl; //数据权限控制
	
	@Autowired
	private ModelCacheService cacheService;
	
	public @PostConstruct void init() {
		
	}  
	
	public @PreDestroy void destory() {
		mvParams.clear();
	}
	
	public MVContext json2MV(GridQuery grid) throws Exception{
		
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		//处理参数,把参数设为hidden
		parserHiddenParam(grid.getPortalParams(), mv, this.mvParams);
		
		//创建corssReport
		GridReportContext cr = json2Grid(grid);
		//设置ID
		String id = ExtConstants.reportIdPrefix + IdCreater.create();
		cr.setId(id);
		
		//创建数据sql
		String sql = this.createSql(grid);
		String name = TemplateManager.getInstance().createTemplate(sql);
		cr.setTemplateName(name);
		
		
		mv.getChildren().add(cr);
		cr.setParent(mv);
		
		Map<String, GridReportContext> crs = new HashMap<String, GridReportContext>();
		crs.put(cr.getId(), cr);
		mv.setGridReports(crs);
		
		//设置数据集
		String dsid = super.createDsource(this.cacheService.getDsource(grid.getDsid()), mv);
		cr.setRefDsource(dsid);
		
		return mv;
	}

	public GridReportContext json2Grid(GridQuery gridJson){
		GridReportContext grid = new GridReportContextImpl();
		Integer height = gridJson.getHeight();
		grid.setOut("lockUI");
		if(height != null){
			grid.setHeight(String.valueOf(height));
		}
		List<GridColDto> cols = gridJson.getCols();
		//生成head
		GridCell[][] headers = new GridCell[1][cols.size()];
		for(int i=0; i<cols.size(); i++){
			GridColDto col = cols.get(i);
			GridCell cell = new GridCell();
			cell.setColSpan(1);
			cell.setRowSpan(1);
			String name = col.getName();
			String id = col.getId();
			String dispName = col.getDispName();
			cell.setDesc(dispName == null || dispName.length() == 0 ? name : dispName);
			cell.setAlias(id);
			headers[0][i] = cell;
		}
		grid.setHeaders(headers);
		
		//生成Detail
		GridCell[][] detail = new GridCell[1][cols.size()];
		for(int i=0; i<cols.size(); i++){
			GridColDto col = cols.get(i);
			GridCell cell = new GridCell();
			String id = col.getId();
			String type = col.getType();
			cell.setAlias(id);
			String fmt = col.getFmt();
			String align = col.getAlign();
			if(fmt != null && fmt.length() > 0){
				cell.setFormatPattern(fmt);
			}
			if(align != null && align.length() > 0){
				cell.setAlign(align);
			}
			detail[0][i] = cell;
		}
		grid.setDetails(detail);
		
		//设置分页
		Integer pageSize = gridJson.getPageSize();
		if(pageSize == null){
			pageSize = 10;
		}
		PageInfo page = new PageInfo();
		page.setPagesize(pageSize);
		//是否禁用分页
		String isnotfy = gridJson.getIsnotfy();
		if("true".equals(isnotfy)){
			
		}else{
			grid.setPageInfo(page);
		}
		return grid;
	}
	
	public String createSql(GridQuery grid){
		JSONObject dset = this.cacheService.getDset(grid.getDsetId());
		Map<String, String> tableAlias = createTableAlias(dset);
		StringBuffer sb = new StringBuffer("select ");
		List<GridColDto> cols = grid.getCols();
		for(int i=0; i<cols.size(); i++){
			GridColDto col = cols.get(i);
			String tname = col.getTname();
			String name = col.getName();
			String expression = col.getExpression();  //表达式字段
			if(expression != null && expression.length() > 0){
				sb.append(" "+ expression + " as " + name);
			}else{
				sb.append(" "+tableAlias.get(tname)+"."+name);
			}
			if(i != cols.size() - 1){
				sb.append(",");
			}
		}
		JSONArray joinTabs = (JSONArray)dset.get("joininfo");
		String master = dset.getString("master");
		sb.append(" from " + master + " a0");
		
		for(int i=0; joinTabs!=null&&i<joinTabs.size(); i++){  //通过主表关联
			JSONObject tab = joinTabs.getJSONObject(i);
			String ref = tab.getString("ref");
			String refKey = tab.getString("refKey");
			String jtype = (String)tab.get("jtype");
			if("left".equals(jtype) || "right".equals(jtype)){
				sb.append(" " + jtype);
			}
			sb.append(" join " + ref+ " " + tableAlias.get(ref));
			sb.append(" on a0."+tab.getString("col")+"="+tableAlias.get(ref)+"."+refKey);
			sb.append(" ");
			
		}
		sb.append(" where 1=1 ");
		//数据权限
		if(dataControl != null){
			String ret = dataControl.process(RSBIUtils.getLoginUserInfo(), master);
			if(ret != null){
				sb.append(ret + " ");
			}
		}
		
		//添加参数筛选
		List<CompParamDto> compParams = grid.getParams();
		for(int i=0; compParams!=null&&i<compParams.size(); i++){
			CompParamDto param = compParams.get(i);
			String col = param.getCol();
			String tname = param.getTname();
			String expression = param.getExpression();  //如果有表达式，用表达式替换 字段
			if(expression != null && expression.length() > 0) {
				col = expression;
			}else{
				col = tableAlias.get(tname)+"." + col;
			}
			String type = param.getType();
			String val = param.getVal();
			String val2 = param.getVal2();
			String valuetype = param.getValuetype();
			String usetype = param.getUsetype();
			String linkparam = param.getLinkparam();
			String linkparam2 = param.getLinkparam2();
			
			
			if(type.equals("like")){
				if(val != null){
					val = "%"+val+"%";
				}
				if(val2 != null){
					val2 = "%"+val2+"%";
				}
			}
			if("string".equals(valuetype)){
				if(val != null){
					if("in".equals(type)){  //in需要把数据用逗号分隔的重新生成
						String[] vls = val.split(",");
						val = "";
						for(int j=0; j<vls.length; j++){
							val = val + "'" + vls[j] + "'";
							if(j != vls.length - 1){
								val = val + ",";
							}
						}
					}else{
						val = "'" + val + "'";
					}
				}
				if(val2 != null){
					val2 = "'" + val2 + "'";
				}
			}
			if(type.equals("between")){
				if(usetype.equals("gdz")){
					sb.append(" and " +  col + " " + type + " " + val + " and " + val2);
				}else{
					sb.append("#if([x]"+linkparam+" != '' && [x]"+linkparam2+" != '') ");
					sb.append(" and "  + col + " " + type + " " + ("string".equals(valuetype)?"'":"") + "[x]"+linkparam +("string".equals(valuetype)?"'":"") + " and " + ("string".equals(valuetype)?"'":"")+ "[x]"+linkparam2 + ("string".equals(valuetype)?"'":"") + " #end");
				}
			}else if(type.equals("in")){
				if(usetype.equals("gdz")){
					sb.append(" and " + col + " in (" + val + ")");
				}else{
					sb.append("#if([x]"+linkparam+" != '') ");
					sb.append(" and " + col + " in (" + "$extUtils.printVals([x]"+linkparam + ", '"+valuetype+"'))");
					sb.append("  #end");
				}
			}else{
				if(usetype.equals("gdz")){
					sb.append(" and " + col + " " + type + " " + val);
				}else{
					sb.append("#if([x]"+linkparam+" != '') ");
					sb.append(" and " + col + " "+type+" " + ("string".equals(valuetype) ? "'"+("like".equals(type)?"%":"")+""+"[x]"+linkparam+""+("like".equals(type)?"%":"")+"'":"[x]"+linkparam) + "");
					sb.append("  #end");
				}
			}
		}
		//排序字段
		for(int i=0; i<cols.size(); i++){
			GridColDto col = cols.get(i);
			String id = col.getId();
			String sort = col.getSort();
			String tname = col.getTname();
			String expression = col.getExpression();
			if(sort != null && sort.length() > 0){
				sb.append(" order by "+(expression != null && expression.length() > 0 ? "" :tableAlias.get(tname)+".") + id + " ");
				sb.append(sort);
				break;
			}
		}
		return sb.toString().replaceAll("@", "'").replaceAll("\\[x\\]", "\\$");
	}

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}
	
}
