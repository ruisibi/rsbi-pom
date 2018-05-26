package com.ruisitech.bi.entity.model;

public class Measure extends CubeColMeta {
	
	private Integer kpiId;
	private String name;
	private String kpinote;
	private String unit;
	private String fmt;
	private String aggre;
	/**
	 * 0否，1是
	 */
	private Integer calcKpi;
	private Integer cubeId;
	public Integer getKpiId() {
		return kpiId;
	}
	public void setKpiId(Integer kpiId) {
		this.kpiId = kpiId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getKpinote() {
		return kpinote;
	}
	public void setKpinote(String kpinote) {
		this.kpinote = kpinote;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getFmt() {
		return fmt;
	}
	public void setFmt(String fmt) {
		this.fmt = fmt;
	}
	public String getAggre() {
		return aggre;
	}
	//获取聚合字段字符串
	public String getAggreCol() {
		if("count(distinct)".equals(aggre)){  //需要特殊处理
			return "count(distinct " + super.getCol() + ")";
		}else{  //sum/avg/max/min/count 不需要特殊处理
			return aggre +"(" + super.getCol() +")";
		}
	}
	public void setAggre(String aggre) {
		this.aggre = aggre;
	}
	public Integer getCalcKpi() {
		return calcKpi;
	}
	public void setCalcKpi(Integer calcKpi) {
		this.calcKpi = calcKpi;
	}
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}

	
}
