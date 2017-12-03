package com.ruisitech.bi.entity.portal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.bireport.ChartJSONDto;
import com.ruisitech.bi.entity.bireport.KpiDto;

public class PortalChartQuery {
	
	private String dsid;
	private String dsetId;
	private Integer compId;
	private List<KpiDto> kpiJson;
	/**
	 * 提出 kpiJson 中 为 null的数据
	 */
	private List<KpiDto> useKpiJson;
	private ChartJSONDto chartJson;
	private List<PortalParamDto> portalParams;
	private List<CompParamDto> params;
	private String id;
	private Integer cubeId;
	private String name;
	private String type;
	
	private Map<String, Object> style = new HashMap<String, Object>();
	
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
	public Integer getCompId() {
		return compId;
	}
	public void setCompId(Integer compId) {
		this.compId = compId;
	}
	public List<KpiDto> getKpiJson() {
		if(useKpiJson == null){
			useKpiJson = new ArrayList<KpiDto>();
			for(KpiDto kpi: this.kpiJson){
				if(kpi != null){
					useKpiJson.add(kpi);
				}
			}
		}
		return useKpiJson;
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
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public Map<String, Object> getStyle() {
		return style;
	}
	public void setStyle(Map<String, Object> style) {
		this.style = style;
	}
	
}
