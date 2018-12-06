package com.ruisitech.bi.entity.bireport;

import com.ruisitech.bi.entity.common.BaseEntity;

public class ParamDto extends BaseEntity {

	private String type;
	private String colname;
	private String alias;
	private String valType;
	private String dateformat;
	private String tname;
	private String st;
	private String end;
	private String vals;
	private String valStrs;
	private String valDesc;
	private Integer id;
	private Integer cubeId;
	private String colDesc;
	private String tableName;
	private String dimord;
	private String tableColKey;
	private String tableColName;
	private String dsid;
	private String grouptype;
	private String name;
	private Integer filtertype;
	private Integer calc; //是否动态指标
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getColname() {
		return colname;
	}
	public void setColname(String colname) {
		this.colname = colname;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getValType() {
		return valType;
	}
	public void setValType(String valType) {
		this.valType = valType;
	}
	public String getDateformat() {
		return dateformat;
	}
	public void setDateformat(String dateformat) {
		this.dateformat = dateformat;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public String getSt() {
		return st;
	}
	public void setSt(String st) {
		this.st = st;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getVals() {
		return vals;
	}
	public void setVals(String vals) {
		this.vals = vals;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getValDesc() {
		return valDesc;
	}
	public void setValDesc(String valDesc) {
		this.valDesc = valDesc;
	}
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public String getColDesc() {
		return colDesc;
	}
	public void setColDesc(String colDesc) {
		this.colDesc = colDesc;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getDimord() {
		return dimord;
	}
	public void setDimord(String dimord) {
		this.dimord = dimord;
	}
	public String getTableColKey() {
		return tableColKey;
	}
	public void setTableColKey(String tableColKey) {
		this.tableColKey = tableColKey;
	}
	public String getTableColName() {
		return tableColName;
	}
	public void setTableColName(String tableColName) {
		this.tableColName = tableColName;
	}
	public String getDsid() {
		return dsid;
	}
	public void setDsid(String dsid) {
		this.dsid = dsid;
	}
	public String getValStrs() {
		return valStrs;
	}
	public void setValStrs(String valStrs) {
		this.valStrs = valStrs;
	}
	public String getGrouptype() {
		return grouptype;
	}
	public void setGrouptype(String grouptype) {
		this.grouptype = grouptype;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getFiltertype() {
		return filtertype;
	}
	public void setFiltertype(Integer filtertype) {
		this.filtertype = filtertype;
	}
	public Integer getCalc() {
		return calc;
	}
	public void setCalc(Integer calc) {
		this.calc = calc;
	}
	@Override
	public void validate() {
		 
	 }
}
