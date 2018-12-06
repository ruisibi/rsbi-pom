package com.ruisitech.bi.entity.app;

import java.util.Date;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.util.RSBIUtils;

public class Collect extends BaseEntity {
	
	private String rid;
	private Integer userId;
	private Date crtdate;
	private String title;
	private String url;
	public String getRid() {
		return rid;
	}
	public void setRid(String rid) {
		this.rid = rid;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Date getCrtdate() {
		return crtdate;
	}
	public void setCrtdate(Date crtdate) {
		this.crtdate = crtdate;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
	@Override
	public void validate() {
		this.title = RSBIUtils.htmlEscape(this.title);
		this.rid = RSBIUtils.htmlEscape(this.rid);
		this.url = RSBIUtils.htmlEscape(this.url);
	}
}
