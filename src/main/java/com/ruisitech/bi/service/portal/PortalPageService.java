package com.ruisitech.bi.service.portal;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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
import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.init.TemplateManager;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.cross.BaseKpiField;
import com.ruisi.ext.engine.view.context.cross.CrossKpi;
import com.ruisi.ext.engine.view.context.cross.CrossReportContext;
import com.ruisi.ext.engine.view.context.cross.RowDimContext;
import com.ruisi.ext.engine.view.context.dc.grid.GridDataCenterContext;
import com.ruisi.ext.engine.view.context.face.OptionsLoader;
import com.ruisi.ext.engine.view.context.form.ButtonContext;
import com.ruisi.ext.engine.view.context.form.ButtonContextImpl;
import com.ruisi.ext.engine.view.context.form.DateSelectContextImpl;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ext.engine.view.context.form.MultiSelectContextImpl;
import com.ruisi.ext.engine.view.context.form.RadioContextImpl;
import com.ruisi.ext.engine.view.context.form.SelectContext;
import com.ruisi.ext.engine.view.context.form.SelectContextImpl;
import com.ruisi.ext.engine.view.context.form.TextFieldContext;
import com.ruisi.ext.engine.view.context.form.TextFieldContextImpl;
import com.ruisi.ext.engine.view.context.gridreport.GridReportContext;
import com.ruisi.ext.engine.view.context.html.DivContext;
import com.ruisi.ext.engine.view.context.html.DivContextImpl;
import com.ruisi.ext.engine.view.context.html.IncludeContext;
import com.ruisi.ext.engine.view.context.html.IncludeContextImpl;
import com.ruisi.ext.engine.view.context.html.TextContext;
import com.ruisi.ext.engine.view.context.html.TextContextImpl;
import com.ruisi.ext.engine.view.context.html.TextProperty;
import com.ruisi.ext.engine.view.context.html.table.TableContext;
import com.ruisi.ext.engine.view.context.html.table.TableContextImpl;
import com.ruisi.ext.engine.view.context.html.table.TdContext;
import com.ruisi.ext.engine.view.context.html.table.TdContextImpl;
import com.ruisi.ext.engine.view.context.html.table.TrContext;
import com.ruisi.ext.engine.view.context.html.table.TrContextImpl;
import com.ruisi.ext.engine.view.exception.ExtConfigException;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.bireport.TableQueryDto;
import com.ruisitech.bi.entity.model.Dimension;
import com.ruisitech.bi.entity.portal.BoxQuery;
import com.ruisitech.bi.entity.portal.GridColDto;
import com.ruisitech.bi.entity.portal.GridQuery;
import com.ruisitech.bi.entity.portal.PortalChartQuery;
import com.ruisitech.bi.entity.portal.PortalTableQuery;
import com.ruisitech.bi.service.bireport.BaseCompService;
import com.ruisitech.bi.service.bireport.ModelCacheService;
import com.ruisitech.bi.service.model.DimensionService;

@Service
@Scope("prototype")
public class PortalPageService extends BaseCompService {
	
	public final static String deftMvId = "mv.portal.tmp";
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
	private StringBuffer css = new StringBuffer(); //在创建页面过程中生成所需要的组件样式文件
	private StringBuffer scripts = new StringBuffer();
	private List<String> dsids = new ArrayList<String>(); //用到的数据原
	
	@Autowired
	private DimensionService dimService;
	
	@Autowired
	private ModelCacheService cacheService;
	
	@Autowired
	private PortalChartService chartService;
	
	@Autowired
	private GridService gridSerivce;
	
	@Autowired
	private PortalTableService tableService;
	
	@Autowired
	private BoxService boxSerivce;
	
	public @PostConstruct void init() {
		
	}  
	
	public @PreDestroy void destory() {
		mvParams.clear();
		dsids.clear();
	}
	
