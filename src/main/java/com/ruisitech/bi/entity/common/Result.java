package com.ruisitech.bi.entity.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class Result {

	/** 状态 */
    private Integer result;
    /** 消息 */
    private String msg;
    /** 数据 */
    @JsonInclude(Include.NON_NULL)
    private Object rows;
    
    private long total;
    
    public Result(){
    	
    }
    
    public Result(Integer result, String msg, Object rows){
    	this.result = result;
    	this.msg = msg;
    	this.rows = rows;
    }
    
    public Result(Integer result, String msg, Object rows, long total){
    	this.result = result;
    	this.msg = msg;
    	this.rows = rows;
    	this.total = total;
    }
    
	public Integer getResult() {
		return result;
	}
	public void setResult(Integer result) {
		this.result = result;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getRows() {
		return rows;
	}

	public void setRows(Object rows) {
		this.rows = rows;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}
	
	
}
