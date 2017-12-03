package com.ruisitech.bi.service.portal;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.portal.Portal;
import com.ruisitech.bi.mapper.portal.PortalMapper;

@Service
public class PortalService {
	
	@Autowired
	private PortalMapper mapper;
	
	public List<Portal> listPortal(){
		return mapper.listPortal();
	}
	
	public String getPortalCfg(String pageId){
		return mapper.getPortalCfg(pageId);
	}
	
	public List<Portal> list3g(Integer cataId){
		return mapper.list3g(cataId);
	}
	
	public void insertPortal(Portal portal){
		mapper.insertPortal(portal);
	}
	
	public void deletePortal(String pageId){
		mapper.deletePortal(pageId);
	}
	
	public void updatePortal(Portal portal){
		mapper.updatePortal(portal);
	}
	
	public Portal getPortal(String pageId){
		return mapper.getPortal(pageId);
	}
	
	public void renamePortal(Portal portal){
		mapper.renamePortal(portal);
	}
	
	public List<Map<String, Object>> listAppReport(Integer userId, Integer cataId){
		return mapper.listAppReport(userId, cataId);
	}
}
