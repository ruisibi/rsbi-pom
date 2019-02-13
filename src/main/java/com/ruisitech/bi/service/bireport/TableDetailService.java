package com.ruisitech.bi.service.bireport;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableCell;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ruisi.ext.engine.dao.DaoHelper;
import com.ruisi.ext.engine.util.DaoUtils;
import com.ruisi.ext.engine.view.builder.dsource.DataSourceBuilder;
import com.ruisi.ext.engine.view.context.dsource.DataSourceContext;
import com.ruisi.ext.engine.view.context.grid.PageInfo;
import com.ruisi.ext.engine.wrapper.ExtRequest;
import com.ruisi.ext.engine.wrapper.TestRequestImpl;
import com.ruisitech.bi.entity.bireport.TableDetailDto;
import com.ruisitech.bi.entity.model.DataSource;

/**
 * 提取表格明细Service
 * @author hq
 *
 */
@Service
public class TableDetailService extends BaseCompService {
	
	@Autowired
	private ModelCacheService cacheService;
	
	/**
	 * 获取表格的字段
	 * @param tid
	 * @return
	 */
	public JSONArray getTableHeader(TableDetailDto dto){
		JSONObject dset = cacheService.getDset(dto.getDsetId());
		JSONArray cols = dset.getJSONArray("cols");
		return cols;
	}
	
	/**
	 * 根据纬度提取明细
	 * @param tid
	 * @return
	 */
	public List<Map<String, Object>> detailDatas(TableDetailDto dto){
		JSONObject dset = cacheService.getDset(dto.getDsetId());
		String sql = this.createSql(dset, dto.getPms());
		PageInfo page = new PageInfo();
		if(dto.getPage() != null){
			page.setCurtpage(dto.getPage() - 1);
		}
		if(dto.getRows() != null){
			page.setPagesize(dto.getRows());
		}
		List<Map<String, Object>> ls = this.querySql(sql, page, dto);
		dto.setTotal((int)page.getAllsize());
		return ls;
	}
	
	private List<Map<String, Object>> querySql(String sql, PageInfo page, TableDetailDto dto){
		DataSource ds = this.cacheService.getDsource(dto.getDsid());
		DataSourceContext dsource = new DataSourceContext();
		dsource.putProperty("id", ds.getDsid());
		String use = dsource.getUse();
		dsource.putProperty("usetype", use);
		if(use == null || "jdbc".equalsIgnoreCase(use.toString())){
			String linktype = ds.getLinkType();
			dsource.putProperty("linktype", linktype);
			dsource.putProperty("linkname", ds.getLinkName());
			dsource.putProperty("linkpwd", ds.getLinkPwd());
			dsource.putProperty("linkurl", ds.getLinkUrl());
		}else{
			dsource.putProperty("jndiname", ds.getJndiName());
		}
		if(page == null){
			return new DataSourceBuilder().queryForList(sql, dsource);
		}else{
			ExtRequest req =  new TestRequestImpl(null, null);
			return new DataSourceBuilder().queryForList(sql, dsource, page, req);
		}
	}
	
	public String createSql(JSONObject dset, Map<String, String> pms){
		//获取表
		Map<String, String> tableAlias = super.createTableAlias(dset);
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("select ");
		JSONArray cols = dset.getJSONArray("cols");
		for(int i=0; i<cols.size(); i++){
			JSONObject col = cols.getJSONObject(i);
			String tname = col.getString("tname");
			String name = col.getString("name");
			sb.append(tableAlias.get(tname));
			sb.append(".");
			sb.append(name);
			sb.append(" as ");
			sb.append("c" + i);
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
		for(Map.Entry<String, String> p : pms.entrySet()){
			String name = p.getKey();
			String val = p.getValue();
			JSONObject col = findColByAlias(name, dset);
			String tname = col.getString("tname");
			String colname = col.getString("name");
			String expression = col.getString("expression");
			if(expression != null && expression.length() > 0){
				colname = expression;
			}
			String type = col.getString("type");
			if("Double".equalsIgnoreCase(type) || "Int".equalsIgnoreCase(type)){
				sb.append(" and " +  (expression == null || expression.length() == 0 ?tableAlias.get(tname) + ".":"") +colname  + " = " + val);
			}else{
				sb.append(" and " + (expression == null || expression.length() == 0 ?tableAlias.get(tname) + ".":"") + colname + " = '" + val+"'");
			}
		}
		return sb.toString().replaceAll("@", "'");
	}
	
	private JSONObject findColByAlias(String alias, JSONObject dset){
		JSONObject ret = null;
		JSONArray cols = dset.getJSONArray("cols");
		for(int i=0; i<cols.size(); i++){
			JSONObject col = cols.getJSONObject(i);
			String name = col.getString("name");
			if(name.equalsIgnoreCase(alias)){
				ret = col;
				break;
			}
		}
		if(ret == null){
			//查找动态字段
			JSONArray dyans = dset.getJSONArray("dynamic");
			for(int i=0; i<dyans.size(); i++){
				JSONObject dyan = dyans.getJSONObject(i);
				String name = dyan.getString("name");
				if(name.equals(alias)){
					ret = dyan;
					break;
				}
			}
		}
		return ret;
	}
	
	public void exportDatas(TableDetailDto dto, HttpServletResponse res) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		JSONObject dset = cacheService.getDset(dto.getDsetId());
		String sql = this.createSql(dset, dto.getPms());
		List<Map<String, Object>> ls = this.querySql(sql, null, dto);
		OutputStream os =  res.getOutputStream();
		WritableWorkbook workbook = Workbook.createWorkbook( os );
		WritableSheet sheet = workbook.createSheet( "页1", 0);
		//写head
		JSONArray cols = dset.getJSONArray("cols");
		for(int i=0; i<cols.size(); i++){
			JSONObject col = cols.getJSONObject(i);
			WritableCell cell = new Label( i, 0, col.getString("name") );
			sheet.addCell(cell);
		}
		//写数据
		for(int i=0; i<ls.size(); i++){
			Map<String, Object> data = ls.get(i);
			for(int j=0; j<cols.size(); j++){
				//JSONObject col = cols.getJSONObject(i);
				WritableCell cell = null;
				Object value = data.get("c"+j);
				if(value == null){
					cell = new Label( j, i, "" );
				}else{
					if(value instanceof Date){
						Date d = (Date)value;
						cell = new Label( j, i + 1, sdf.format( d ) );
					}else if(value instanceof Integer){
						cell = new Number(j, i + 1, ((Integer) value).intValue());
					}else if(value instanceof Double){
						cell = new Number(j, i + 1, ((Double) value).doubleValue());
					} else if(value instanceof BigDecimal) {
						cell = new Number(j, i + 1, ((BigDecimal) value).doubleValue());
					}else{
						cell = new Label( j, i + 1, value.toString() );
					}
				}
				sheet.addCell( cell );
			}
		}
		workbook.write( );
		workbook.close( );
	}

}
