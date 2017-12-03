package com.ruisitech.bi.entity.portal;

import java.util.List;

import com.ruisitech.bi.entity.common.BaseEntity;

public class GridQuery extends BaseEntity {

	private String id;
	private String type;
	private String name;
	private String dsetId;
	private String dsid;
	private List<GridColDto> cols;
	private List<PortalParamDto> portalParams;
	private List<CompParamDto> params;
	
	private String lockhead;
	private Integer height;
	private Integer pageSize;
	private String isnotfy;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
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
	public List<GridColDto> getCols() {
		return cols;
	}
	public void setCols(List<GridColDto> cols) {
		this.cols = cols;
	}
	public List<PortalParamDto> getPortalParams() {
		return portalParams;
	}
	public void setPortalParams(List<PortalParamDto> portalParams) {
		this.portalParams = portalParams;
	}
	public List<CompParamDto> getParams() {
		return params;
	}
	public void setParams(List<CompParamDto> params) {
		this.params = params;
	}
	public String getLockhead() {
		return lockhead;
	}
	public void setLockhead(String lockhead) {
		this.lockhead = lockhead;
	}
	public Integer getHeight() {
		return height;
	}
	public void setHeight(Integer height) {
		this.height = height;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	public String getIsnotfy() {
		return isnotfy;
	}
	public void setIsnotfy(String isnotfy) {
		this.isnotfy = isnotfy;
	}
	
}
