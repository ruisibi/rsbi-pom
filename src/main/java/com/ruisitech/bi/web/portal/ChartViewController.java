package com.ruisitech.bi.web.portal;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisitech.bi.entity.portal.PortalChartQuery;
import com.ruisitech.bi.service.portal.PortalChartService;
import com.ruisitech.bi.util.CompPreviewService;

@Controller
@Scope("prototype")
@RequestMapping(value = "/portal")
public class ChartViewController {
	
	@Autowired
	private PortalChartService chartService;

	@RequestMapping(value="/ChartView.action", method = RequestMethod.POST)
	public @ResponseBody Object tableView(@RequestBody PortalChartQuery chartJson,  HttpServletRequest req, HttpServletResponse res) throws Exception {
		
		ExtContext.getInstance().removeMV(PortalChartService.deftMvId);
		MVContext mv = chartService.json2MV(chartJson);
		
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(chartService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		return ret;
	}
	
	@RequestMapping(value="/ChartType.action")
	public String chartType() {
		return "portal/ChartView-chartType";
	}
}
