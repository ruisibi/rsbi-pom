package com.ruisitech.bi.entity.common;

public class DSColumn {
	private Integer idx;
	private String name;
	private String type;
	private String dispName;
	private Integer length; //字段长度
	private String tname; 
	private Boolean isshow = true; //是否显示字段
	private String expression;
	
	public String getName() {
		return name;
	}
	public String getType() {
		return type;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDispName() {
		return dispName;
	}
	public void setDispName(String dispName) {
		this.dispName = dispName;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public Integer getIdx() {
		return idx;
	}
	public void setIdx(Integer idx) {
		this.idx = idx;
	}
	public Boolean getIsshow() {
		return isshow;
	}
	public void setIsshow(Boolean isshow) {
		this.isshow = isshow;
	}
	public Integer getLength() {
		return length;
	}
	public void setLength(Integer length) {
		this.length = length;
	}
	public String getExpression() {
		return expression;
	}
	public void setExpression(String expression) {
		this.expression = expression;
	}
	
}
