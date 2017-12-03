package com.ruisitech.bi.entity.common;

public enum RequestStatus {
	SUCCESS(1),//成功
	FAIL_FIELD(0);//失败

	private Integer status;

	private RequestStatus(int status) {
		this.status=status;
	}

	public Integer getStatus() {
		return status;
	}
	
	
}
