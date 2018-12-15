package com.ruisitech.bi.entity.model;


public class Dimension extends CubeColMeta {
	
	private Integer dimId;
	private String name;
	private String type;
	private String colkey;
	private String coltext;
	private String dimord;
	private String ordcol;
	private String vtype;
	private String colTable;
	private Integer cubeId;
	private String groupId;
	private String groupName;
	private String dateformat;
	
	public Integer getDimId() {
		return dimId;
	}
	public void setDimId(Integer dimId) {
		this.dimId = dimId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getColkey() {
		return colkey;
	}
	public void setColkey(String colkey) {
		this.colkey = colkey;
	}
	public String getColtext() {
		return coltext;
	}
	public void setColtext(String coltext) {
		this.coltext = coltext;
	}
	public String getDimord() {
		return dimord;
	}
	public void setDimord(String dimord) {
		this.dimord = dimord;
	}
	public String getVtype() {
		return vtype;
	}
	public void setVtype(String vtype) {
		this.vtype = vtype;
	}
	public String getColTable() {
		return colTable;
	}
	public void setColTable(String colTable) {
		this.colTable = colTable;
	}
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public String getDateformat() {
		return dateformat;
	}
	public void setDateformat(String dateformat) {
		this.dateformat = dateformat;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getOrdcol() {
		return ordcol;
	}
	public void setOrdcol(String ordcol) {
		this.ordcol = ordcol;
	}

}
