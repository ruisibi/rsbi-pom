package com.ruisitech.bi.service.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ruisitech.bi.entity.common.DSColumn;
import com.ruisitech.bi.entity.model.DataSource;
import com.ruisitech.bi.entity.model.Dataset;
import com.ruisitech.bi.mapper.model.DatasetMapper;
import com.ruisitech.bi.mapper.model.DimensionMapper;
import com.ruisitech.bi.service.bireport.ModelCacheService;

@Service
public class DatasetService {

	@Autowired
	private DatasetMapper mapper;
	
	@Autowired
	private DataSourceService dsService;
	
	@Autowired
	private ModelCacheService cacheService;
	
	@Autowired
	private DimensionMapper dimMapper;
	
	public List<Dataset> listDataset(){
		return mapper.listDataset();
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void updateDset(Dataset ds){
		mapper.updateDset(ds);
		//同步立方体表的字段类型
		JSONObject obj = (JSONObject)JSON.parse(ds.getCfg());
		JSONArray cols = obj.getJSONArray("cols");
		for(int i=0; i<cols.size(); i++){
			JSONObject col = cols.getJSONObject(i);
			String isupdate = (String)col.get("isupdate");
			if("y".equals(isupdate)){
				String type = col.getString("type");
				Map<String,Object> param = new HashMap<String, Object>();
				param.put("vtype", type);
				param.put("tname", col.getString("tname"));
				param.put("col", col.getString("name"));
				param.put("dset", obj.get("dsetId"));
				dimMapper.updateColType(param);
			}
		}
		
		//删除缓存
		cacheService.removeDset(ds.getDsid());
	}
	
	/**
	 * 重新加载数据集的字段
	 * @param dsetId
	 * @throws Exception 
	 */
	public void reloadDset(String dsetId, String dsid) throws Exception{
		String cfg = mapper.getDatasetCfg(dsetId);
		JSONObject json = JSON.parseObject(cfg);
		JSONArray oldCols = json.getJSONArray("cols");
		List<DSColumn> cols = this.queryMetaAndIncome(json, dsid);
		//添加新的字段到原数据集中
		List<DSColumn> addList = new ArrayList<DSColumn>();
		for(DSColumn col : cols){
			if(!existCol(col.getName(), oldCols)){
				addList.add(col);
			}
		}
		if(addList.size() == 0){
			return;
		}
		for(DSColumn col : addList){
			oldCols.add(JSON.toJSON(col));
		}
		String newCfg = json.toJSONString();
		Dataset ds = new Dataset();
		ds.setDsetId(dsetId);
		ds.setCfg(newCfg);
		mapper.updateDsetCfg(ds);
	}
	
	private boolean existCol(String colName, JSONArray cols){
		boolean ext = false;
		for(int i=0; i<cols.size(); i++){
			JSONObject col = cols.getJSONObject(i);
			String name = col.getString("name");
			if(name.equals(colName)){
				ext = true;
				break;
			}
		}
		return ext;
	}
	
	public void insertDset(Dataset ds){
		mapper.insertDset(ds);
	}
	
	public void deleteDset(String dsetId){
		mapper.deleteDset(dsetId);
		//删除缓存
		cacheService.removeDset(dsetId);
	}
	
	public String getDatasetCfg(String dsetId){
		return mapper.getDatasetCfg(dsetId);
	}
	
	public List<DSColumn> listTableColumns(String dsid, String tname) throws Exception{
		DataSource ds = dsService.getDataSource(dsid);
		Connection conn = null;
		try {
			if(ds.getUse().equals("jndi")){
				conn = dsService.getJndi(ds);
			}else if(ds.getUse().equals("jdbc")){
				conn = dsService.getJDBC(ds);
			}
			String sql = "select * from "+ tname;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setMaxRows(1);
			ResultSet rs = ps.executeQuery();
			List<DSColumn> cols = copyValue(rs);
			rs.close();
			ps.close();
			return cols;
		}catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException("sql 执行报错.");
		}finally{
			if(conn != null){
				conn.close();
			}
		}
	}
	
	public List<DSColumn> copyValue(ResultSet rs) throws SQLException{
		ResultSetMetaData meta = rs.getMetaData();
		List<DSColumn> cols = new ArrayList<DSColumn>();
		for(int i=0; i<meta.getColumnCount(); i++){
			String name = meta.getColumnName(i+1);
			if(name.indexOf(".") >= 0){
				name = name.substring(name.indexOf(".") + 1, name.length());
			}
			String tp = meta.getColumnTypeName(i+1);
			//meta.get
			//tp转换
			tp = columnType2java(tp);
			DSColumn col = new DSColumn();
			col.setName(name);
			col.setType(tp);
			col.setIsshow(true);
			col.setIdx(i+1);
			if("Date".equals(tp)){
				//日期不设置长度
			}else{
				col.setLength(meta.getColumnDisplaySize(i + 1));
			}
			cols.add(col);
		}
		return cols;
	}
	
