package com.ruisitech.bi.entity.common;

import com.ruisitech.bi.util.RSBIUtils;

public abstract class BaseEntity {
	
	public abstract void validate();

	private String dbName = RSBIUtils.getConstant("dbName");

	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
}
