package com.ruisitech.bi.web.model;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/model")
public class ModelController {

	@RequestMapping(value="/ModelIndex.action")
	public String index(){
		return "model/ModelIndex";
	}
}
