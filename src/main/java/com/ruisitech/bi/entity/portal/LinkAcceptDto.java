package com.ruisitech.bi.entity.portal;

import com.ruisitech.bi.entity.common.BaseEntity;

/**
 * 事件接收
 * @author hq
 *
 */
public class LinkAcceptDto extends BaseEntity {

	private Integer id;
	private String col;
	private String tableColKey;
	private String alias;
	private String type;
	private String dftval;
	private String valType;
	private Integer calc;
	private String tname;
	private String dimTname;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getCol() {
		return col;
	}
	public void setCol(String col) {
		this.col = col;
	}
	public String getTableColKey() {
		return tableColKey;
	}
	public void setTableColKey(String tableColKey) {
		this.tableColKey = tableColKey;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDftval() {
		return dftval;
	}
	public void setDftval(String dftval) {
		this.dftval = dftval;
	}
	public String getValType() {
		return valType;
	}
	public void setValType(String valType) {
		this.valType = valType;
	}
	public Integer getCalc() {
		return calc;
	}
	public void setCalc(Integer calc) {
		this.calc = calc;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public String getDimTname() {
		return dimTname;
	}
	public void setDimTname(String dimTname) {
		this.dimTname = dimTname;
	}
	
	
}
