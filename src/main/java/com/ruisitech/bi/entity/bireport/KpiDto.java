package com.ruisitech.bi.entity.bireport;

import java.util.Map;

import com.ruisitech.bi.entity.common.BaseEntity;

public class KpiDto extends BaseEntity {
	
	private String aggre;
	private String col_name;
	private String fmt;
	private String alias;
	private String kpi_name;
	private String ydispName;
	private String tname; //指标所在表名称
	private String descKey; //指标解释KEY
	private Integer rate; //指标倍率
	private String unit; //指标单位
	private Integer kpi_id; //指标ID
	private String sort; //指标排序方式，用在SQL中
	private String order; //客户端排序
	private Integer min; //y轴最小值
	private Integer max; //Y轴最大值，用在仪表盘中
	
	private Integer calc;  //是否计算指标
	
	private KpiFilterDto filter; //对指标进行过滤
	
	private Map<String, Object> style; //指标样式
	private Map<String, Object> warning;  //指标预警
	private String compute; //指标计算方式（同比、环比、占比、排名等计算）
	
	private String funcname;  //回调函数名称
	private String code;  //回调函数内容
	private Boolean mergeData; //合并第二纵轴的数据
	private String tfontcolor;
	private Integer tfontsize;  //字体大小
	
	public String getAggre() {
		return aggre;
	}
	public void setAggre(String aggre) {
		this.aggre = aggre;
	}
	public String getFmt() {
		return fmt;
	}
	public void setFmt(String fmt) {
		this.fmt = fmt;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getYdispName() {
		return ydispName;
	}
	public void setYdispName(String ydispName) {
		this.ydispName = ydispName;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public String getDescKey() {
		return descKey;
	}
	public void setDescKey(String descKey) {
		this.descKey = descKey;
	}
	public Integer getRate() {
		return rate;
	}
	public void setRate(Integer rate) {
		this.rate = rate;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	public Integer getCalc() {
		return calc;
	}
	public void setCalc(Integer calc) {
		this.calc = calc;
	}
	public KpiFilterDto getFilter() {
		return filter;
	}
	public void setFilter(KpiFilterDto filter) {
		this.filter = filter;
	}
	
	public Map<String, Object> getStyle() {
		return style;
	}
	public void setStyle(Map<String, Object> style) {
		this.style = style;
	}
	
	public Map<String, Object> getWarning() {
		return warning;
	}
	public void setWarning(Map<String, Object> warning) {
		this.warning = warning;
	}
	public String getCompute() {
		return compute;
	}
	public void setCompute(String compute) {
		this.compute = compute;
	}
	public String getFuncname() {
		return funcname;
	}
	public void setFuncname(String funcname) {
		this.funcname = funcname;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Boolean getMergeData() {
		return mergeData;
	}
	public void setMergeData(Boolean mergeData) {
		this.mergeData = mergeData;
	}
	public Integer getMax() {
		return max;
	}
	public void setMax(Integer max) {
		this.max = max;
	}
	public Integer getMin() {
		return min;
	}
	public void setMin(Integer min) {
		this.min = min;
	}
	public String getKpi_name() {
		return kpi_name;
	}
	public void setKpi_name(String kpi_name) {
		this.kpi_name = kpi_name;
	}
	public Integer getKpi_id() {
		return kpi_id;
	}
	public void setKpi_id(Integer kpi_id) {
		this.kpi_id = kpi_id;
	}
	public String getCol_name() {
		return col_name;
	}
	public void setCol_name(String col_name) {
		this.col_name = col_name;
	}
	public String getTfontcolor() {
		return tfontcolor;
	}
	public void setTfontcolor(String tfontcolor) {
		this.tfontcolor = tfontcolor;
	}
	public Integer getTfontsize() {
		return tfontsize;
	}
	public void setTfontsize(Integer tfontsize) {
		this.tfontsize = tfontsize;
	}
	
}
