package com.ruisitech.bi.web.portal;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruisi.bi.engine.view.emitter.ContextEmitter;
import com.ruisi.bi.engine.view.emitter.excel.ExcelEmitter;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.emitter.pdf.PdfEmitter;
import com.ruisi.ext.engine.view.emitter.text.TextEmitter;
import com.ruisi.ext.engine.view.emitter.word.WordEmitter;
import com.ruisitech.bi.service.portal.PortalPageService;
import com.ruisitech.bi.service.portal.PortalService;
import com.ruisitech.bi.util.CompPreviewService;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@Scope("prototype")
@RequestMapping(value = "/portal")
public class PortalViewController {
	
	@Autowired
	private PortalService portalService;
	
	@Autowired
	private PortalPageService pageService;

	@RequestMapping(value="/view.action")
	public @ResponseBody Object view(String pageId, HttpServletRequest req, HttpServletResponse res) throws Exception {
		ExtContext.getInstance().removeMV(PortalPageService.deftMvId);
		String cfg = portalService.getPortalCfg(pageId);
		if(cfg == null){
			return "找不到报表文件。";
		}
		JSONObject json = (JSONObject)JSON.parse(cfg);
		MVContext mv = pageService.json2MV(json, false, false);
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(pageService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		return ret;
	}
	
	@RequestMapping(value="/export.action")
	public void export(String type, String pageId, String json, String picinfo, HttpServletRequest req, HttpServletResponse res) throws Exception {
		ExtContext.getInstance().removeMV(PortalPageService.deftMvId);
		if(json == null || json.length() == 0){
			json = portalService.getPortalCfg(pageId);
		}
		req.setAttribute("picinfo", picinfo);
		JSONObject obj = (JSONObject)JSON.parse(json);
		MVContext mv = pageService.json2MV(obj, false, true);
		
		CompPreviewService ser = new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(pageService.getMvParams());
		ser.initPreview();
		
		String fileName = "file.";
		if("html".equals(type)){
			fileName += "html";
		}else
		if("excel".equals(type)){
			fileName += "xls";
		}else
		if("csv".equals(type)){
			fileName += "csv";
		}else
		if("pdf".equals(type)){
			fileName += "pdf";
		}else 
		if("word".equals(type)){
			fileName += "docx";
		}
		
		res.setContentType("application/x-msdownload");
		String contentDisposition = "attachment; filename=\""+fileName+"\"";
		res.setHeader("Content-Disposition", contentDisposition);
		
		if("html".equals(type)){
			String ret = ser.buildMV(mv, req.getServletContext());
			String html = RSBIUtils.htmlPage(ret, RSBIUtils.getConstant("resPath"), "report");
			InputStream is = IOUtils.toInputStream(html, "utf-8");
			IOUtils.copy(is, res.getOutputStream());
			is.close();
		}else
		if("excel".equals(type)){
			ContextEmitter emitter = new ExcelEmitter();
			ser.buildMV(mv, emitter, req.getServletContext());
		}else
		if("csv".equals(type)){
			ContextEmitter emitter = new TextEmitter();
			String ret = ser.buildMV(mv, emitter, req.getServletContext());
			InputStream is = IOUtils.toInputStream(ret, "gb2312");
			IOUtils.copy(is, res.getOutputStream());
			is.close();
		}else 
		if("pdf".equals(type)){
			ContextEmitter emitter = new PdfEmitter();
			ser.buildMV(mv, emitter, req.getServletContext());
		}else
		if("word".equals(type)){
			ContextEmitter emitter = new WordEmitter();
			ser.buildMV(mv, emitter, req.getServletContext());
		}
	}
	
	@RequestMapping(value="/print.action")
	public String print(String pageId, String pageInfo, HttpServletRequest req, HttpServletResponse res) throws Exception {
		ExtContext.getInstance().removeMV(PortalPageService.deftMvId);
		if(pageInfo == null || pageInfo.length() == 0){
			pageInfo = portalService.getPortalCfg(pageId);
		}
		if(pageInfo == null){
			return null;
		}
		JSONObject obj = (JSONObject)JSON.parse(pageInfo);
		MVContext mv = pageService.json2MV(obj, false, false);
		
		CompPreviewService ser =  new CompPreviewService(req, res, req.getServletContext());
		ser.setParams(pageService.getMvParams());
		ser.initPreview();
		String ret = ser.buildMV(mv, req.getServletContext());
		req.setAttribute("str", ret);
		return "portal/PortalIndex-print";
	}
	
}
