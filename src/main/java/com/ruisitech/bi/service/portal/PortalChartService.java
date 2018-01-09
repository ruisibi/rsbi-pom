package com.ruisitech.bi.service.portal;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.ruisi.bi.engine.view.context.chart.ChartContext;
import com.ruisi.bi.engine.view.context.chart.ChartContextImpl;
import com.ruisi.bi.engine.view.context.chart.ChartKeyContext;
import com.ruisi.bi.engine.view.context.chart.ChartLinkContext;
import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContext;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ext.engine.view.context.form.TextFieldContext;
import com.ruisi.ext.engine.view.context.form.TextFieldContextImpl;
import com.ruisitech.bi.entity.bireport.ChartJSONDto;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.portal.PortalChartQuery;
import com.ruisitech.bi.service.bireport.BaseCompService;
import com.ruisitech.bi.service.bireport.ChartService;
import com.ruisitech.bi.service.bireport.ModelCacheService;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class PortalChartService extends BaseCompService {
	
	public final static String deftMvId = "mv.portal.chart";
	
	@Autowired
	private ModelCacheService cacheService;
	
	@Autowired
	private ChartService chartService;
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
	
	private DataControlInterface dataControl; //数据权限控制
	
	public @PostConstruct void init() {
		String clazz = ExtContext.getInstance().getConstant("dataControl");
		if(clazz != null && clazz.length() != 0){
			try {
				dataControl = (DataControlInterface)Class.forName(clazz).newInstance();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
	}  
	
	public @PreDestroy void destory() {
		mvParams.clear();
	}
	
	public MVContext json2MV(PortalChartQuery chart) throws Exception{
		
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		//处理参数,把参数设为hidden
		super.parserHiddenParam(chart.getPortalParams(), mv, mvParams);	
		
		//创建chart
		ChartContext cr = this.json2Chart(chart.getChartJson(), chart.getKpiJson(), chart.getId(), false);
		
		//重新设置chartId
		cr.setId("C"+chart.getId());
		
		String sql = createSql(chart, 0);
		GridDataCenterContext dc = chartService.createDataCenter(chart.getChartJson(), sql);
		cr.setRefDataCenter(dc.getId());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		
		mv.getChildren().add(cr);
		cr.setParent(mv);
		//判断是否有事件，是否需要添加参数
		Map<String, Object> linkAccept = chart.getChartJson().getLinkAccept();
		if(linkAccept != null && !linkAccept.isEmpty()){
			//创建参数
			TextFieldContext linkText = new TextFieldContextImpl();
			linkText.setType("hidden");
			linkText.setDefaultValue((String)linkAccept.get("dftval"));
			linkText.setId((String)linkAccept.get("alias"));
			mv.getChildren().add(0, linkText);
			linkText.setParent(mv);
			this.mvParams.put(linkText.getId(), linkText);
			ExtContext.getInstance().putServiceParam(mv.getMvid(), linkText.getId(), linkText);
			mv.setShowForm(true);
		}
		
		Map<String, ChartContext> crs = new HashMap<String, ChartContext>();
		crs.put(cr.getId(), cr);
		mv.setCharts(crs);
		
		//设置数据集
		String dsid = super.createDsource(this.cacheService.getDsource(chart.getDsid()), mv);
		dc.getConf().setRefDsource(dsid);
		
		return mv;
	}
	
	public ChartContext json2Chart(ChartJSONDto chartJson, List<KpiDto> kpiJson, String compId, boolean is3g){
		ChartContext ctx = new ChartContextImpl();
		//设置x
		DimDto obj = chartJson.getXcol();
		if(obj != null){
			String alias = obj.getAlias();
			String key = obj.getTableColKey();
			String txt = obj.getTableColName();
			if(key != null && key.length() > 0 && txt != null && txt.length() > 0){  //只有在维度关联了维度表后才进行判断
				ctx.setXcolDesc(key); //用来关联ID,用在钻取中
				ctx.setXcol(txt);
			}else{
				ctx.setXcol(alias);
				ctx.setXcolDesc(alias);
			}
		}
		
		KpiDto kpiInfo = kpiJson.get(0);
		String y = kpiInfo.getAlias();
		ctx.setYcol(y);
		
		//如果是散点图或气泡图，需要 y2col
		String chartType = chartJson.getType();
		if(chartType.equals("scatter")){
			ctx.setY2col(kpiJson.get(1).getAlias());
		}
		if(chartType.equals("bubble")){
			ctx.setY2col(kpiJson.get(1).getAlias());
			ctx.setY3col(kpiJson.get(2).getAlias());
		}
		
		//设置倍率
		if(kpiInfo.getRate() != null){
			ctx.setRate(kpiInfo.getRate());
		}
		if(kpiJson.size() > 1){
			ctx.setRate2(kpiJson.get(1).getRate());
		}
		if(kpiJson.size() > 2){
			ctx.setRate3(kpiJson.get(2).getRate());
		}
		
		
		DimDto scol = chartJson.getScol();
		if(scol != null){
			ctx.setScol(scol.getAlias());
		}
		
		ctx.setShape(chartJson.getType());
		if("pie".equals(ctx.getShape()) || "gauge".equals(ctx.getShape())){
			ctx.setWidth(chartJson.getWidth() == null ? "360" : String.valueOf(chartJson.getWidth()));
			ctx.setHeight(chartJson.getHeight() == null ? "250" : String.valueOf(chartJson.getHeight()));
		}else{
			ctx.setWidth(chartJson.getWidth() == null ? "600" : String.valueOf(chartJson.getWidth()));
			ctx.setHeight(chartJson.getHeight() == null ? "250" : String.valueOf(chartJson.getHeight()));
		}
		//默认图形为居中
		ctx.setAlign("center");
		
		
		//设置配置信息
		List<ChartKeyContext> properties = new ArrayList<ChartKeyContext>();
		String unitStr = super.writerUnit(kpiInfo.getRate()) + (kpiInfo.getUnit() == null ? "" : kpiInfo.getUnit());
		
		properties.add(new ChartKeyContext("ydesc",kpiInfo.getYdispName()+(unitStr.length() == 0 ? "" : "("+unitStr+")")));
		if("bubble".equals(ctx.getShape()) || "scatter".equals(ctx.getShape())){
			KpiDto kpiInfo2 = kpiJson.get(1);
			//对于散点图和气泡图，需要设置xdesc
			String unit2Str = super.writerUnit(kpiInfo2.getRate()) + (kpiInfo2.getUnit() == null ? "" : kpiInfo2.getUnit());
			properties.add(new ChartKeyContext("xdesc", kpiInfo2.getKpi_name() + (unit2Str.length() == 0 ? "": "("+unit2Str+")")));
			properties.add(new ChartKeyContext("formatCol2", kpiInfo2.getFmt()));
		}else
		if(chartJson.getXcol() != null){
			properties.add(new ChartKeyContext("xdesc", chartJson.getXcol().getXdispName()));
		}
		//title
		/**
		String tit = (String)chartJson.get("title");
		if(tit != null && tit.length() > 0){
			properties.add(new ChartKeyContext("title", tit));
		}
		**/
		
		
		//格式化配置信息
		if(kpiInfo.getFmt() != null && kpiInfo.getFmt().length() > 0){
			properties.add(new ChartKeyContext("formatCol", "kpi_fmt"));
		}
		
		if(kpiInfo.getUnit() != null && kpiInfo.getUnit().length() > 0){
			properties.add(new ChartKeyContext("unitCol", "kpi_unit"));
		}
		if(kpiInfo.getMin() != null){
			properties.add(new ChartKeyContext("ymin", String.valueOf(kpiInfo.getMin())));
		}
		if(kpiInfo.getMax() != null){
			properties.add(new ChartKeyContext("ymax", String.valueOf(kpiInfo.getMax())));
		}
		//lengend
		if(chartJson.getShowLegend() != null && chartJson.getShowLegend().equals("true")){
			ChartKeyContext val1 = new ChartKeyContext("showLegend", "false");
			properties.add(val1);
		}else{
			ChartKeyContext val1 = new ChartKeyContext("showLegend", "true");
			properties.add(val1);
		}
		//legendLayout
		String legendLayout = chartJson.getLegendLayout();
		if(legendLayout != null){
			ChartKeyContext val1 = new ChartKeyContext("legendLayout", legendLayout);
			properties.add(val1);
		}
		//legendLayout
		String legendpos = chartJson.getLegendpos();
		if(legendpos != null){
			ChartKeyContext val1 = new ChartKeyContext("legendPosition", legendpos);
			properties.add(val1);
		}
		
		if(obj != null){
			//取得top
			Integer top = obj.getTop();
			if(top != null){
				ChartKeyContext val1 = new ChartKeyContext("xcnt", String.valueOf(top));
				properties.add(val1);
			}
			if(obj.getTickInterval() != null){
				ChartKeyContext val1 = new ChartKeyContext("tickInterval", obj.getTickInterval());
				properties.add(val1);
			}
			if(obj.getRouteXaxisLable() != null){
				ChartKeyContext val1 = new ChartKeyContext("routeXaxisLable", obj.getRouteXaxisLable());
				properties.add(val1);
			}
		}
		
		//设置饼图是否显示标签
		String dataLabel = chartJson.getDataLabel();
		ChartKeyContext val3 = new ChartKeyContext("showLabel", dataLabel == null ? "" : dataLabel);
		properties.add(val3);
		
		//设置仪表盘数量
		ChartKeyContext val1 = new ChartKeyContext("gaugeCnt", "1");
		properties.add(val1);
		
		//marginLeft,marginRight
		String marginLeft = chartJson.getMarginLeft();
		if(marginLeft != null && marginLeft.length() > 0){
			ChartKeyContext tmp = new ChartKeyContext("marginLeft", marginLeft);
			properties.add(tmp);
		}
		String marginRight = chartJson.getMarginRight();
		if(marginRight != null && marginRight.length() > 0){
			ChartKeyContext tmp = new ChartKeyContext("marginRight", marginRight);
			properties.add(tmp);
		}
		
		String markerEnabled = chartJson.getMarkerEnabled();
		if(markerEnabled != null && "true".equals(markerEnabled)){
			ChartKeyContext md = new ChartKeyContext("markerEnabled", "false");
			properties.add(md);
		}
		//如果是地图，需要设置地图的 mapJson
		if("map".equals(ctx.getShape())){
			properties.add(new ChartKeyContext("mapJson",chartJson.getMaparea()));
		}
		
		ctx.setProperties(properties);
		
		//判断是否有事件
		Map<String, Object> link = chartJson.getLink();
		if(link != null && !link.isEmpty()){
			ctx.setLink(createChartLink(link));
		}
	
		ctx.setLabel(compId);  //都加上label
		
		//判断曲线图、柱状图是否双坐标轴
		Integer typeIndex = chartJson.getTypeIndex();
		if((chartType.equals("column")||chartType.equals("line")) && (typeIndex == 2 || 4 == typeIndex) && kpiJson.size() > 1 && kpiJson.get(1) != null){
			List<KpiDto> kpis = kpiJson;
			ctx.setY2col(kpis.get(1).getAlias());
			ctx.setMergeData(kpis.get(1).getMergeData());
			ctx.setY2Aggre(kpis.get(1).getAggre());
			String y2unit = super.writerUnit(kpis.get(1).getRate()) + (kpis.get(1).getUnit() == null ? "" : kpis.get(1).getUnit()) ;
			ChartKeyContext y2desc = new ChartKeyContext("y2desc", kpis.get(1).getYdispName() + (y2unit.length() ==0 ? "" : "("+y2unit+")"));
			properties.add(y2desc);
			ChartKeyContext y2fmtcol = new ChartKeyContext("formatCol2", kpis.get(1).getFmt());
			properties.add(y2fmtcol);
		}
		//判断柱状图是否显示为堆积图
		if("column".equals(chartType) && (3 == typeIndex || 4 == typeIndex)){
			ChartKeyContext stack = new ChartKeyContext("stack", "true");
			properties.add(stack);
		}
		//饼图
		if("pie".equals(chartType) && 2 == typeIndex){
			ChartKeyContext ring = new ChartKeyContext("ring", "true");
			properties.add(ring);
		}
		if("pie".equals(chartType) && 3 == typeIndex){
			ctx.setShape("nestingPie");  //嵌套圆环图
		}
		if("map".equals(chartType) && 2 == typeIndex){
			ctx.setShape("scatterMap");  //地图散点图嵌套
		}
		
		return ctx;
	}
	
	public ChartLinkContext createChartLink(Map<String, Object> link){
		String type = (String)link.get("type");
		String target = (String)link.get("target");
		String url = (String)link.get("url");
		
		ChartLinkContext clink = new ChartLinkContext();
		if(url != null && url.length() > 0){
			clink.setLinkUrl(url);
		}else{
			clink.setTarget(target.split(","));
			clink.setType(type.split(","));
		}
		return clink;
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
	public String createSql(PortalChartQuery chart, int release) throws ParseException {
		JSONObject dset = cacheService.getDset(chart.getDsetId());
		Map<String, String> tableAlias = createTableAlias(dset);
		
		StringBuffer sql = new StringBuffer();
		
		sql.append("select ");
		List<DimDto> dims = chart.getChartJson().getDims();
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			String tname = dim.getTname();
			String tableName = dim.getTableName();
			String key = dim.getTableColKey();
			String txt = dim.getTableColName();
			if(key != null && txt != null && key.length() >0 && txt.length() >0){
				sql.append(tableAlias.get(tableName)+"."+key+", " + tableAlias.get(tableName) + "." + txt + ",");
			}else{
				if(dim.getCalc() == 0){
					sql.append(" "+tableAlias.get(tname)+"."+dim.getColname()+" "+dim.getAlias()+", ");
				}else{
					sql.append(" " + dim.getColname() + " "+dim.getAlias()+", ");
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
		if(chart.getKpiJson().size() > 1 && chart.getKpiJson().get(1) != null){
			KpiDto sinfo = chart.getKpiJson().get(1);
			if(sinfo.getFmt() != null && sinfo.getFmt().length() > 0){
				sql.append("'"+sinfo.getFmt()+"' kpi_fmt2,");
			}
			if(sinfo.getUnit() != null && sinfo.getUnit().length() > 0){
				sql.append("'" +sinfo.getUnit()+"' kpi_unit2,");
			}
		}
		//第三个指标
		if(chart.getKpiJson().size() > 2 && chart.getKpiJson().get(2) != null){
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
			sql.append(" null kpi_value ");
		}else{
			for(int i=0; i<kpis.size(); i++){
				KpiDto kpi = kpis.get(i);
				sql.append(kpi.getCol_name() + " ");
				sql.append(kpi.getAlias());
				
				if(i != kpis.size() - 1){
					sql.append(",");
				}
			}
		}
		
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
		//数据权限
		if(dataControl != null){
			String ret = dataControl.process(RSBIUtils.getLoginUserInfo(), dset.getString("master"));
			if(ret != null){
				sql.append(ret + " ");
			}
		}
		
		//限制参数的查询条件
		sql.append(dealCubeParams(chart.getParams(), tableAlias));
		
		//
		Map<String, Object> linkAccept = chart.getChartJson().getLinkAccept();
		if(linkAccept != null &&  !linkAccept.isEmpty()){
			String col = (String)linkAccept.get("col");
			String alias = (String)linkAccept.get("alias");
			String valtype = (String)linkAccept.get("valType");
			String tname = (String)linkAccept.get("tname");  //维度来源表
			String dimTname = (String)linkAccept.get("dim_tname");  //维度映射的表
			String ncol = "$" + alias;
			if("string".equalsIgnoreCase(valtype)){
				ncol = "'" + ncol + "'";
			}
			sql.append("#if($"+alias+" != '') and  "+tableAlias.get(dimTname == null || dimTname.length() == 0 ? tname:dimTname)+"." + col + " = " + ncol + " #end");
		}
		
		if(dims.size() > 0){
			sql.append(" group by ");
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				String tname = dim.getTname();
				String tableName = dim.getTableName();
				String key = dim.getTableColKey();
				String txt = dim.getTableColName();
				if(key != null && txt != null && key.length() >0 && txt.length() >0){
					sql.append(tableAlias.get(tableName)  + "." + key+", " + tableAlias.get(tableName) + "." + txt);
				}else{
					if(dim.getCalc() == 1){
						sql.append(dim.getColname());
					}else{
						sql.append(tableAlias.get(tname)+"."+dim.getColname());
					}
				}
				
				if(i != dims.size() - 1){
					sql.append(",");
				}
			}
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
						order.append(tableAlias.get(dim.getTname()) + "." + dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						order.append(tableAlias.get(dim.getTname()) + "." + dim.getOrdcol() + " " + dim.getDimord() + ",");
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

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}

	public ChartService getChartService() {
		return chartService;
	}

}
