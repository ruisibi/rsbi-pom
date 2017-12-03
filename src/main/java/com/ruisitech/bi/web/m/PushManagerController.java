package com.ruisitech.bi.web.m;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.ruisitech.bi.entity.portal.Portal;
import com.ruisitech.bi.service.portal.MobReportTypeService;
import com.ruisitech.bi.service.portal.PortalService;
import com.ruisitech.bi.util.BaseController;

@Controller
@RequestMapping(value = "/m")
public class PushManagerController extends BaseController {

	@Autowired
	private MobReportTypeService service;
	
	@Autowired
	private PortalService portalService;
	
	@RequestMapping(value="/PushManager.action")
	public String index(ModelMap model) {
		model.addAttribute("str", JSONObject.toJSONString(service.listcataTree()));
		return "m/PushManager";
	}
	
	@RequestMapping(value="/pushList.action")
	public @ResponseBody Object list(Integer cataId) {
		List<Portal> ls = portalService.list3g(cataId);
		return ls;
	}
}
