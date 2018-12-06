package com.ruisitech.bi.entity.frame;

import java.io.Serializable;
import java.util.Date;

import com.ruisitech.bi.entity.common.BaseEntity;
import com.ruisitech.bi.util.RSBIUtils;

public final class User extends BaseEntity implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6096757156465671644L;
	
	private Integer userId;
	private String staffId;
	private Date loginTime;
	private Date lastActive;
	private String loginIp;
	private String sessionId;
	private Date logoutTime;
	private Integer logCnt;
	private String loginName;
	private String password;
	private String gender;
	private String mobilePhone;
	private String email;
	private String officeTel;
	private int state; //1 为启用， 0为停用。
		
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public User() {
		
	}
	public String getStaffId() {
		return staffId;
	}
	public void setStaffId(String staffId) {
		this.staffId = staffId;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public Date getLastActive() {
		return lastActive;
	}
	public void setLastActive(Date lastActive) {
		this.lastActive = lastActive;
	}
	public String getLoginIp() {
		return loginIp;
	}
	public void setLoginIp(String loginIp) {
		this.loginIp = loginIp;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public Date getLogoutTime() {
		return logoutTime;
	}
	public void setLogoutTime(Date logoutTime) {
		this.logoutTime = logoutTime;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLoginName() {
		return loginName;
	}
	
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getMobilePhone() {
		return mobilePhone;
	}
	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}
	public String getOfficeTel() {
		return officeTel;
	}
	public void setOfficeTel(String officeTel) {
		this.officeTel = officeTel;
	}
	
	@Override
	public String toString() {
		return "id = " + this.userId + ", name = " + this.loginName;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getLogCnt() {
		return logCnt;
	}
	public void setLogCnt(Integer logCnt) {
		this.logCnt = logCnt;
	}
	
	@Override
	public void validate() {
		this.staffId = RSBIUtils.htmlEscape(this.staffId);
		this.loginName = RSBIUtils.htmlEscape(this.loginName);
	}
	
}
