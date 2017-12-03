package com.ruisitech.bi.service.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.app.Collect;
import com.ruisitech.bi.mapper.app.CollectMapper;

@Service
public class CollectService {

	@Autowired
	private CollectMapper mapper;
	
	public List<Collect> listCollect(Integer userId, String basePath){
		List<Collect> ls = mapper.listCollect(userId);
		for(int i=0; i<ls.size(); i++){
			Collect m = ls.get(i);
			String url = basePath + "app/Report!view.action?rid=" + m.getRid();
			m.setUrl(url);
		}
		return ls;
	}
	
	public Integer collectExist(Collect collect){
		return mapper.collectExist(collect);
	}
	
	public void addCollect(Collect collect){
		mapper.addCollect(collect);
	}
	
	public void delCollect(Collect collect){
		mapper.delCollect(collect);
	}
	
}
