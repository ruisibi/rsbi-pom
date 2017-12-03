package com.ruisitech.bi.mapper.model;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.model.Dimension;

public interface DimensionMapper {
	
	void insertDim(Dimension dim);
	
	void updatedim(Dimension dim);
	
	void deleteDim(Dimension dim);
	
	void insertGroup(Dimension dim);
	
	Integer getMaxDimId();
	
	void deleteGroupById(@Param("groupId") String groupId);
		
	void deleteGroupByCubeId(@Param("cubeId") Integer cubeId);
	
	List<String> listGroup(@Param("cubeId") Integer cubeId);
	
	Dimension getDimInfo(@Param("dimId") Integer dimId, @Param("cubeId") Integer cubeId);
}
