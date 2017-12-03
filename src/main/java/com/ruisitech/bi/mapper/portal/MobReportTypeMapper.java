package com.ruisitech.bi.mapper.portal;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.portal.MobReportType;

public interface MobReportTypeMapper {

	List<MobReportType> listcataTree();
	
	void insertType(MobReportType type);
	
	void updateType(MobReportType type);
	
	void deleleType(@Param("id") Integer id);
	
	MobReportType getType(@Param("id") Integer id);
	
	Integer cntReport(@Param("id") Integer id);
	
	Integer maxTypeId();
}
