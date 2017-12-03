package com.ruisitech.bi.entity.bireport;

import java.util.List;

import com.ruisitech.bi.entity.common.BaseEntity;

public class ChartQueryDto extends BaseEntity {

	private String dsid;
	private String dsetId;
	private Integer compId;
	
	private List<KpiDto> kpiJson;
	
	private ChartJSONDto chartJson;
	
	private List<ParamDto> params;
	
	public Integer getCompId() {
		return compId;
	}
	public void setCompId(Integer compId) {
		this.compId = compId;
	}
	public List<KpiDto> getKpiJson() {
		return kpiJson;
	}
	public void setKpiJson(List<KpiDto> kpiJson) {
		this.kpiJson = kpiJson;
	}
	public ChartJSONDto getChartJson() {
		return chartJson;
	}
	public void setChartJson(ChartJSONDto chartJson) {
		this.chartJson = chartJson;
	}
	public List<ParamDto> getParams() {
		return params;
	}
	public void setParams(List<ParamDto> params) {
		this.params = params;
	}
	
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
}
