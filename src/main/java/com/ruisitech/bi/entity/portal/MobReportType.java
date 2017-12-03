package com.ruisitech.bi.entity.portal;

import java.util.Date;

import com.ruisitech.bi.entity.common.BaseEntity;

public class MobReportType extends BaseEntity {

	private Integer id;
	private String name;
	private String text;
	private String note;
	private Integer crtUser;
	private Date crtDate;
	private Integer ord;
	private String iconCls;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}

	public Integer getCrtUser() {
		return crtUser;
	}
	public void setCrtUser(Integer crtUser) {
		this.crtUser = crtUser;
	}
	public Date getCrtDate() {
		return crtDate;
	}
	public void setCrtDate(Date crtDate) {
		this.crtDate = crtDate;
	}
	public Integer getOrd() {
		return ord;
	}
	public void setOrd(Integer ord) {
		this.ord = ord;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}
	
	
}
