package com.ruisitech.bi.web.app;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisitech.bi.service.portal.PortalPageService;
import com.ruisitech.bi.service.portal.PortalService;
import com.ruisitech.bi.util.CompPreviewService;

@Controller
@Scope("prototype")
@RequestMapping(value = "/app")
public class AppReportViewController {
	
	@Autowired
	private PortalService portalService;
	
	@Autowired
	private PortalPageService pageService;
	
	@RequestMapping(value="/Report!view.action")
	public String view(String rid, HttpServletRequest req, HttpServletResponse res) throws Exception {
		String cfg = portalService.getPortalCfg(rid);
		if(cfg == null){
			return "找不到报表文件。";
		}
		JSONObject json = (JSONObject)JSON.parse(cfg);
		MVContext mv = pageService.json2MV(json, false, false);
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(pageService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		req.setAttribute("str", ret);
		return "app/Report-view"; 
	}

}
