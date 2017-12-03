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
import com.ruisitech.bi.entity.bireport.TableQueryDto;
import com.ruisitech.bi.service.bireport.TableService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.CompPreviewService;

@Controller
@Scope("prototype")
@RequestMapping(value = "/bireport")
public class TableController extends BaseController {
	
	@Autowired
	private TableService tableService;

	@RequestMapping(value="/TableView.action", method = RequestMethod.POST)
	public @ResponseBody Object tableView(@RequestBody TableQueryDto tableJson, HttpServletRequest req, HttpServletResponse res) throws Exception {
		
		//放入request,方便访问
		req.setAttribute("table", tableJson);
		req.setAttribute("compId", String.valueOf(tableJson.getCompId()));
		
		ExtContext.getInstance().removeMV(TableService.deftMvId);
		MVContext mv = tableService.json2MV(tableJson);
		
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(tableService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		return ret;
	}
}
