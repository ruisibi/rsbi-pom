package com.ruisitech.bi.web.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.entity.model.DataSource;
import com.ruisitech.bi.service.model.DataSourceService;
import com.ruisitech.bi.util.BaseController;

@Controller
@RequestMapping(value = "/model")
public class DataSourceController extends BaseController {

	@Autowired
	private DataSourceService dsService;
	
	@RequestMapping(value="/listDataSource.action")
	public @ResponseBody Object list(){
		return dsService.listDataSource();
	}
	
	@RequestMapping(value="/getDataSource.action")
	public @ResponseBody Object get(String dsid){
		return dsService.getDataSource(dsid);
	}
	
	@RequestMapping(value="/deleteDataSource.action")
	public @ResponseBody Object delete(String dsid){
		dsService.deleteDataSource(dsid);
		return this.buildSucces();
	}
	@RequestMapping(value="/testDataSource.action", method = RequestMethod.POST)
	public @ResponseBody Object test(DataSource ds){
		ds.setUse("jdbc");
		return dsService.testDataSource(ds);
	}
	@RequestMapping(value="/testJndi.action", method = RequestMethod.POST)
	public @ResponseBody Object testJndi(DataSource ds){
		ds.setUse("jndi");
		return dsService.testJNDI(ds);
	}
	
	@RequestMapping(value="/saveDataSource.action", method = RequestMethod.POST)
	public @ResponseBody Object save(DataSource ds){
		dsService.insertDataSource(ds);
		return this.buildSucces();			
	}
	
	@RequestMapping(value="/updateDataSource.action", method = RequestMethod.POST)
	public @ResponseBody Object update(DataSource ds){
		dsService.updateDataSource(ds);
		return this.buildSucces();			
	}
}
