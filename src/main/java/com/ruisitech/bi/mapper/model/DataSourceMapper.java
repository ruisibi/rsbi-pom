package com.ruisitech.bi.mapper.model;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.model.DataSource;

public interface DataSourceMapper {

	List<DataSource> listDataSource();
	
	void insertDataSource(DataSource ds);
	
	void updateDataSource(DataSource ds);
	
	void deleteDataSource(@Param("dsid") String dsid);
	
	DataSource getDataSource(@Param("dsid") String dsid);
}