	public MVContext json2MV(JSONObject pageJson, boolean release, boolean export) throws Exception{
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		IncludeContext inc = new IncludeContextImpl();
		String stylename = (String)pageJson.get("stylename");
		if(stylename != null && stylename.length() > 0 && !"def".equals(stylename)){
			inc.setPage("/resource/css/portal-inc-"+stylename+".css");
		}else{
			inc.setPage("/resource/css/portal-inc.css");
		}
		mv.getChildren().add(inc);
		inc.setParent(mv);
		
		//解析参数
		Object param = pageJson.get("params");
		if(param != null && ((JSONArray)param).size()>0){
			DivContext outdiv = new DivContextImpl();
			outdiv.setStyleClass("ibox");
			outdiv.setStyle("margin:10px;");
			outdiv.setChildren(new ArrayList<Element>());
			outdiv.setParent(mv);
			mv.getChildren().add(outdiv);
			DivContext div = new DivContextImpl();
			div.setStyleClass("ibox-content");
			div.setStyle("padding:5px;");
			div.setParent(outdiv);
			div.setChildren(new ArrayList<Element>());
			outdiv.getChildren().add(div);
			
			JSONArray pp = (JSONArray)param;
			for(int i=0; i<pp.size(); i++){
				this.parserParam(pp.getJSONObject(i), div, mv, release?false:true);
			}
			if(!export){
				//创建提交按钮
				ButtonContext btn = new ButtonContextImpl();
				btn.setDesc("查询");
				btn.setType("button");
				btn.setMvId(new String[]{mv.getMvid()});
				div.getChildren().add(btn);
				btn.setParent(div);
			}
		}
		
		JSONObject body = pageJson.getJSONObject("body");
		parserBody(body, mv, param, release);
		//生成样式
		TextContext csstext = new TextContextImpl();
		csstext.setText("<style>" + this.css.toString() + "</style>");
		mv.getChildren().add(csstext);
		csstext.setParent(mv);
		//生成数据原
		for(String dsid : dsids){
			createDsource(this.cacheService.getDsource(dsid), mv);
		}
		return mv;
	}
	
	//解析布局器
	public void parserBody(JSONObject body, MVContext mv, Object param, boolean release) throws Exception{		
		TableContext tab = new TableContextImpl();
		tab.setStyleClass("r_layout");
		tab.setChildren(new ArrayList<Element>());
		mv.getChildren().add(tab);
		tab.setParent(mv);
		for(int i=1; true; i++){
			Object tmp = body.get("tr" + i);
			if(tmp == null){
				break;
			}
			JSONArray trs = (JSONArray)tmp;
			TrContext tabTr = new TrContextImpl();
			tabTr.setChildren(new ArrayList<Element>());
			tab.getChildren().add(tabTr);
			tabTr.setParent(tab);
			for(int j=0; j<trs.size(); j++){
				JSONObject td = trs.getJSONObject(j);
				TdContext tabTd = new TdContextImpl();
				tabTd.setStyleClass("layouttd");
				tabTd.setChildren(new ArrayList<Element>());
				tabTd.setParent(tabTr);
				tabTr.getChildren().add(tabTd);
				tabTd.setColspan(String.valueOf(td.getIntValue("colspan")));
				tabTd.setRowspan(String.valueOf(td.getIntValue("rowspan")));
				tabTd.setWidth(td.getIntValue("width") + "%");
				
				Object cldTmp = td.get("children");
				
				if(cldTmp != null){
					JSONArray children = (JSONArray)cldTmp;
					for(int k=0; k<children.size(); k++){
						JSONObject comp = children.getJSONObject(k);
						String tp = comp.getString("type");
						
						//生成外层div
						DivContext div = new DivContextImpl(); //外层div
						div.setStyleClass("ibox");
						div.setChildren(new ArrayList<Element>());
						tabTd.getChildren().add(div);
						div.setParent(tabTd);
						
						//判断是否生成title
						String showtitle = (String)comp.get("showtitle");
						if((showtitle != null && "false".equalsIgnoreCase(showtitle))
								//数据框默认不生成title
								|| tp.equals("box") ){   //不生成head
							
						}else{   //生成head
							DivContext head = new DivContextImpl(); //内层head Div
							head.setChildren(new ArrayList<Element>());
							head.setStyleClass("ibox-title-view");
							div.getChildren().add(head);
							head.setParent(div);
							
							TextContext text = new TextContextImpl(); //head Div 的文字
							text.setText(comp.getString("name"));
							TextProperty ctp = new TextProperty();
							ctp.setAlign("left");
							ctp.setWeight("bold");
							text.setTextProperty(ctp);
							head.getChildren().add(text);
							text.setParent(head);
						}
						
						DivContext content = new DivContextImpl(); //内层content Div
						content.setStyleClass("ibox-content");
						content.setStyle("border-top:none; padding:3px;");
						content.setChildren(new ArrayList<Element>());
						div.getChildren().add(content);
						content.setParent(div);
						
						if(tp.equals("text")){
							this.createText(content, comp);
						}else if(tp.equals("chart")){
							PortalChartQuery chart = JSONObject.toJavaObject(comp, PortalChartQuery.class);
							this.createChart(mv, content, chart, release);
						}else if(tp.equals("table")){
							PortalTableQuery table = JSONObject.toJavaObject(comp, PortalTableQuery.class);
							this.crtTable(mv, content, table, release);
						}else if(tp.equals("grid")){
							GridQuery grid = JSONObject.toJavaObject(comp, GridQuery.class);
							this.crtGrid(mv, content, grid, release);
						}else if(tp.equals("box")){
							BoxQuery ncomp = JSONObject.toJavaObject(comp, BoxQuery.class);
							this.createBox(mv, content, ncomp);
						}
					}
				}
			}
		}
		//生成scripts
		String s = scripts.toString();
		if(s.length() > 0){
			mv.setScripts(s);
		}
	}
	
