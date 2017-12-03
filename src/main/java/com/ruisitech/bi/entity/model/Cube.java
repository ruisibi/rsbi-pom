package com.ruisitech.bi.entity.model;

import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.common.BaseEntity;

public class Cube extends BaseEntity  {
	
	private Integer cubeId;
	private String cubeName;
	private String desc;
	/**
	 * 数据集名称
	 */
	private String dsetName; 
	private String dsetId;
	/**
	 * 数据源ID
	 */
	private String dsId;
	/**
	 * 主表
	 */
	private String priTable;
	
	private List<Dimension> dims;
	private List<Measure> kpis;
	
	/**
	 * 需要删除的对象, 包含 id, type
	 */
	private List<Map<String, Object>> delObj;

	
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public String getCubeName() {
		return cubeName;
	}
	public void setCubeName(String cubeName) {
		this.cubeName = cubeName;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getDsetName() {
		return dsetName;
	}
	public void setDsetName(String dsetName) {
		this.dsetName = dsetName;
	}
	public String getDsetId() {
		return dsetId;
	}
	public void setDsetId(String dsetId) {
		this.dsetId = dsetId;
	}
	public String getDsId() {
		return dsId;
	}
	public void setDsId(String dsId) {
		this.dsId = dsId;
	}
	public List<Dimension> getDims() {
		return dims;
	}
	public void setDims(List<Dimension> dims) {
		this.dims = dims;
	}
	public List<Measure> getKpis() {
		return kpis;
	}
	public void setKpis(List<Measure> kpis) {
		this.kpis = kpis;
	}
	public String getPriTable() {
		return priTable;
	}
	public void setPriTable(String priTable) {
		this.priTable = priTable;
	}
	public List<Map<String, Object>> getDelObj() {
		return delObj;
	}
	public void setDelObj(List<Map<String, Object>> delObj) {
		this.delObj = delObj;
	}
}
