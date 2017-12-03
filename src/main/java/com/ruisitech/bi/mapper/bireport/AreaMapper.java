package com.ruisitech.bi.mapper.bireport;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.bireport.Area;

public interface AreaMapper {
	
	List<Area> listCityByProvCode(@Param("code") String code);

}
