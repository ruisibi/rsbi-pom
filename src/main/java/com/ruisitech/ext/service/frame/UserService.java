package com.ruisitech.ext.service.frame;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.control.InputOption;
import com.ruisi.ext.engine.scan.InterRef;
import com.ruisi.ext.engine.scan.ResultRef;
import com.ruisi.ext.engine.service.ServiceSupport;
import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.mapper.frame.MenuMapper;
import com.ruisitech.bi.mapper.frame.UserMapper;
import com.ruisitech.bi.util.RSBIUtils;
/**
 * 用户管理的服务类,由于采用了EXT0配置框架，
 * @author 毛子源
 *
 */
public class UserService extends ServiceSupport 
{
	/**
	 * 默认执行方法
	 */
	public void execute(InputOption option){
		
		
	}
	/**
	 * 显示新增用户需要填写的信息页面
	 * @param option
	 */
	
	public void preAdd(InputOption option){
		
	}
	/**
	 * 显示用户已关联的角色列表
	 * @param option
	 */
	public void	roleUserList(InputOption option){
		
	}
	/**
	 * 显示用户已授权的菜单
	 * @param option
	 */
	public void	roleMenuList(InputOption option){
		
	}
	/**
	 * 新增用户的方法，执行SQL
	 * @param option
	 */
	public void save(InputOption option) throws IOException
	{
		int cnt = daoHelper.queryForInt("select count(1) cnt from sc_login_user where STAFF_ID = '" + option.getParamValue("staffId")+"'");
		if(cnt > 0){
			return;
		}
		
		User u = new User();
		int uid = daoHelper.queryForInt("select case WHEN max(user_id) is null then 1 else  max(user_id) + 1 end from sc_login_user");
		u.setUserId(uid);
		u.setLoginName(option.getParamValue("name"));
		u.setStaffId(option.getParamValue("staffId"));
		u.setGender(option.getParamValue("sex"));
		u.setMobilePhone(option.getParamValue("mobile"));
		u.setEmail(option.getParamValue("email"));
		u.setOfficeTel(option.getParamValue("offmobile"));
		//FIXME 设置默认密码为1
		u.setPassword(RSBIUtils.getEncodedStr(option.getParamValue("pwd")));
		u.setState(Integer.parseInt(option.getParamValue("state")));
		SqlSession s = null;
		try{
			s = RSBIUtils.getSqlSession(this.servletContext);
			UserMapper mapper = s.getMapper(UserMapper.class);
			mapper.insertuser(u);
		}finally{
			RSBIUtils.closeSqlSession(s);
		}
		super.sendRedirect(option, "frame.User", "", false);
		
	}
	
	/**
	 * 显示修改用户信息页面
	 * @param option
	 */
	public void preMod(InputOption option){
	
	}
	/**
	 * 修改用户信息的方法，执行SQL
	 * @param option
	 */
	@ResultRef("frame.User")
	public void mod(InputOption option) throws IOException
	{		
		User u = new User();
		u.setLoginName(option.getParamValue("name"));
		u.setStaffId(option.getParamValue("staffId"));
		u.setGender(option.getParamValue("sex"));
		u.setMobilePhone(option.getParamValue("mobile"));
		u.setEmail(option.getParamValue("email"));
		u.setOfficeTel(option.getParamValue("offmobile"));
		u.setUserId(new Integer(option.getRequest().getParameter("user_id")));
		u.setState(Integer.parseInt(option.getParamValue("state")));
		SqlSession s = null;
		try{
			s = RSBIUtils.getSqlSession(this.servletContext);
			UserMapper mapper = s.getMapper(UserMapper.class);
			mapper.updateuser(u);
		}finally{
			RSBIUtils.closeSqlSession(s);
		}
		super.sendRedirect(option, "frame.User", "", false);
		
	}
	/**
	 * 删除用户信息的执行方法，执行SQL
	 * @param option
	 */
	@ResultRef("frame.User")
	public void del(InputOption option) throws IOException
	{
	
		String[] ids = option.getParamValues("user_id");
		for(final String tmp : ids)
		{//这个循环用于循环插入授权数据
			if(tmp.length() > 0)
			{
				
				daoHelper.execute("delete from sc_login_user where user_id = " + tmp);
				//删除用户菜单关系
				daoHelper.execute("delete from user_menu_rela where user_id = " + tmp);
				//删除用户角色关系
				daoHelper.execute("delete from role_user_rela where user_id = " + tmp);
			}
		}
		super.sendRedirect(option, "frame.User", "", false);
	
	}
}
