package com.ruisitech.bi.entity.model;

import com.ruisitech.bi.entity.common.BaseEntity;

public class CubeColMeta extends BaseEntity {
	
	private Integer rid;
	private Integer cubeId;
	/**
	 * 1 维度，2 度量
	 */
	private Integer colType; 
	private Integer colId;
	private String tname;
	private String col;
	private String alias;
	/**
	 * 1 是， 0 否
	 */
	private Integer calc;
	private Integer ord;
	private Integer targetId;
	/**
	 * 维度或度量是否被修改
	 */
	private String isupdate; 
	
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public Integer getColType() {
		return colType;
	}
	public void setColType(Integer colType) {
		this.colType = colType;
	}
	public Integer getColId() {
		return colId;
	}
	public void setColId(Integer colId) {
		this.colId = colId;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public String getCol() {
		return col;
	}
	public void setCol(String col) {
		this.col = col;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public Integer getCalc() {
		return calc;
	}
	public void setCalc(Integer calc) {
		this.calc = calc;
	}
	public Integer getOrd() {
		return ord;
	}
	public void setOrd(Integer ord) {
		this.ord = ord;
	}
	public Integer getRid() {
		return rid;
	}
	public void setRid(Integer rid) {
		this.rid = rid;
	}
	public Integer getTargetId() {
		return targetId;
	}
	public void setTargetId(Integer targetId) {
		this.targetId = targetId;
	}
	public String getIsupdate() {
		return isupdate;
	}
	public void setIsupdate(String isupdate) {
		this.isupdate = isupdate;
	}
	
}