	/**
	 * 生成动态参数
	 * @param params
	 * @param mv
	 * @param isput 是否把参数放入MV对象，在发布的时候不用
	 * @throws ExtConfigException
	 * @throws IOException
	 */
	public void parserParam(JSONObject param, DivContext div, MVContext mv, boolean isput) throws ExtConfigException, IOException {
	
			String type = param.getString("type");
			String id = param.getString("paramid");
			String desc = param.getString("name");
			String def = (String)param.get("defvalue");
			String vtp = (String)param.get("valtype");
			String dtformat = (String)param.get("dtformat");
			String hiddenprm = (String)param.get("hiddenprm");
			//String refds = (String)param.get("dsource");
			
			InputField input = null;
			if("y".equals(hiddenprm)){
				TextFieldContext txt = new TextFieldContextImpl();
				txt.setType("hidden");
				txt.setShow(true);
				input = txt;
			}else{
				if("radio".equals(type)){
					SelectContextImpl target = new SelectContextImpl();
					if("static".equals(vtp)){
						this.paramOptions(param, target);
					}else if("dynamic".equals(vtp)){
						String sql = this.createDimSql(param);
						String template = TemplateManager.getInstance().createTemplate(sql);
						target.setTemplateName(template);
						String dsid = param.getJSONObject("option").getString("dsource");
						target.setRefDsource(dsid);  //获取数据源
						if(!dsids.contains(dsid)){
							dsids.add(dsid);
						}
					}
					target.setAddEmptyValue(true);
					input = target;
				}else if("checkbox".equals(type)){
					SelectContext target = new MultiSelectContextImpl(); 
					if("static".equals(vtp)){
						this.paramOptions(param, target);
					}else if("dynamic".equals(vtp)){
						String sql = this.createDimSql(param);
						String template = TemplateManager.getInstance().createTemplate(sql);
						target.setTemplateName(template);
						String dsid = param.getJSONObject("option").getString("dsource");
						target.setRefDsource(dsid);  //获取数据源
						if(!dsids.contains(dsid)){
							dsids.add(dsid);
						}
					}
					input = target;
				}else if("dateselect".equals(type) || "monthselect".equals(type) || "yearselect".equals(type)){  //日历框
					DateSelectContextImpl target = new DateSelectContextImpl();
					//target.setShowCalendar(true);
					String max =  (String)param.get("maxval");
					if(max != null && max.length() > 0){
						target.setMaxDate(max);
					}
					String min = (String)param.get("minval");
					if(min != null && min.length() > 0){
						target.setMinDate(min);
					}
					if(dtformat != null && dtformat.length() > 0){
						target.setDateFormat(dtformat);
					}
					if("monthselect".equals(type)){
						target.setDateType("month");
					}else if("yearselect".equals(type)){
						target.setDateType("year");
					}
					input = target;
				}else if("text".equals(type)){
					TextFieldContext target = new TextFieldContextImpl();
					input = target;
				}
			}
			input.setId(id);
			input.setDesc(desc);
			String size = (String)param.get("size");
			if(size != null && size.length() > 0){
				if("radio".equals(type)){
					//select 框就是 radio,他的size表示像素，转换成实际size
					input.setSize(String.valueOf(Integer.parseInt(size) * 8));
				}else{
					input.setSize(size);
				}
			}
			if(def != null && def.length() > 0){
				if(("dateselect".equals(type) || "monthselect".equals(type) || "yearselect".equals(type) )&& "now".equals(def)){
					def = new SimpleDateFormat(dtformat).format(new Date());
				}
				input.setDefaultValue(def);
			}
			div.getChildren().add(input);
			input.setParent(div);
			
			//把参数放入对象
			if(isput){
				this.mvParams.put(input.getId(), input);
				ExtContext.getInstance().putServiceParam(mv.getMvid(), input.getId(), input);
			}
						
			//处理样式
			JSONObject style = (JSONObject)param.get("style");
			if(style != null && !style.isEmpty()){
				StringBuffer sb = new StringBuffer();
				String talign = (String)style.get("talign"); //排列方式
				if(talign != null && "horizontal".equals(talign) && ("radio".equals(type) || "checkbox".equals(type))){
					((RadioContextImpl)input).setRadioStyle("display:inline;");
				}
				String theight = (String)style.get("theight");
				String fontweight = (String)style.get("tfontweight");
				String tfontcolor = (String)style.get("tfontcolor");
				String tfontsize = (String)style.get("tfontsize");
				if(tfontsize != null && tfontsize.length() > 0){
					sb.append("font-size:"+tfontsize+"px;");
				}
				if(theight != null && theight.length() > 0){
					sb.append("height:"+theight+"px;");
				}
				if(fontweight != null && "true".equals(fontweight)){
					sb.append("font-weight:bold;");
				}
				if(tfontcolor != null && tfontcolor.length() > 0){
					sb.append("color:" + tfontcolor+";");
				}
				
				String italic = (String)style.get("titalic");
				String underscore = (String)style.get("tunderscore");
				String lineheight = (String)style.get("tlineheight");
				String tbgcolor = (String)style.get("tbgcolor");
				if("true".equals(italic)){
					sb.append("font-style:italic;");
				}
				if("true".equals(underscore)){
					sb.append("text-decoration: underline;");
				}
				if(lineheight != null && lineheight.length() > 0){
					sb.append("line-height:"+lineheight+"px;");
				}
				if(tbgcolor != null && tbgcolor.length() > 0){
					sb.append("background-color:"+tbgcolor+";");
				}
				div.setStyle(sb.toString());
			}
		
	}
	
