package com.ruisitech.bi.entity.portal;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.common.BaseEntity;

public class PortalTableQuery extends BaseEntity {

	private String dsid;
	private String dsetId;
	private String id;
	private Integer cubeId;
	private String name;
	private String type;
	
	private List<KpiDto> kpiJson;
	private List<DimDto> cols;
	private List<DimDto> rows;
	
	private Map<String, Object> link;
	private LinkAcceptDto linkAccept;
	
	private List<PortalParamDto> portalParams;
	private List<CompParamDto> params;
	private String lockhead;
	private String height;
	private String showtitle;
	private Map<String, Object> style;
	
	private List<Map<String, Object>> drillDim;
	
	public String getDsid() {
		return dsid;
	}
	public void setDsid(String dsid) {
		this.dsid = dsid;
	}
	public String getDsetId() {
		return dsetId;
	}
	public void setDsetId(String dsetId) {
		this.dsetId = dsetId;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public List<KpiDto> getKpiJson() {
		return kpiJson;
	}
	public void setKpiJson(List<KpiDto> kpiJson) {
		this.kpiJson = kpiJson;
	}
	public List<DimDto> getCols() {
		return cols;
	}
	public void setCols(List<DimDto> cols) {
		this.cols = cols;
	}
	public List<DimDto> getRows() {
		return rows;
	}
	public void setRows(List<DimDto> rows) {
		this.rows = rows;
	}
	public Map<String, Object> getLink() {
		return link;
	}
	public void setLink(Map<String, Object> link) {
		this.link = link;
	}
	
	public LinkAcceptDto getLinkAccept() {
		return linkAccept;
	}
	public void setLinkAccept(LinkAcceptDto linkAccept) {
		this.linkAccept = linkAccept;
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
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public List<Map<String, Object>> getDrillDim() {
		return drillDim;
	}
	public void setDrillDim(List<Map<String, Object>> drillDim) {
		this.drillDim = drillDim;
	}
	public String getLockhead() {
		return lockhead;
	}
	public void setLockhead(String lockhead) {
		this.lockhead = lockhead;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public List<DimDto> getDims(){
		List<DimDto> ret = new ArrayList<DimDto>();
		ret.addAll(this.cols);
		ret.addAll(this.rows);
		return ret;
	}
	public Map<String, Object> getStyle() {
		return style;
	}
	public void setStyle(Map<String, Object> style) {
		this.style = style;
	}
	public String getShowtitle() {
		return showtitle;
	}
	public void setShowtitle(String showtitle) {
		this.showtitle = showtitle;
	}
	
}
