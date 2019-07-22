package com.ruisitech.bi.web.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruisitech.bi.entity.model.Dataset;
import com.ruisitech.bi.service.model.DataSourceService;
import com.ruisitech.bi.service.model.DatasetService;
import com.ruisitech.bi.util.BaseController;

@Controller
@RequestMapping(value = "/model")
public class DatasetController extends BaseController {
	
	@Autowired
	private DatasetService service;
	
	@Autowired
	private DataSourceService dsservice;
	
	@RequestMapping(value="/listDataset.action")
	public @ResponseBody Object list(){
		return service.listDataset();
	}
	
	@RequestMapping(value="/listTables.action")
	public @ResponseBody Object listTables(String dsid, String tname) throws Exception{
		return dsservice.listTables(dsid, tname);
	}
	
	@RequestMapping(value="/listTableColumns.action")
	public @ResponseBody Object listTableColumns(String dsid, String tname) throws Exception {
		return service.listTableColumns(dsid, tname);
	}
	
	@RequestMapping(value="/queryDatasetMeta.action", method = RequestMethod.POST)
	public @ResponseBody Object queryDatasetMeta(String cfg, String dsid) throws Exception {
		JSONObject dset = (JSONObject)JSON.parse(cfg);
		return service.queryMetaAndIncome(dset, dsid);
	}
	
	@RequestMapping(value="/updateDset.action", method = RequestMethod.POST)
	public @ResponseBody Object updateDset(Dataset dset)  {
		service.updateDset(dset);
		return this.buildSucces();
	}
	
	@RequestMapping(value="/saveDset.action", method = RequestMethod.POST)
	public @ResponseBody Object saveDset(Dataset dset)  {
		service.insertDset(dset);
		return buildSucces();
	}
	
	@RequestMapping(value="/deleteDset.action")
	public @ResponseBody Object deleteDset(String dsetId)  {
		service.deleteDset(dsetId);
		return buildSucces();
	}
	
	@RequestMapping(value="/getDatasetCfg.action")
	public @ResponseBody Object getDatasetCfg(String dsetId)  {
		String ret = service.getDatasetCfg(dsetId);
		return ret;
	}
	
	@RequestMapping(value="/reloadDset.action")
	public @ResponseBody Object reloadDset(String dsetId, String dsid)  {
		try{
			service.reloadDset(dsetId, dsid);
			return super.buildSucces();
		}catch(Exception ex){
			ex.printStackTrace();
			return super.buildError(ex.getMessage());
		}
	}
}