	private void paramOptions(JSONObject param, OptionsLoader option){
		List ls = option.loadOptions();
		if(ls == null){
			ls = new ArrayList();
			option.setOptions(ls);
		}
		Object vals = param.get("values");
		if(vals != null){
			JSONArray values = (JSONArray)vals;
			for(int i=0; i<values.size(); i++){
				JSONObject opt = values.getJSONObject(i);
				Map<String, String> nOption = new HashMap<String, String>();
				nOption.put("text", opt.getString("text"));
				nOption.put("value", opt.getString("value"));
				ls.add(nOption);
			}
		}
	}
	
	public String createDimSql(JSONObject dim){
		JSONObject opt = dim.getJSONObject("option");
		//查询事实表
		Dimension d = dimService.getDimInfo(new Integer(opt.get("dimId").toString()), new Integer(opt.get("tableId").toString()));
		String col = d.getCol();
		String key = d.getColkey();
		String name = d.getColtext();
		String dimord = d.getDimord();
		String ordcol = d.getOrdcol();
		String sql =  "select distinct " +  (key==null||key.length() == 0 ? col : key) + " \"value\", " + (name==null||name.length() == 0 ?col:name) + " \"text\" from ";
		sql += (d.getColTable() == null || d.getColTable().length() == 0 ? d.getTname() : d.getColTable());
		if(ordcol != null && ordcol.length() > 0){
			sql += " order by " + ordcol;
		}
		if(ordcol != null && ordcol.length() > 0 && dimord != null && dimord.length() > 0){
			sql += " " + dimord;
		}
		 //直接从数据中查询。
		return sql;
	}
	
	public String createMonthSql(){
		String sql = "select mid \"value\", mname \"text\" from code_month order by mid desc";
		return sql;
	}
	
	public void createBox(MVContext mv, Element td, BoxQuery compJson) throws IOException{
		String dsetId = compJson.getDsetId();
		String dsid = compJson.getDsid();
		if(dsetId == null || dsid == null){
			return;
		}
		if(!this.dsids.contains(dsid)){
			dsids.add(dsid);
		}
		boxSerivce.json2Box(compJson, td, true);
		if(!this.dsids.contains(compJson.getDsid())){
			this.dsids.add(compJson.getDsid());
		}
	}
	
