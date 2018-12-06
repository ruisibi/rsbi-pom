package com.ruisitech.bi.entity.model;

import java.util.Date;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.util.RSBIUtils;

public class Dataset extends BaseEntity {
	
	private String dsetId;
	/**
	 * 数据源ID
	 */
	private String dsid;
	private String dsname;
	/**
	 * 数据源链接方式
	 */
	private String useType;
	private String name;
	private String cfg;
	private Date crtdate;
	private String priTable;
	public String getDsetId() {
		return dsetId;
	}
	public void setDsetId(String dsetId) {
		this.dsetId = dsetId;
	}
	public String getDsid() {
		return dsid;
	}
	public void setDsid(String dsid) {
		this.dsid = dsid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCfg() {
		return cfg;
	}
	public void setCfg(String cfg) {
		this.cfg = cfg;
	}
	public Date getCrtdate() {
		return crtdate;
	}
	public void setCrtdate(Date crtdate) {
		this.crtdate = crtdate;
	}
	public String getPriTable() {
		return priTable;
	}
	public void setPriTable(String priTable) {
		this.priTable = priTable;
	}
	public String getDsname() {
		return dsname;
	}
	public void setDsname(String dsname) {
		this.dsname = dsname;
	}
	public String getUseType() {
		return useType;
	}
	public void setUseType(String useType) {
		this.useType = useType;
	}
	@Override
	public void validate() {
		this.dsname = RSBIUtils.htmlEscape(this.dsname);
		this.name = RSBIUtils.htmlEscape(this.name);
	}
}
