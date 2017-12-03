package com.ruisitech.bi.web.frame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.ruisitech.bi.service.frame.MenuService;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@RequestMapping(value = "/frame")
public class FrameController {
	
	@Autowired
	private MenuService service;

	@RequestMapping(value="/Frame.action")
	public ModelAndView execute() {
		ModelAndView mv = new ModelAndView("/frame/Frame");
		mv.addObject("menus", service.listUserMenus());
		mv.addObject("uinfo", RSBIUtils.getLoginUserInfo());
		return mv;
	}
	
	@RequestMapping(value="/Welcome.action")
	public String welcome() {
		return "/frame/Frame-welcome";
	}
	
}
