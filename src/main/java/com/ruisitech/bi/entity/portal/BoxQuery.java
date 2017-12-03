package com.ruisitech.bi.entity.portal;

import java.util.List;

import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.common.BaseEntity;

public class BoxQuery extends BaseEntity {

	private String id;
	private String type;
	private String name;
	private String dsetId;
	private String dsid;
	private KpiDto kpiJson;
	private List<PortalParamDto> portalParams;
	private List<CompParamDto> params;
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
	public KpiDto getKpiJson() {
		return kpiJson;
	}
	public void setKpiJson(KpiDto kpiJson) {
		this.kpiJson = kpiJson;
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
	
}
