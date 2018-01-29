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

import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.control.InputOption;
import com.ruisi.ext.engine.scan.ResultRef;
import com.ruisi.ext.engine.service.ServiceSupport;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.wrapper.ExtRequest;
import com.ruisitech.bi.mapper.frame.RoleMapper;
import com.ruisitech.bi.mapper.frame.UserMapper;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.bi.util.TreeInterface;
import com.ruisitech.bi.util.TreeService;


/**
 * 角色管理的服务类,由于采用了EXT0配置框架
 * @author 毛子源
 *
 */
public class RoleService extends ServiceSupport
{
	/**类的默认执行方法
	 * @param
	 * @return
	 */
	public void execute(InputOption arg0) 
	{
	}
	
	/**
	 * 显示所有角色信息的页面
	 * @param arg0
	 */
	
	public void list(InputOption arg0) 
	{
		
		
	}
	/**
	 * 显示所有关联角色的用户的页面
	 * @param arg0
	 */
	public void roleUserList(InputOption option)
	{
		
	}

	
	@ResultRef("frame.Role-list")
	public void roleReportAdd(InputOption option) throws IOException{
		ExtRequest req = option.getRequest();
		final String roleId = req.getParameter("role_id");
		//删除全部
		String delsql = "delete from role_report_rela where role_id = " + roleId;
		this.daoHelper.execute(delsql);
		List<ReportAuthVO> datas = new ArrayList<ReportAuthVO>();
		Enumeration enumer = req.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = (String)enumer.nextElement();
			if(key.startsWith("view") || key.startsWith("print") || key.startsWith("export")){
				String[] ks = key.split("@");
				datas.add(new ReportAuthVO(ks[0], ks[1]));
			}
		}
		//变换格式成id,权限、权限、权限格式
		Map<String, String> m = new HashMap<String, String>();
		for(ReportAuthVO vo : datas){
			if(m.get(vo.id) == null){
				m.put(vo.id, vo.type);
			}else{
				m.put(vo.id, m.get(vo.id) + "," + vo.type);
			}
		}
		for(Map.Entry<String, String> map : m.entrySet()){
			final String rid = map.getKey();
			final String val = map.getValue();
			String sql = "insert into role_report_rela(role_id, report_id, r_view, r_print, export) values(?,?,?,?,?)";
			this.daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
				@Override
				public Object doInPreparedStatement(PreparedStatement ps)
						throws SQLException, DataAccessException {
					ps.setInt(1, Integer.parseInt(roleId));
					ps.setInt(2, Integer.parseInt(rid));
					ps.setInt(3, val.indexOf("view")>=0?1:0);
					ps.setInt(4, val.indexOf("print")>=0?1:0);
					ps.setInt(5, val.indexOf("export")>=0?1:0);
					ps.executeUpdate();
					return null;
				}				
			});
		}
		super.sendRedirect(option, "frame.Role", "list", false);
	}
	
	@ResultRef("frame.Role-list")
	public void roleDataAdd(InputOption option) throws IOException{
		ExtRequest req = option.getRequest();
		final String roleId = req.getParameter("role_id");
		//删除全部
		String delsql = "delete from role_data_rela where role_id = " + roleId;
		this.daoHelper.execute(delsql);
		List<String> datas = new ArrayList<String>();
		Enumeration enumer = req.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = (String)enumer.nextElement();
			if(key.startsWith("view")){
				String[] ks = key.split("@");
				datas.add(ks[1]);
			}
		}
		
		for(final String data : datas){
			String sql = "insert into role_data_rela(role_id, data_id) values(?,?)";
			this.daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
				@Override
				public Object doInPreparedStatement(PreparedStatement ps)
						throws SQLException, DataAccessException {
					ps.setInt(1, Integer.parseInt(roleId));
					ps.setInt(2, Integer.parseInt(data));
					ps.executeUpdate();
					return null;
				}				
			});
		}
		super.sendRedirect(option, "frame.Role", "list", false);
	}
	
	
	/**
	 * 显示角色关联菜单的页面
	 * @param arg0
	 */
	public void roleMenuList(InputOption option)
	{
		
		String roleId = option.getRequest().getParameter("role_id");//获取角色ID
		SqlSession s = null;
		List<Map<String, Object>> ls = null;
		try{
			s = RSBIUtils.getSqlSession(this.servletContext);
			RoleMapper mapper = s.getMapper(RoleMapper.class);
			ls = mapper.listRoleMenus(new Integer(roleId));
		}finally{
			RSBIUtils.closeSqlSession(s);
		}
		
		TreeService tree = new TreeService();
		List<Map<String, Object>> ret = tree.createTreeData(ls, new TreeInterface(){
			@Override
			public void processMap(Map<String, Object> m) {
				Object id2 = m.get("id2");
				if(id2 != null){
					m.put("checked", true);
				}
			}

			@Override
			public void processEnd(Map<String, Object> m, boolean hasChild) {
				if(hasChild){
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
	 * 保存菜单授权的方法，先删除数据再插入新的菜单授权数据
	 * @param arg0
	 * @throws IOException 
	 */
	@ResultRef("frame.Role-list")
	public void roleMenuAdd(InputOption option) throws IOException
	{
		String menuIds = option.getParamValue("menuIds");//通过JS获取的所有选择的菜单的ID
		final String role_id = option.getParamValue("role_id");//获取正在授权的角色ID
		
		//删除以前数据
		String delSql = "delete from role_menu_rela where role_id = '" + role_id + "'";
		daoHelper.execute(delSql);
		
		String[] ids = menuIds.split(",");//处理获取的菜单ID格式
		String sql = "insert into role_menu_rela(role_id, menu_id) values(?,?)";
		for(final String tmp : ids){//这个循环用于循环插入授权数据
			if(tmp.length() > 0){
				daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
					public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
						ps.setString(1, role_id);
						ps.setString(2, tmp);
						ps.executeUpdate();
						return null;
					}
				});
			}
		}
		super.sendRedirect(option, "frame.Role", "list", false);
	}
	/**
	 * 显示添加关联用户角色时需填写的信息的页面
	 * @param arg0
	 */
	public void roleUserPreAdd(InputOption option)
	{
		
	}
	/**
	 * 删除关联用户角色的方法
	 * @param arg0
	 * @throws IOException 
	 */
	@ResultRef("frame.Role-roleUserList")
	public void roleUserDel(InputOption option) throws IOException
	{
		String[] ids = option.getParamValues("id");//获取前台通过多选框勾选的用户的ID
		String role_id = option.getParamValue("role_id");
		String id = "";//作为SQL参数的字符串
		for(String str : ids){
			id +="'" + str + "',";
		}//把前台传过来的ID加到参数字符串中
		id = id.substring(0, id.length() - 1);
		String sql = "delete from role_user_rela where user_id in (" + id + ") and role_id = '"+role_id+"'";//执行SQL
		daoHelper.execute(sql);
		super.sendRedirect(option, "frame.Role", "roleUserList", true);
	}
	/**
	 * 显示添加新角色时需填写的信息页面
	 * @param arg0
	 */
	public void preAdd(InputOption option)
	{
		
	}
	/**
	 * 新增角色信息的方法
	 * @param arg0
	 */
	@ResultRef("frame.Role-list")
	public void add(final InputOption option) throws IOException 
	{
		String sql = "insert into sc_role(role_name,role_desc,create_date,create_user, ord) values(?,?,now(),?,?)";
		daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
			public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
				//UUID uuid = UUID.randomUUID();//主键用UUID生成
				//String id = uuid.toString().replaceAll("-", "");
				Integer userid = RSBIUtils.getLoginUserInfo().getUserId();
				//ps.setString(1, id);
				ps.setString(1, option.getParamValue("name"));
				ps.setString(2, option.getParamValue("desc"));
				ps.setInt(3, userid);
				ps.setInt(4, Integer.parseInt(option.getParamValue("ord")));
				ps.executeUpdate();
				return null;
			}
		});
		super.sendRedirect(option, "frame.Role", "list", true);
	}
	/**
	 * 显示修改角色信息的页面
	 * @param arg0
	 */
	public void preMod(InputOption option)
	{
		
	}
	/**
	 * 修改角色信息的方法
	 * @param arg0
	 */
	@ResultRef("frame.Role-list")
	public void mod(final InputOption option) throws IOException
	{
		String sql = "update sc_role set role_name = ?,role_desc = ?, ord=? where role_id = ?";
		daoHelper.execute(sql, new PreparedStatementCallback<Object>(){
			public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
				ps.setString(4, option.getParamValue("id"));
				ps.setString(1, option.getParamValue("role_name"));
				ps.setString(2, option.getParamValue("role_desc"));
				ps.setString(3, option.getParamValue("ord"));
				ps.executeUpdate();
				return null;
			}
		});
		super.sendRedirect(option, "frame.Role", "list", false);
	}
	/**
	 * 删除角色信息的方法
	 * @param arg0
	 */
	@ResultRef("frame.Role-list")
	public void delete(final InputOption option) throws IOException
	{
		String[] ids = option.getParamValues("id");//取用户选中的所有ID
		String id = "";
		for(String str : ids){//格式处理
			id +="'" + str + "',";
		}
		id = id.substring(0, id.length() - 1);
		String sql = "delete from sc_role where role_id in (" + id + ")";
		daoHelper.execute(sql);
		super.sendRedirect(option, "frame.Role", "list", true);
		for(String str : ids){
			//删除角色菜单关系
			daoHelper.execute("delete from role_menu_rela where role_id = " + str);
			//删除角色用户关系
			daoHelper.execute("delete from role_user_rela where role_id = " + str);
		}
	}
	/**
	 * 关联用户角色的方法
	 * @param arg0
	 */
	@ResultRef("frame.Role-roleUserList")
	public void roleUserAdd(final InputOption option) throws IOException
	{
		String[] ids = option.getParamValues("id");
		final String roleId = option.getParamValue("role_id");
		for(int i=0; i<ids.length; i++)
		{
			String sql = "insert into role_user_rela(user_id,role_id) values(?,?)";
			final String id = ids[i];
			daoHelper.execute(sql, new PreparedStatementCallback<Object>()
			{
				public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
					ps.setString(1, id);
					ps.setString(2, roleId);
					ps.executeUpdate();
					return null;
				}
			});
		}
		super.sendRedirect(option, "frame.Role", "roleUserList", true);
	
	}
	
	public static class ReportAuthVO{
		String type;
		String id;
		
		ReportAuthVO(String type, String id){
			this.type = type;
			this.id = id;
		}
	}
}
