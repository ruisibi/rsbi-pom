package com.ruisitech.ext.service.frame;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.apache.ibatis.session.SqlSession;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.PreparedStatementCallback;

import com.ruisi.ext.engine.control.InputOption;
import com.ruisi.ext.engine.scan.ResultRef;
import com.ruisi.ext.engine.service.ServiceSupport;
import com.ruisi.ext.engine.wrapper.ExtRequest;
import com.ruisitech.bi.mapper.frame.UserMapper;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.bi.util.TreeInterface;
import com.ruisitech.bi.util.TreeService;

/**
 * 用户授权和关联角色的服务类,由于采用了EXT0配置框架，
 * @author 毛子源
 *
 */

public class UserPermissionService extends ServiceSupport {
	/**
	 * 默认的执行方法
	 */
	public void execute(InputOption option)  {
		
	}
	/**
	 * 显示目前用户已关联的角色列表
	 */
	public void roleList(InputOption option) throws Exception {
		
	}
	/**
	 * 关联用户角色的方法
	 */
	@ResultRef("frame.UserPermission-roleList")
	public void addRole(InputOption option) throws Exception 
	{
		
		String[] ids = option.getParamValues("role_id");//获取选中的角色ID
		String userId = option.getParamValue("user_id");//获取操作的用户ID
		for(int i=0; i<ids.length; i++)//循环操作SQL
		{
			String roleId = ids[i];
			daoHelper.execute("insert into role_user_rela(user_id,role_id) values("+userId+","+roleId+")");
		}
		super.sendRedirect(option, "frame.UserPermission", "roleList", true);
		
	}
	
