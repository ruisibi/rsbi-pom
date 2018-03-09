package com.ruisitech.bi.service.portal;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
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
import com.ruisi.ext.engine.view.context.cross.BaseKpiField;
import com.ruisi.ext.engine.view.context.cross.CrossKpi;
import com.ruisi.ext.engine.view.context.cross.CrossReportContext;
import com.ruisi.ext.engine.view.context.cross.RowDimContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContextImpl;
import com.ruisi.ext.engine.view.context.dc.grid.GridSetConfContext;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ext.engine.view.context.form.TextFieldContext;
import com.ruisi.ext.engine.view.context.form.TextFieldContextImpl;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.bireport.TableQueryDto;
import com.ruisitech.bi.entity.portal.PortalTableQuery;
import com.ruisitech.bi.service.bireport.BaseCompService;
import com.ruisitech.bi.service.bireport.ModelCacheService;
import com.ruisitech.bi.service.bireport.TableService;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class PortalTableService  extends BaseCompService {

	public final static String deftMvId = "mv.portal.table";
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
	
	private DataControlInterface dataControl; //数据权限控制
	
	@Autowired
	private ModelCacheService cacheService;
	
	@Autowired
	private TableService tableService;
	
	public @PostConstruct void init() {
		String clazz = ExtContext.getInstance().getConstant("dataControl");
		if(clazz != null && clazz.length() != 0){
			try {
				dataControl = (DataControlInterface)Class.forName(clazz).newInstance();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
	}  
	
	public @PreDestroy void destory() {
		mvParams.clear();
	}
	
	/**
	 * 生成表格SQL
	 * @param sqlVO
	 * @param tinfo
	 * @param params
	 * @param release  判断当前是否为发布状态, 0 表示不是发布，1表示发布到多维分析，2表示发布到仪表盘
	 * @param drillLevel 是否有钻取，从0开始, 0表示不钻取，1表示钻取一层，以此类推
	 * @return
	 * @throws ParseException
	 */
	public String createSql(PortalTableQuery table, int release, int drillLevel) throws ParseException{
		JSONObject dset = cacheService.getDset(table.getDsetId());
		Map<String, String> tableAlias = super.createTableAlias(dset);
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		List<DimDto> dims = table.getDims();
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			String t = dim.getTname();
			String key = dim.getTableColKey();
			String txt = dim.getTableColName();
			String tname = dim.getTableName();
			int iscalc = dim.getCalc();
			if(key != null && txt != null && key.length() >0 && txt.length() >0){
				sql.append(tableAlias.get(tname)+"."+key+", "+tableAlias.get(tname)+"." + txt + ",");
			}else{
				if(iscalc == 1){
					sql.append(dim.getColname()+" "+dim.getAlias()+", ");
				}else{
					sql.append(tableAlias.get(t)+"."+dim.getColname()+" "+dim.getAlias()+", ");
				}
			}
			
		}
		
		//处理钻取维
		List<Map<String, Object>> drillDim = table.getDrillDim();
		if(drillDim != null && drillDim.size() >= drillLevel){
			for(int i=0; i<drillLevel; i++){
				Map<String, Object> dim = drillDim.get(i);
				String key = (String)dim.get("tableColKey");
				String txt = (String)dim.get("tableColName");
				String tname = (String)dim.get("tableName");
				String t = (String)dim.get("tname");
				int iscalc = (Integer)dim.get("calc");
				if(key != null && txt != null && key.length() >0 && txt.length() >0){
					sql.append(tableAlias.get(tname)+"."+key+", "+ tableAlias.get(tname) +"." + txt + ",");
				}else{
					if(iscalc == 1){
						sql.append(dim.get("colname")+" "+dim.get("code")+", ");
					}else{
						sql.append(tableAlias.get(t)+"."+dim.get("colname")+" "+dim.get("code")+", ");
					}
				}
			}
			
		}
		
		List<KpiDto> kpis = table.getKpiJson();
		if(kpis.size() == 0){
			sql.append(" null kpi_value ");
		}else{
			for(int i=0; i<kpis.size(); i++){
				KpiDto kpi = kpis.get(i);
				//if(kpi.getRate() == null){
					sql.append(kpi.getCol_name() + " ");
				//}else{
				//	sql.append("(" + kpi.getColName() + ")/"+kpi.getRate()+" ");
				//}
				sql.append(kpi.getAlias());
				
				if(i != kpis.size() - 1){
					sql.append(",");
				}
			}
		}
		
		//如果名字是SQL，加括号，是表名不加括号
		JSONArray joinTabs = (JSONArray)dset.get("joininfo");
		String master = dset.getString("master");
		sql.append(" from " + master + " a0");
		
		for(int i=0; joinTabs!=null&&i<joinTabs.size(); i++){  //通过主表关联
			JSONObject tab = joinTabs.getJSONObject(i);
			String ref = tab.getString("ref");
			String refKey = tab.getString("refKey");
			String jtype = (String)tab.get("jtype");
			if("left".equals(jtype) || "right".equals(jtype)){
				sql.append(" " + jtype);
			}
			sql.append(" join " + ref+ " " + tableAlias.get(ref));
			sql.append(" on a0."+tab.getString("col")+"="+tableAlias.get(ref)+"."+refKey);
			sql.append(" ");
			
		}
		sql.append(" where 1=1 ");
		
		//数据权限
		if(dataControl != null){
			String ret = dataControl.process(RSBIUtils.getLoginUserInfo(), dset.getString("master"));
			if(ret != null){
				sql.append(ret + " ");
			}
		}
		
		//限制参数的查询条件
		sql.append(dealCubeParams(table.getParams(), tableAlias));
		
		//在钻取的时候设置过滤
		if(drillLevel == 1 && table.getRows().size() == 1) {
			DimDto row = table.getRows().get(0);
			String valType = row.getValType();
			String tname = row.getTname();
			if("String".equalsIgnoreCase(valType)){
				sql.append(" and "+ (row.getCalc() == 1 ?"":tableAlias.get(tname)+".") + row.getColname()+" = '$"+row.getAlias()+"'");
			}else{
				sql.append(" and " + (row.getCalc() == 1 ?"":tableAlias.get(tname)+".") + row.getColname()+" = $"+row.getAlias());
			}
		}
		
		//处理事件接受的参数限制条件
		Map<String, Object> linkAccept = table.getLinkAccept();
		if(linkAccept != null && !linkAccept.isEmpty()){
			String col = (String)linkAccept.get("col");
			String alias = (String)linkAccept.get("alias");
			String valtype = (String)linkAccept.get("valType");
			String tname = (String)linkAccept.get("tname");  //维度来源表
			String dimTname = (String)linkAccept.get("dim_tname");  //维度映射的表 
			String ncol = "$" + alias;
			if("string".equalsIgnoreCase(valtype)){
				ncol = "'" + ncol + "'";
			}
			sql.append("#if($"+alias+" != '') and  "+tableAlias.get(dimTname == null || dimTname.length() == 0 ? tname:dimTname)+"." + col + " = " + ncol + " #end");
		}
		
		if(dims.size() > 0){
			sql.append(" group by ");
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				String key = dim.getTableColKey();
				String txt = dim.getTableColName();
				String tname = dim.getTableName();
				String t = dim.getTname();
				int calc = dim.getCalc();
				if(key != null && txt != null && key.length() >0 && txt.length() >0){
					sql.append(tableAlias.get(tname) + "." + key+", "+ tableAlias.get(tname) +"." + txt);
				}else{
					if(calc == 1){
						sql.append(dim.getColname());
					}else{
						sql.append(tableAlias.get(t) + "."+ dim.getColname());
					}
				}
				if(i != dims.size() - 1){
					sql.append(",");
				}
			}
			//钻取的group by
			if(drillDim != null && drillDim.size() >= drillLevel){
				for(int i=0; i<drillLevel; i++){
					Map<String, Object> dim = drillDim.get(i);
					String key = (String)dim.get("tableColKey");
					String txt = (String)dim.get("tableColName");
					String tname = (String)dim.get("tableName");
					String t = (String)dim.get("tname");
					int iscalc = (Integer)dim.get("calc");
					if(key != null && txt != null && key.length() >0 && txt.length() >0){
						sql.append("," + (iscalc == 1 ? "":tableAlias.get(tname) + ".") + key);
					}else{
						sql.append("," + (iscalc == 1 ?"":tableAlias.get(t) + ".") + dim.get("code"));
					}
				}
			}
		}
		//处理指标过滤
		/**
		StringBuffer filter = new StringBuffer("");
		for(KpiInfo kpi : sqlVO.getKpis()){
			if(kpi.getFilter() != null){
				filter.append(" and "+kpi.getColName()+" ");
				String tp = kpi.getFilter().getFilterType();
				filter.append(tp);
				filter.append(" ");
				double val1 = kpi.getFilter().getVal1();
				if(kpi.getFmt() != null && kpi.getFmt().endsWith("%")){
					val1 = val1 / 100;
				}
				filter.append(val1 * (kpi.getRate() == null ? 1 : kpi.getRate()));
				if("between".equals(tp)){
					double val2 = kpi.getFilter().getVal2();
					if(kpi.getFmt() != null && kpi.getFmt().endsWith("%")){
						val2 = val2 / 100;
					}
					filter.append(" and " + val2 * (kpi.getRate() == null ? 1 : kpi.getRate()));
				}
			}
		}
		**/
		String retSql = null;
		
		if(dims.size() > 0){
			StringBuffer order = new StringBuffer();
			order.append(" order by ");
			//先按col排序
			for(int i=0; i<table.getCols().size(); i++){
				DimDto dim = table.getCols().get(i);
				if(dim.getDimord() != null && dim.getDimord().length() > 0){
					if(dim.getOrdcol() != null && dim.getOrdcol().length() > 0){  //处理维度排序
						order.append(dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						order.append(dim.getColname() + " " + dim.getDimord() + ",");
					}
				}
			}
			//判断是否按指标排序
			for(int i=0; i<kpis.size(); i++){
				KpiDto kpi = kpis.get(i);
				if(kpi.getSort() != null && kpi.getSort().length() > 0){
					order.append(kpi.getAlias() + " " + kpi.getSort());
					order.append(",");
				}
			}
			
			//再按row排序
			for(int i=0; i<table.getRows().size(); i++){
				DimDto dim = table.getRows().get(i);
				if(dim.getDimord() != null && dim.getDimord().length() > 0){
					if(dim.getOrdcol() != null && dim.getOrdcol().length() > 0){  //处理维度排序
						order.append(dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						order.append(dim.getColname() + " " + dim.getDimord() + ",");
					}
				}
			}
			
			
			if(order.length() <= 11 ){  //判断是否拼接了 order by 字段
				retSql = sql.toString();
			}else{
				//返回前先去除最后的逗号
				retSql = sql + order.toString().substring(0, order.length() - 1);
			}
		}else{
			retSql =  sql.toString();
		}
		return retSql.replaceAll("@", "'");
	}
	
	/**
	 * 门户使用的JSON2MV对象
	 */
	public MVContext json2MV(PortalTableQuery table) throws Exception{
		
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		//处理参数,把参数设为hidden
		parserHiddenParam(table.getPortalParams(), mv, this.mvParams);
		
		//创建corssReport
		TableQueryDto dto = new TableQueryDto();
		dto.setCompId(table.getId());
		dto.setLink(table.getLink());
		dto.setDrillDim(table.getDrillDim());
		dto.setCols(table.getCols());
		dto.setRows(table.getRows());
		dto.setKpiJson(table.getKpiJson());
		CrossReportContext cr = null;
		//处理kpiOther
		CrossKpi mybaseKpi = null;
		List<DimDto> cols = table.getCols();
		if(cols.size() > 0 && table.getKpiJson().size() == 1){
			//如果只有一个指标，并且具有列维度，放入baseKpi
			KpiDto kpi = table.getKpiJson().get(0);
			CrossKpi baseKpi = new BaseKpiField();
			baseKpi.setAggregation(kpi.getAggre());
			baseKpi.setAlias(kpi.getAlias());
			baseKpi.setFormatPattern(kpi.getFmt());
			baseKpi.setKpiRate(kpi.getRate() == null ? null : new BigDecimal(kpi.getRate()));
			mybaseKpi = baseKpi;
			cr = tableService.json2Table(dto);
			cr.setBaseKpi(mybaseKpi);
		}else{
			DimDto kpiOther = new DimDto();
			kpiOther.setType("kpiOther");
			cols.add(kpiOther);
			cr = tableService.json2Table(dto);
			cols.remove(cols.size() - 1);
		}
		//设置ID
		String id = ExtConstants.reportIdPrefix + IdCreater.create();
		cr.setId(id);
		cr.setOut("lockUI");
		String height =  table.getHeight();
		if(height != null && height.length() > 0){
			cr.setHeight(height);
		}
		cr.setShowData(true);
		
		//创建datacenter
		String sql = this.createSql(table, 0, 0);
		GridDataCenterContext dc = this.createDataCenter(sql, table);
		cr.setRefDataCetner(dc.getId());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		
		//判断是否有钻取维
		List<RowDimContext> drillDims = cr.getDims();
		for(int i=0; drillDims!=null&&i<drillDims.size(); i++){ 
			RowDimContext drillDim = drillDims.get(i);
			//生成钻取维的DataCenter
			sql = this.createSql(table, 0, i+1);
			GridDataCenterContext drillDc = this.createDataCenter(sql, table);
			drillDim.setRefDataCenter(drillDc.getId());
			mv.getGridDataCenters().put(drillDc.getId(), drillDc);
		}
		
		mv.getChildren().add(cr);
		cr.setParent(mv);
		
		//判断是否有事件，是否需要添加参数
		Map<String, Object> linkAccept = table.getLinkAccept();
		if(linkAccept != null && !linkAccept.isEmpty()){
			//创建参数
			TextFieldContext linkText = new TextFieldContextImpl();
			linkText.setType("hidden");
			linkText.setDefaultValue((String)linkAccept.get("dftval"));
			linkText.setId((String)linkAccept.get("col"));
			linkText.setShow(true);
			mv.getChildren().add(0, linkText);
			linkText.setParent(mv);
			this.mvParams.put(linkText.getId(), linkText);
			ExtContext.getInstance().putServiceParam(mv.getMvid(), linkText.getId(), linkText);
			mv.setShowForm(true);
		}
		
		Map<String, CrossReportContext> crs = new HashMap<String, CrossReportContext>();
		crs.put(cr.getId(), cr);
		mv.setCrossReports(crs);
		
		//处理scripts
		String scripts = tableService.getScripts().toString();
		if(scripts.length() > 0){
			mv.setScripts(scripts);
		}
		//数据源
		String dsid = createDsource(this.cacheService.getDsource(table.getDsid()), mv);
		dc.getConf().setRefDsource(dsid);
		return mv;
	}
	
	/**
	 * 创建表格datacenter
	 * @param sql
	 * @return
	 * @throws IOException
	 */
	public GridDataCenterContext createDataCenter(String sql, PortalTableQuery table) throws IOException{
		GridDataCenterContext ctx = new GridDataCenterContextImpl();
		GridSetConfContext conf = new GridSetConfContext();
		ctx.setConf(conf);
		ctx.setId("DC-" + IdCreater.create());
		String name = TemplateManager.getInstance().createTemplate(sql);
		ctx.getConf().setTemplateName(name);
		
		return ctx;
	}

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}

	public TableService getTableService() {
		return tableService;
	}
	
}
