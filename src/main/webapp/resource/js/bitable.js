if($ == undefined){
	$ = jQuery;
}
//创建交叉表
function crtCrossTable(){
	var ret = "<table class='d_table'><tr><td class='blank'>"
		+ "</td><td>"+
		"<div id='d_colDims' class='tabhelpr'>将维度拖到此处作为列标签</div>"+"</td></tr><tr><td>"+
		"<div id='d_rowDims' class='tabhelpr'>将维度拖到此处<br>作为行标签</div>"+"</td><td>"+
		"<div id='d_kpi' class='tabhelpr'>将度量拖到此处<br>查询数据</div>"+"</td></tr></table>";
	return ret;
}
/**
注册行列维度、度量区域的拖拽事件
对应表格组件的事件
**/
function initDropDiv(id){
	var ischg = false;
	$("#T" + id + " #d_colDims, #T" + id +" #d_rowDims, #T"+id+" #d_kpi").droppable({
		accept:"ul.tableTreeCss .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			
			
			//对维度拖拽设置图标
			if(tp == 1 && ($(this).attr("id") == "d_colDims" || $(this).attr("id") == "d_rowDims")){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				
				if($(this).attr("id") == "d_colDims"){
					$("#T"+id+" #d_colDims").css("border", "1px solid #ff0000");
				}
				if($(this).attr("id") == "d_rowDims"){
					$("#T"+id+" #d_rowDims").css("border", "1px solid #ff0000");
				}
				
				ischg = true;
			}else{
				ischg = false;
			}
				
			//对度量拖拽设置图标
			if(tp == 2 && $(this).attr("id") == "d_kpi"){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				
				$("#T"+id+" #d_kpi").css("border", "1px solid #ff0000");
				
				ischg = false;
			}
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			
			if($(this).attr("id") == 'd_kpi' && ischg == true){
			}else{
				$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
				
				$("#T"+id+" #" + $(this).attr("id")).css("border", "none");
			}
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var id = $(this).parents(".comp_table").attr("id").replace("T","");
			var json = findCompById(Number(id));
			
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//清除边框颜色
			$("#T"+id+" #" + $(this).attr("id")).css("border", "none");
			
			//获取TREE
			var node = $("#datasettree").tree("getNode", source);
			
			//判断拖入的维度及度量是否和以前维度及度量在同一个表。
			if(json.cubeId != undefined){
				if(json.cubeId != node.attributes.cubeId){
					msginfo("您拖入的"+ (node.attributes.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
					return;
				}
			}
			
			//判断拖入的度量是否是（同比、环比），如果是，需要判断当前维度是否有date类型
			/**  放入度量计算菜单判断
			if(node.attributes.calc_kpi == 1){
				if(!isExistDateDim(json, 'table')){
					msginfo("您拖入的度量需要表格中先有时间类型的维度(年/季度/月/日)。");
					return;
				}
			}
			**/
			
			json.cubeId = node.attributes.cubeId;
			json.dsid = node.attributes.dsid;
			json.dsetId = node.attributes.dsetId;
			
			if(json.kpiJson == undefined){
				json.kpiJson = [];
			};
			if(json.cols == undefined){
				json.cols = [];
			}
			if(json.rows == undefined){
				json.rows = [];
			}
			//写度量
			if(node.attributes.col_type == 2 && $(this).attr("id") == "d_kpi"){
				//如果度量存在就忽略
				if(!kpiExist(node.attributes.col_id, json.kpiJson)){
					json.kpiJson.push({"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate,"calc":node.attributes.calc});
				}else{
					msginfo("度量已经存在。");
					return;
				}
				curTmpInfo.isupdate = true;
				tableView(json, Number(id));
			}
			//写维度
			if(node.attributes.col_type == 1){
				//写col维度
				if($(this).attr("id") == "d_colDims"){
					if(dimExist(node.attributes.col_id, json.cols) || dimExist(node.attributes.col_id, json.rows)){
						msginfo("维度已经存在。");
						return;
					}
					//如果维度有分组，分组必须相同
					var group = node.attributes.grouptype;
					if(group != null && findGroup(json.rows, group)){
						msginfo("拖放失败，同一分组的维度必须在同一行/列标签。");
						return;
					}
					json.cols.push({"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "grouptype":node.attributes.grouptype,"valType":node.attributes.valType,ordcol:node.attributes.ordcol,dateformat:node.attributes.dateformat,"calc":node.attributes.calc});
					curTmpInfo.isupdate = true;
					tableView(json, Number(id));
				}
				//写row维度
				if($(this).attr("id") == "d_rowDims"){
					if(dimExist(node.attributes.col_id, json.rows) || dimExist(node.attributes.col_id, json.cols)){
						msginfo("维度已经存在。");
						return;
					}
					//如果维度有分组，分组必须相同
					var group = node.attributes.grouptype;
					if(group != null && findGroup(json.cols, group)){
						msginfo("拖放失败，同一分组的维度必须在同一行/列标签。");
						return;
					}
					json.rows.push({"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord,"grouptype":node.attributes.grouptype,"valType":node.attributes.valType,ordcol:node.attributes.ordcol,dateformat:node.attributes.dateformat,"calc":node.attributes.calc});
					curTmpInfo.isupdate = true;
					tableView(json, Number(id));
				}
			}
		}
	});
	//注册固定表头事件
	fireTableScroll(id);
}
function fireTableScroll(id){
	$("#T"+id+" #d_kpi").scroll(function(){
		var top = $(this).scrollTop();
		$("#d_rowDims table").css("margin-top", "-"+top+"px");
		//$("#T"+id+" #d_rowDims").scrollTop(top);
		var left = $(this).scrollLeft();
		$("#T"+id+" #d_colDims table").css("margin-left", "-"+left+"px");
	});
	var comp = findCompById(id);
	var rowLvl = comp.rows?comp.rows.length:1;
	if(rowLvl == 0){
		rowLvl = 1;
	}
	var w = $("#optarea").width(), h = $(window).height();
	h = h - 300;
	w = w - (127 * rowLvl);
	if(w <0){
		w = 200;
	}
	$("#T"+id+" #d_rowDims").height(h);
	$("#T"+id+" #d_colDims").width(w);
	$("#T"+id+" #d_kpi").width(w).height(h);
}
//查找维度分组
function findGroup(dims, group, curNode){
	var ret = false;
	if(!dims || dims == null){
		return ret;
	}
	for(m=0; m<dims.length; m++){
		if(curNode && curNode == dims[m]){  //curNode存在表示忽略当前节点
			continue; 
		}
		if(dims[m].grouptype == group){
			ret = true;
			break;
		}
	}
	return ret;
}
/**
判断是否有时间参数，如果有，必须表格组件中也具有相同的参数
**/
function paramsamedimdate(comp){
	var same = true;
	var exist = function(input){
		var ret = false;
		for(var i=0; comp.cols&&i<comp.cols.length; i++){
			if(comp.cols[i].type == input){
				ret = true;
				break;
			}
		}
		for(var i=0; comp.rows&&i<comp.rows.length; i++){
			if(comp.rows[i].type == input){
				ret = true;
				break;
			}
		}
		return ret;
	}
	var params = pageInfo.params;
	for(i=0; params&&i<params.length; i++){
		if(params[i].type == "year" || params[i].type == "quarter" || params[i].type == "month" || params[i].type == "day"){
			if(!exist(params[i].type)){
				same = false;
				break;
			}
		}
	}
	return same;
}
function kpicompute(tp){
	//设置计算类型， 1表示不能同时存在，2表示可以同时存在。
	var tpobj = {"zb":1,"sxpm":1, "jxpm": 1, "ydpj":1, "sq":2, "tq":2, "zje":2, "hb":2, "tb":2}
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var kpi = findKpiById(kpiId, comp.kpiJson);
	if(tp == "zb"){
		kpi.compute = "zb";
	}else if(tp == "sxpm"){
		kpi.compute = "sxpm";
	}else if(tp == "jxpm"){
		kpi.compute = "jxpm";
	}else{
		if(!isExistDateDim(comp, 'table')){
			msginfo("当前度量计算需要表格中先有时间类型的维度(年/季度/月/日)。", "error");
			return;
		}		
		//如果有参数,并且参数是时间维度，需要判断表格中是否有同样的参数维度，如果没有提示用户添加
		if(!paramsamedimdate(comp)){
			msginfo("度量计算时，需要表格中具有和参数相同的维度。", "error");
			return;
		}
		//先判断已经存在的，如果是时间偏移计算就追加，或者替换.
		var exist = kpi.compute;
		if(!exist || exist == ""){
			kpi.compute = tp;
		}else{
			var js = exist.split(",");
			if(tpobj[js[0]] == 1){
				kpi.compute = tp;
			}else{
				var cz = false;   //不存在才添加
				for(j=0; j<js.length; j++){
					if(js[j] == tp){
						cz = true;
						break;
					}
				}
				if(!cz){
					kpi.compute = exist+","+tp;
				}
			}
		}
	}
	tableView(comp, compId);
}
function delExtKpi(ts, kpiId, compute){
	var compId = $(ts).parents(".comp_table").attr("id").replace("T", "");
	var comp = findCompById(Number(compId));
	//设置度量排序的标识
	var kpi = findKpiById(kpiId, comp.kpiJson);
	var js = kpi.compute.split(",");
	if(js.length == 1){
		delete kpi.compute;
	}else{
		//剔除需要删除的计算度量
		var ret = "";
		for(i=0; i<js.length; i++){
			if(js[i] != compute){
				ret = ret + js[i] + ",";
			}
		}
		kpi.compute = ret.substring(0, ret.length  - 1);
	}
	tableView(comp, compId);
}
function tableView(table, compId){
	if(table.kpiJson == undefined){
		return;
	}	//如果没有度量，维度等内容，返回界面到初始状态
	if(table.kpiJson.length == 0 && table.cols.length == 0 && table.rows.length == 0){
		$("#T" + compId + " div.ctx").html(crtCrossTable());
		initDropDiv(compId);
		return;
	}
	
	var json = {cols:table.cols,rows:table.rows,kpiJson:table.kpiJson,dsid:table.dsid, dsetId:table.dsetId, "compId":compId, "params":pageInfo.params};
	__showLoading();
	
	$.ajax({
	   type: "POST",
	   url: "TableView.action",
	   dataType:"html",
	   contentType : "application/json",
	   data: JSON.stringify(json),
	   success: function(resp){
		 __hideLoading();
		  $("#T" + compId + " div.ctx").html(resp);
		   
		 //重新注册拖放事件(从度量拖入的事件)
		  initDropDiv(compId);
	   },
	   error:function(resp){
			__hideLoading();
		   $.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
}
//指标预警
function kpiwarning(){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var kpi = findKpiById(kpiId, comp.kpiJson);
	var warn = kpi.warning;
	var str = "<div style='margin:10px;'><span class=\"inputtext\">图片样式：</span><select id=\"wctype\" class=\"inputform2\" style=\"width:90px;\"><option value=\"1\" "+(warn&&warn.pictype=="1"?"selected":"")+">交通灯</option><option value=\"2\" "+(warn&&warn.pictype=="2"?"selected":"")+">箭头</option></select> <div class=\"checkbox checkbox-inline\"><input type=\"checkbox\" value=\"y\" id=\"fztp\" name=\"fztp\" "+(warn&&warn.reverse=="y"?"checked":"")+"><label for=\"fztp\">反转图片</label></div><br/>";
	str = str + "<span id=\"w1\" class=\""+(warn?warn.pic1:"warning6")+"\"></span> <span class=\"inputtext\">当前值</span> <select id=\"logic1\" name=\"logic1\" class=\"inputform2\" style=\"width:50px;\"><option value=\">=\" "+(warn&&warn.logic1==">="?"selected":"")+">&gt;=</option><option value=\">\" "+(warn&&warn.logic1==">"?"selected":"")+">&gt;</option></select> <input type=\"text\" id=\"val1\" name=\"val1\" idx=\"1\" value=\""+(warn?warn.val1:"")+"\"> <br/><span id=\"w2\" class=\""+(warn?warn.pic2:"warning5")+"\"></span> <span class=\"inputtext\">当前值 &lt; <span id=\"and1\">"+(warn?warn.val1:"X")+"</span> 且 </span> <select id=\"logic2\" name=\"logic2\" class=\"inputform2\" style=\"width:50px;\"><option value=\">=\" "+(warn&&warn.logic2==">="?"selected":"")+">&gt;=</option><option value=\">\" "+(warn&&warn.logic2=="="?"selected":"")+">&gt;</option></select> <input type=\"text\" name=\"val2\" idx=\"2\" id=\"val2\" value=\""+(warn?warn.val2:"")+"\"><br/> <span id=\"w3\" class=\""+(warn?warn.pic3:"warning4")+"\"></span> <span class=\"inputtext\"> 当前值 &lt;  <span id=\"and2\">"+(warn?warn.val2:"X")+"</span></span> <br/><div class=\"checkbox checkbox-info\"><input type=\"checkbox\" value=\"y\" id=\"clear\" name=\"clear\" ><label for=\"clear\">清除预警信息</label></div></div>";
	$('#pdailog').dialog({
		title: '指标预警',
		width: 360,
		height: 240,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: str,
		buttons:[{
			text:'确定',
			iconCls:'icon-ok',
			handler:function(){
				var pictype = $("#pdailog #wctype").val();
				var reverse = $("#pdailog input[name=\"fztp\"]:checked").val();
				if(!reverse){
					reverse = "n";
				}
				var logic1 = $("#pdailog #logic1").val();
				var val1 = $("#pdailog #val1").val();
				var logic2 = $("#pdailog #logic2").val();
				var val2 = $("#pdailog #val2").val();
				var pic1 = $("#pdailog #w1").attr("class");
				var pic2 = $("#pdailog #w2").attr("class");
				var pic3 = $("#pdailog #w3").attr("class");
				if(val1 == '' || val2 == ''){
					delete kpi.warning;
					tableView(comp, compId);
					$('#pdailog').dialog('close');
					return;
				}
				kpi.warning = {pictype:pictype,reverse:reverse,logic1:logic1,val1:val1,logic2:logic2,val2:val2,pic1:pic1,pic2:pic2,pic3:pic3}
				tableView(comp, compId);
				$('#pdailog').dialog('close');
			}
		},{
			text:'取消',
			iconCls:"icon-cancel",
			handler:function(){
				$('#pdailog').dialog('close');
			}
		}]
	});
	$("#pdailog #val1,#pdailog #val2").numberbox({width:100,height:28, onChange:function(a, b){
			var idx = $(this).attr("idx");
			$("#pdailog #and" + idx).text(a);
		}
	});
	/**
	$("#pdailog #val2").numberbox("onChange", function(){
		$("#pdailog #and2").text($("#pdailog #val2").numberbox("getValue"));
	});
	**/
	$("#pdailog #wctype").change(function(){
		if($(this).val() == 1){
			$("#pdailog #w1").attr("class", "warning6");
			$("#pdailog #w2").attr("class", "warning5");
			$("#pdailog #w3").attr("class", "warning4");
		}else if($(this).val() == 2){
			$("#pdailog #w1").attr("class", "warning3");
			$("#pdailog #w2").attr("class", "warning2");
			$("#pdailog #w3").attr("class", "warning1");
		}
	});
	//反转图片
	$("#pdailog #fztp").change(function(){
		if(this.checked){
			if($("#pdailog #wctype").val() == 1){
				$("#pdailog #w1").attr("class", "warning4");
				$("#pdailog #w2").attr("class", "warning5");
				$("#pdailog #w3").attr("class", "warning6");
			}else if($("#pdailog #wctype").val() == 2){
				$("#pdailog #w1").attr("class", "warning1");
				$("#pdailog #w2").attr("class", "warning2");
				$("#pdailog #w3").attr("class", "warning3");
			}
		}else{
			if($("#pdailog #wctype").val() == 1){
				$("#pdailog #w1").attr("class", "warning6");
				$("#pdailog #w2").attr("class", "warning5");
				$("#pdailog #w3").attr("class", "warning4");
			}else if($("#pdailog #wctype").val() == 2){
				$("#pdailog #w1").attr("class", "warning3");
				$("#pdailog #w2").attr("class", "warning2");
				$("#pdailog #w3").attr("class", "warning1");
			}
		}
	});
	$("#pdailog #clear").change(function(){
		if(this.checked){
			$("#pdailog #val1").numberbox("clear");
			$("#pdailog #val2").numberbox("clear");
		}
	});
}
function kpiFilter(tp){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var kpi = findKpiById(kpiId, comp.kpiJson);
	var ft = kpi.filter;
	var unitStr = "";
	if(kpi.rate == 1000){
		unitStr = "千";
	}else if(kpi.rate == 10000){
		unitStr = "万";
	}else if(kpi.rate == 1000000){
		unitStr = "百万";
	}else if(kpi.rate == 100000000){
		unitStr = "亿";
	}
	var ctx = "<div style='margin:5px; line-height:25px;'><span class=\"inputtext\">"+kpi.kpi_name+"：</span> <select id=\"ftype\" class=\"inputform\" style=\"width:100px;\"><option value=\"\"></option><option value=\">\" "+(ft&&ft.filterType==">"?"selected":"")+">大于</option><option value=\"<\" "+(ft&&ft.filterType=="<"?"selected":"")+">小于</option><option value=\"=\" "+(ft&&ft.filterType=="="?"selected":"")+">等于</option><option value=\"between\" "+(ft&&ft.filterType=="between"?"selected":"")+">区间</option></select> <br/>  <span class=\"inputtext\"> </span> <input type=\"text\" style=\"\" id=\"startval\" size=\"5\" value=\""+(ft?ft.val1:"")+"\"><span id=\"endvalspan\" style=\"display:"+(ft&&ft.filterType=='between'?"inline":"none")+"\"> - <input class=\"inputform\" type=\"text\" id=\"endval\" size=\"5\" value=\""+(ft?ft.val2:"")+"\"></span>" + unitStr+kpi.unit+"<br/><button id=\"clear\" class=\"btn btn-success btn-xs\">清除筛选</button></div>";
	$('#pdailog').dialog({
		title: '度量筛选',
		width: 350,
		height: 220,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						var ft = $("#pdailog #ftype").val();
						var sv = $("#pdailog #startval").val();
						var ev = $("#pdailog #endval").val();
						if(ft == "" || sv == ""){
							delete kpi.filter;
						}else{
							var filter = {"kpi":kpi.kpi_id,"filterType":ft,"val1":Number(sv),"val2":(ev == ""?0:Number(ev))};
							kpi.filter = filter;
						}
						$('#pdailog').dialog('close');
						curTmpInfo.isupdate = true;
						if(tp == 'table'){
							tableView(comp, compId);
						}else if(tp == 'chart'){
							chartview(comp, compId);
						}
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	$('#pdailog #startval,#pdailog #endval').numberbox({width:100,height:28});
	$("#pdailog #ftype").bind("change", function(){
		var o = $(this);
		if(o.val() == 'between'){
			$("#pdailog #endvalspan").css("display","inline");
		}else{
			$("#pdailog #endvalspan").css("display","none");
		}
	});
	$("#pdailog #clear").bind("click", function(){
		$("#pdailog #ftype").val("");
		$("#pdailog #startval").numberbox("clear");
		$("#pdailog #endval").numberbox("clear");
	});
}
//从表格JSON中删除KPI
function delJsonKpiOrDim(tp){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(Number(compId));
	var pos = curTmpInfo.pos;
	if(tp == 'kpi'){
		var kpis = comp.kpiJson;
		var idx = -1;
		for(var i=0; i<kpis.length; i++){
			if(kpis[i].kpi_id == id){
				idx = i;
				break;
			}
		}
		kpis.splice(idx, 1);
	}
	if(tp == 'dim'){
		var dims = null;
		if(pos == 'col'){
			dims = comp.cols;
		}else{
			dims = comp.rows;
		}
		var idx = -1;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == id){
				idx = i
				break;
			}
		}
		dims.splice(idx, 1);
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
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
}

function setKpiInfo(ts, id){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获取
	curTmpInfo.ckid = id;
	curTmpInfo.compId = $(ts).parents(".comp_table").attr("id");
	var comp = findCompById(Number(curTmpInfo.compId.replace("T", "")));
	//设置度量排序的标识
	var kpi = findKpiById(id, comp.kpiJson);
	if(kpi.sort == 'asc'){
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-ok"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-blank"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-blank"});
	}else if(kpi.sort == 'desc'){
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-blank"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-ok"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-blank"});
	}else{
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-blank"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-blank"});
		$("#dimoptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-ok"});
	}
	
	$("#kpioptmenu").menu("show", {left:offset.left, top:offset.top + 20});
}

function setCdimInfo(ts, id, name){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获
	curTmpInfo.ckid = id;
	curTmpInfo.compId = $(ts).parents(".comp_table").attr("id");
	curTmpInfo.pos = "col";
	curTmpInfo.dimname = name;
	//设置聚合菜单
	var issum = false;
	var comp = findCompById(Number(curTmpInfo.compId.replace("T", "")));
	var dims = comp.cols;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == id){
			if(dims[i].issum == 'y'){
				issum = true;
				
			break;
			}
		}
	}
	if(issum){
		var aggr = $("#dimoptmenu").menu("getItem", $("#m_aggre"));
		$("#dimoptmenu").menu("setText", {target:aggr.target, text:"取消聚合"});
	}else{
		var aggr = $("#dimoptmenu").menu("getItem", $("#m_aggre"));
		$("#dimoptmenu").menu("setText", {target:aggr.target, text:"聚合..."});
	}
	//设置移至行、列的文本
	var aggr = $("#dimoptmenu").menu("getItem", $("#m_moveto"));
	$("#dimoptmenu").menu("setText", {target:aggr.target, text:"移至行维度"});
	
	$("#dimoptmenu").menu("show", {left:offset.left, top:offset.top + 20});
}
function setRdimInfo(ts, id, name){
	var offset = $(ts).offset();
	curTmpInfo.ckid = id;
	curTmpInfo.compId = $(ts).parents(".comp_table").attr("id");
	curTmpInfo.pos = "row";
	curTmpInfo.dimname = name;
	
	//设置聚合菜单
	var issum = false;
	var comp = findCompById(Number(curTmpInfo.compId.replace("T", "")));
	var dims = comp.rows;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == id){
			if(dims[i].issum == 'y'){
				issum = true;
				break;
			}
		}
	}
	if(issum){
		var aggr = $("#dimoptmenu").menu("getItem", $("#m_aggre"));
		$("#dimoptmenu").menu("setText", {target:aggr.target, text:"取消聚合"});
	}else{
		var aggr = $("#dimoptmenu").menu("getItem", $("#m_aggre"));
		$("#dimoptmenu").menu("setText", {target:aggr.target, text:"聚合..."});
	}
	//设置移至行、列的文本
	var aggr = $("#dimoptmenu").menu("getItem", $("#m_moveto"));
	$("#dimoptmenu").menu("setText", {target:aggr.target, text:"移至列维度"});
	
	$("#dimoptmenu").menu("show", {left:offset.left, top:offset.top + 20});
}
function changecolrow(islink){
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var tmp = comp.rows;
	comp.rows = comp.cols;
	comp.cols = tmp;
	tableView(comp, compId);
	//判断是否联动
	if(comp.complink && islink){
		//联动图形
		var chartComp = findCompById(comp.complink);
		if(chartComp != null && isSameDimsInDrill(comp, chartComp)){
			exchangexs(chartComp.id, false); //存在相同维度才能联动
		}
	}
}
function searchDims(val, vls){
	var tab = $('#dimfiltertab').tabs('getSelected');
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	
	var url = 'paramSearch.action?dsid='+comp.dsid+'&id='+dimid+'&cubeId=' + comp.cubeId;
	$.ajax({
		type:"POST",
		url:url,
		data:{keyword:val, vals:vls, t:Math.random()},
		dataType:'HTML',
		success:function(resp){
			$('#dimfiltertab').tabs('update', {
				tab: tab,
				options: {
					content:"<div class=\"dfilter\">"+resp+"</div>"
				}
			});
		}
	});
}
function filterDims(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	var dim_type;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			dim_type = dims[i].type;
			break;
		}
	}
	$('#pdailog').dialog({
		title: name + ' - 维度筛选',
		width: 300,
		height: dim_type=="frd" ? 341 : 310,
		closed: false,
		cache: false,
		modal: true,
		content:'<div id="div_dimfilter"><div class="panel-loading">Loading...</div></div>',
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						//获取DIM
						var dim = null;
						for(var i=0; i<dims.length; i++){
							if(dims[i].id == dimid){
							    dim = dims[i];
								break;
							}
						}
						//获取选择项
						var tab = $('#dimfiltertab').tabs('getSelected');
						var index = $('#dimfiltertab').tabs('getTabIndex',tab);

						if("day" == dim.type && index == 0){
							var st = $("#dimfiltertab #dft2").val();
							var ed = $("#dimfiltertab #dft1").val();
							//判断是否st < ed
							if(Number(st.replace(/-/g, "")) > Number(ed.replace(/-/g, ""))){
								msginfo("您选择的开始日期不能大于结束日期。", "error");
								return;
							}
							dim.startdt = st;
							dim.enddt = ed;
							dim.filtertype = 1;
							delete dim.vals;
						}else if("month" == dim.type && index == 0){
							var st = $("#dimfiltertab #dfm2").val();
							var ed = $("#dimfiltertab #dfm1").val();
							//判断是否st < ed
							if(Number(st) > Number(ed)){
								msginfo("您选择的开始月份不能大于结束月份。", "error");
								return;
							}
							dim.startmt = st;
							dim.endmt = ed;
							dim.filtertype = 1;
							delete dim.vals;
						}else{
							//获取勾选值
							var vals = "";
							var seles = $("#pdailog input[name='dimval']:checkbox:checked");
							seles.each(function(a, b){
								if(a >= 10){  //只能最多选10个
									return;
								}
								vals = vals + $(this).val();					
								if(a == seles.size() - 1 || a == 9){
								   
								}else{
									vals = vals + ',';
								}
							});
							dim.vals = vals;
							dim.filtertype = 2;
							delete dim.startmt;
							delete dim.endmt;
							delete dim.startdt;
							delete dim.enddt;
						}
						
						curTmpInfo.isupdate = true;
						tableView(comp, compId);
						$('#pdailog').dialog('close');
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	
	var vals = "";
	var dimtp = "";
	var filtertype = ""; //用来筛选的方式，1为区间，2为值筛选
	var curDim = null;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			vals = (dims[i].vals?dims[i].vals:"");
			dimtp = dims[i].type;
			filtertype = dims[i].filtertype == undefined ? "" : dims[i].filtertype;
			curDim = dims[i];
			break;
		}
	}
	var url =  (curTmpInfo.filterUrl ? curTmpInfo.filterUrl :"DimFilter.action")+"?dsid="+comp.dsid+"&cubeId="+comp.cubeId+"&filtertype="+filtertype+"&id="+dimid;
	if(dimtp == 'month'){
		url = url + "&st="+(curDim.startmt == undefined ? "" : curDim.startmt);
		url = url + "&end="+(curDim.endmt == undefined ? "" : curDim.endmt);
	}
	if(dimtp == 'day'){
		url = url + "&st="+(curDim.startdt == undefined ? "" : curDim.startdt);
		url = url + "&end="+(curDim.enddt == undefined ? "" : curDim.enddt);
		url = url + "&dateformat=" + curDim.dateformat?curDim.dateformat:"";
	}
	//$('#pdailog').dialog('refresh', url);
	$("#pdailog #div_dimfilter").load(url, {vals:vals,t:Math.random()});
}
//添加维度聚合项
function aggreDim(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	var dim = null;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			dim = dims[i];
		}
	}
	if(dim.issum == 'y'){
		dim.issum = "n";
		delete dim.aggre;
		curTmpInfo.isupdate = true;
		tableView(comp, compId);
		return;
	}
	
	var ctx = "<div style='line-height:30px; margin:20px 20px 20px 40px;'><span class=\"inputtext\">聚合方式：</span><select id=\"dimaggre\" name=\"dimaggre\" class=\"inputform2\"><option value=\"sum\">求和</option><option value=\"count\">计数</option><option value=\"avg\">平均</option><option value=\"max\">最大</option><option value=\"min\">最小</option><option value=\"var\">方差</option><option value=\"sd\">标准差</option><option value=\"middle\">中位数</option></select></div>";
	$('#pdailog').dialog({
		title: '维度聚合',
		width: 300,
		height: 180,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						if(dim.issum == 'y'){
							dim.issum = "n";
							delete dim.aggre;
						}else{
							dim.issum = 'y';
							dim.aggre = $("#pdailog #dimaggre").val();
						}
						curTmpInfo.isupdate = true;
						tableView(comp, compId);
						$('#pdailog').dialog('close');
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
}
/**
判断是否存在date类型的维度，比如day/month/quarter/year
**/
function isExistDateDim(comp, tp){
	var ret = false;
	if(tp == 'table'){
		if(!comp.cols){
			return ret;
		}
		for(var i=0; i<comp.cols.length; i++){
			var tp = comp.cols[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
		if(!comp.rows){
			return ret;
		}
		for(var i=0; i<comp.rows.length; i++){
			var tp = comp.rows[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
	}
	if(tp == 'chart'){
		if(!comp.chartJson || !comp.chartJson.params){
			return ret;
		}
		for(var i=0; i<comp.chartJson.params.length; i++){
			var tp = comp.chartJson.params[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
		if(!comp.chartJson || !comp.chartJson.xcol){
			return ret;
		}
		var xtype = comp.chartJson.xcol.type;
		if(xtype == 'year' || xtype == 'quarter' || xtype == 'month' || xtype == 'day'){
			ret = true;
		}
	}
	return ret;
}
function kpiproperty(){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var kpi = findKpiById(kpiId, comp.kpiJson);
	var ctx = "<div style='line-height:30px; margin:5px;'><span class=\"inputtext\">度量名称：</span>"+kpi.kpi_name+"<br><span class=\"inputtext\">度量单位：</span><select id=\"kpiunit\" name=\"kpiunit\" class=\"inputform\"><option value='1'></option><option value='1000'>千</option><option value='10000'>万</option><option value='1000000'>百万</option><option value='100000000'>亿</option></select>"+kpi.unit+"<br><span class=\"inputtext\">格 式 化：</span>"+
		"<select id=\"fmt\" name=\"fmt\" class=\"inputform\"><option value=\"\"></option><option value=\"###,##0\">整数</option><option value=\"###,##0.0\">小数(保留1位)</option><option value=\"###,##0.00\">小数(保留2位)</option><option value=\"0.00%\">百分比</option></select></div>";
	$('#pdailog').dialog({
		title: '度量属性',
		width: 400,
		height: 230,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						kpi.fmt = $("#pdailog #fmt").val();
						kpi.rate = Number($("#pdailog #kpiunit").val());
						$('#pdailog').dialog('close');
						curTmpInfo.isupdate = true;
						tableView(comp, compId);
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	//让格式化、聚合方式选中
	$("#pdailog #fmt").find("option[value='"+kpi.fmt+"']").attr("selected",true);
	$("#pdailog #kpiunit").find("option[value='"+kpi.rate+"']").attr("selected",true);
	//$("#pdailog #aggreType").find("option[value='"+kpi.aggre+"']").attr("selected",true);
}
function linkdetail(pms){
	var comp = findCompById(1);
	$.ajax({
	   type: "POST",
	   url: "header.action",
	   dataType:"JSON",
	   data: {dsetId:comp.dsetId,dsid:comp.dsid},
	   success: function(resp){
		   if($("#dsColumn_div").size() == 0){
				$("<div id=\"dsColumn_div\"></div>").appendTo("body");
			}
		    var ctx = "<table id=\"detailTable\"></table>";
			$('#dsColumn_div').dialog({
				title: '度量提取明细',
				width: 660,
				height: 400,
				closed: false,
				cache: false,
				modal: true,
				toolbar:null,
				content: ctx,
				toolbar:[{iconCls: 'icon-export',text:"导出",handler: function(){
					location.href = 'exportDetail.action';
				}}],
				onClose:function(){
					$('#dsColumn_div').dialog('destroy');
				},
				buttons:[{
					text:'关闭',
					iconCls:"icon-ok",
					handler:function(){
						$('#dsColumn_div').dialog('close');
					}
				}]
			});
			var cols = [];
			for(i=0; i<resp.length; i++){
				cols.push({field:"c"+i,title:resp[i].name,width:'90'});
			}
			$("#detailTable").datagrid({
				fitColumns:true,
				pagination:true,
				columns:[cols],
				singleSelect:true,
				pageSize:20,
				fit:true,
				loader:function(param, func, err){
					var json = {pms:pms, dsetId:comp.dsetId,dsid:comp.dsid, page:param.page, rows:param.rows};
					$.ajax({
					   type: "POST",
					   url: "detail.action",
					   contentType : "application/json",
					   dataType:"JSON",
					   data: JSON.stringify(json),
					   success: function(resp){
						   //$("#detailTable").datagrid("loadData", resp);
						   func(resp);
					   },
					   error:function(resp){
						   $.messager.alert('出错了','系统出错，请联系管理员。','error');
					   }
					});
				}
			});
			
	   },
	   error:function(resp){
		   $.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
}
function getDimTop(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	var dim = null;
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			dim = dims[i];
		}
	}
	var ctx = "<div style=\"margin:20px;\"><span class=\"inputtext\">维度取Top：</span><input type=\"text\" id=\"top\" name=\"top\" size=\"5\" value=\""+(dim.top?dim.top:"")+"\"><br/><span class=\"inputtext\"></span><select id=\"type\" name=\"type\" class=\"inputform2\"><option value=\"number\" "+(dim.topType=="number"?"selected":"")+">数字</option><option value=\"percent\" "+(dim.topType=="percent"?"selected":"")+">百分比</option></select></div>";
	$('#pdailog').dialog({
		title: '维度取Top',
		width: 360,
		height: 170,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
				text:'完成',
				iconCls:"icon-ok",
				handler:function(){
					var top = $("#pdailog #top").numberbox("getValue");
					var type = $("#pdailog #type").val();
					dim.top = top;
					dim.topType = type;
					$('#pdailog').dialog('close');
					tableView(comp, compId);
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#pdailog').dialog('close');
				}
			}]
	});
	$("#pdailog #top").numberbox({width:180, height:28});
}
function kpisort(tp){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	for(i=0; i<comp.kpiJson.length; i++){
		if(comp.kpiJson[i].kpi_id == kpiId){
			comp.kpiJson[i].sort = tp;
		}else{
			comp.kpiJson[i].sort = '';
		}
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
}
function dimsort(tp){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			dims[i].dimord = tp;
			break;
		}
	}
	//进行维度排序时，清除度量的排序信息
	for(i=0; i<comp.kpiJson.length; i++){
		comp.kpiJson[i].sort = '';
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
	$("#dimoptmenu").menu("hide")
}
//维度交换行列
function dimexchange(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	
	if(pos == 'col'){
		//先移除维度
		var idx = 0;
		var tmp = null;
		var dims = comp.cols;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == dimid){
				idx = i;
				tmp = dims[i];
				break;
			}
		}
		//如果维度有分组，分组必须相同
		var group = tmp.grouptype;
		if(group != null && findGroup(comp.cols, group, tmp)){
			msginfo("移动失败，同一分组的维度必须在同一行/列标签。", "error");
			return;
		}
		comp.cols.splice(idx, 1);
		//再添加维度
		comp.rows.push(tmp);
	}
	if(pos == 'row'){
		//先移除维度
		var idx = 0;
		var tmp = null;
		var dims = comp.rows;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == dimid){
				idx = i;
				tmp = dims[i];
				break;
			}
		}
		//如果维度有分组，分组必须相同
		var group = tmp.grouptype;
		if(group != null && findGroup(comp.rows, group, tmp)){
			msginfo("移动失败，同一分组的维度必须在同一行/列标签。", "error");
			return;
		}
		comp.rows.splice(idx, 1);
		//再添加维度
		comp.cols.push(tmp);
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
}
function dimmove(tp){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	if(dims.length <= 1){
		msginfo('无效移动。', "error");
		return;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimid){
			if(tp == 'left'){
				if(i <= 0){
					msginfo('无效移动。', "error");
					return;
				}else{
					var tp = dims[i - 1];
					dims[i - 1] = dims[i];
					dims[i] = tp;
					curTmpInfo.isupdate = true;
					tableView(comp, compId);
					$("#dimoptmenu").menu("hide");
					return;
				}
			}else
			if(tp == 'right'){
				if( i >= dims.length - 1){
					msginfo('无效移动。', "error");
					return;
				}else{
					var tp = dims[i + 1];
					dims[i + 1] = dims[i];
					dims[i] = tp;
					curTmpInfo.isupdate = true;
					tableView(comp, compId);
					$("#dimoptmenu").menu("hide");
					return;
				}
			}
			break;
		}
	}
}
function getTableHeadJson(compId){
	
//	var comp = findCompById(compId);
//	var json = {comp:comp, filter:[["92"]] };
//	$.ajax({
//		type:"POST",
//		async:false,
//		url:"Table2JSON!test.action",
//		dataType:"json",
//		data: {json:JSON.stringify(json),"_hideMVDiv":"true"},
//		success: function(resp){
//			
//		}
//	})
	
	var comp = findCompById(compId);
	if(comp == null){
		msginfo("组件不存在！", "error");
	}
	var ret;
	$.ajax({
		type:"POST",
		async:false,
		url:"Table2JSON.action",
		dataType:"json",
		data: {json:JSON.stringify(comp),"_hideMVDiv":"true"},
		success: function(resp){
			ret = resp;
		}
	});	
	return ret;
}
function findDimById(dimId, dims){
	var ret = null;
	if(!dims || dims == null){
		return ret;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimId){
			ret = dims[i];
			break;
		}
	}
	return ret;
}
function findKpiById(kpiId, kpis){
	var ret = null;
	if(!kpis || kpis == null){
		return ret;
	}
	for(var i=0; i<kpis.length; i++){
		if(kpis[i].kpi_id == kpiId){
			ret = kpis[i];
			break;
		}
	}
	return ret;
}
function findParamById(pid){
	var ret = null;
	for(i=0; pageInfo.params&&i<pageInfo.params.length; i++){
		var p = pageInfo.params[i];
		if(p.id == pid){
			ret = p;
			break;
		}
	}
	return ret;
}
function kpiExist(kpiId, kpis){
	var ret = false;
	if(!kpis || kpis == null){
		return ret;
	}
	for(var i=0; i<kpis.length; i++){
		if(kpis[i].kpi_id == kpiId){
			ret = true;
			break;
		}
	}
	return ret;
}

function dimExist(dimId, dims){
	var ret = false;
	if(!dims || dims == null){
		return ret;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimId){
			ret = true;
			break;
		}
	}
	return ret;
}
function findCompById(id){
	var ret = null;
	for(i=0;i<pageInfo.comps.length; i++){
		var t = pageInfo.comps[i];
		if(t.id == id){
			ret = t;
			break;
		}
	}
	return ret;
}