	public void createText(Element td, JSONObject compJson){
		TextContext text = new TextContextImpl();
		JSONObject style = (JSONObject)compJson.get("style");
		if(style != null && !style.isEmpty()){
			TextProperty tp = new TextProperty();
			tp.setAlign((String)style.get("talign"));
			tp.setHeight((String)style.get("tfontheight"));
			tp.setSize((String)style.get("tfontsize"));
			String fontweight = (String)style.get("tfontweight");
			tp.setWeight("true".equals(fontweight)?"bold":"normal");
			tp.setColor((String)style.get("tfontcolor"));
			tp.setId("C"+IdCreater.create());
			text.setTextProperty(tp);
			
			css.append("#"+tp.getId()+"{");
			String italic = (String)style.get("titalic");
			String underscore = (String)style.get("tunderscore");
			String lineheight = (String)style.get("tlineheight");
			String tbgcolor = (String)style.get("tbgcolor");
			if("true".equals(italic)){
				css.append("font-style:italic;");
			}
			if("true".equals(underscore)){
				css.append("text-decoration: underline;");
			}
			if(lineheight != null && lineheight.length() > 0){
				css.append("line-height:"+lineheight+"px;");
			}
			if(tbgcolor != null && tbgcolor.length() > 0){
				css.append("background-color:"+tbgcolor+";");
			}
			css.append("}");
		}
		String desc = compJson.getString("desc");
		text.setText(desc);
		text.setParent(td);
		text.setFormatEnter(true);
		td.getChildren().add(text);
	}
	
	public void createChart(MVContext mv, Element tabTd, PortalChartQuery chart, boolean release) throws Exception{
		if(chart.getChartJson() == null){
			return;
		}
		if(chart.getKpiJson() == null || chart.getKpiJson().size() == 0){
			return;
		}
		KpiDto firstKpi = chart.getKpiJson().get(0);
		if(firstKpi == null){
			return; //未选指标
		}

		ChartContext cr = chartService.json2Chart(chart.getChartJson(), chart.getKpiJson(), chart.getId(), false);
		cr.setId("C" + IdCreater.create());
		
		String sql = chartService.createSql(chart, 0);
		GridDataCenterContext dc = chartService.getChartService().createDataCenter(chart.getChartJson(), sql);
		cr.setRefDataCenter(dc.getId());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		
		tabTd.getChildren().add(cr);
		cr.setParent(tabTd);
		if(mv.getCharts() == null){
			Map crs = new HashMap();
			mv.setCharts(crs);
		}
		mv.getCharts().put(cr.getId(), cr);
		
		//判断是否有事件，是否需要添加参数
		Map<String, Object> linkAccept = chart.getChartJson().getLinkAccept();
		if(linkAccept != null &&  !linkAccept.isEmpty()){
			//创建参数, 如果参数已经存在就不放置
			if(!this.mvParams.containsKey(linkAccept.get("alias"))){
				TextFieldContext linkText = new TextFieldContextImpl();
				linkText.setType("hidden");
				linkText.setDefaultValue((String)linkAccept.get("dftval"));
				linkText.setId((String)linkAccept.get("alias"));
				linkText.setShow(true);
				mv.getChildren().add(0, linkText);
				linkText.setParent(mv);
				if(!release){
					this.mvParams.put(linkText.getId(), linkText);
					ExtContext.getInstance().putServiceParam(mv.getMvid(), linkText.getId(), linkText);
					mv.setShowForm(true);
				}	
			}
		}
		//设置ds
		dc.getConf().setRefDsource(chart.getDsid());
		if(!this.dsids.contains(chart.getDsid())){
			this.dsids.add(chart.getDsid());
		}
	}
	
	public void crtGrid(MVContext mv, Element tabTd, GridQuery grid, boolean release) throws IOException{
		List<GridColDto> cols = grid.getCols();
		if(cols == null || cols.size() == 0){
			return;
		}
		
		if(!this.dsids.contains(grid.getDsid())){
			this.dsids.add(grid.getDsid());
		}
		
		//创建corssReport
		GridReportContext cr = gridSerivce.json2Grid(grid);
		//设置ID
		String id = ExtConstants.reportIdPrefix + IdCreater.create();
		cr.setId(id);
		cr.setRefDsource(grid.getDsid());
		
		//创建数据sql
		String sql = gridSerivce.createSql(grid);
		String name = TemplateManager.getInstance().createTemplate(sql);
		cr.setTemplateName(name);
		
		tabTd.getChildren().add(cr);
		cr.setParent(tabTd);
		
		if(mv.getGridReports() == null){
			Map<String, GridReportContext> crs = new HashMap<String, GridReportContext>();
			mv.setGridReports(crs);
		}
		Map<String, GridReportContext> crs = mv.getGridReports();
		crs.put(cr.getId(), cr);
		
		mv.setGridReports(crs);
	}
	
