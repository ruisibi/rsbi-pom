package com.ruisitech.bi.entity.portal;

import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.common.BaseEntity;

public class PortalParamDto extends BaseEntity {

	private String paramid;
	private String defvalue;
	private String type;
	private String dtformat;
	private String name;
	private String valtype;
	private String hiddenprm;
	private String maxval;
	private String minval;
	private String id;
	private Integer size;
	private Map<String, Object> option;
	private List<Map<String, Object>> values;
	public String getParamid() {
		return paramid;
	}
	public void setParamid(String paramid) {
		this.paramid = paramid;
	}
	public String getDefvalue() {
		return defvalue;
	}
	public void setDefvalue(String defvalue) {
		this.defvalue = defvalue;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDtformat() {
		return dtformat;
	}
	public void setDtformat(String dtformat) {
		this.dtformat = dtformat;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValtype() {
		return valtype;
	}
	public void setValtype(String valtype) {
		this.valtype = valtype;
	}
	public String getHiddenprm() {
		return hiddenprm;
	}
	public void setHiddenprm(String hiddenprm) {
		this.hiddenprm = hiddenprm;
	}
	public String getMaxval() {
		return maxval;
	}
	public void setMaxval(String maxval) {
		this.maxval = maxval;
	}
	public String getMinval() {
		return minval;
	}
	public void setMinval(String minval) {
		this.minval = minval;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getSize() {
		return size;
	}
	public void setSize(Integer size) {
		this.size = size;
	}
	public Map<String, Object> getOption() {
		return option;
	}
	public void setOption(Map<String, Object> option) {
		this.option = option;
	}
	public List<Map<String, Object>> getValues() {
		return values;
	}
	public void setValues(List<Map<String, Object>> values) {
		this.values = values;
	}
	
	
}
