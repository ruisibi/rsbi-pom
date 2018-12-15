package com.ruisitech.bi.service.bireport;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.bireport.OlapInfo;
import com.ruisitech.bi.entity.model.DataSource;
import com.ruisitech.bi.entity.model.Dimension;
import com.ruisitech.bi.mapper.bireport.OlapMapper;
import com.ruisitech.bi.mapper.model.DataSourceMapper;
import com.ruisitech.bi.mapper.model.DimensionMapper;
import com.ruisitech.bi.service.model.DataSourceService;

@Service
public class OlapService {

	@Autowired
	private OlapMapper mapper;
	
	@Autowired
	private DimensionMapper dimMapper;
	
	@Autowired
	private DataSourceMapper dsMapper;
	
	@Autowired
	private DataSourceService dsService;
	
	public List<Map<String, Object>> listDims(Integer cubeId){
		return mapper.listDims(cubeId);
	}
	
	public OlapInfo getOlap(Integer pageId){
		return mapper.getOlap(pageId);
	}
	
	public List<OlapInfo> listreport(String keyword){
		return mapper.listreport(keyword);
	}
	
	public void insertOlap(OlapInfo olap){
		mapper.insertOlap(olap);
	}
	
	public void updateOlap(OlapInfo olap){
		mapper.updateOlap(olap);
	}
	
	public void deleteOlap(Integer pageId){
		mapper.deleteOlap(pageId);
	}
	
	public void renameOlap(OlapInfo olap){
		mapper.renameOlap(olap);
	}
	
	public Integer maxOlapId(){
		return mapper.maxOlapId();
	}
	
	public Integer olapExist(String pageName){
		return mapper.olapExist(pageName);
	}
	
	public List<Map<String, Object>> paramFilter(Dimension d, String keyword, String dsid) throws Exception{
		//查询事实表
		String col = d.getCol();
		String key = d.getColkey();
		String name = d.getColtext();
		String dimord = d.getDimord();
		String tname = d.getTname();
		String coltable = d.getColTable();
		String sql = "select distinct " +  (key==null||key.length() == 0 ? col : key) + " \"id\", " + (name==null||name.length() == 0 ?col:name) + " \"name\" from ";
		sql += (coltable == null || coltable.length() == 0 ? tname : coltable);
		if(keyword != null && keyword.length() > 0){
			sql += " where "+(name==null||name.length() == 0 ?col:name)+" like '%"+keyword+"%'";
		}
		if(dimord != null && dimord.length() > 0){
			sql += " order by " + (key==null||key.length() == 0 ? col : key)+ " " + dimord;
		}
		sql = sql.replaceAll("@", "'");
		
		DataSource ds = dsMapper.getDataSource(dsid);
		List<Map<String, Object>> ret = this.queryTopN(sql, ds, 100);
		return ret;
	}
	
	public List<Map<String, Object>> queryTopN(String sql, DataSource ds, int n) throws Exception{
		Connection conn  = null;
		try {
			List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>();
			if(ds.getUse().equals("jndi")){
				conn = dsService.getJndi(ds);
			}else if(ds.getUse().equals("jdbc")){
				conn = dsService.getJDBC(ds);
			}
			
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setMaxRows(n);
			ResultSet rs = ps.executeQuery();
			
			ResultSetMetaData meta = rs.getMetaData();
			List<String> cols = new ArrayList<String>();
			for(int i=0; i<meta.getColumnCount(); i++){
				String name = meta.getColumnLabel(i+1);
				cols.add(name);
			}
			//ret.add(cols);
			int idx = 0;
			while(rs.next() && idx <= n){
				Map<String, Object> m = new HashMap<String, Object>();
				for(String s : cols){
					m.put(s, rs.getString(s));
				}
				ret.add(m);
				idx++;
			}
			rs.close();
			ps.close();
			return ret;
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}finally{
			if(conn != null){
				conn.close();
			}
		}
	}
	
	public List<Map<String, Object>> listKpiDesc(Integer cubeId){
		return mapper.listKpiDesc(cubeId);
	}
}