	public String columnType2java(String tp){
		tp = tp.replaceAll(" UNSIGNED", ""); //mysql 存在 UNSIGNED 类型, 比如： INT UNSIGNED
		String ret = null;
		if("varchar".equalsIgnoreCase(tp) || "varchar2".equalsIgnoreCase(tp) || "nvarchar".equalsIgnoreCase(tp) || "char".equalsIgnoreCase(tp)){
			ret = "String";
		}else if("int".equalsIgnoreCase(tp) || "MEDIUMINT".equalsIgnoreCase(tp) || "BIGINT".equalsIgnoreCase(tp) || "smallint".equalsIgnoreCase(tp) || "TINYINT".equalsIgnoreCase(tp)){
			ret = "Int";
		}else if("number".equalsIgnoreCase(tp) || "DECIMAL".equalsIgnoreCase(tp) || "Float".equalsIgnoreCase(tp) || "Double".equalsIgnoreCase(tp)){
			ret = "Double";
		}else if("DATETIME".equalsIgnoreCase(tp) || "DATE".equalsIgnoreCase(tp) || "Timestamp".equalsIgnoreCase(tp)){
			ret = "Date";
		}
		return ret;
	}
	
	/**
	 * 查询数据集的字段
	 * @param dataset
	 * @param dsid
	 * @return
	 * @throws Exception 
	 */
	public List<DSColumn> queryMetaAndIncome(JSONObject dataset, String dsid) throws Exception{
		DataSource ds = this.dsService.getDataSource(dsid);
		List<String> tables = new ArrayList<String>();
		//需要进行关联的表
		JSONArray joinTabs = (JSONArray)dataset.get("joininfo");
		//生成sql
		StringBuffer sb = new StringBuffer("select a0.* ");
		//添加 列的分隔符，方便识别列是从哪个表来
		if(joinTabs!=null&&joinTabs.size() != 0){ //无关联表，不需要该字段
			sb.append(",'' a$idx ");
		}
		
		List<String> tabs = new ArrayList<String>(); //需要进行关联的表，从joininfo中获取，剔除重复的表
		for(int i=0; joinTabs!=null&&i<joinTabs.size(); i++){
			JSONObject join = joinTabs.getJSONObject(i);
			String ref = join.getString("ref");
			if(!tabs.contains(ref)){
				tabs.add(ref);
			}
		}
		
		for(int i=0; i<tabs.size(); i++){
			sb.append(", a"+(i+1)+".* ");
			if(i != tabs.size() - 1){
				//添加 列的分隔符，方便识别列是从哪个表来
				sb.append(",'' a$idx");
			}
		}
		sb.append("from ");
		String master = dataset.getString("master");
		sb.append( master + " a0 ");
		tables.add(dataset.getString("master"));
		for(int i=0; i<tabs.size(); i++){
			String tab = tabs.get(i);
			sb.append(", " +tab);
			sb.append(" a"+(i+1)+" ");
			tables.add(tab);
		}
		sb.append("where 1=2 ");
		for(int i=0; i<tabs.size(); i++){
			String tab = tabs.get(i);
			List<JSONObject> refs = getJoinInfoByTname(tab, joinTabs);
			for(int k=0; k<refs.size(); k++){
				JSONObject t = refs.get(k);
				sb.append("and a0."+t.getString("col")+"=a"+(i+1)+"."+t.getString("refKey"));
				sb.append(" ");
			}
		}
		
		Connection conn  = null;
		try {
			if(ds.getUse().equals("jndi")){
				conn = this.dsService.getJndi(ds);
			}else if(ds.getUse().equals("jdbc")){
				conn = this.dsService.getJDBC(ds);
			}
			PreparedStatement ps = conn.prepareStatement(sb.toString());
			ps.setMaxRows(1);
			ResultSet rs = ps.executeQuery();
			
			ResultSetMetaData meta = rs.getMetaData();
			List<DSColumn> cols = new ArrayList<DSColumn>();
			String tname = tables.get(0);
			int idx = 1;
			for(int i=0; i<meta.getColumnCount(); i++){
				String name = meta.getColumnName(i+1);
				if(name.indexOf(".") >= 0){
					name = name.substring(name.indexOf(".") + 1, name.length());
				}
				String tp = meta.getColumnTypeName(i+1);
				//遇到a$idx 表示字段做分割, 需要变换字段所属表信息
				if("a$idx".equalsIgnoreCase(name)){
					tname = tables.get(idx);
					idx++;
					continue;
				}
				tp = columnType2java(tp);
				DSColumn col = new DSColumn();
				col.setIdx(idx);
				col.setDispName("");
				col.setExpression("");
				col.setName(name);
				col.setType(tp);
				col.setTname(tname);
				col.setIsshow(true);
				cols.add(col);
			}
			rs.close();
			ps.close();
			return cols;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException("sql 执行报错.");
		}finally{
			if(conn != null){
				conn.close();
			}
		}
	}
	
	private List<JSONObject> getJoinInfoByTname(String tname, JSONArray joins){
		List<JSONObject> ret = new ArrayList<JSONObject>();
		for(int i=0; joins!=null&&i<joins.size(); i++){
			JSONObject join = joins.getJSONObject(i);
			String ref = join.getString("ref");
			if(ref.equals(tname)){
				ret.add(join);
			}
		}
		return ret;
	}
}
