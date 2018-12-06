package com.ruisitech.bi.entity.bireport;

import com.ruisitech.bi.entity.common.BaseEntity;

public class DimDto extends BaseEntity {

	private Integer id;
	private String type;
	private String colname; //码表在事实表中对应的字段名
	private String alias; //别名
	private String vals; //码表的限制维
	private String valDesc; //码表限制维的名称
	private String issum; //y,n两值
	private String tname; //维度所在表name
	private Integer calc;  //是否计算列
	private String tableName; //维度码表表名
	private String tableColKey; //码表表KEY字段
	private String tableColName; //码表表name字段
	
	private String dimord; //维度排序方式
	private String ordcol; //维度排序字段
	private String dimdesc; //维度名称
	private String valType; //维度value 字段的类型，用在拼接sql中，判断是否增加单引号
	
	private String dimpos; //维度所在位置，行维度还是列维度
	private String pos; //col还是row, 用在图形中表示钻取维度的来源
	private String dateformat; //如果是时间维度，设置时间类型
	private String grouptype;
	private String iscas;
	private Integer top;
	private String topType;
	private String aggre;
	private Integer filtertype;
	private String startmt;
	private String endmt;
	private String startdt;
	private String enddt;
	private Integer cubeId;
	private String xdispName;
	private String tickInterval;
	private String routeXaxisLable;
	
	private QueryDayDto day;
	private QueryMonthDto month;
	
	public String getOrdcol() {
		return ordcol;
	}
	public void setOrdcol(String ordcol) {
		this.ordcol = ordcol;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getColname() {
		return colname;
	}
	public void setColname(String colname) {
		this.colname = colname;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getVals() {
		return vals;
	}
	public void setVals(String vals) {
		this.vals = vals;
	}
	public String getValDesc() {
		return valDesc;
	}
	public void setValDesc(String valDesc) {
		this.valDesc = valDesc;
	}
	public String getIssum() {
		return issum;
	}
	public void setIssum(String issum) {
		this.issum = issum;
	}
	public String getTname() {
		return tname;
	}
	public void setTname(String tname) {
		this.tname = tname;
	}
	public Integer getCalc() {
		return calc;
	}
	public void setCalc(Integer calc) {
		this.calc = calc;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getTableColKey() {
		return tableColKey;
	}
	public void setTableColKey(String tableColKey) {
		this.tableColKey = tableColKey;
	}
	public String getTableColName() {
		return tableColName;
	}
	public void setTableColName(String tableColName) {
		this.tableColName = tableColName;
	}
	public String getDimord() {
		return dimord;
	}
	public void setDimord(String dimord) {
		this.dimord = dimord;
	}
	public String getDimdesc() {
		return dimdesc;
	}
	public void setDimdesc(String dimdesc) {
		this.dimdesc = dimdesc;
	}
	public String getValType() {
		return valType;
	}
	public void setValType(String valType) {
		this.valType = valType;
	}
	public String getDimpos() {
		return dimpos;
	}
	public void setDimpos(String dimpos) {
		this.dimpos = dimpos;
	}
	public String getPos() {
		return pos;
	}
	public void setPos(String pos) {
		this.pos = pos;
	}
	public String getDateformat() {
		return dateformat;
	}
	public void setDateformat(String dateformat) {
		this.dateformat = dateformat;
	}
	public String getGrouptype() {
		return grouptype;
	}
	public void setGrouptype(String grouptype) {
		this.grouptype = grouptype;
	}
	public String getIscas() {
		return iscas;
	}
	public void setIscas(String iscas) {
		this.iscas = iscas;
	}
	public QueryDayDto getDay() {
		if(day == null){
			if(startdt != null && startdt.length() > 0 && enddt != null && enddt.length() > 0){
				day = new QueryDayDto();
				day.setStartDay(this.startdt);
				day.setEndDay(this.enddt);
			}
		}
		return day;
	}
	public void setDay(QueryDayDto day) {
		this.day = day;
	}
	public QueryMonthDto getMonth() {
		if(month == null){
			if(startmt != null && startmt.length() > 0 && endmt != null && endmt.length() > 0){
				month = new QueryMonthDto();
				month.setStartMonth(startmt);
				month.setEndMonth(endmt);
			}
		}
		return month;
	}
	public void setMonth(QueryMonthDto month) {
		this.month = month;
	}
	public Integer getTop() {
		return top;
	}
	public void setTop(Integer top) {
		this.top = top;
	}
	public String getTopType() {
		return topType;
	}
	public void setTopType(String topType) {
		this.topType = topType;
	}
	public String getAggre() {
		return aggre;
	}
	public void setAggre(String aggre) {
		this.aggre = aggre;
	}
	public Integer getFiltertype() {
		return filtertype;
	}
	public void setFiltertype(Integer filtertype) {
		this.filtertype = filtertype;
	}
	public String getStartmt() {
		return startmt;
	}
	public void setStartmt(String startmt) {
		this.startmt = startmt;
	}
	public String getEndmt() {
		return endmt;
	}
	public void setEndmt(String endmt) {
		this.endmt = endmt;
	}
	public String getStartdt() {
		return startdt;
	}
	public void setStartdt(String startdt) {
		this.startdt = startdt;
	}
	public String getEnddt() {
		return enddt;
	}
	public void setEnddt(String enddt) {
		this.enddt = enddt;
	}
	public Integer getCubeId() {
		return cubeId;
	}
	public void setCubeId(Integer cubeId) {
		this.cubeId = cubeId;
	}
	public String getXdispName() {
		return xdispName;
	}
	public void setXdispName(String xdispName) {
		this.xdispName = xdispName;
	}
	public String getTickInterval() {
		return tickInterval;
	}
	public void setTickInterval(String tickInterval) {
		this.tickInterval = tickInterval;
	}
	public String getRouteXaxisLable() {
		return routeXaxisLable;
	}
	public void setRouteXaxisLable(String routeXaxisLable) {
		this.routeXaxisLable = routeXaxisLable;
	}
	@Override
	public void validate() {
		 
	 }
}
