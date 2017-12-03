package com.ruisitech.bi.web.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ruisitech.bi.entity.common.PageParam;
import com.ruisitech.bi.entity.common.Result;
import com.ruisitech.bi.entity.model.Cube;
import com.ruisitech.bi.service.model.CubeService;
import com.ruisitech.bi.util.BaseController;

@Controller
@RequestMapping(value = "/model")
public class CubeController extends BaseController {
	
	@Autowired
	private CubeService service;
	
	@RequestMapping(value="/listCube.action")
	public @ResponseBody Object list(){
		return service.listCube(null);
	}
	
	@RequestMapping(value="/pageCube.action")
	public @ResponseBody Object page(String key, PageParam page){
		PageHelper.startPage(page.getPage(), page.getRows());
		List<Cube> ls = service.listCube(key);
		PageInfo<Cube> pageInfo=new PageInfo<Cube>(ls);
		return super.buildSucces(pageInfo);
	}

	@RequestMapping(value="/saveCube.action", method = RequestMethod.POST)
	public @ResponseBody Object save(@RequestBody Cube cube){
		Result ret = service.insertCube(cube);
		return ret;
	}
	
	@RequestMapping(value="/updateCube.action", method = RequestMethod.POST)
	public @ResponseBody Object update(@RequestBody Cube cube){
		Result ret = service.updateCube(cube);
		return ret;
	}
	
	@RequestMapping(value="/delCube.action")
	public @ResponseBody Object delete(Integer cubeId){
		Result ret = service.deleteCube(cubeId);
		return ret;
	}
	
	@RequestMapping(value="/getCube.action")
	public @ResponseBody Object get(Integer cubeId){
		return service.getCubeById(cubeId).toString();
	}
	
	@RequestMapping(value="/treeCube.action")
	public @ResponseBody Object tree(Integer cubeId){
		return service.treeCube(cubeId);
	}
}
