package com.ruisitech.bi.service.frame;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.servlet.AdviceFilter;

public class AppSessionAuthcFilter extends AdviceFilter {

	@Override
	protected boolean preHandle(ServletRequest request, ServletResponse response)
			throws Exception {
		Subject us = SecurityUtils.getSubject(); 
		if(us.isAuthenticated()){  //判断是否登录
			return true;
		}else{
			request.getRequestDispatcher("/pages/control/NoLogin_app.jsp").forward(request, response);
			return false;
		}
	}

}