	@ResultRef("frame.User")
	public void userReportAdd(InputOption option) throws IOException{
		ExtRequest req = option.getRequest();
		final String userId = req.getParameter("user_id");
		//删除全部
		String delsql = "delete from user_report_rela where user_id = " + userId;
		this.daoHelper.execute(delsql);
		List<RoleService.ReportAuthVO> datas = new ArrayList<RoleService.ReportAuthVO>();
		Enumeration<String> enumer = req.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = (String)enumer.nextElement();
			if(key.startsWith("view") || key.startsWith("print") || key.startsWith("export")){
				String[] ks = key.split("@");
				datas.add(new RoleService.ReportAuthVO(ks[0], ks[1]));
			}
		}
		//变换格式成id,权限、权限、权限格式
		Map<String, String> m = new HashMap<String, String>();
		for(RoleService.ReportAuthVO vo : datas){
			if(m.get(vo.id) == null){
				m.put(vo.id, vo.type);
			}else{
				m.put(vo.id, m.get(vo.id) + "," + vo.type);
			}
		}
		for(Map.Entry<String, String> map : m.entrySet()){
			final String rid = map.getKey();
			final String val = map.getValue();
			String sql = "insert into user_report_rela(user_id, report_id, r_view, r_print, export) values(?,?,?,?,?)";
			this.daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
				@Override
				public Object doInPreparedStatement(PreparedStatement ps)
						throws SQLException, DataAccessException {
					ps.setInt(1, Integer.parseInt(userId));
					ps.setInt(2, Integer.parseInt(rid));
					ps.setInt(3, val.indexOf("view")>=0?1:0);
					ps.setInt(4, val.indexOf("print")>=0?1:0);
					ps.setInt(5, val.indexOf("export")>=0?1:0);
					ps.executeUpdate();
					return null;
				}				
			});
		}
		super.sendRedirect(option, "frame.User", "", false);
	}
	
	@ResultRef("frame.User")
	public void userDataAdd(InputOption option) throws IOException{
		ExtRequest req = option.getRequest();
		final String userId = req.getParameter("user_id");
		//删除全部
		String delsql = "delete from user_data_rela where user_id = " + userId;
		this.daoHelper.execute(delsql);
		List<String> datas = new ArrayList<String>();
		Enumeration<String> enumer = req.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = (String)enumer.nextElement();
			if(key.startsWith("view")){
				String[] ks = key.split("@");
				datas.add(ks[1]);
			}
		}
		
		for(final String data : datas){
			String sql = "insert into user_data_rela(user_id, data_id) values(?,?)";
			this.daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
				@Override
				public Object doInPreparedStatement(PreparedStatement ps)
						throws SQLException, DataAccessException {
					ps.setInt(1, Integer.parseInt(userId));
					ps.setInt(2, Integer.parseInt(data));
					ps.executeUpdate();
					return null;
				}				
			});
		}
		super.sendRedirect(option, "frame.User", "", false);
	}
	
	/**
	 * 显示目前用户未关联的角色列表
	 */
	public void preAddRole(InputOption option) throws Exception 
	{

	}
	
	/**
	 * 删除用户关联的角色
	 */
	@ResultRef("frame.UserPermission-roleList")
	public void delRole(InputOption option) throws IOException
	{

		String[] ids = option.getParamValues("role_id");
		String userId = option.getParamValue("user_id");
		for(int i=0; i<ids.length; i++)
		{
			String roleId = ids[i];
			daoHelper.execute("delete from role_user_rela where role_id = "+roleId+" and user_id = " + userId);
		}
		super.sendRedirect(option, "frame.UserPermission", "roleList", true);

	}
	
	/**
	 * 显示目前用户已授权的菜单列表
	 */
	public void menuList(InputOption option) throws Exception {
		String userid = option.getParamValue("user_id");
		
		SqlSession s = null;
		List<Map<String, Object>> ls = null;
		try{
			s = RSBIUtils.getSqlSession(this.servletContext);
			UserMapper mapper = s.getMapper(UserMapper.class);
			ls = mapper.listUserMenus(new Integer(userid));
		}finally{
			RSBIUtils.closeSqlSession(s);
		}
		
		TreeService ser = new TreeService();
		List<Map<String, Object>> ret = ser.createTreeData(ls, new TreeInterface(){

			@Override
			public void processMap(Map<String, Object> m) {
				String chk2 = m.get("id2") == null ? "" : m.get("id2").toString();
				if(chk2 == null || chk2.length() == 0){

					//id3为用户所拥有的菜单，需要判断是否checked
					String chk3 = m.get("id3") == null ? "" : m.get("id3").toString();
					if(chk3 == null || chk3.length() == 0){
						m.put("checked", false);
					}else{
						m.put("checked", true);
					}
					m.put("disabled", false);
				}else{
					m.put("disabled", true);
					m.put("checked", true);
				}
				//设置属性
				Map<String, Object> attributes = new HashMap<String, Object>();
				m.put("attributes", attributes);
				attributes.put("id2", m.get("id2"));
				attributes.put("id3", m.get("id3"));
				attributes.put("disabled", m.get("disabled"));
			}

			@Override
			public void processEnd(Map<String, Object> m, boolean hasChild) {
				String chk3 = m.get("id3") == null ? "" : m.get("id3").toString();
				if(hasChild && chk3 != null && chk3.length() > 0){
					m.remove("checked");
				}
			}
			
		});
		Map<String, Object> m = new HashMap<String, Object>();
		m.put("id", "root");
		m.put("text", "系统菜单树");
		m.put("children", ret);
		
		String str = JSONArray.fromObject(m).toString();//将结果LIST作为jsonarray直接由Response打印
		option.getRequest().setAttribute("datas", str);
	}
	/**
	 * 保存操作完成的用户授权菜单信息
	 */
	@ResultRef("frame.User")
	public void save(InputOption option) throws IOException{
		final String user_id = option.getParamValue("user_id");
		String menuids = option.getParamValue("menuIds");
		
		//删除以前数据
		String delSql = "delete from user_menu_rela where user_id = '" + user_id + "'";
		daoHelper.execute(delSql);
		
		String[] ids = menuids.split(",");
		String sql = "insert into user_menu_rela(user_id, menu_id) values(?,?)";
		for(final String tmp : ids){
			if(tmp.length() > 0){
				daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
					public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
						ps.setInt(1, Integer.parseInt(user_id));
						ps.setString(2, tmp);
						ps.executeUpdate();
						return null;
					}
				});
			}
		}
		
		super.sendRedirect(option, "frame.User", "", true);
		
	}

}
