package com.ruisitech.bi.entity.portal;

import com.ruisitech.bi.entity.common.BaseEntity;

public class GridColDto extends BaseEntity {

	private String id;
	private String name;
	private String dispName;
	private String tname;
	private String type;
	private String expression;
	private String fmt;
	private String align;
	private String sort;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getExpression() {
		return expression;
	}
	public void setExpression(String expression) {
		this.expression = expression;
	}
	public String getDispName() {
		return dispName;
	}
	public void setDispName(String dispName) {
		this.dispName = dispName;
	}
	public String getFmt() {
		return fmt;
	}
	public void setFmt(String fmt) {
		this.fmt = fmt;
	}
	public String getAlign() {
		return align;
	}
	public void setAlign(String align) {
		this.align = align;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	
}
