package com.ruisitech.bi.web.bireport;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.ruisitech.bi.entity.bireport.TableDetailDto;
import com.ruisitech.bi.entity.common.RequestStatus;
import com.ruisitech.bi.entity.common.Result;
import com.ruisitech.bi.service.bireport.TableDetailService;
import com.ruisitech.bi.util.BaseController;

/**
 * 提取明细 controller
 * @author hq
 *
 */
@Controller
@RequestMapping(value = "/bireport")
public class DetailController extends BaseController {
	
	@Autowired
	private TableDetailService detailService;

	/**
	 * 查询表格详情
	 * @return
	 */
	@RequestMapping(value="/detail.action", method = RequestMethod.POST)
	public @ResponseBody Object detail(@RequestBody TableDetailDto dto, HttpServletRequest req) {
		//放入SESSION,方便在导出时取值
		req.getSession().setAttribute("qdto", dto);
		List<Map<String, Object>> ls = detailService.detailDatas(dto);
		return new Result(RequestStatus.SUCCESS.getStatus(), "操作成功", ls, dto.getTotal());
	}
	
	/**
	 * 查询表头
	 * @return
	 */
	@RequestMapping(value="/header.action")
	public @ResponseBody Object header(TableDetailDto dto) {
		JSONArray ls = detailService.getTableHeader(dto);
		return ls.toString();
	}
	
	/**
	 * 导出详情
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value="/exportDetail.action", method = RequestMethod.GET)
	public @ResponseBody Object export(HttpServletRequest req, HttpServletResponse res) throws Exception {
		TableDetailDto dto = (TableDetailDto)req.getSession().getAttribute("qdto");
		if(dto == null){
			return null;
		}
		res.setContentType("application/x-msdownload");
		String contentDisposition = "attachment; filename=\"file.xls\"";
		res.setHeader("Content-Disposition", contentDisposition);
		this.detailService.exportDatas(dto, res);
		return null;
	}
}
