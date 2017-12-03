package com.ruisitech.bi.web.bireport;

import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.entity.bireport.OlapInfo;
import com.ruisitech.bi.service.bireport.OlapService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@RequestMapping(value = "/bireport")
public class MyReportController extends BaseController {
	
	@Autowired
	private OlapService service;
	
	@RequestMapping(value="/listReport.action")
	public String list(String keyword, ModelMap model){
		List<OlapInfo> ret = service.listreport(keyword);
		model.addAttribute("ls", ret);
		return "bireport/MyReport-list";
	}
	
	@RequestMapping(value="/saveReport.action", method = RequestMethod.POST)
	public @ResponseBody Object save(OlapInfo info){
		if(service.olapExist(info.getPageName()) > 0){
			return super.buildError("报表名存在。");
		}
		if(info.getPageId() == null){
			info.setPageId(service.maxOlapId());
			info.setUserId(RSBIUtils.getLoginUserInfo().getUserId());
			JSONObject page = JSONObject.fromObject(info.getPageInfo());
			page.put("id", info.getPageId());
			info.setPageInfo(page.toString());
			service.insertOlap(info);
		}else{
			service.updateOlap(info);
		}
		//返回ID
		return super.buildSucces(info.getPageId());
	}
	
	@RequestMapping(value="/deleteReport.action")
	public @ResponseBody Object deleteReport(Integer id){
		service.deleteOlap(id);
		return this.buildSucces();
	}
	
	@RequestMapping(value="/renameReport.action")
	public @ResponseBody Object rename(OlapInfo info){
		service.renameOlap(info);
		return this.buildSucces();
	}

}
