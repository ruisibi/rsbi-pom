package com.ruisitech.bi.entity.model;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.service.model.DataSourceService;

public class DataSource extends BaseEntity {
	
	private String linkType;
	private String linkName;
	private String linkPwd;
	private String linkUrl;
	private String dsname;
	private String jndiName;
	private String use; //使用jdbc/jndi
	private String dsid;
	
	/**
	 * 获取驱动类
	 * @return
	 */
	public String getClazz(){
		String clazz  = null;
		String linktype = this.getLinkType();
		if(linktype.equals("mysql")){
			clazz = DataSourceService.mysql;
		}else if(linktype.equals("oracle")){
			clazz = DataSourceService.oracle;
		}else if(linktype.equals("sqlserver")){
			clazz = DataSourceService.sqlserver;
		}
		return clazz;
	}
	
	public String getLinkType() {
		return linkType;
	}
	public void setLinkType(String linkType) {
		this.linkType = linkType;
	}
	public String getLinkName() {
		return linkName;
	}
	public void setLinkName(String linkName) {
		this.linkName = linkName;
	}
	public String getLinkPwd() {
		return linkPwd;
	}
	public void setLinkPwd(String linkPwd) {
		this.linkPwd = linkPwd;
	}
	public String getLinkUrl() {
		return linkUrl;
	}
	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}
	public String getDsname() {
		return dsname;
	}
	public void setDsname(String dsname) {
		this.dsname = dsname;
	}
	
	public String getJndiName() {
		return jndiName;
	}
	public void setJndiName(String jndiName) {
		this.jndiName = jndiName;
	}
	public String getUse() {
		return use;
	}
	public void setUse(String use) {
		this.use = use;
	}
	public String getDsid() {
		return dsid;
	}
	public void setDsid(String dsid) {
		this.dsid = dsid;
	}
}
