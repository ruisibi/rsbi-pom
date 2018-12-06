package com.ruisitech.bi.entity.bireport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.common.BaseEntity;

public class TableQueryDto extends BaseEntity {

	private String dsid;
	private String dsetId;
	private String compId;
	
	private List<KpiDto> kpiJson;
	private List<DimDto> cols;
	private List<DimDto> rows;
	private List<ParamDto> params;
	
	private Map<String, Object> link;
	private Map<String, Object> linkAccept;
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

	public String getCompId() {
		return compId;
	}
	public void setCompId(String compId) {
		this.compId = compId;
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
	public List<ParamDto> getParams() {
		return params;
	}
	public void setParams(List<ParamDto> params) {
		this.params = params;
	}
	
	/**
	 * 获取kpi的计算方式，是计算上期值、还是计算同期值、还是都计算
	 * 
	 * @return 返回 0(都不计算)，1（上期值）, 2（同期值）, 3 （都计算） 
	 */
	public int getKpiComputeType(){
		boolean sq = false;
		boolean tq = false;
		for(KpiDto kpi : kpiJson){
			String compute = kpi.getCompute();
			if(compute != null && compute.length() > 0){
				String[] jss = compute.split(",");
				for(String js : jss){
					if("sq".equals(js) || "zje".equals(js) || "hb".equals(js)){
						sq = true;
					}else if("tq".equals(js) || "tb".equals(js)){
						tq = true;
					}
				}
			}
		}
		if(sq && tq){
			return 3;
		}else if(sq){
			return 1;
		}else if(tq){
			return 2;
		}else{
			return 0;
		}
	}
	public Map<String, Object> getLink() {
		return link;
	}
	public void setLink(Map<String, Object> link) {
		this.link = link;
	}
	public Map<String, Object> getLinkAccept() {
		return linkAccept;
	}
	public void setLinkAccept(Map<String, Object> linkAccept) {
		this.linkAccept = linkAccept;
	}
	public List<Map<String, Object>> getDrillDim() {
		return drillDim;
	}
	public void setDrillDim(List<Map<String, Object>> drillDim) {
		this.drillDim = drillDim;
	}
	
	public List<DimDto> getDims(){
		List<DimDto> ret = new ArrayList<DimDto>();
		ret.addAll(this.cols);
		ret.addAll(this.rows);
		return ret;
	}
	@Override
	public void validate() {
		 
	 }
}
