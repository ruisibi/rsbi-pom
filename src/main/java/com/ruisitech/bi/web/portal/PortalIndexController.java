package com.ruisitech.bi.web.portal;

import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.entity.portal.Portal;
import com.ruisitech.bi.service.portal.PortalService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@RequestMapping(value = "/portal")
public class PortalIndexController extends BaseController {
	
	@Autowired
	private PortalService portalService;

	@RequestMapping(value="/customization.action")
	public String customization(String pageId, String menus, String is3g, ModelMap model) {
		if(menus != null && menus.length() > 0){
			JSONObject obj = JSONObject.fromObject(menus);
			model.addAttribute("menuDisp", obj);
		}
		String pageInfo = pageId == null ? null : portalService.getPortalCfg(pageId);
		model.addAttribute("pageInfo", pageInfo);
		model.addAttribute("is3g", is3g);
		return "portal/PortalIndex-customiz";
	}
	
	@RequestMapping(value="/PortalIndex.action")
	public String index(ModelMap model) {
		List<Portal> ls = portalService.listPortal();
		model.addAttribute("ls", ls);
		return "portal/PortalIndex";
	}
	
	@RequestMapping(value="/delete.action")
	public @ResponseBody Object delete(String pageId) {
		portalService.deletePortal(pageId);
		return this.buildSucces();
	}
	
	@RequestMapping(value="/rename.action", method = RequestMethod.POST)
	public @ResponseBody Object rename(Portal portal) {
		portalService.renamePortal(portal);
		return this.buildSucces();
	}
	
	@RequestMapping(value="/show.action")
	public String show(String pageId, String income, ModelMap model) {
		model.addAttribute("pageId", pageId);
		model.addAttribute("income", income);
		return "portal/PortalIndex-show";
	}
	
	@RequestMapping(value="/save.action", method = RequestMethod.POST)
	public @ResponseBody Object save(Portal portal){
		String pageId = portal.getPageId();
		if(pageId == null || pageId.length() == 0){
			JSONObject obj = JSONObject.fromObject(portal.getPageInfo());
			String id = RSBIUtils.getUUIDStr();
			obj.put("id", id);
			portal.setPageId(id);
			portal.setUserId(RSBIUtils.getLoginUserInfo().getUserId());
			portal.setPageInfo(obj.toString());
			portal.setIs3g("y".equals(portal.getIs3g())?"y":"n");
			portalService.insertPortal(portal);
		}else{
			portalService.updatePortal(portal);
		}
		return super.buildSucces(portal.getPageId());
	}
}
