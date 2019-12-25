if($ == undefined){
	$ = jQuery;
}
function drill(dimId, compId, pos, val, vdesc, oldDimId, islink){
	var comp = findCompById(compId);
	var dodrill = function(){
		var dims = null;
		if(pos == 'row'){
			dims = comp.rows;
		}else{
			dims = comp.cols;
		}
		
		//判断是否有联动
		if(comp.complink && islink){
			//联动图形
			var chartComp = findCompById(comp.complink);
			if(chartComp != null && isSameDimsInDrill(comp, chartComp)){
				drillingChart(dimId, chartComp.id,  pos, val, vdesc, oldDimId, false); //存在相同维度才能联动
			}
		}
		
		//设置当前维度值为过滤条件
		var oldDim = null;
		var oldDimIndex = 0;
		for(i=0; i<dims.length;i++){
			if(dims[i].id == oldDimId){
				oldDimIndex = i;
				dims[i].vals = val;   //只展开当前，设置值筛选
				if(dims[i].type == 'month'){
					dims[i].filtertype = 1; //按区间筛选
					dims[i].startmt = val;
					dims[i].endmt = val;
					delete dims[i].vals;
					oldDim = dims[i];
				}
				if(dims[i].type == 'day'){
					var dateformat = dims[i].dateformat;
					var tmpval = val;;
					//if(dateformat.length == 8){
					//	tmpval = val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8);
					//}else{
					//}
					dims[i].filtertype = 1; //按区间筛选
					dims[i].startdt = tmpval;
					dims[i].enddt = dims[i].startdt;
					delete dims[i].vals;
					oldDim = dims[i];
				}
				
			}
		}
		var json = null;
		for(j=0;j<comp.dims.length; j++){
			if(comp.dims[j].dim_id == dimId){
				json = comp.dims[j];
				break;
			}
		}
		var ooo = {"id":json.dim_id, "dimdesc" : json.dim_desc, "type":json.dim_type, "colname":json.col_name,"alias":json.alias,"cubeId":json.cubeId,"iscas":'', tname:json.tname, "tableName":(json.dim_tname == null ? "" : json.dim_tname), "tableColKey":(json.tableColKey == null ? "" : json.tableColKey),"tableColName":(json.tableColName == null ? "" : json.tableColName), "dimord":(json.dim_ord==null?"":json.dim_ord), "dim_name":json.dim_name, "iscas":(json.iscas == null ? "" : json.iscas), "grouptype":json.grouptype, "valType":json.valType,calc:json.calc, "ordcol":(json.ordcol == null ? "": json.ordcol), "dateformat":(json.dateformat==null?"":json.dateformat)};
		dims.splice(oldDimIndex + 1, 0, ooo);
		curTmpInfo.isupdate = true;
		tableView(comp, comp.id);
	}
	//判断是否缓存有维度
	if(!comp.dims){
		$.ajax({
			async:false,
			type:"POST",
			url: curTmpInfo.qdimUrl ? curTmpInfo.qdimUrl :"queryDims.action",
			data:{"cubeId": comp.cubeId},
			dataType:"json",
			success:function(resp){
				comp.dims = resp;
				dodrill();
			}
		});
	}else{
		dodrill();
	}
}
/**
展开维度，把维度从上级层次展开到下级层次
**/
function openTheDim(compId, pos, val, vdesc, oldDimId){
	var comp = findCompById(compId);
	var oldDim = findDimById(oldDimId, pos=="row"?comp.rows:comp.cols);
	if(oldDim.grouptype == null){
		msginfo("维度无下级层次。", "error");
		return;
	}
	var opts = function(resp){
		var deal = 0;
		for(i=0; i<resp.length; i++){
			if(resp[i].dim_id == oldDimId){
				//取当前维的下一级
				if(i < resp.length - 1 && resp[i + 1].grouptype == resp[i].grouptype){
					var t = resp[i + 1];
					//判断下级维是否存在
					if(dimExist(t.dim_id, comp.cols) || dimExist(t.dim_id, comp.rows)){
						deal = 2;
						break
					}
					drill(t.dim_id, compId, pos, val, vdesc, oldDimId, true);
					deal = 1;
					break;
				}
			}
		}
		if(deal == 0){
			msginfo("维度无下级层次。", "error");
		}else if(deal == 2){
			msginfo("维度下级层次已经展开。", "error");
		}
	};
	if(!comp.dims){  //获取组件的维度
		
		$.ajax({
			async:false,
			type:"POST",
			url: curTmpInfo.qdimUrl ? curTmpInfo.qdimUrl :"queryDims.action",
			data:{"cubeId": comp.cubeId},
			dataType:"json",
			success:function(resp){
				comp.dims = resp;
				opts(comp.dims);
			}
		});
		
	}else{
		opts(comp.dims);
	}
}
function drillDim(compId, ts, pos, val, vdesc, oldDimId){
	//查询度量已有维
	var comp = findCompById(compId);
	var offset = $(ts).offset();
	var oldDim = findDimById(oldDimId, pos=="row"?comp.rows:comp.cols);
	var opts = function(resp){
		$("#drillmenu").menu("destroy");
		var str = "<div id=\"drillmenu\" style=\"width:150px\">";
		var cnt = 0;
		var ignoreGroup = []; 
		var groupExist = function(ignoreGroup, group){
			var r = false;
			for(k=0; k<ignoreGroup.length; k++){
				if(ignoreGroup[k] == group){
					r = true;
				}
			}
			return r;
		};
		var findGroupChild = function(grouptype){
			var dimret = [];
			for(j=0; j<resp.length; j++){
				if(resp[j].grouptype == grouptype){
					dimret.push(resp[j]);
				}
			}
			return dimret;
		};
		for(i=0; i<resp.length; i++){
			//忽略已存在的维
			if(dimExist(resp[i].dim_id, comp.cols) || dimExist(resp[i].dim_id, comp.rows)){
				continue;
			}
			
			if(resp[i].grouptype == '' || resp[i].grouptype == null){ //无分组的，直接显示维度
					var dim_id  = resp[i].dim_id;
					str = str +  "<div onclick=\"drill("+dim_id+", "+comp.id+", '"+pos+"', '"+val+"', '"+vdesc+"', '"+oldDimId+"', true)\"><span style=\"color:#ccc\">下钻</span>" + resp[i].dim_desc+"</div>"
					cnt = cnt + 1;	
				}else{ //有分组，显示分组, 对于分组，如果下级分组已选择，不能再选择上级分组
					if(!groupExist(ignoreGroup, resp[i].grouptype)){
						var groups = "<div><span style=\"color:#ccc\">下钻</span><span>" + resp[i].groupname+"</span><div style=\"width:150px;\">"
						ignoreGroup.push(resp[i].grouptype);
						//查询分组的内容
						var lsdim = findGroupChild(resp[i].grouptype);
						var ss = "";
						var ccnt = 0;
						for(kl = 0; kl<lsdim.length; kl++){
							var tmp = lsdim[kl];
							var bcz = !dimExist(tmp.dim_id, comp.cols) && !dimExist(tmp.dim_id, comp.rows);
							if(bcz){
								ss = ss +  "<div onclick=\"drill("+tmp.dim_id+", "+comp.id+", '"+pos+"', '"+val+"', '"+vdesc+"', '"+oldDimId+"', true)\"><span style=\"color:#ccc\">下钻</span>" + tmp.dim_desc+"</div>"
								ccnt = ccnt + 1;	
							}else{
								ss = "";
								ccnt = 0;
							}
						}
						groups = groups + ss + "</div></div>";
						if(ccnt == 0){
							groups = "";
						}
						str = str + groups;
						cnt = cnt + ccnt;
					}
				}
		}
		str = str + "</div>";
		if(cnt == 0){
			msginfo("数据已钻透。", "error");
			return;
		}
		$(str).appendTo("body");
		$("#drillmenu").menu({});
		$("#drillmenu").menu("show", {left:offset.left, top:offset.top + 20});
	}
	if(comp.dims){
		opts(comp.dims);
	}else{
		$.ajax({
			async:false,
			type:"POST",
			url: curTmpInfo.qdimUrl ? curTmpInfo.qdimUrl :"queryDims.action",
			data:{"cubeId": comp.cubeId},
			dataType:"json",
			success:function(resp){
				comp.dims = resp;
				opts(comp.dims);
			}
		});
	}
}
//上卷维度
function goupDim(compId, ts, pos, dimId, islink){
	var dims = null;
	var comp = findCompById(compId);
	if(pos == 'row'){
		dims = comp.rows;
	}else{
		dims = comp.cols;
	}
	//判断是否有组件联动
	if(comp.complink && islink){
		var chartComp = findCompById(comp.complink);
		if(chartComp != null && isSameDimsInDrill(comp, chartComp)){ //必须维度相同才能联动。
			chartGoupDim(chartComp.id, dimId, pos, false);
		}
	}
	//清除过滤条件
	//删除该维度以后的维度
	var idx = 0;
	for(i=0; i<dims.length;i++){
		if(dims[i].id == dimId){
			dims[i].vals = "";
			if(dims[i].type == 'day'){
				delete dims[i].startdt;
				delete dims[i].enddt;
			}
			if(dims[i].type == 'month'){
				delete dims[i].startmt;
				delete dims[i].endmt;
			}
			idx = i;
			break;
		}
	}
	dims.splice(idx + 1, dims.length - 1);
	
	//如果删除维度后无时间维度，并且度量中含有计算度量，需要清除计算度量内容
	if(!isExistDateDim(comp, 'table')){
		for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
			delete comp.kpiJson[j].compute;
		}
	}
	//如果有参数,并且参数是时间维度，如果参数时间类型表格中没有，移除计算度量
	if(!paramsamedimdate(comp)){
		for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
			delete comp.kpiJson[j].compute;
		}
	}
	
	curTmpInfo.isupdate = true;
	tableView(comp, comp.id);
}
//图形钻取
function drillChart(xvalue, xvalueDesc,yvalue, svalue, pos, compId, oldDimId){
	//查询度量已有维
	var comp = findCompById(compId);
	var offset = pos;
	var deployDim = function(resp){
		var oldDim = comp.chartJson.xcol;
		if(oldDim.grouptype == null){
			msginfo("维度无下级层次。", "error");
			return;
		}
		var deal = 0;
		for(i=0; i<resp.length; i++){
			if(resp[i].dim_id == oldDimId){
				//取当前维的下一级
				if(i < resp.length - 1 && resp[i + 1].grouptype == resp[i].grouptype){
					var t = resp[i + 1];
					drillingChart(t.dim_id, compId, 'row', xvalue, xvalueDesc, oldDimId, true);
					deal = 1;
					break;
				}
			}
		}
		if(deal == 0){
			msginfo("维度无下级层次。", "error");
		}else if(deal == 2){
			msginfo("维度下级层次已经展开。", "error");
		}
	}
	var opts = function(resp){
		$("#drillmenu").menu("destroy");
		var str = "<div id=\"drillmenu\" style=\"width:150px\">";
		var cnt = 0;
		var ignoreGroup = []; 
		var groupExist = function(ignoreGroup, group){
			var r = false;
			for(k=0; k<ignoreGroup.length; k++){
				if(ignoreGroup[k] == group){
					r = true;
				}
			}
			return r;
		};
		var findGroupChild = function(grouptype){
			var dimret = [];
			for(j=0; j<resp.length; j++){
				if(resp[j].grouptype == grouptype){
					dimret.push(resp[j]);
				}
			}
			return dimret;
		};
		for(i=0; i<resp.length; i++){
			//忽略用户已经选择的维度
			if(dimExist(resp[i].dim_id, comp.chartJson.params) ||  (comp.chartJson.xcol && resp[i].dim_id == comp.chartJson.xcol.id) || (comp.chartJson.scol && resp[i].dim_id == comp.chartJson.scol.id)){
				continue;
			}
			if(resp[i].grouptype == '' || resp[i].grouptype == null){ //无分组的，直接显示维度
				var dim_id  = resp[i].dim_id;
				str = str +  "<div onclick=\"drillingChart("+dim_id+", "+comp.id+", 'row', '"+xvalue+"', '"+xvalueDesc+"', '"+oldDimId+"', true)\"><span style=\"color:#ccc\">下钻</span>" + resp[i].dim_desc+"</div>"
				cnt = cnt + 1;	
			}else{ //有分组，显示分组, 对于分组，如果下级分组已选择，不能再选择上级分组
				if(!groupExist(ignoreGroup, resp[i].grouptype)){
					var groups = "<div><span style=\"color:#ccc\">下钻</span><span>" + resp[i].groupname+"</span><div style=\"width:150px;\">"
					ignoreGroup.push(resp[i].grouptype);
					//查询分组的内容
					var lsdim = findGroupChild(resp[i].grouptype);
					var ss = "";
					var ccnt = 0;
					for(kl = 0; kl<lsdim.length; kl++){
						var tmp = lsdim[kl];
						var cz = dimExist(tmp.dim_id, comp.chartJson.params) ||  (comp.chartJson.xcol && tmp.dim_id == comp.chartJson.xcol.id) || (comp.chartJson.scol && tmp.dim_id == comp.chartJson.scol.id);
						if(!cz){
							ss = ss +  "<div onclick=\"drillingChart("+tmp.dim_id+", "+comp.id+", 'row', '"+xvalue+"', '"+xvalueDesc+"', '"+oldDimId+"', true)\"><span style=\"color:#ccc\">下钻</span>" + tmp.dim_desc+"</div>"
							ccnt = ccnt + 1;	
						}else{
							ss = "";
							ccnt = 0;
						}
					}
					groups = groups + ss + "</div></div>";
					if(ccnt == 0){
						groups = "";
					}
					str = str + groups;
					cnt = cnt + ccnt;
				}
			}
			
		}
		str = str + "</div>";
		if(cnt == 0){
			msginfo("数据已钻透。", "error");
			return;
		}
		$(str).appendTo("body");
		$("#drillmenu").menu({});
		$("#drillmenu").menu("show", {left:offset.left, top:offset.top + 20});
	}
	if(comp.dims){
		opts(comp.dims);
	}else{
		
		$.ajax({
			async:false,
			type:"POST",
			url: curTmpInfo.qdimUrl ? curTmpInfo.qdimUrl :"queryDims.action",
			data:{"cubeId": comp.cubeId},
			dataType:"json",
			success:function(resp){
				comp.dims = resp;
				opts(comp.dims);
			}
		});
		
	}
}
//开始钻取图形
function drillingChart(id, compId, pos, xvalue, xvalueDesc, oldDimId, islink){
	var comp = findCompById(compId);
	//判断是否有组件的dims,如果没有就去获取
	if(!comp.dims){
		$.ajax({
			async:false,
			type:"POST",
			url:curTmpInfo.qdimUrl ? curTmpInfo.qdimUrl :"queryDims.action",
			data:{"cubeId": comp.cubeId},
			dataType:"json",
			success:function(resp){
				comp.dims = resp;
			}
		});
	}

	//设置当前维度值为过滤条件
	if(pos == "row"){
		comp.chartJson.xcol.vals = xvalue + "";
		comp.chartJson.xcol.valDesc = xvalueDesc;
		comp.chartJson.xcol.pos = "row";
	}else{
		comp.chartJson.scol.vals = xvalue + "";
		comp.chartJson.scol.valDesc = xvalueDesc;
		comp.chartJson.scol.pos = "col";
	}
	
	//判断是否联动表格
	if(comp.complink && islink){
		var tableComp = findCompById(comp.complink);
		if(tableComp != null && isSameDimsInDrill(tableComp, comp)){ //必须维度相同才能联动。
			drill(id, tableComp.id, 'row', xvalue, xvalueDesc, oldDimId, false);
		}
	}
	
	var dim = pos == "row" ? comp.chartJson.xcol : comp.chartJson.scol;
	dim.filtertype = 2; // 按值钻取
	if(dim.type == 'month'){
		delete dim.startmt;
		delete dim.endmt;
	}
	if(dim.type == 'day'){
		delete dim.startdt;
		delete dim.enddt;
	}
	//把当前维放入params
	//如果当前维度是合计，不用加入
	if(xvalue == '合计' && xvalueDesc == '合计'){
	}else{
		comp.chartJson.params.push(pos=="row"?comp.chartJson.xcol:comp.chartJson.scol);
	}
	//更新x轴
	var json = null;
	for(j=0;j<comp.dims.length; j++){
		if(comp.dims[j].dim_id == id){
			json = comp.dims[j];
			break;
		}
	}
	var nxcol = {"id":json.dim_id, "dimdesc" : json.dim_desc, "type":json.dim_type, "colname":json.col_name,"alias":json.alias,"cubeId":json.cubeId,tname:json.tname,"iscas":'', "tableName":(json.dim_tname == null ? "" : json.dim_tname), "tableColKey":(json.tableColKey == null ? "" : json.tableColKey),"tableColName":(json.tableColName == null ? "" : json.tableColName), "dimord":json.dim_ord, "dim_name":json.dim_name, "iscas":(json.iscas == null ? "" : json.iscas),"grouptype":json.grouptype,"valType":json.valType, "ordcol":(json.ordcol==null?"":json.ordcol), "dateformat":(json.dateformat==null?"":json.dateformat),calc:json.calc};
	if(pos == "row"){
		comp.chartJson.xcol = nxcol;
	}else{
		comp.chartJson.scol = nxcol;
	}
	//回写X轴的值
	var node = nxcol;
	$("#T" + comp.id + (pos=="row"?" #xcol":" #scol")).html("<span class=\"charttxt\">" + node.dimdesc + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.id+","+(pos=="row"?"'xcol'":"'scol'")+", '"+node.dimdesc+"')\"></span>");
	curTmpInfo.isupdate = true;
	chartview(comp, comp.id);
}
//图形上卷
function chartGoupDim(compId,dimId, pos, islink){
	var comp = findCompById(compId);
	var dims = comp.chartJson.params;
	//判断是否有组件联动
	if(comp.complink && islink){
		var tableComp = findCompById(comp.complink);
		if(tableComp != null && isSameDimsInDrill(tableComp, comp)){ //必须维度相同才能联动。
			goupDim(tableComp.id, null, pos, dimId, false);
		}
	}
	//清除过滤条件
	//删除该维度以后的维度
	var idx = 0;
	var xcol = null;
	for(i=0; i<dims.length;i++){
		if(dims[i].id == dimId){
			dims[i].vals = "";
			dims[i].valDesc = "";
			delete dims[i].filtertype;
			idx = i;
			xcol = dims[i];
			break;
		}
	}
	if(pos == "row"){
		comp.chartJson.xcol = xcol;
	}else{
		comp.chartJson.scol = xcol;
	}
	dims.splice(idx, dims.length);
	
	//回写X轴的值
	var node = xcol;
	$("#T" + comp.id + (pos=="row"?" #xcol":" #scol")).html("<span class=\"charttxt\">" + node.dimdesc + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.id+","+(pos=="row"?"'xcol'":"'scol'")+", '"+node.dimdesc+"')\"></span>");
	
	curTmpInfo.isupdate = true;
	chartview(comp, comp.id);
}
/**
判断图形和表格是否有相同的维度，如果维度不同，不能联动
**/
function isSameDimsInDrill(table, chart){
	var tj = table;
	var cj = chart.chartJson;
	var tcnt = tj.cols.length + tj.rows.length;
	var ccnt = (cj.params?cj.params.length:0) + ($.isEmptyObject(cj.xcol)?0:1) + ($.isEmptyObject(cj.scol)?0:1);
	if(tcnt != ccnt){
		return false;
	}
	var ret = true;
	for(i=0; cj.params && i<cj.params.length; i++){
		if(!dimExist(cj.params[i].id, tj.cols) && !dimExist(cj.params[i].id, tj.rows)){
			return false;
		}
	}
	if(!$.isEmptyObject(cj.xcol)){
		if(!dimExist(cj.xcol.id, tj.cols) && !dimExist(cj.xcol.id, tj.rows)){
			return false;
		}
	}
	if(!$.isEmptyObject(cj.scol)){
		if(!dimExist(cj.scol.id, tj.cols) && !dimExist(cj.scol.id, tj.rows)){
			return false;
		}
	}
	return ret;
}