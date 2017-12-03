package com.ruisitech.bi.web.app;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/app")
public class AppMenuController {

	@RequestMapping(value="/Menus!topMenu2.action")
	public @ResponseBody Object topMenu(Integer userId, HttpServletRequest request) {
		List<Map<String, Object>> ls = new ArrayList<Map<String, Object>>();
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
		
		Map<String, Object> m2 = new HashMap<String, Object>();
		m2.put("id", 3);
		m2.put("name", "手机报表");
		m2.put("note", "通过手机端查看报表数据,报表需在PC端先创建。");
		m2.put("pic", "resource/img/3g/a4.png");
		m2.put("url", "");
		ls.add(m2);
		
		Map<String, Object> m6 = new HashMap<String, Object>();
		m6.put("id", 5);
		m6.put("name", "系统帮助");
		m6.put("note", "睿思BI系统介绍，指导您正确使用本系统。");
		m6.put("pic", "resource/img/3g/help.png");
		m6.put("url", basePath + "app/Helper.action?token=");
		ls.add(m6);
		
		return ls;
	}
	
	@RequestMapping(value="/Helper.action")
	public String helper() {
		return "app/Helper";
	}
}
