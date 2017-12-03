package com.ruisitech.bi.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 递归调用，生成Tree 数据
 * @author hq
 * @date 2014-7-30
 */
public class TreeService {
	
	public List<Map<String, Object>> createTreeData(List<Map<String, Object>> datas, TreeInterface treeface){
		List<Map<String, Object>> roots = this.getChildren(datas, 0);
		this.loopChildren(roots, datas, treeface);
		return roots;
	}
	
	public List<Map<String, Object>> createTreeDataById(List<Map<String, Object>> datas, TreeInterface treeface, int id){
		List<Map<String, Object>> roots = this.getChildren(datas, id);
		this.loopChildren(roots, datas, treeface);
		return roots;
	}
	
	private void loopChildren(List<Map<String, Object>> nodes, List<Map<String, Object>> datas, TreeInterface treeface){
		for(int i=0; i<nodes.size(); i++){
			Map<String, Object> root = (Map<String, Object>)nodes.get(i);
			treeface.processMap(root);
			int id;
			Object ret = root.get("id");
			if(ret instanceof Integer){
				id = (Integer)ret;
			}else if(ret instanceof BigDecimal){
				id = ((BigDecimal)ret).intValue();
			}else{
				id = ((Long)ret).intValue();
			}
			List<Map<String, Object>> child = this.getChildren(datas, id);
			if(child.size() > 0){
				this.loopChildren(child, datas, treeface);
			}
			if(child.size() > 0){
				root.put("state", "closed");
			}
			treeface.processEnd(root, child.size() > 0 ? true : false);
			root.put("children", child);
		}
	}
	
	private List<Map<String, Object>> getChildren(List<Map<String, Object>> datas, int id){
		List<Map<String, Object>> roots = new ArrayList<Map<String, Object>>();
		for(int i=0; i<datas.size(); i++){
			Map<String, Object> m = (Map<String, Object>)datas.get(i);
			int pid;
			Object pobj = m.get("pid");
			if(pobj instanceof Integer){
				pid = (Integer)pobj;
			}else if(pobj instanceof Long){
				pid = ((Long)pobj).intValue();
			}else if(pobj instanceof BigDecimal){
				pid = ((BigDecimal)pobj).intValue();
			}else{
				throw new RuntimeException("类型不支持。");
			}
			if(pid == id){
				roots.add(m);
			}
		}
		return roots;
	}
	
	/**
	 * 给目录上添加报表
	 */
	public void addReport2Cata(List<Map<String, Object>> catas, List<Map<String, Object>> reports){
		for(int i=0; i<catas.size(); i++){
			Map<String, Object> cata = (Map<String, Object>)catas.get(i);
			cata.put("state", "closed");
			List<Map<String, Object>> rpt = this.findReports(cata, reports);
			List<Map<String, Object>> children = (List<Map<String, Object>>)cata.get("children");
			if(children != null && children.size() > 0){
				addReport2Cata(children, reports);
			}
			//给目录的 children 添加报
			//设置图标
			for(int j=0; j<rpt.size(); j++){
				Map<String, Object> rp = (Map<String, Object>)rpt.get(j);
				rp.put("iconCls", "icon-gears");
				//添加attributes
				Map<String, Object> att = new HashMap<String, Object>();
				att.put("rfile", rp.get("rfile"));
				rp.put("attributes", att);
				rp.remove("crtdate");
			}
			children.addAll(rpt);
		}
		return;
	}
	/**
	private Map<String, Object> copyMap(Map<String, Object> map){
		Map<String, Object> ret = new HashMap<String, Object>();
		Iterator<String> it = map.keySet().iterator();
		while(it.hasNext()){
			String key = it.next();
			if("children".equals(key)){
				continue;
			}
			ret.put(key, map.get(key));
		}
		return ret;
	}
	**/
	private List<Map<String, Object>> findReports(Map<String, Object> cata, List<Map<String, Object>> reports){
		List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>();
		int id;
		Object pobj = cata.get("id");
		if(pobj instanceof Integer){
			id = (Integer)pobj;
		}else if(pobj instanceof Long){
			id = ((Long)pobj).intValue();
		}else if(pobj instanceof BigDecimal){
			id = ((BigDecimal)pobj).intValue();
		}else{
			throw new RuntimeException("类型不支持。");
		}
		for(int i=0; i<reports.size(); i++){
			Map<String, Object> report = (Map<String, Object>)reports.get(i);
			int cataId;
			Object cobj = report.get("cataId");
			if(cobj instanceof Integer){
				cataId = (Integer)cobj;
			}else if(cobj instanceof Long){
				cataId = ((Long)cobj).intValue();
			}else if(cobj instanceof BigDecimal){
				cataId = ((BigDecimal)cobj).intValue();
			}else{
				throw new RuntimeException("类型不支持。");
			}
			if(id == cataId){
				ret.add(report);
			}
		}
		return ret;
	}
}
