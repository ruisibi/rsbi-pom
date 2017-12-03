package com.ruisitech.bi.mapper.portal;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.portal.Portal;

public interface PortalMapper {

	List<Portal> listPortal();
	
	String getPortalCfg(@Param("pageId") String pageId);
	
	List<Portal> list3g(@Param("cataId") Integer cataId);
	
	void insertPortal(Portal portal);
	
	Portal getPortal(@Param("pageId") String pageId);
	
	void updatePortal(Portal portal);
	
	void deletePortal(@Param("pageId") String pageId);
	
	void renamePortal(Portal portal);
	
	List<Map<String, Object>> listAppReport(@Param("userId") Integer userId, @Param("cataId") Integer cataId);
}
