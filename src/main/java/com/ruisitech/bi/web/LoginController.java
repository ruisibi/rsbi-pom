package com.ruisitech.bi.web;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.service.frame.UserService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.RSBIUtils;


@Controller
@RequestMapping(value = "/")
public class LoginController extends BaseController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/Login.action")
	public String login() {
		Subject us = SecurityUtils.getSubject(); 
		if(us.isAuthenticated() || us.isRemembered()){  //判断是否登录
			return "Login-login";
		}
		return "Login";
	}
	
	@RequestMapping(value="/dologin.action", method = RequestMethod.POST)
	public @ResponseBody Object dologin(String userName, String password, ModelMap model) {
		String msg = userService.shiroLogin(userName, password);
		if("SUC".equals(msg)){
			//更新登陆次数及时间
			Integer userId = RSBIUtils.getLoginUserInfo().getUserId();
			userService.updateLogDateAndCnt(userId);
			return super.buildSucces();
		}else{
			return super.buildError(msg);
		}
	}
}