	public void crtTable(MVContext mv, Element tabTd, PortalTableQuery table, boolean release) throws Exception {
		if(table.getCols() == null && table.getRows() == null) {
			return;
		}
		if(!this.dsids.contains(table.getDsid())){
			dsids.add(table.getDsid());
		}
		//创建corssReport
		TableQueryDto dto = new TableQueryDto();
		dto.setCompId(table.getId());
		dto.setLink(table.getLink());
		dto.setDrillDim(table.getDrillDim());
		dto.setCols(table.getCols());
		dto.setRows(table.getRows());
		dto.setKpiJson(table.getKpiJson());
		CrossReportContext cr = null;
		//处理kpiOther
		CrossKpi mybaseKpi = null;
		List<DimDto> cols = table.getCols();
		if(cols.size() > 0 && table.getKpiJson().size() == 1){
			//如果只有一个指标，并且具有列维度，放入baseKpi
			KpiDto kpi = table.getKpiJson().get(0);
			CrossKpi baseKpi = new BaseKpiField();
			baseKpi.setAggregation(kpi.getAggre());
			baseKpi.setAlias(kpi.getAlias());
			baseKpi.setFormatPattern(kpi.getFmt());
			baseKpi.setKpiRate(kpi.getRate() == null ? null : new BigDecimal(kpi.getRate()));
			mybaseKpi = baseKpi;
			cr = tableService.getTableService().json2Table(dto);
			cr.setBaseKpi(mybaseKpi);
		}else{
			DimDto kpiOther = new DimDto();
			kpiOther.setType("kpiOther");
			cols.add(kpiOther);
			cr = tableService.getTableService().json2Table(dto);
			cols.remove(cols.size() - 1);
		}
	
		String id = ExtConstants.reportIdPrefix + IdCreater.create();
		cr.setId(id);
		String lock = table.getLockhead();
		if("true".equals(lock)){
			cr.setOut("lockUI");
		}else{
			cr.setOut("HTML");
		}
		String height = table.getHeight();
		if(height != null && height.length() > 0){
			cr.setHeight(height);
		}
		cr.setShowData(true);
		if(mybaseKpi != null){
			cr.setBaseKpi(mybaseKpi);
		}
		
		String sql = tableService.createSql(table, 0, 0);
		GridDataCenterContext dc = tableService.createDataCenter(sql, table);
		cr.setRefDataCetner(dc.getId());
		dc.getConf().setRefDsource(table.getDsid());
		if(mv.getGridDataCenters() == null){
			mv.setGridDataCenters(new HashMap<String, GridDataCenterContext>());
		}
		mv.getGridDataCenters().put(dc.getId(), dc);
		//判断是否有钻取维
		List<RowDimContext> drillDims = cr.getDims();
		for(int i=0; drillDims!=null&&i<drillDims.size(); i++){
			RowDimContext drillDim = drillDims.get(i);
			//生成钻取维的DataCenter
			sql = tableService.createSql(table, 0, i+1);
			GridDataCenterContext drillDc = tableService.createDataCenter(sql, table);
			drillDim.setRefDataCenter(drillDc.getId());
			mv.getGridDataCenters().put(drillDc.getId(), drillDc);
		}
		
		tabTd.getChildren().add(cr);
		cr.setParent(tabTd);
		
		//判断是否有事件，是否需要添加参数
		Map<String, Object> linkAccept = table.getLinkAccept();
		if(linkAccept != null &&  !linkAccept.isEmpty()){
			//如果参数重复，不放置
			if(!this.mvParams.containsKey(linkAccept.get("alias"))){
				//创建参数
				TextFieldContext linkText = new TextFieldContextImpl();
				linkText.setType("hidden");
				linkText.setDefaultValue((String)linkAccept.get("dftval"));
				linkText.setId((String)linkAccept.get("alias"));
				linkText.setShow(true);
				mv.getChildren().add(0, linkText);
				linkText.setParent(mv);
				if(!release){
					this.mvParams.put(linkText.getId(), linkText);
					ExtContext.getInstance().putServiceParam(mv.getMvid(), linkText.getId(), linkText);
					mv.setShowForm(true);
				}
			}
			
		}
		if(mv.getCrossReports() == null){
			Map crs = new HashMap();
			mv.setCrossReports(crs);
		}
		mv.getCrossReports().put(cr.getId(), cr);
		scripts.append(tableService.getTableService().getScripts());
	}

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}

}
