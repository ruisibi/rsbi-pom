package com.ruisitech.bi.web.app;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.service.frame.UserService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@RequestMapping(value = "/app")
public class AppLoginController extends BaseController {
	
	@Autowired
	private UserService userService;

	@RequestMapping(value="/Login!login.action")
	public @ResponseBody Object login(String userName, String password, String channel_id) {
		String ret = userService.shiroLogin(userName, password);
		Map<String, Object> obj = new HashMap<String, Object>();
		if("SUC".equals(ret)){
			obj.put("result", true);
			User user = RSBIUtils.getLoginUserInfo();
			String token = RSBIUtils.getMD5((user.getStaffId() + new Date().getTime()).getBytes());
			obj.put("token", token);
			Map<String, Object> u = new HashMap<String, Object>();
			u.put("userId", "1");
			obj.put("user", u);
			//更新登录次数
			userService.updateLogDateAndCnt(user.getUserId());
		}else{
			obj.put("result", false);
			obj.put("msg", ret);
		}
		return obj;
	}
	
	@RequestMapping(value="/Login!logout.action")
	public @ResponseBody Object logout(Integer userId) {
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {  
	        try{  
	            subject.logout();  
	        }catch(Exception ex){  
	        	
	        }  
	    }
		return super.buildSucces();
	}
}
