package com.ruisitech.bi.service.bireport;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ruisi.bi.engine.view.context.chart.ChartContext;
import com.ruisi.bi.engine.view.context.chart.ChartContextImpl;
import com.ruisi.bi.engine.view.context.chart.ChartKeyContext;
import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.init.TemplateManager;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContextImpl;
import com.ruisi.ext.engine.view.context.dc.grid.GridFilterContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridSetConfContext;
import com.ruisi.ext.engine.view.context.html.TextContext;
import com.ruisi.ext.engine.view.context.html.TextContextImpl;
import com.ruisi.ispire.dc.grid.GridFilter;
import com.ruisitech.bi.entity.bireport.Area;
import com.ruisitech.bi.entity.bireport.ChartJSONDto;
import com.ruisitech.bi.entity.bireport.ChartQueryDto;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.bireport.ParamDto;
import com.ruisitech.bi.mapper.bireport.AreaMapper;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class ChartService extends BaseCompService {
	
	public final static String deftMvId = "mv.chart.tmp";
	
	@Autowired
	private ModelCacheService cacheService;
	@Autowired
	private AreaMapper areaMapper;
	@Autowired
	private DataControlInterface dataControl; //数据权限控制
	
	public @PostConstruct void init() {
		
	}  
	
	public @PreDestroy void destory() {
		
	}
	
	public MVContext json2MV(ChartQueryDto chart, boolean xlsdata) throws Exception{
		
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
	
		if(!xlsdata){
			//创建图形钻取项
			this.createChartDrill(mv, chart);
		}
		
		//创建chart
		ChartContext cr = this.json2Chart(chart.getChartJson(), chart.getKpiJson(), false);
		cr.setXlsData(xlsdata);
		
		String sql = this.createSql(chart, 0);
		GridDataCenterContext dc = this.createDataCenter(chart.getChartJson(), sql);
		cr.setRefDataCenter(dc.getId());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		
		mv.getChildren().add(cr);
		cr.setParent(mv);
		
		Map<String, ChartContext> crs = new HashMap<String, ChartContext>();
		crs.put(cr.getId(), cr);
		mv.setCharts(crs);
		
		String dsid = createDsource(cacheService.getDsource(chart.getDsid()), mv);
		dc.getConf().setRefDsource(dsid);
		
		return mv;
	}
	
	public ChartContext json2Chart(ChartJSONDto chartJson, List<KpiDto> kpiJson, boolean is3g){
		ChartContext ctx = new ChartContextImpl();
		ctx.setLabel(chartJson.getLabel());
		//设置x
		DimDto xcol = chartJson.getXcol();
		if(xcol != null){
			String tp = xcol.getType();
			String alias = xcol.getAlias();
			String key = xcol.getTableColKey();
			String txt = xcol.getTableColName();
			if("day".equals(tp)){
				ctx.setDateType(tp);
				ctx.setDateTypeFmt(xcol.getDateformat());
			}
			if(key != null && key.length() > 0 && txt != null && txt.length() > 0){  //只有在维度关联了维度表后才进行判断
				ctx.setXcolDesc(key); //用来关联ID,用在钻取中
				ctx.setXcol(txt);
			}else{
				ctx.setXcolDesc(alias);
				ctx.setXcol(alias);
			}
		}
		
		
		KpiDto kpiInfo = kpiJson.get(0);
		String y = kpiInfo.getAlias();
		ctx.setYcol(y);
		
		//如果是散点图或气泡图，需要 y2col
		if(kpiJson.size() > 1 && kpiJson.get(1) != null){
			ctx.setY2col(kpiJson.get(1).getAlias());
		}
		if(kpiJson.size() > 2 && kpiJson.get(2) != null){
			ctx.setY3col(kpiJson.get(2).getAlias());
		}
		DimDto scol = chartJson.getScol();
		if(scol != null){
			String alias = scol.getAlias();
			String key = scol.getTableColKey();
			String txt = scol.getTableColName();
			if(key != null && key.length() > 0 && txt != null && txt.length() > 0){  //只有在维度关联了维度表后才进行判断
				ctx.setScol(txt); //用来关联ID,用在钻取中
			}else{
				ctx.setScol(alias);
			}
		}
		
		ctx.setShape(chartJson.getType());
		if(is3g){
			//手机页面，宽度设置为100%
			ctx.setWidth("100%");
		}else{
			ctx.setWidth("auto");
		}
		ctx.setHeight("240");
		
		//设置ID
		String chartId = ExtConstants.chartIdPrefix + IdCreater.create();
		ctx.setId(chartId);
		
		//设置配置信息
		List<ChartKeyContext> properties = new ArrayList<ChartKeyContext>();
		ChartKeyContext val1 = new ChartKeyContext("margin", is3g?"30, 20, 50, 75":"30, 20, 50, 90");  //手机页面减少左边距
		properties.add(val1);
		
		//设置倍率  (在SQL中获取基本单位，运算单位（万、千、百万）等通过倍率获取 )
		if(kpiInfo.getRate() != null){
			ctx.setRate(kpiInfo.getRate());
		}
		if(kpiJson.size() > 1 && kpiJson.get(1) != null){
			ctx.setRate2(kpiJson.get(1).getRate());
		}
		if(kpiJson.size() > 2 && kpiJson.get(2) != null){
			ctx.setRate3(kpiJson.get(2).getRate());
		}
		
		properties.add(new ChartKeyContext("ydesc",kpiInfo.getKpi_name()+ "(" + super.writerUnit(kpiInfo.getRate()) +kpiInfo.getUnit()+")"));
		
		//格式化配置信息
		if(kpiInfo.getFmt() != null && kpiInfo.getFmt().length() > 0){
			properties.add(new ChartKeyContext("formatCol","kpi_fmt"));
		}
		
		if(kpiInfo.getUnit() != null && kpiInfo.getUnit().length() > 0){
			properties.add(new ChartKeyContext("unitCol","kpi_unit"));
		}
		//启用钻取
		properties.add(new ChartKeyContext("action","drillChart"));
		
		if("pie".equals(ctx.getShape())){
			properties.add(new ChartKeyContext("showLegend","true"));
			//ctx.setHeight("280"); //重新设置高度,宽度
			if(!is3g){
				ctx.setWidth("600");
			}
		}
		if("gauge".equals(ctx.getShape()) && !is3g){
			ctx.setWidth("210");
		}
		if("radar".equals(ctx.getShape()) && !is3g){
			ctx.setHeight("340"); //重新设置雷达图的高度
		}
		if("map".equals(ctx.getShape()) && !is3g){
			ctx.setWidth("600");
			ctx.setHeight("350");
		}
		if("bubble".equals(ctx.getShape()) || "scatter".equals(ctx.getShape())){
			KpiDto kpiInfo2 = kpiJson.get(1);
			//对于散点图和气泡图，需要设置xdesc
			properties.add(new ChartKeyContext("xdesc", kpiInfo2.getKpi_name() + "(" +  super.writerUnit(kpiInfo2.getRate()) +kpiInfo2.getUnit()+")"));
			properties.add(new ChartKeyContext("formatCol2", kpiInfo2.getFmt()));
			properties.add(new ChartKeyContext("unitCol2", kpiInfo2.getUnit()));
			//设置气泡图
			if("bubble".equals(ctx.getShape())){
				KpiDto kpiInfo3 = kpiJson.get(2);
				properties.add(new ChartKeyContext("formatCol3", kpiInfo3.getFmt()));
				properties.add(new ChartKeyContext("unitCol3", kpiInfo3.getUnit()));
			}
		}
		//对于曲线图、柱状图设置图例位置
		if("line".equals(ctx.getShape()) || "column".equals(ctx.getShape())){
			properties.add(new ChartKeyContext("legendLayout","horizontal"));
		}
		//饼图不显示Legend
		if("pie".equals(ctx.getShape())){
			properties.add(new ChartKeyContext("showLegend","false"));
		}
		
		//如果是地图，需要设置地图的 mapJson
		if("map".equals(ctx.getShape())){
			properties.add(new ChartKeyContext("mapJson",chartJson.getMaparea()));
		}
		//手机页面，横轴旋转角度
		if(is3g){
			properties.add(new ChartKeyContext("routeXaxisLable","-45"));
		}
		//不显示值
		properties.add(new ChartKeyContext("showLabel", "false"));
		
		ctx.setProperties(properties);
		
		return ctx;
	}
	
	/**
	 * 创建sql语句所用函数，图形用这个函数创建SQL
	 * 其中第二个参数只用在图形中，当用户没选X轴时(xcol)时，用这个做默认xcol
	 * 其中第三个参数只用在图形中，当用户没选图例(scol)时，用这个做默认图例
	 * release 表示当前为发布状态, 0 表示不是发布，1表示发布到多维分析，2表示发布到仪表盘
	 * @param sqlVO
	 * @param ser
	 * @return
	 * @throws ParseException
	 */
	public String createSql(ChartQueryDto chart, int release) throws ParseException{
		Map<String, String> tableAlias = super.createTableAlias(this.cacheService.getDset(chart.getDsetId()));
		
		StringBuffer sql = new StringBuffer();
		
		sql.append("select ");
		List<DimDto> dims = chart.getChartJson().getDims();
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			String key = dim.getTableColKey();
			String txt = dim.getTableColName();
			String tname = dim.getTableName();
			if(key != null && txt != null && key.length() >0 && txt.length() >0){
				sql.append(tableAlias.get(tname)+"."+key+", " + tableAlias.get(tname) +"."+ txt + ",");
			}else{
				if(dim.getCalc() == 1){ 
					sql.append(" "+dim.getColname()+" "+dim.getAlias()+", ");
				}else{
					sql.append(" " + tableAlias.get(dim.getTname()) + "."+dim.getColname()+" "+dim.getAlias()+", ");
				}
			}
			
		}
		
		//判断是否添加 格式化 字段
		KpiDto info = chart.getKpiJson().get(0);
		if(info.getFmt() != null && info.getFmt().length() > 0){
			sql.append("'"+info.getFmt()+"' kpi_fmt,");
		}
		//判断是否添加单位字段
		if(info.getUnit() != null && info.getUnit().length() > 0){
			//sql.append("'" + ChartService.formatUnits(info)+info.getUnit()+"' kpi_unit,");
			sql.append("'" + info.getUnit()+"' kpi_unit,");
		}
		
		//第二个指标
		if(chart.getKpiJson().size() > 1){
			KpiDto sinfo = chart.getKpiJson().get(1);
			if(sinfo.getFmt() != null && sinfo.getFmt().length() > 0){
				sql.append("'"+sinfo.getFmt()+"' kpi_fmt2,");
			}
			if(sinfo.getUnit() != null && sinfo.getUnit().length() > 0){
				sql.append("'" +sinfo.getUnit()+"' kpi_unit2,");
			}
		}
		//第三个指标
		if(chart.getKpiJson().size() > 2){
			KpiDto sinfo = chart.getKpiJson().get(2);
			if(sinfo.getFmt() != null && sinfo.getFmt().length() > 0){
				sql.append("'"+sinfo.getFmt()+"' kpi_fmt3,");
			}
			if(sinfo.getUnit() != null && sinfo.getUnit().length() > 0){
				sql.append("'" +sinfo.getUnit()+"' kpi_unit3,");
			}
		}
		
		List<KpiDto> kpis = chart.getKpiJson();
		if(kpis.size() == 0){
			sql.append(" 0 kpi_value ");
		}else{
			for(int i=0; i<kpis.size(); i++){
				KpiDto kpi = kpis.get(i);
				if(kpi.getCalc() != null && kpi.getCalc() == 1){  //表达式，直接取表达式
					sql.append(kpi.getCol_name() + " ");
				}else{  //获取字段别名
					String name = super.convertKpiName(kpi, tableAlias);
					sql.append( name + " ");
				}
				sql.append(kpi.getAlias());
				if(i != kpis.size() - 1){
					sql.append(",");
				}
			}
		}
		
		JSONObject dset = this.cacheService.getDset(chart.getDsetId());
		JSONArray joinTabs = (JSONArray)dset.get("joininfo");
		String master = dset.getString("master");
		sql.append(" from " + master + " a0");
		
		for(int i=0; joinTabs!=null&&i<joinTabs.size(); i++){  //通过主表关联
			JSONObject tab = joinTabs.getJSONObject(i);
			String ref = tab.getString("ref");
			String refKey = tab.getString("refKey");
			String jtype = (String)tab.get("jtype");
			if("left".equals(jtype) || "right".equals(jtype)){
				sql.append(" " + jtype);
			}
			sql.append(" join " + ref+ " " + tableAlias.get(ref));
			sql.append(" on a0."+tab.getString("col")+"="+tableAlias.get(ref)+"."+refKey);
			sql.append(" ");
		}
		sql.append(" where 1=1 ");
		
		//数据权限控制筛选
		if(dataControl != null){
			String ret = dataControl.process(RSBIUtils.getLoginUserInfo(),  dset.getString("master"));
			if(ret != null){
				sql.append(ret + " ");
			}
		}
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			//处理日期限制
			if(dim.getType().equals("day")){
				if(dim.getDay() != null){
					sql.append(" and " + dim.getColname() + " between '"+dim.getDay().getStartDay()+"' and '" + dim.getDay().getEndDay()+"'");
				}else
				if(dim.getVals() != null && dim.getVals().length() > 0){
					String vls = RSBIUtils.dealStringParam(dim.getVals());
					sql.append(" and " + dim.getColname() + " in ("+vls+")");
				}
			}else
			if(dim.getType().equals("month")){
				if(dim.getMonth() != null){
					sql.append(" and " + dim.getColname() + " between '"+dim.getMonth().getStartMonth()+"' and '" + dim.getMonth().getEndMonth()+"'");
				}else
				if(dim.getVals() != null && dim.getVals().length() > 0){
					String vls = RSBIUtils.dealStringParam(dim.getVals());
					sql.append(" and " + dim.getColname() + " in ("+vls+")");
					//isDealDate = true;
				}
			}else{
				//限制维度筛选
				if(dim.getVals() != null && dim.getVals().length() > 0){
					String  vls = dim.getVals();
					if("string".equalsIgnoreCase(dim.getValType())){
						vls = RSBIUtils.dealStringParam(dim.getVals());
					}
					sql.append(" and " + dim.getColname() + " in ("+vls+")");
				}
			}
		
		}
		
		//限制参数的查询条件
		List<ParamDto> params = chart.getParams();
		for(int i=0; params!=null&&i<params.size(); i++){
			ParamDto param = params.get(i);
			int cubeId = param.getCubeId();
			String tp = param.getType();
			String colname = param.getColname();
			String alias = param.getAlias();
			String dateformat = param.getDateformat();
			String tname = param.getTname();
			//只有参数和组件都来源于同一个表，才能进行参数拼装
			if((tp.equals("day") || tp.equals("month"))){
				if(release == 0 && param.getSt() != null && param.getSt().length() > 0 ){
					sql.append(" and " + colname + " between '"+ param.getSt() + "' and '" +  param.getEnd() + "'");
				}else if(release == 1){
					sql.append(" and " + colname + " between '$s_"+alias+"' and '$e_"+alias+"'");
				}else if(release == 2){
					sql.append(" #if($"+alias+" != '') and " + tableAlias.get(tname) + "." +colname + " = $"+alias + " #end");   //仪表盘发布，日期,月份只有一个参数
				}
			}else{
				if(release == 0 && param.getVals() != null && param.getVals().length() > 0){
					//字符串特殊处理
					String  vls = param.getVals();
					if("string".equalsIgnoreCase(param.getValType())){
						vls = RSBIUtils.dealStringParam(param.getVals());
					}
					sql.append(" and " + (param.getCalc() == 0 ?(tableAlias.get(tname) + "."):"") + colname + " in ("+vls+")");
				}else if(release == 1 || release == 2){
					sql.append(" #if($"+alias+" != '') and " + (param.getCalc() == 0 ?(tableAlias.get(tname) + "."):"") + colname + " in ($extUtils.printVals($"+alias+", '"+param.getValType()+"')) #end");
				}
			}
		}
		
		/**
		Map<String, Object> linkAccept = chart.getChartJson().getLinkAccept();
		if(linkAccept != null && !linkAccept.isEmpty()){
			String col = (String)linkAccept.get("col");
			String valtype = (String)linkAccept.get("valType");
			String ncol = "$" + col;
			if("string".equalsIgnoreCase(valtype)){
				ncol = "'" + ncol + "'";
			}
			sql.append(" and  " + col + " = " + ncol);
		}
		**/
		
		if(dims.size() > 0){
			sql.append(" group by ");
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				String key = dim.getTableColKey();
				String txt = dim.getTableColName();
				String tname = dim.getTableName();
				if(key != null && txt != null && key.length() >0 && txt.length() >0){
					sql.append(tableAlias.get(tname)+"."+key+", " + tableAlias.get(tname) + "." + txt);
				}else{
					if(dim.getCalc() == 1){
						sql.append(dim.getColname());
					}else{
						sql.append(tableAlias.get(dim.getTname())+"."+dim.getColname());
					}
				}
				if(i != dims.size() - 1){
					sql.append(",");
				}
			}
		}
		//处理指标过滤
		StringBuffer filter = new StringBuffer("");
		for(KpiDto kpi : chart.getKpiJson()){
			if(kpi.getFilter() != null){
				filter.append(" and "+kpi.getCol_name()+" ");
				String tp = kpi.getFilter().getFilterType();
				filter.append(tp);
				filter.append(" ");
				double val1 = kpi.getFilter().getVal1();
				if(kpi.getFmt() != null && kpi.getFmt().endsWith("%")){
					val1 = val1 / 100;
				}
				filter.append(val1 * (kpi.getRate() == null ? 1 : kpi.getRate()));
				if("between".equals(tp)){
					double val2 = kpi.getFilter().getVal2();
					if(kpi.getFmt() != null && kpi.getFmt().endsWith("%")){
						val2 = val2 / 100;
					}
					filter.append(" and " + val2 * (kpi.getRate() == null ? 1 : kpi.getRate()));
				}
			}
		}
		if(filter.length() > 0){
			sql.append(" having 1=1 " + filter);
		}
		if(dims.size() > 0){
			StringBuffer order = new StringBuffer();
			order.append(" order by ");
			KpiDto kpi = chart.getKpiJson().get(0);
			if(kpi.getSort() != null && kpi.getSort().length() > 0){
				order.append(kpi.getAlias() + " " + kpi.getSort()) ;
				order.append(",");
			}
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				if(dim.getDimord() != null && dim.getDimord().length() > 0){
					if(dim.getOrdcol() != null && dim.getOrdcol().length() > 0){  //处理维度排序
						order.append(dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						//需要处理 是否计算列
						order.append("" +(dim.getCalc() != null && dim.getCalc() == 1 ? dim.getColname():tableAlias.get(dim.getTname()) + "." + dim.getColname()) + " " + dim.getDimord() + ",");
					}
				}
			}
			if(order.length() <= 11 ){  //判断是否拼接了 order by 字段
				
			}else{
				//返回前先去除最后的逗号
				 sql.append(order.toString().substring(0, order.length() - 1));
			}
		}
		String ret = sql.toString();
		//替换 ## 为 函数，##在velocity中为注释意思
		ret = ret.replaceAll("##", "\\$extUtils.printJH()").replaceAll("@", "'");
		return ret;
	}
	
	/**
	 * 创建图形钻取菜单
	 * @param mv
	 */
	public void createChartDrill(MVContext mv, ChartQueryDto chart){
		StringBuffer txt = new StringBuffer();
		txt.append("<div class=\"chartdrillmenu\">");
		
		int cnt = 0;
		for(DimDto dim : chart.getChartJson().getParams()){
			//if(dim.getDimpos().equals("param")){
				if(cnt == 0){
					txt.append("钻取维：");
				}
				txt.append("<span class=\"chartdrillDim\"><a href=\"javascript:;\" title=\"上卷\" onclick=\"chartGoupDim("+chart.getCompId()+", "+dim.getId()+",'"+dim.getPos()+"',true)\" style=\"opacity:0.5\"></a>"+dim.getDimdesc()+"("+dim.getValDesc()+")</span>");
				cnt++;
			//}
		}
		if(cnt == 0){
			txt.append("<span class=\"charttip\">(点击图形节点进行钻取分析)</span>");
		}
		txt.append("</div>");
		
		TextContext text = new TextContextImpl();
		text.setText(txt.toString());
		text.setParent(mv);
		mv.getChildren().add(text);
	}

	/**
	 * 创建图形的dataCenter
	 * @param sql
	 * @param sqlVO
	 * @return
	 * @throws IOException
	 */
	public GridDataCenterContext createDataCenter(ChartJSONDto chartJson, String sql) throws IOException{
		List<DimDto> dims = chartJson.getDims();
		GridDataCenterContext ctx = new GridDataCenterContextImpl();
		GridSetConfContext conf = new GridSetConfContext();
		ctx.setConf(conf);
		ctx.setId("DC-" + IdCreater.create());
		String name = TemplateManager.getInstance().createTemplate(sql);
		ctx.getConf().setTemplateName(name);
		String maparea = chartJson.getMaparea();
		String type = chartJson.getType();
		if("map".equals(type) && maparea != null && maparea.length() > 0 && !"china".equals(maparea)){  //如果是地图，并且是省份地图。需要忽略其他省份数据
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				if(dim.getType().equals("city")){  //地市
					GridFilterContext filter = new GridFilterContext();
					filter.setColumn(dim.getTableColName() != null && dim.getTableColName().length() > 0 ? dim.getTableColName() : dim.getAlias());
					filter.setFilterType(GridFilter.in);
					List<Area> ls = areaMapper.listCityByProvCode(maparea);
					StringBuffer sb = new StringBuffer();
					for(int j=0; j<ls.size(); j++){
						Area a = ls.get(j);
						sb.append(a.getCityName());
						if(j != ls.size() - 1){
							sb.append(",");
						}
					}
					filter.setValue(sb.toString());
					ctx.getProcess().add(filter);  //过滤其他地市
				}
			}
		}
		return ctx;
	}
}
