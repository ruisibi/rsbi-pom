package com.ruisitech.bi.web.app;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.util.BaseController;

@Controller
@RequestMapping(value = "/app")
public class AppPushContorller extends BaseController {
	
	@RequestMapping(value="/Push!listMsg2.action")
	public @ResponseBody Object listMsg2() {
		List<Map<String, Object>> ls = new ArrayList<Map<String, Object>>();
		Map<String, Object> ret = new HashMap<String, Object>();
		ret.put("rows", ls);
		ret.put("hasNext",  false);
		return null; 
	}
	
	@RequestMapping(value="/Push!listMsg.action")
	public @ResponseBody Object listMsg() throws IOException{
		List<Map<String, Object>> ls = new ArrayList<Map<String, Object>>();
		return ls;
	}
	
	@RequestMapping(value="/Push!updateChennel.action")
	public @ResponseBody Object updateChennel(String channel) throws IOException{
		return super.buildSucces();
	}
}
