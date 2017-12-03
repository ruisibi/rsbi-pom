package com.ruisitech.bi.web.bireport;

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
import com.ruisitech.bi.entity.bireport.ChartQueryDto;
import com.ruisitech.bi.service.bireport.ChartService;
import com.ruisitech.bi.util.CompPreviewService;

@Controller
@Scope("prototype")
@RequestMapping(value = "/bireport")
public class ChartController {
	
	@Autowired
	private ChartService chartService;

	@RequestMapping(value="/ChartView.action", method = RequestMethod.POST)
	public @ResponseBody Object chartView(@RequestBody ChartQueryDto chartJson, HttpServletRequest req, HttpServletResponse res) throws Exception {
		req.setAttribute("compId", String.valueOf(chartJson.getCompId()));
		ExtContext.getInstance().removeMV(ChartService.deftMvId);
		MVContext mv = chartService.json2MV(chartJson, false);
		
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		//ser.setParams(tableService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		return ret;
	}
}
