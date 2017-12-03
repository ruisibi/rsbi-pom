package com.ruisitech.bi.web;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/frame")
public class LogoutController {

	@RequestMapping(value="/Logout.action")
	public String logout(){
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {  
	        try{  
	            subject.logout();  
	        }catch(Exception ex){  
	        	
	        }  
	    }  
		return "redirect:/Login.action";
	}
}
