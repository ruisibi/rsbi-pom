package com.ruisitech.bi.service.frame;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.servlet.AdviceFilter;
import org.springframework.beans.factory.annotation.Autowired;

import com.ruisitech.bi.entity.frame.User;

public class AppSessionAuthcFilter extends AdviceFilter {
	
	@Autowired
	private UserService userService;

	@Override
	protected boolean preHandle(ServletRequest request, ServletResponse response)
			throws Exception {
		Subject us = SecurityUtils.getSubject(); 
		Session session = us.getSession();
		
		if(!us.isAuthenticated() && us.isRemembered() && session.getAttribute(ShiroDbRealm.SESSION_USER_KEY) == null){
			//说明是记住我过来的,恢复SESSION里的值
			Object staffId = us.getPrincipal();
			if(staffId != null){
				User u = userService.getUserByStaffId(staffId.toString());
				session.setAttribute(ShiroDbRealm.SESSION_USER_KEY, u);
			}else{
				request.getRequestDispatcher("/pages/control/NoLogin_app.jsp").forward(request, response);
				return false;
			}
		}
		if(us.isAuthenticated() || us.isRemembered()){  //不管是认证登陆 还是 记住我登陆， 都放行
			return true;
		}else{
			request.getRequestDispatcher("/pages/control/NoLogin_app.jsp").forward(request, response);
			return false;
		}
	}

}
