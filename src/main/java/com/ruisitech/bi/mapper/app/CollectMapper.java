package com.ruisitech.bi.mapper.app;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.app.Collect;

public interface CollectMapper {
	
	List<Collect> listCollect(@Param("userId") Integer userId);
	
	Integer collectExist(Collect collect);
	
	void addCollect(Collect collect);
	
	void delCollect(Collect collect);
}
