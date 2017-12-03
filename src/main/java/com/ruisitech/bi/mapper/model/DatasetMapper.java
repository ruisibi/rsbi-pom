package com.ruisitech.bi.mapper.model;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.model.Dataset;

public interface DatasetMapper {

	List<Dataset> listDataset();
	
	void updateDset(Dataset ds);
	
	void insertDset(Dataset ds);
	
	void deleteDset(@Param("dsetId") String dsetId);
	
	String getDatasetCfg(@Param("dsetId") String dsetId);
}
