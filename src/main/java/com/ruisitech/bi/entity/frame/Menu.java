package com.ruisitech.bi.entity.frame;

import java.util.Date;
import java.util.List;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.util.RSBIUtils;

public class Menu extends BaseEntity {
	
	private Integer menuId;
	private Integer menuPid;
	private String menuName;
	private String menuDesc;
	private Date menuDate;
	private Integer menuOrder;
	private String menuUrl;
	private String urls;
	private String mvs;
	private String avatar;
	
	private List<Menu> children;
	
	public Integer getMenuId() {
		return menuId;
	}
	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}
	public Integer getMenuPid() {
		return menuPid;
	}
	public void setMenuPid(Integer menuPid) {
		this.menuPid = menuPid;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getMenuDesc() {
		return menuDesc;
	}
	public void setMenuDesc(String menuDesc) {
		this.menuDesc = menuDesc;
	}
	public Date getMenuDate() {
		return menuDate;
	}
	public void setMenuDate(Date menuDate) {
		this.menuDate = menuDate;
	}
	public Integer getMenuOrder() {
		return menuOrder;
	}
	public void setMenuOrder(Integer menuOrder) {
		this.menuOrder = menuOrder;
	}
	public String getMenuUrl() {
		return menuUrl;
	}
	public void setMenuUrl(String menuUrl) {
		this.menuUrl = menuUrl;
	}
	public String getUrls() {
		return urls;
	}
	public void setUrls(String urls) {
		this.urls = urls;
	}
	public String getMvs() {
		return mvs;
	}
	public void setMvs(String mvs) {
		this.mvs = mvs;
	}
	public String getAvatar() {
		return avatar;
	}
	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}
	public List<Menu> getChildren() {
		return children;
	}
	public void setChildren(List<Menu> children) {
		this.children = children;
	}
	
	 @Override
	public void validate() {
		this.menuName = RSBIUtils.htmlEscape(this.menuName);
		this.menuDesc = RSBIUtils.htmlEscape(this.menuDesc);
	}
}
