package com.ruisitech.bi.entity.portal;

import java.util.Date;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.util.RSBIUtils;

public class Portal extends BaseEntity {
	
	private String pageId;
	private Integer userId;
	private String userName;
	private String pageInfo;
	private String pageName;
	private String is3g;
	private Integer cataId;
	private String cataName;
	private Date crtDate;
	private Date updateDate;
	
	public String getPageId() {
		return pageId;
	}
	public void setPageId(String pageId) {
		this.pageId = pageId;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getPageInfo() {
		return pageInfo;
	}
	public void setPageInfo(String pageInfo) {
		this.pageInfo = pageInfo;
	}
	public String getPageName() {
		return pageName;
	}
	public void setPageName(String pageName) {
		this.pageName = pageName;
	}
	public String getIs3g() {
		return is3g;
	}
	public void setIs3g(String is3g) {
		this.is3g = is3g;
	}
	public Integer getCataId() {
		return cataId;
	}
	public void setCataId(Integer cataId) {
		this.cataId = cataId;
	}
	public Date getCrtDate() {
		return crtDate;
	}
	public void setCrtDate(Date crtDate) {
		this.crtDate = crtDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCataName() {
		return cataName;
	}
	public void setCataName(String cataName) {
		this.cataName = cataName;
	}
	@Override
	public void validate() {
		this.pageName = RSBIUtils.htmlEscape(this.pageName);
		this.pageId = RSBIUtils.htmlEscape(this.pageId);
	}
}
