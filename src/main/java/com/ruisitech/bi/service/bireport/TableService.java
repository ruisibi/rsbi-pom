package com.ruisitech.bi.service.bireport;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
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
import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.init.TemplateManager;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.cross.CrossCols;
import com.ruisi.ext.engine.view.context.cross.CrossField;
import com.ruisi.ext.engine.view.context.cross.CrossReportContext;
import com.ruisi.ext.engine.view.context.cross.CrossReportContextImpl;
import com.ruisi.ext.engine.view.context.cross.CrossRows;
import com.ruisi.ext.engine.view.context.cross.RowDimContext;
import com.ruisi.ext.engine.view.context.cross.RowLinkContext;
import com.ruisi.ext.engine.view.context.dc.grid.ComputeMoveAvgContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridAccountContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContextImpl;
import com.ruisi.ext.engine.view.context.dc.grid.GridFilterContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridSetConfContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridShiftContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridSortContext;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ispire.dc.grid.GridFilter;
import com.ruisi.ispire.dc.grid.GridProcContext;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.bireport.ParamDto;
import com.ruisitech.bi.entity.bireport.TableQueryDto;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class TableService extends BaseCompService {
	
	public final static String deftMvId = "mv.tmp.table";
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
	
	private StringBuffer scripts = new StringBuffer(); //用来构造js 脚本的字符串对象
	
	/***
	 * 当指标有计算指标时，需要计算上期、同期等值，在显示数据时需要对偏移的数据进行过滤，
	 */
	private List<GridFilterContext> filters = new ArrayList<GridFilterContext>();
	
	/**
	 * 数据权限接口
	 */
	@Autowired
	private DataControlInterface dataControl;

	@Autowired
	private ModelCacheService cacheService;
	
	public @PostConstruct void init() {
		
	}  
	
	public @PreDestroy void destory() {
		mvParams.clear();
		filters.clear();
	}
	
	public MVContext json2MV(TableQueryDto table) throws ParseException, IOException{
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		//创建corssReport
		//添加kpiOther
		DimDto kpiOther = new DimDto();
		kpiOther.setType("kpiOther");
		table.getCols().add(kpiOther);
		CrossReportContext cr = json2Table(table);
		//移除kpiOther
		table.getCols().remove(table.getCols().size() - 1);
		//设置ID
		String id = ExtConstants.reportIdPrefix + IdCreater.create();
		cr.setId(id);
		cr.setOut("olap");
		cr.setShowData(true);
		//cr.setExportName(title);
	
		mv.getChildren().add(cr);
		cr.setParent(mv);
		
		Map<String, CrossReportContext> crs = new HashMap<String, CrossReportContext>();
		crs.put(cr.getId(), cr);
		mv.setCrossReports(crs);
		
		//创建datacenter
		String sql = this.createSql(table, 0);
		GridDataCenterContext dc = this.createDataCenter(sql, table);
		cr.setRefDataCetner(dc.getId());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		
		//判断是否需要创建数据源
		String dsid = super.createDsource(cacheService.getDsource(table.getDsid()), mv);
		dc.getConf().setRefDsource(dsid);
		
		String scripts = this.scripts.toString();
		if(scripts != null && scripts.length() > 0){
			mv.setScripts(scripts);
		}
		return mv;
	}
	
	public CrossReportContext json2Table(TableQueryDto table) throws ParseException{
		CrossReportContext ctx = new CrossReportContextImpl();
		
		CrossCols cols = new CrossCols();
		cols.setCols(new ArrayList<CrossField>());
		ctx.setCrossCols(cols);
		
		CrossRows rows = new CrossRows();
		rows.setRows(new ArrayList<CrossField>());
		ctx.setCrossRows(rows);
		
		ctx.setLabel(table.getCompId());  //给组件设置label
		boolean uselink = false;
		Map<String, Object> link = table.getLink();
		if(link != null && !link.isEmpty()){
			RowLinkContext rlink = new RowLinkContext();
			rlink.setParamName((String)link.get("paramName"));
			String url = (String)link.get("url");  //url 优先于联动组件
			if(url != null && url.length() >0){
				rlink.setUrl(url);
			}else{
				String target = (String)link.get("target");
				String type = (String)link.get("type");
				rlink.setTarget(target.split(","));
				rlink.setType(type.split(","));
			}
			ctx.getCrossRows().setLink(rlink);
			uselink = true;
		}
		
		//表格钻取维度
		List<RowDimContext> drill = this.getDrillDim(table);
		if(drill != null && drill.size() > 0){
			ctx.setDims(drill);
			uselink = true;
		}
	
		loopJsonField(table.getCols(), cols.getCols(), table.getKpiJson(), "col", uselink);
		loopJsonField(table.getRows(), rows.getRows(), table.getKpiJson(), "row", uselink);
		
		//如果没有维度，添加none维度
		if(cols.getCols().size() == 0){
			CrossField cf = new CrossField();
			cf.setType("none");
			cf.setDesc("合计");
			cols.getCols().add(cf);
		}
		if(rows.getRows().size() == 0){
			CrossField cf = new CrossField();
			cf.setType("none");
			cf.setDesc("合计");
			rows.getRows().add(cf);
		}
		
		return ctx;
	}
	
	/**
	 * 生成表格SQL
	 * @param sqlVO
	 * @param tinfo
	 * @param params
	 * @param release  判断当前是否为发布状态, 0 表示不是发布，1表示发布到多维分析，2表示发布到仪表盘
	 * @return
	 * @throws ParseException
	 */
	public String createSql(TableQueryDto table, int release) throws ParseException{
		JSONObject dset = cacheService.getDset(table.getDsetId());
		Map<String, String> tableAlias = createTableAlias(dset);
		//判断是否需要计算上期、同期值
		int jstype = table.getKpiComputeType();
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		List<DimDto> dims = table.getDims();
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			String key = dim.getTableColKey();
			String txt = dim.getTableColName();
			String tname = dim.getTableName();
			if(key != null && txt != null && key.length() >0 && txt.length() >0){
				sql.append( tableAlias.get(tname) + "."+key+", " + tableAlias.get(tname) + "." + txt + ",");
			}else{
				if(dim.getCalc() == 0){
					sql.append( tableAlias.get(dim.getTname()) + "." + dim.getColname()+" "+dim.getAlias()+", ");
				}else{
					sql.append( dim.getColname()+" "+dim.getAlias()+", ");
				}
			}
		}
		
		List<KpiDto> kpis = table.getKpiJson();
		if(kpis.size() == 0){
			sql.append(" null kpi_value ");
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
		
		//处理数据权限
		if(dataControl != null){
			sql.append(dataControl.process(RSBIUtils.getLoginUserInfo(), dset.getString("master")));
		}
		
		for(int i=0; i<dims.size(); i++){
			DimDto dim = dims.get(i);
			
			//处理日期限制
			if(dim.getType().equals("day")){
				if(dim.getDay() != null){
					String start = dim.getDay().getStartDay();
					String end = dim.getDay().getEndDay();
					if(jstype != 0){ //有计算指标，从写数据区间
						String[] q = resetBetween(start, end, dim.getType(), dim.getDateformat(), jstype);
						start = q[0];
						end = q[1];
						GridFilterContext filter = new GridFilterContext();
						filter.setColumn(dim.getAlias());
						filter.setFilterType(GridFilter.between);
						filter.setValue(dim.getDay().getStartDay());
						filter.setValue2(dim.getDay().getEndDay());
						filter.setDateFormat(dim.getDateformat());
						this.filters.add(filter);
					}
					sql.append(" and " + dim.getColname() + " between '"+start+"' and '" + end + "'");
				}else
				if(dim.getVals() != null && dim.getVals().length() > 0){
					String ret = dim.getVals();
					if(jstype != 0){
						ret = resetVals(ret, dim.getType(), dim.getDateformat(), jstype);
						GridFilterContext filter = new GridFilterContext();
						filter.setColumn(dim.getAlias());
						filter.setFilterType(GridFilter.in);
						filter.setValue(dim.getVals());
						this.filters.add(filter);
					}
					ret = RSBIUtils.dealStringParam(ret);
					sql.append(" and " + dim.getColname()+ " in ("+ret+")");
				}
			}
			//处理月份
			else if(dim.getType().equals("month")){
				if(dim.getMonth() != null){
					//如果有计算指标，需要重写数据区间
					String start = dim.getMonth().getStartMonth();
					String end = dim.getMonth().getEndMonth();
					if(jstype != 0){
						String[] q = resetBetween(start, end, dim.getType(), dim.getDateformat(), jstype);
						start = q[0];
						end = q[1];
						GridFilterContext filter = new GridFilterContext();
						filter.setColumn(dim.getAlias());
						filter.setFilterType(GridFilter.between);
						filter.setValue(dim.getMonth().getStartMonth());
						filter.setValue2(dim.getMonth().getEndMonth());
						filter.setDateFormat(dim.getDateformat());
						this.filters.add(filter);
					}
					sql.append(" and " + dim.getColname()+ " between '"+start+"' and '" + end + "'");
				}else
				if(dim.getVals() != null && dim.getVals().length() > 0){
					//如果有计算指标，需要重写数据值列表
					String ret = dim.getVals();
					if(jstype != 0){
						ret = resetVals(ret, dim.getType(), dim.getDateformat(), jstype);
						GridFilterContext filter = new GridFilterContext();
						filter.setColumn(dim.getAlias());
						filter.setFilterType(GridFilter.in);
						filter.setValue(dim.getVals());
						this.filters.add(filter);
					}
					ret = RSBIUtils.dealStringParam(ret);
					sql.append(" and " + dim.getColname() + " in ("+ret+")");
				}
			} else {
				//限制维度筛选
				if(dim.getVals() != null && dim.getVals().length() > 0){
					String vls = null;
					if( jstype != 0){  //有计算指标，需要从写时间值
						vls = resetVals(dim.getVals(), dim.getType(), dim.getDateformat(), jstype);
						GridFilterContext filter = new GridFilterContext();
						filter.setColumn(dim.getAlias());
						filter.setFilterType(GridFilter.in);
						filter.setValue(dim.getVals());
						this.filters.add(filter);
					}else{
						vls = dim.getVals();
					}
					//处理字符串
					if("string".equalsIgnoreCase(dim.getValType())){
						vls = RSBIUtils.dealStringParam(vls);
					}
					sql.append(" and " + (dim.getCalc() == 1 ? dim.getColname(): tableAlias.get(dim.getTname()) + "." + dim.getColname()) + " in ("+vls+")");
				}
			}
		}
		
		//限制参数的查询条件
		for(int i=0; table.getParams() != null && i<table.getParams().size(); i++){
			ParamDto param = table.getParams().get(i);
			String tp = param.getType();
			String colname = param.getColname();
			String alias = param.getAlias();
			String valType = param.getValType();
			String dateformat = param.getDateformat();
			String tname = param.getTname();
			//只有参数和组件都来源于同一个表，才能进行参数拼装
			if((tp.equals("day") || tp.equals("month"))){
				if(release == 0 && param.getSt() != null && param.getSt().length() > 0 ){
					String ostart = param.getSt();
					String oend = param.getEnd();
					String start = ostart;
					String end = oend;
					if(jstype != 0){
						String[] q = resetBetween(start, end, tp, param.getDateformat(), jstype);
						start = q[0];
						end = q[1];
					}
					sql.append(" and " + colname + " between '"+ start  + "' and '" + end + "'");
				}else if(release == 1){
					sql.append(" #if($s_"+alias+" != '' && $e_"+alias+" != '') and " + colname + " between $myUtils.resetBetween($s_"+alias+", $e_"+alias+", '"+tp+"', '"+dateformat+"', "+jstype+") #end");
				}else if(release == 2){
					sql.append(" #if($"+alias+" != '') and "+tableAlias.get(tname) + "." + colname+" = $"+alias+" #end");
				}
				//生成filter
				if(jstype != 0){
					GridFilterContext filter = new GridFilterContext();
					filter.setColumn(param.getAlias());
					filter.setFilterType(GridFilter.between);
					filter.setDateFormat(param.getDateformat());
					if(release == 0 && param.getSt() != null && param.getSt().length() > 0 ){
						String ostart = param.getSt();
						String oend = param.getEnd();
						filter.setValue(ostart);
						filter.setValue2(oend);
					}else if(release == 1){
						filter.setValue("${s_"+alias+"}");
						filter.setValue2("${e_"+alias+"}");
					}else if(release == 2){
						filter.setValue("${"+alias+"}");
					}
					this.filters.add(filter);
				}
			}else{
				if(release == 0 && param.getVals() != null && param.getVals().length() > 0){
					//字符串特殊处理
					String  vls = param.getVals();
					if(jstype != 0 && ("year".equals(tp) || "quarter".equals(tp))){
						vls = resetVals(vls, tp, param.getDateformat(), jstype);
					}
					if("string".equalsIgnoreCase(valType)){
						vls = RSBIUtils.dealStringParam(vls);
					}
					sql.append(" and " + tableAlias.get(tname) + "." + colname + " in ("+vls+")");
				}else if(release == 1 || release == 2){
					sql.append(" #if($"+alias+" != '') and " + tableAlias.get(tname) + "." +colname + " in ($extUtils.printVals($myUtils.resetVals($"+alias+",'"+tp+"','"+dateformat+"', "+jstype+"), '"+valType+"')) #end");
				}
				//生成filter
				if(jstype != 0){
					GridFilterContext filter = new GridFilterContext();
					filter.setColumn(param.getAlias());
					filter.setFilterType(GridFilter.in);
					if(release == 0 && param.getVals() != null && param.getVals().length() > 0){
						filter.setValue(param.getVals());
					}else if(release == 1 || release == 2){
						filter.setValue("${"+colname+"}");
					}
					this.filters.add(filter);
				}
			}
		}
		
		//处理事件接受的参数限制条件
		Map<String, Object> linkAccept = table.getLinkAccept();
		if(linkAccept != null && linkAccept.size() > 0){
			String col = (String)linkAccept.get("col");
			String valtype = (String)linkAccept.get("valType");
			String ncol = "$" + col;
			if("string".equalsIgnoreCase(valtype)){
				ncol = "'" + ncol + "'";
			}
			sql.append(" and  " + col + " = " + ncol);
		}
		
		if(dims.size() > 0){
			sql.append(" group by ");
			for(int i=0; i<dims.size(); i++){
				DimDto dim = dims.get(i);
				String key = dim.getTableColKey();
				String txt = dim.getTableColName();
				String tname = dim.getTableName();
				if(key != null && txt != null && key.length() >0 && txt.length() >0){
					sql.append(tableAlias.get(tname) + "."+key+", "+ tableAlias.get(tname) + "." + txt);
				}else{
					if(dim.getCalc() == 1){
						sql.append(dim.getColname());
					}else{
						sql.append(tableAlias.get(dim.getTname()) + "."+dim.getColname());
					}
				}
				if(i != dims.size() - 1){
					sql.append(",");
				}
			}
		}
		//处理指标过滤
		StringBuffer filter = new StringBuffer("");
		for(KpiDto kpi : table.getKpiJson()){
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
			//先按col排序
			for(int i=0; i<table.getCols().size(); i++){
				DimDto dim = dims.get(i);
				if(dim.getDimord() != null && dim.getDimord().length() > 0){
					if(dim.getOrdcol() != null && dim.getOrdcol().length() > 0){  //处理维度排序
						order.append(dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						order.append(dim.getColname() + " " + dim.getDimord() + ",");
					}
				}
			}
			//判断是否按指标排序
			for(int i=0; i<kpis.size(); i++){
				KpiDto kpi = kpis.get(i);
				if(kpi.getSort() != null && kpi.getSort().length() > 0){
					order.append(kpi.getAlias() + " " + kpi.getSort());
					order.append(",");
				}
			}
			
			//再按row排序
			for(int i=0; i<table.getRows().size(); i++){
				DimDto dim = table.getRows().get(i);
				if(dim.getDimord() != null && dim.getDimord().length() > 0){
					if(dim.getOrdcol() != null && dim.getOrdcol().length() > 0){  //处理维度排序
						order.append(dim.getOrdcol() + " " + dim.getDimord() + ",");
					}else{
						order.append(dim.getColname() + " " + dim.getDimord() + ",");
					}
				}
			}
			
			
			if(order.length() <= 11 ){  //判断是否拼接了 order by 字段
				return sql.toString().replaceAll("@", "'");
			}else{
				//返回前先去除最后的逗号
				return (sql + order.toString().substring(0, order.length() - 1)).replaceAll("@", "'");
			}
		}else{
			return sql.toString().replaceAll("@", "'");
		}
	}
	
	/**
	 * 创建表格datacenter
	 * @param sql
	 * @return
	 * @throws IOException
	 */
	public GridDataCenterContext createDataCenter(String sql, TableQueryDto dto) throws IOException{
		GridDataCenterContext ctx = new GridDataCenterContextImpl();
		GridSetConfContext conf = new GridSetConfContext();
		ctx.setConf(conf);
		ctx.setId("DC-" + IdCreater.create());
		String name = TemplateManager.getInstance().createTemplate(sql);
		ctx.getConf().setTemplateName(name);
		
		//判断指标计算
		for(KpiDto kpi : dto.getKpiJson()){
			if(kpi.getCompute() != null && kpi.getCompute().length() > 0){
				if("zb".equals(kpi.getCompute())){
					GridProcContext proc = this.createAccount(dto, kpi);
					ctx.getProcess().add(proc);
				}else if("sxpm".equals(kpi.getCompute()) || "jxpm".equals(kpi.getCompute())){
					GridProcContext proc = this.createSort(dto, kpi);
					ctx.getProcess().add(proc);
				}else if("ydpj".equals(kpi.getCompute())){
					GridProcContext proc = this.createMoveAvg(dto, kpi);
					ctx.getProcess().add(proc);
				}else{
					String[] jss = kpi.getCompute().split(",");
					for(String js : jss){
						GridProcContext proc = this.createShift(dto, kpi, js);
						ctx.getProcess().add(proc);
					}
				}
			}
		}
		
		//判断是否有时间偏移的计算
		for(GridFilterContext filter : this.filters){
			ctx.getProcess().add(filter);
		}
		
		return ctx;
	}
	
	/**
	 * 创建指标排名process
	 * @param sqlVO
	 * @param kpi
	 * @return
	 */
	private GridProcContext createSort(TableQueryDto sqlVO, KpiDto kpi){
		GridSortContext proc = new GridSortContext();
		proc.setAppendOrder(true);
		proc.setChangeOldOrder(false);
		
		//创建排序的分组维
		StringBuffer sb = new StringBuffer("");
		StringBuffer orderSb = new StringBuffer("");
		for(int i=0; i<sqlVO.getCols().size(); i++){
			DimDto dim = sqlVO.getCols().get(i);
			//设置 col 维度 为分组维
			sb.append(dim.getAlias());
			sb.append(",");
			orderSb.append(dim.getDimord());
			orderSb.append(",");
		}
		sb.append(kpi.getAlias());
		orderSb.append("sxpm".equals(kpi.getCompute())?"asc":"desc");
		proc.setColumn(sb.toString().split(","));
		proc.setType(orderSb.toString().split(","));
		return proc;
	}
	
	/**
	 * 创建时间偏移process,时间偏移用来计算同比、环比、上期、同期等值
	 * @param sqlVO
	 * @param kpi
	 * @return
	 */
	private GridProcContext createShift(TableQueryDto sqlVO, KpiDto kpi, String compute){
		//查询最小时间维度
		int minDate = 4;
		DimDto minDim = null;
		for(DimDto dim : sqlVO.getDims()){
			String tp = dim.getType();
			if("frd".equalsIgnoreCase(tp)){
				continue;
			}
			int curDate = type2value(tp);
			if(curDate <= minDate){
				minDate = curDate;
				minDim = dim;
			}
		}
		GridShiftContext proc = new GridShiftContext();
		proc.setDateType(minDim.getType());
		proc.setDateFormat(minDim.getDateformat());
		proc.setDateColumn(minDim.getAlias());
		proc.setComputeType(compute);
		proc.setKpiColumn(new String[]{kpi.getAlias()});
		//设置过滤维度
		StringBuffer sb = new StringBuffer("");
		for(DimDto dim : sqlVO.getDims()){
			String tp = dim.getType();
			if("year".equals(tp) || "quarter".equals(tp) || "month".equals(tp) || "day".equals(tp)){
				continue;
			}
			sb.append(dim.getAlias());
			sb.append(",");
		}
		if(sb.length() > 0){
			String str = sb.substring(0, sb.length() - 1);
			proc.setKeyColumns(str.split(","));
		}
		return proc;
	}
	
	private GridProcContext createMoveAvg(TableQueryDto sqlVO, KpiDto kpi){
		ComputeMoveAvgContext ctx = new ComputeMoveAvgContext();
		ctx.setAlias(kpi.getAlias()+"_ydpj");
		ctx.setColumn(kpi.getAlias());
		ctx.setStep(3);
		return ctx;
	}
	
	/**
	 * 创建占比计算process
	 */
	private GridProcContext createAccount(TableQueryDto sqlVO, KpiDto kpi){
		GridAccountContext proc = new GridAccountContext();
		proc.setColumn(kpi.getAlias());
		//创建计算的分组维
		StringBuffer sb = new StringBuffer("");
		for(int i=0; i<sqlVO.getCols().size(); i++){
			DimDto dim = sqlVO.getCols().get(i);
			sb.append(dim.getColname());
			sb.append(",");
			
		}
		if(sb.length() > 0){
			String str = sb.substring(0, sb.length() - 1);
			proc.setGroupDim(str.split(","));
		}
		return proc;
	}
	
	private void loopJsonField(List<DimDto> arrays, List<CrossField> ls, List<KpiDto> kpis, String pos, boolean uselink) throws ParseException{
		List<CrossField> tmp = ls;
		for(int i=0; i<arrays.size(); i++){
			DimDto obj = arrays.get(i);
			String type = obj.getType();
			String issum = obj.getIssum();
			
			if(type.equals("kpiOther")){
				
				List<CrossField> newCf = new ArrayList<CrossField>();
				if(tmp.size() == 0){
					for(KpiDto kpi : kpis){
						CrossField cf = new CrossField();
						cf.setType(type);
						cf.setAggregation(kpi.getAggre());
						cf.setAlias(kpi.getAlias());
						cf.setFormatPattern(kpi.getFmt());
						cf.setOrder("y".equals(kpi.getOrder()));
						cf.setSubs(new ArrayList<CrossField>());
						//用 id来表示指标ID，用在OLAP中,对指标进行操作
						cf.setId(String.valueOf(kpi.getKpi_id()));
						if(kpi.getRate() != null){
							cf.setKpiRate(new BigDecimal(kpi.getRate()));
						}
						String ru = this.writerUnit(kpi.getRate()) +kpi.getUnit();
						if(ru != null && ru.length() > 0){
							cf.setDesc(kpi.getKpi_name() + "("  + ru + ")");  //指标名称+ 单位
						}else{
							cf.setDesc(kpi.getKpi_name());  //指标名称
						}
						
						//当回调函数和指标预警同时起作用时， 指标预警起作用
						//处理回调函数
						cf.setJsFunc(kpi.getFuncname());
						String code = kpi.getCode();
						if(code != null && code.length() > 0){
							try {
								code = URLDecoder.decode(code, "UTF-8");
							} catch (UnsupportedEncodingException e) {
								e.printStackTrace();
							}
							this.scripts.append("function "+cf.getJsFunc()+"(value,col,row,data){"+code+"}");
						}
						
						//处理指标预警
						Map<String, Object> warn = kpi.getWarning();
						if(warn != null && !warn.isEmpty()){
							String name = createWarning(warn, kpi.getFmt(), scripts);
							cf.setJsFunc(name);
						}
						tmp.add(cf);
						newCf.add(cf);
						
						//判断指标是否需要进行计算
						if(kpi.getCompute() != null && kpi.getCompute().length() > 0){
							String[] jss = kpi.getCompute().split(",");  //可能有多个计算，用逗号分隔
							for(String js : jss){
								CrossField compute = this.kpiCompute(js, kpi);
								tmp.add(compute);
								newCf.add(compute);
							}
						}
					}
				}else{
					for(CrossField tp : tmp){
						for(KpiDto kpi : kpis){
							CrossField cf = new CrossField();
							cf.setType(type);
							cf.setAggregation(kpi.getAggre());
							cf.setAlias(kpi.getAlias());
							cf.setFormatPattern(kpi.getFmt());
							cf.setOrder("y".equals(kpi.getOrder()));
							cf.setSubs(new ArrayList<CrossField>());
							//用 size来表示指标ID，用在OLAP中
							cf.setId(String.valueOf(kpi.getKpi_id()));
							if(kpi.getRate() != null){
								cf.setKpiRate(new BigDecimal(kpi.getRate()));
							}
							String ru = this.writerUnit(kpi.getRate()) +kpi.getUnit();
							if(ru != null && ru.length() > 0){
								cf.setDesc(kpi.getKpi_name() + "("  + ru + ")");  //指标名称+ 单位
							}else{
								cf.setDesc(kpi.getKpi_name());  //指标名称
							}
							//当回调函数和指标预警同时起作用时， 指标预警起作用
							//处理回调函数
							cf.setJsFunc(kpi.getFuncname());
							String code = kpi.getCode();
							if(code != null && code.length() > 0){
								try {
									code = URLDecoder.decode(code, "UTF-8");
								} catch (UnsupportedEncodingException e) {
									e.printStackTrace();
								}
								this.scripts.append("function "+cf.getJsFunc()+"(value,col,row,data){"+code+"}");
							}
							//处理指标预警
							Map<String, Object> warn = kpi.getWarning();
							if(warn != null && !warn.isEmpty()){
								String name = createWarning(warn, kpi.getFmt(), scripts);
								cf.setJsFunc(name);
							}
							tp.getSubs().add(cf);
							newCf.add(cf);
							
							//判断指标是否需要进行计算
							if(kpi.getCompute() != null && kpi.getCompute().length() > 0){
								String[] jss = kpi.getCompute().split(",");  //可能有多个计算，用逗号分隔
								for(String js : jss){
									CrossField compute = this.kpiCompute(js, kpi);
									tp.getSubs().add(compute);
									newCf.add(compute);
								}
							}
						}
					}
				}
				tmp = newCf;
				
				
			}else if("day".equals(type)){
				List<CrossField> newCf = new ArrayList<CrossField>();
				
				if(tmp.size() == 0){
					CrossField cf = new CrossField();
					/**
					cf.setType(type);
					if(sqlVO.getDayColumn() != null && sqlVO.getDayColumn().getStartDay() != null && sqlVO.getDayColumn().getStartDay().length() > 0){
						cf.setStart(sqlVO.getDayColumn().getEndDay());
						cf.setSize(sqlVO.getDayColumn().getBetweenDay() + 1);
					}else{
						int size = 365;
						cf.setStart("${s.defDay}");
						cf.setSize(size);
					}
					**/
					cf.setCasParent(true);
					
					Integer top = obj.getTop();
					cf.setTop(top);
					String topType = obj.getTopType();
					cf.setTopType(topType);
					cf.setId(String.valueOf(obj.getId()));
					cf.setType("frd");
					cf.setDateType("day");
					cf.setDateTypeFmt(obj.getDateformat());
					cf.setUselink(uselink);
					cf.setValue(obj.getVals());
					cf.setMulti(true);
					cf.setShowWeek(false);
					cf.setDesc(obj.getDimdesc());
					String alias = obj.getAlias();
					cf.setAlias(alias);
					//cf.setAggreDim("true".equalsIgnoreCase((String)obj.get("issum")));
					cf.setAliasDesc(alias);
					cf.setSubs(new ArrayList<CrossField>());
					tmp.add(cf);
					newCf.add(cf);
					
					//添加合计项
					if("y".equals(issum)){
						CrossField sumcf = new CrossField();
						sumcf.setType("none");
						String aggre = obj.getAggre();
						if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
							sumcf.setDimAggre(aggre);
						}
						sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
						sumcf.setSubs(new ArrayList<CrossField>());		
						tmp.add(sumcf);
						newCf.add(sumcf);
					}
					
				}else{
					for(CrossField tp : tmp){
						//如果上级是合计，下级不包含维度了
						if(tp.getType().equals("none")){
							continue;
						}
						CrossField cf = new CrossField();
						/**
						cf.setType(type);
						if(sqlVO.getDayColumn() != null && sqlVO.getDayColumn().getStartDay() != null && sqlVO.getDayColumn().getStartDay().length() > 0){
							cf.setStart(sqlVO.getDayColumn().getEndDay());
							cf.setSize(sqlVO.getDayColumn().getBetweenDay() + 1);
						}else{
							int size = 365;
							cf.setStart("${s.defDay}");
							cf.setSize(size);
						}**/
						cf.setCasParent(true);
						cf.setTop(obj.getTop());
						cf.setTopType(obj.getTopType());
						cf.setId(String.valueOf(obj.getId()));
						cf.setType("frd");
						cf.setDateType("day");
						cf.setDateTypeFmt(obj.getDateformat());
						cf.setUselink(uselink);
						cf.setValue(obj.getVals());
						cf.setMulti(true);
						cf.setShowWeek(false);
						cf.setDesc(obj.getDimdesc());
						String alias = obj.getAlias();
						cf.setAlias(alias);
						cf.setAliasDesc(alias);
						cf.setSubs(new ArrayList<CrossField>());
						cf.setParent(tp);
						
						tp.getSubs().add(cf);
						newCf.add(cf);
						
						//添加合计项
						if("y".equals(issum)){
							CrossField sumcf = new CrossField();
							sumcf.setType("none");
							String aggre = obj.getAggre();
							if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
								sumcf.setDimAggre(aggre);
							}
							sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
							sumcf.setSubs(new ArrayList<CrossField>());		
							tp.getSubs().add(sumcf);
							newCf.add(sumcf);
						}
					}
				}
				tmp = newCf;
				
			}else if("month".equals(type)){
				List<CrossField> newCf = new ArrayList<CrossField>();
				if(tmp.size() == 0){
					CrossField cf = new CrossField();
					/**
					cf.setType(type);
					if(sqlVO.getMonthColumn()!= null && sqlVO.getMonthColumn().getStartMonth() != null && sqlVO.getMonthColumn().getStartMonth().length() > 0){
						cf.setStart(sqlVO.getMonthColumn().getEndMonth());
						cf.setSize(sqlVO.getMonthColumn().getBetweenMonth() + 1);
					}else{
						int size = 12;
						cf.setStart("${s.defMonth}");
						cf.setSize(size);
					}
					**/
					cf.setCasParent(true);
					cf.setTop(obj.getTop());
					cf.setTopType(obj.getTopType());
					cf.setId(String.valueOf(obj.getId()));
					cf.setType("frd");
					cf.setDateType("month");
					cf.setDateTypeFmt(obj.getDateformat());
					cf.setUselink(uselink);
					cf.setValue(obj.getVals());
					cf.setMulti(true);
					cf.setDesc(obj.getDimdesc());
					String alias = obj.getAlias();
					cf.setAlias(alias);
					cf.setAliasDesc(alias);
					cf.setSubs(new ArrayList<CrossField>());
					tmp.add(cf);
					newCf.add(cf);
					
					//添加合计项
					if("y".equals(issum)){
						CrossField sumcf = new CrossField();
						sumcf.setType("none");
						String aggre = obj.getAggre();
						if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
							sumcf.setDimAggre(aggre);
						}
						sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
						sumcf.setSubs(new ArrayList<CrossField>());		
						tmp.add(sumcf);
						newCf.add(sumcf);
					}
					
				}else{
					for(CrossField tp : tmp){
						//如果上级是合计，下级不包含维度了
						if(tp.getType().equals("none")){
							continue;
						}
						CrossField cf = new CrossField();
						/**
						cf.setType(type);
						if(sqlVO.getMonthColumn()!= null && sqlVO.getMonthColumn().getStartMonth() != null && sqlVO.getMonthColumn().getStartMonth().length() > 0){
							cf.setStart(sqlVO.getMonthColumn().getEndMonth());
							cf.setSize(sqlVO.getMonthColumn().getBetweenMonth() + 1);
						}else{
							int size = 12;
							cf.setStart("${s.defMonth}");
							cf.setSize(size);
						}
						**/
						cf.setCasParent(true);
						cf.setTop(obj.getTop());
						cf.setTopType(obj.getTopType());
						cf.setId(String.valueOf(obj.getId()));
						cf.setType("frd");
						cf.setDateType("month");
						cf.setDateTypeFmt(obj.getDateformat());
						cf.setUselink(uselink);
						cf.setValue(obj.getVals());
						cf.setMulti(true);
						cf.setDesc(obj.getDimdesc());
						String alias = obj.getAlias();
						cf.setAlias(alias);
						cf.setAliasDesc(alias);
						cf.setSubs(new ArrayList<CrossField>());
						cf.setParent(tp);
						
						tp.getSubs().add(cf);
						newCf.add(cf);
						
						//添加合计项
						if("y".equals(issum)){
							CrossField sumcf = new CrossField();
							sumcf.setType("none");
							String aggre = obj.getAggre();
							if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
								sumcf.setDimAggre(aggre);
							}
							sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
							sumcf.setSubs(new ArrayList<CrossField>());		
							tp.getSubs().add(sumcf);
							newCf.add(sumcf);
						}
					}
				}
				tmp = newCf;
			}else{
				List<CrossField> newCf = new ArrayList<CrossField>();
				if(tmp.size() == 0){
					CrossField cf = new CrossField();
					cf.setType("frd"); //统一为frd
					cf.setId(String.valueOf(obj.getId()));
					cf.setDesc(obj.getDimdesc());
					String alias = obj.getAlias();
					String tableColKey = obj.getTableColKey();
					String tableColName = obj.getTableColName();
					if(tableColKey == null || tableColKey.length() == 0 || tableColName == null || tableColName.length() == 0){
						cf.setAlias(alias);
						cf.setAliasDesc(alias);
					}else{
						cf.setAlias(tableColKey);
						cf.setAliasDesc(tableColName);
					}
					cf.setCasParent(true);
					cf.setTop(obj.getTop());
					cf.setTopType(obj.getTopType());
					cf.setUselink(uselink);
					cf.setValue(obj.getVals());
					cf.setMulti(true);
					cf.setSubs(new ArrayList<CrossField>());			
					tmp.add(cf);
					newCf.add(cf);
					
					//添加合计项
					if("y".equals(issum)){
						CrossField sumcf = new CrossField();
						sumcf.setType("none");
						String aggre = obj.getAggre();
						if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
							sumcf.setDimAggre(aggre);
						}
						sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
						sumcf.setSubs(new ArrayList<CrossField>());		
						tmp.add(sumcf);
						newCf.add(sumcf);
						
						//如果是col,需要给合计添加指标
						/**
						if(pos.equals("col")){
							List<KpiInfo> kpis = sqlVO.getKpis();
							for(KpiInfo kpi : kpis){
								CrossField kpicf = new CrossField();
								kpicf.setType(type);
								kpicf.setDesc(kpi.getKpiName());
								kpicf.setAggregation(kpi.getAggre());
								kpicf.setAlias(kpi.getAlias());
								kpicf.setFormatPattern(kpi.getFmt());
								kpicf.setSubs(new ArrayList<CrossField>());
								//用 size来表示指标ID，用在OLAP中
								kpicf.setId(kpi.getId().toString());
								if(kpi.getRate() != null){
									kpicf.setKpiRate(new BigDecimal(kpi.getRate()));
								}
								sumcf.getSubs().add(kpicf);
								kpicf.setParent(sumcf);
							}
						}
						**/
					}
					
				}else{
					for(CrossField tp : tmp){
						//如果上级是合计，下级不包含维度了, 但需要包含指标
						if(tp.getType().equals("none")){
							
							//如果是col,需要给合计添加指标
							if(pos.equals("col")){
								for(KpiDto kpi : kpis){
									CrossField kpicf = new CrossField();
									kpicf.setType("kpiOther");
									kpicf.setDesc(kpi.getKpi_name());
									kpicf.setAggregation(kpi.getAggre());
									kpicf.setAlias(kpi.getAlias());
									kpicf.setFormatPattern(kpi.getFmt());
									kpicf.setSubs(new ArrayList<CrossField>());
									kpicf.setId(String.valueOf(kpi.getKpi_id()));
									if(kpi.getRate() != null){
										kpicf.setKpiRate(new BigDecimal(kpi.getRate()));
									}
									tp.getSubs().add(kpicf);
									kpicf.setParent(tp);
								}
							}
							
							continue;
						}
						CrossField cf = new CrossField();
						cf.setType("frd"); //统一为frd
						cf.setId(String.valueOf(obj.getId()));
						cf.setDesc(obj.getDimdesc());
						String alias = obj.getAlias();
						String tableColKey = obj.getTableColKey();
						String tableColName = obj.getTableColName();
						if(tableColKey == null || tableColKey.length() == 0 || tableColName == null || tableColName.length() == 0){
							cf.setAlias(alias);
							cf.setAliasDesc(alias);
						}else{
							cf.setAlias(tableColKey);
							cf.setAliasDesc(tableColName);
						}
						cf.setCasParent(true);
						
						cf.setTop(obj.getTop());
						cf.setTopType(obj.getTopType());
						cf.setUselink(uselink);
						cf.setValue(obj.getVals());
						cf.setMulti(true);
						cf.setSubs(new ArrayList<CrossField>());
						cf.setParent(tp);
						tp.getSubs().add(cf);
						newCf.add(cf);
						
						//添加合计项
						if("y".equals(issum)){
							CrossField sumcf = new CrossField();
							sumcf.setType("none");
							String aggre = obj.getAggre();
							if(aggre != null && aggre.length() > 0 && !"auto".equals(aggre)){
								sumcf.setDimAggre(aggre);
							}
							sumcf.setDesc(loadFieldName(sumcf.getDimAggre()));
							sumcf.setSubs(new ArrayList<CrossField>());		
							tp.getSubs().add(sumcf);
							newCf.add(sumcf);
						}
					}
				}
				tmp = newCf;
			}
			
		}
	}	
	
	public List<RowDimContext> getDrillDim(TableQueryDto table){
		List<Map<String, Object>> drillDim = table.getDrillDim();
		if(drillDim == null || drillDim.isEmpty() || table.getCols().size() != 1){  //只有一个row维度才能启用钻取
			return null;
		}
		List<RowDimContext> ret = new ArrayList<RowDimContext>();
		for(int i=0; i<drillDim.size(); i++){
			Map<String, Object> obj = (Map<String, Object>)drillDim.get(i);
			RowDimContext dim = new RowDimContext();
			dim.setCode((String)obj.get("code"));
			dim.setName((String)obj.get("name"));
			dim.setCodeDesc(dim.getCode());
			dim.setType("frd");
			ret.add(dim);
		}
		return ret;
	}
	
	public static String createWarning(Map<String, Object> warn, String kpiFmt, StringBuffer scripts ){
		String funcName = "warn"+IdCreater.create();
		scripts.append("function " +funcName+"(val, a, b, c, d){");
		//先输出值
		scripts.append("out.print(val, '"+kpiFmt+"');");
		scripts.append("if(d != 'html'){"); //只在html模式下起作用
		scripts.append(" return;");
		scripts.append("}");
		scripts.append("if(val "+warn.get("logic1")+" "+warn.get("val1")+"){");
		scripts.append("out.print(\"<span class='"+warn.get("pic1")+"'></span>\")");
		scripts.append("}else if(val "+(warn.get("logic1").equals(">=")?"<":"<=")+" "+warn.get("val1")+" && val "+warn.get("logic2")+" "+warn.get("val2")+"){");
		scripts.append("out.print(\"<span class='"+warn.get("pic2")+"'></span>\")");
		scripts.append("}else{");
		scripts.append("out.print(\"<span class='"+warn.get("pic3")+"'></span>\")");
		scripts.append("}");
		scripts.append("}");
		return funcName; 
	}
	
	private CrossField kpiCompute(String compute, KpiDto kpi){
		CrossField cf = new CrossField();
		if("zb".equals(compute)){
			cf.setDesc("占比");
			cf.setAggregation("avg");
			cf.setAlias(kpi.getAlias() + "_zb");
			cf.setFormatPattern("0.00%");
		}else if("sxpm".equals(compute) || "jxpm".equals(compute)){
			cf.setDesc(("sxpm".equals(compute) ? "升序":"降序") + "排名");
			cf.setAggregation("avg");
			cf.setAlias(kpi.getAlias() + "_order");
			cf.setFormatPattern("#,###");
			cf.setStyleClass("pms");
			cf.setStyleToLine(true);
		}else if("ydpj".equals(compute)){
			cf.setDesc("移动平均");
			cf.setAggregation(kpi.getAggre());
			cf.setAlias(kpi.getAlias() + "_ydpj");
			cf.setFormatPattern(kpi.getFmt());
			if(kpi.getRate() != null){
				cf.setKpiRate(new BigDecimal(kpi.getRate()));
			}
		}else if("sq".equals(compute)){
			cf.setDesc("上期值");
			cf.setAggregation(kpi.getAggre());
			cf.setAlias(kpi.getAlias()+"_sq");
			cf.setFormatPattern(kpi.getFmt());
			if(kpi.getRate() != null){
				cf.setKpiRate(new BigDecimal(kpi.getRate()));
			}
		}else if("tq".equals(compute)){
			cf.setDesc("同期值");
			cf.setAggregation(kpi.getAggre());
			cf.setAlias(kpi.getAlias()+"_tq");
			cf.setFormatPattern(kpi.getFmt());
			if(kpi.getRate() != null){
				cf.setKpiRate(new BigDecimal(kpi.getRate()));
			}
		}else if("zje".equals(compute)){
			cf.setDesc("增减额");
			cf.setAggregation(kpi.getAggre());
			cf.setAlias(kpi.getAlias() + "_zje");
			cf.setFormatPattern(kpi.getFmt());
			if(kpi.getRate() != null){
				cf.setKpiRate(new BigDecimal(kpi.getRate()));
			}
			cf.setFinanceFmt(true);
		}else if("hb".equals(compute)){
			cf.setDesc("环比");
			cf.setAggregation("avg");
			cf.setAlias(kpi.getAlias() + "_hb");
			cf.setFormatPattern("0.00%");
			cf.setFinanceFmt(true);
		}else if("tb".equals(compute)){
			cf.setDesc("同比");
			cf.setAggregation("avg");
			cf.setAlias(kpi.getAlias()+"_tb");
			cf.setFormatPattern("0.00%");
			cf.setFinanceFmt(true);
		}
		cf.setType("kpiOther");
		cf.setId("ext_" + kpi.getKpi_id()+"_"+compute); //表示当前指标是由基本指标衍生而来，比如昨日、累计、同比、环比、排名、占比等内容。
		return cf;
	}

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}

	public StringBuffer getScripts() {
		return scripts;
	}
	
}
