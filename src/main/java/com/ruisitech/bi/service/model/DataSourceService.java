package com.ruisitech.bi.service.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.common.RequestStatus;
import com.ruisitech.bi.entity.common.Result;
import com.ruisitech.bi.entity.model.DataSource;
import com.ruisitech.bi.mapper.model.DataSourceMapper;

@Service
public class DataSourceService {
	
	public static final String mysql = "com.mysql.jdbc.Driver";
	public static final String oracle = "oracle.jdbc.driver.OracleDriver";
	public static final String sqlserver = "net.sourceforge.jtds.jdbc.Driver";
	
	public static final String showTables_mysql = "show tables";
	public static final String showTables_oracle = "select table_name from tabs";
	public static final String showTables_sqlser = "select name from sysobjects where xtype='U' order by name";
	
	private Logger log = Logger.getLogger(DataSourceService.class);
	
	@Autowired
	private DataSourceMapper mapper;
	
	public List<DataSource> listDataSource(){
		return mapper.listDataSource();
	}
	
	public void insertDataSource(DataSource ds){
		mapper.insertDataSource(ds);
	}
	
	public void updateDataSource(DataSource ds){
		mapper.updateDataSource(ds);
	}
	
	public void deleteDataSource(String dsid){
		mapper.deleteDataSource(dsid);
	}
	
	public DataSource getDataSource(String dsid){
		return mapper.getDataSource(dsid);
	}
	
	public Result testJNDI(DataSource ds){
		Result ret = new Result();
		Connection con = null;
		try{
		  	Context ctx = new InitialContext();      
		    String strLookup = "java:comp/env/"+ds.getJndiName(); 
		    javax.sql.DataSource sds = (javax.sql.DataSource) ctx.lookup(strLookup);
		    con = sds.getConnection();
		    if (con != null){
		    	ret.setResult(RequestStatus.SUCCESS.getStatus());
		    }else{
		    	ret.setResult(RequestStatus.FAIL_FIELD.getStatus());
		    }
		}catch (Exception e) {
			log.error("JNDI测试出错", e);
			ret.setResult(RequestStatus.FAIL_FIELD.getStatus());
			ret.setMsg(e.getMessage());
		}finally{
			if(con != null){
				try {
					con.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return ret;
	}
	
	public Connection getJDBC(DataSource ds) throws Exception{
		try {
			Connection conn = null;
			Class.forName(ds.getClazz()).newInstance();
			conn= DriverManager.getConnection(ds.getLinkUrl(), ds.getLinkName(), ds.getLinkPwd());
			return conn;
		} catch (Exception e) {
			throw e;
		}
	}
	
	public Connection getJndi(DataSource ds) throws Exception {
		Connection con = null;
		try {
			Context ctx = new InitialContext();      
		    String strLookup = "java:comp/env/"+ds.getJndiName(); 
		    javax.sql.DataSource sds =(javax.sql.DataSource) ctx.lookup(strLookup);
		    con = sds.getConnection();
		}catch(Exception ex){
			ex.printStackTrace();
			throw ex;
		}
	    return con;
	}
	
	public Result testDataSource(DataSource ds){
		Result ret = new Result();
		String clazz = ds.getClazz();
		Connection conn = null;
		try {
			Class.forName(clazz).newInstance();
			conn= DriverManager.getConnection(ds.getLinkUrl(), ds.getLinkName(),  ds.getLinkPwd());
			if(conn != null){
				ret.setResult(RequestStatus.SUCCESS.getStatus());
			}else{
				ret.setResult(RequestStatus.FAIL_FIELD.getStatus());
			}
		} catch (Exception e) {
			log.error("JDBC测试出错。", e);
			ret.setResult(RequestStatus.FAIL_FIELD.getStatus());
			ret.setMsg(e.getMessage());
		}finally{
			if(conn != null){
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return ret;
	}
	
	public List<Map<String, Object>> listTables(String dsid) throws Exception{
		DataSource ds = mapper.getDataSource(dsid);
		final List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>();
		Connection conn = null;
		try {
			if(ds.getUse().equals("jndi")){
				conn = this.getJndi(ds);
			}else if(ds.getUse().equals("jdbc")){
				conn = this.getJDBC(ds);
			}
			
			String qsql = null;
			if("mysql".equals(ds.getLinkType())){
				qsql = showTables_mysql;
			}else if("oracle".equals(ds.getLinkType())){
				qsql = showTables_oracle;
			}else if("sqlserver".equals(ds.getLinkType())){
				qsql = showTables_sqlser;
			}
			PreparedStatement ps = conn.prepareStatement(qsql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				Map<String, Object> m = new HashMap<String, Object>();
				copyData(rs, m);
				ret.add(m);
			}
			rs.close();
			ps.close();
		}catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException("sql 执行报错.");
		}finally{
			if(conn != null){
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return ret;
	}
	
	private void copyData(ResultSet rs, Map<String, Object> m) throws SQLException{
		String tname = rs.getString(1);
		m.put("id", tname);
		m.put("text", tname);
		m.put("iconCls", "icon-table");
	}
}
