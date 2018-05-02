package com.ruisitech.ext.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.service.bireport.ModelCacheService;

/**
 * 默认数据权限控制类，如果需要用户可以再扩展
 * @author hq
 *
 */
public class DataControlImpl implements DataControlInterface {
	
	@Autowired
	private ModelCacheService cacheService;

	@Override
	public String process(User u, String tname) {
		
		return "";
	}

}
