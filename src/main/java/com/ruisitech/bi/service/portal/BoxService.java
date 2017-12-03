package com.ruisitech.bi.service.portal;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.ruisi.ext.engine.ExtConstants;
import com.ruisi.ext.engine.init.TemplateManager;
import com.ruisi.ext.engine.util.IdCreater;
import com.ruisi.ext.engine.view.context.Element;
import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.engine.view.context.MVContext;
import com.ruisi.ext.engine.view.context.MVContextImpl;
import com.ruisi.ext.engine.view.context.form.InputField;
import com.ruisi.ext.engine.view.context.html.DataContext;
import com.ruisi.ext.engine.view.context.html.DataContextImpl;
import com.ruisi.ext.engine.view.context.html.TextContext;
import com.ruisi.ext.engine.view.context.html.TextContextImpl;
import com.ruisi.ext.engine.view.context.html.TextProperty;
import com.ruisi.ext.engine.view.emitter.highcharts.util.ChartUtils;
import com.ruisitech.bi.entity.bireport.KpiDto;
import com.ruisitech.bi.entity.portal.BoxQuery;
import com.ruisitech.bi.service.bireport.BaseCompService;
import com.ruisitech.bi.service.bireport.ModelCacheService;
import com.ruisitech.bi.util.RSBIUtils;
import com.ruisitech.ext.service.DataControlInterface;

@Service
@Scope("prototype")
public class BoxService extends BaseCompService {

	public final static String deftMvId = "mv.portal.box";
	
	private Map<String, InputField> mvParams = new HashMap<String, InputField>(); //mv的参数
		
	private DataControlInterface dataControl; //数据权限控制
	
	@Autowired
	private ModelCacheService cacheService;
	
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
	
	public MVContext json2MV(BoxQuery box) throws Exception{
		//创建MV
		MVContext mv = new MVContextImpl();
		mv.setChildren(new ArrayList<Element>());
		String formId = ExtConstants.formIdPrefix + IdCreater.create();
		mv.setFormId(formId);
		mv.setMvid(deftMvId);
		
		//处理参数,把参数设为hidden
		super.parserHiddenParam(box.getPortalParams(), mv, mvParams);	
		
		this.json2Box(box, mv);
		
		super.createDsource(this.cacheService.getDsource(box.getDsid()), mv);
		
		
		return mv;
	}
	
	/**
	 * 通过数据生成 box 块
	 * @param mv
	 * @throws IOException 
	 */
	public void json2Box(BoxQuery box, Element mv) throws IOException{
		if(box.getKpiJson()== null){
			return;
		}
		//创建box 的 data 标签
		String sql = createSql(box);
		DataContext data = new DataContextImpl();
		data.setKey("k" + box.getKpiJson().getKpi_id());
		data.setRefDsource(box.getDsid());
		String name = TemplateManager.getInstance().createTemplate(sql);
		data.setTemplateName(name);
		mv.getChildren().add(data);
		data.setParent(mv);
		
		//创建box 显示 text 标签
		KpiDto kpi = box.getKpiJson();
		TextContext text = new TextContextImpl();
		String str = "#if($!k"+kpi.getKpi_id()+"."+kpi.getAlias()+") $extUtils.numberFmt($!k"+kpi.getKpi_id()+"."+kpi.getAlias()+", '"+kpi.getFmt()+"') <font size='4' color='#999999'>" ;
		Object rate = kpi.getRate();
		if(rate != null){
			str += ChartUtils.writerUnit(new Integer(rate.toString()));
		}
		str += kpi.getUnit()+"</font>";
		str += "#else - #end";
		String word = TemplateManager.getInstance().createTemplate(str);
		text.setTemplateName(word);
		text.setFormatHtml(true);
		TextProperty tp = new TextProperty();
		tp.setAlign("center");
		tp.setColor("#000000");
		tp.setWeight("bold");
		tp.setSize("32");
		tp.setStyleClass("boxcls");
		text.setTextProperty(tp);
		mv.getChildren().add(text);
		text.setParent(mv);
	}
	
	public String createSql(BoxQuery box){
		JSONObject dset = this.cacheService.getDset(box.getDsetId());
		Map<String, String> tableAlias = createTableAlias(dset);
		KpiDto kpi = box.getKpiJson();
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(kpi.getCol_name());
		Integer rate = kpi.getRate();
		if(rate != null){
			sql.append("/" + rate);
		}
		sql.append(" as ");
		sql.append(kpi.getAlias());
		
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
		
		if(dataControl != null){
			String ret = dataControl.process(RSBIUtils.getLoginUserInfo(), (String)dset.get("master"));
			if(ret != null){
				sql.append(ret + " ");
			}
		}
		sql.append(" " + dealCubeParams(box.getParams(), tableAlias));
		return sql.toString().replaceAll("@", "'");
	}

	public Map<String, InputField> getMvParams() {
		return mvParams;
	}
}
