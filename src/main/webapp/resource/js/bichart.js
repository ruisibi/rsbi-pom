if($ == undefined){
	$ = jQuery;
}
function crtChart(compId){
	var ispie = false;
	var isscatter = false;
	var isbubble = false;
	var ismap = false;
	if(curTmpInfo.charttype){
		ispie = curTmpInfo.charttype == 'pie' || curTmpInfo.charttype == 'gauge';
		isscatter = curTmpInfo.charttype == 'bubble' || curTmpInfo.charttype == 'scatter';
		isbubble = curTmpInfo.charttype == 'bubble';
		ismap = curTmpInfo.charttype == 'map';
	}else{
		var comp = findCompById(compId);
		ispie = comp.chartJson.type == 'pie' ||  comp.chartJson.type == 'gauge';
		isscatter = comp.chartJson.type == 'bubble' ||  comp.chartJson.type == 'scatter';
		isbubble = comp.chartJson.type == 'bubble';
		ismap = comp.chartJson.type == 'map';
	}
	if(ismap){
		return "<div class=\""+(curTmpInfo.chartpos=="left"?"tsbd":"tsbd2")+"\"><div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">地域：<div class=\"h_ctx\" id=\"xcol\"><span class=\"charttip\">将地域拖到这里</span></div></div><div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">度量：<div id=\"ycol\" class=\"h_ctx\"><span class=\"charttip\">将度量拖到这里</span></div></div></div><div class=\"chartctx\" style=\""+(curTmpInfo.chartpos=="top"?"margin-left:auto":"")+"\">图表预览区域</div>";
	}else{
		return "<div class=\""+(curTmpInfo.chartpos=="left"?"tsbd":"tsbd2")+"\">" + (isscatter?"<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">" + (ispie ? "观察维度" : "横轴")+"：<div id=\"y2col\" class=\"h_ctx\"><span class=\"charttip\">"+"将度量拖到这里"+"</span></div></div>":"<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">" + (ispie ? "观察维度" : "横轴")+"：<div id=\"xcol\" class=\"h_ctx\"><span class=\"charttip\">"+"将维度拖到这里"+"</span></div></div>") + 
		"<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">"+(ispie?"度量":"纵轴")+"：<div id=\"ycol\" class=\"h_ctx\"><span class=\"charttip\">将度量拖到这里</span></div></div>" +
		(isbubble ? "<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">气泡大小：<div id=\"y3col\" class=\"h_ctx\"><span class=\"charttip\">将度量拖到这里</span></div></div>":"") +
		(isscatter?"<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\">观察维度：<div id=\"xcol\" class=\"h_ctx\"><span class=\"charttip\">"+"将维度拖到这里"+"</span></div></div>":"") +
		(isbubble ? "":"<div class=\""+(curTmpInfo.chartpos=="left"?"ts_h":"ts_h2")+"\" "+(ispie?"style=\"display:none\"":"")+">图例：<div id=\"scol\" class=\"h_ctx\"><span class=\"charttip\">将维度拖到这里</span></div></div>") + "</div>" + 
		(ispie||isscatter||curTmpInfo.chartpos=="top" ? "" :"<div class=\"exchangexs\"><img src='../resource/img/exchangexs1.gif'><a title='交换维度' href='javascript:exchangexs("+compId+", true);'><img src='../resource/img/reload.png' border='0'></a><img src='../resource/img/exchangexs2.gif'></div>") + 
		"<div class=\"chartctx\" style=\""+(curTmpInfo.chartpos=="top"?"margin-left:auto;":"")+(isscatter?"height:220px;":"")+"\">图表预览区域</div>";
	}
}
function updateChart(){
	var comp = findCompById(2);
	$('#pdailog').dialog({
		title: '切换图表',
		width: 400,
		height: 375,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						if(curTmpInfo.selectChart == undefined){
							msginfo("您还未选择图表，请点击图表示意图片，再点确认按钮。");
						}else{
							var tp = comp.chartJson.type = curTmpInfo.selectChart;
							//清除数据
							delete curTmpInfo.selectChart;
							delete comp.kpiJson[1];
							delete comp.kpiJson[2];
							if(tp == "pie" || tp == "gauge"){
								delete comp.chartJson.scol;
							}
							$('#pdailog').dialog('close');
							var str = crtChart(comp.id);
							$("#chartarea div.ctx").html(str);
							backChartData(comp);
							if(tp == 'bubble' || tp == 'scatter'){
								initChartByScatter(2);
							}else{
								initChartKpiDrop(2)
							}
							chartview(comp, comp.id);
						}
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						//清除数据
						delete curTmpInfo.selectChart;
						$('#pdailog').dialog('close');
					}
				}]
	});
	$('#pdailog').dialog('refresh', 'insertChart.action?tp=' + comp.chartJson.type);
}
function chartcss(){
	$(".chartselect .selleft ul li").bind("click", function(){
		var cid = $(this).attr("cid");
		$(".chartselect .selleft ul li").removeClass("select");
		$(this).addClass("select");
		$(".chartselect .selright .one").css("display", "none");
		$("#schart" + cid).css("display", "block");
		
		//默认选图表
		//$(".chartselect .selright .one").css("border", "none");
		//$("#schart" + cid).css("border","1px solid #FF0000");
		var tp = $("#schart" + cid).attr("tp");
		curTmpInfo.selectChart = tp;
	});
	//默认值
	var cid = $(".chartselect .selleft li.select").attr("cid");
	$(".chartselect .selright .one").css("display", "none");
	$("#schart" + cid).css("display", "block");
	curTmpInfo.selectChart = $("#schart" + cid).attr("tp");;
}
function chartview(json, compId){
	if(json.kpiJson == undefined || json.kpiJson.length == 0){
		return;
	}
	if(json.chartJson.type == "scatter" && (json.kpiJson.length < 2 || json.kpiJson[1] == null)  ){
		return;
	}
	if(json.chartJson.type == "bubble" && (json.kpiJson.length < 3 || json.kpiJson[2] == null ) ){
		return;
	}
	__showLoading();
	var kpiType = json.ttype;
	var  json = {"chartJson":json.chartJson, "kpiJson":json.kpiJson, "compId":compId, "params":pageInfo.params, dsid:json.dsid, dsetId:json.dsetId};
	$.ajax({
	   type: "POST",
	   url: "ChartView.action",
	   dataType:"html",
	   contentType : "application/json",
	   data: JSON.stringify(json),
	   success: function(resp){
		   __hideLoading();
		  //清除DIV高度
		  $("#T" + compId + " div.chartctx").css("height", "auto");
		  
		  $("#T" + compId + " div.chartctx").html(resp);
	   },
	   error:function(resp){
		  __hideLoading();
		   $.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
	
}
function initChartKpiDrop(id){
	$("#T" + id + " #xcol, #T" + id +" #ycol, #T"+id+" #scol").droppable({
		accept:"#datasettree .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			if(tp == 1 && ($(this).attr("id") == 'xcol' || $(this).attr("id") == 'scol')){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#ff0000");
			}
			
			if(tp == 2 && $(this).attr("id") == "ycol"){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				$("#T"+id+" #ycol").css("border-color", "#ff0000");
			}
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#7F9DB9");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var id = $(this).parents(".comp_table").attr("id").replace("T","");
			var json = findCompById(Number(id));
			//清除边框样式
			$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#7F9DB9");
			//获取TREE
			var node = $("#datasettree").tree("getNode", source);
			
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//判断拖入的维度及度量是否和以前维度及度量在同一个表。
			if(json.cubeId != undefined){
				if(json.cubeId != node.attributes.cubeId){
					msginfo("您拖入的"+ (node.attributes.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
					return;
				}
			}
			
			//判断拖入的度量是否是（同比、环比），如果是，需要判断当前维度是否有date类型
			if(node.attributes.calc_kpi == 1){
				if(!isExistDateDim(json, 'chart')){
					msginfo("您拖入的度量需要图形中有时间类型的维度(年/季度/月/日)。");
					return;
				}
			}
		
			json.cubeId = node.attributes.cubeId;
			json.dsid = node.attributes.dsid;
			json.dsetId = node.attributes.dsetId;
			json.chartJson.label = "PIC";
			
			if(json.kpiJson == undefined){
				json.kpiJson = [];
			};
			/**
			if(!json.chartJson || !json.chartJson.xcol || !json.chartJson.ycol || !json.chartJson.scol || !json.chartJson.params){
				json.chartJson = {"xcol":{}, "ycol":{}, "scol":{}, "params":[]};
			}
			**/
			
			//拖放度量后，判断维度是否在params中
			if(node.attributes.col_type == 1){
				var dimId = node.attributes.col_id;
				if(findDimById(dimId, json.chartJson.params) != null){
					msginfo("您拖放的维度已存在于钻取维中，不能拖放。")
					return;
				}
			}
			
			if(node.attributes.col_type == 2 && $(this).attr("id") == "ycol"){
				json.kpiJson = [];
				json.kpiJson.push({"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate,"calc":node.attributes.calc});
				json.chartJson.ycol = {"type":"kpi"};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'ycol','"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				chartview(json, id);
			}
			if(node.attributes.col_type == 1 && $(this).attr("id") == "xcol"){
				//判断是否在xcol中已经存在
				if(json.chartJson.scol != undefined && json.chartJson.scol.id == node.attributes.col_id){
					msginfo("您拖放的维度已存在于图例项中，不能拖放。")
					return;
				}
				
				//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
				var gt = node.attributes.grouptype;
				if(gt != null && gt != ''){
					if(json.chartJson.scol != undefined && json.chartJson.scol.grouptype == gt){
						msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
						return;
					}
				}
				
				json.chartJson.xcol = {"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "dim_name":node.attributes.dim_name, "grouptype":node.attributes.grouptype,"valType":node.attributes.valType, "ordcol":node.attributes.ordcol,dateformat:node.attributes.dateformat,"calc":node.attributes.calc};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'xcol', '"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				chartview(json, id);
			}
			if(node.attributes.col_type == 1 && $(this).attr("id") == "scol"){
				//判断是否在xcol中已经存在
				if(json.chartJson.xcol != undefined && json.chartJson.xcol.id == node.attributes.col_id){
					msginfo("您拖放的维度已存在于横轴中，不能拖放。")
					return;
				}
				
				//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
				var gt = node.attributes.grouptype;
				if(gt != null && gt != ''){
					if(json.chartJson.xcol != undefined && json.chartJson.xcol.grouptype == gt){
						msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
						return;
					}
				}
				
				json.chartJson.scol = {"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "dim_name":node.attributes.dim_name, "grouptype":node.attributes.grouptype,"valType":node.attributes.valType, "ordcol":node.attributes.ordcol,"calc":node.attributes.calc};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this,"+node.attributes.col_id+", 'scol', '"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				chartview(json, id);
			}
		}
	});
}
/**
对于气泡图、 散点图， 横轴和纵轴都是度量，序列是维度，处理方式和其他图表不一样，需特殊处理
*/
function initChartByScatter(id){
	$("#T" + id + " #xcol, #T" + id +" #ycol, #T"+id+" #y2col, #T"+id+" #y3col, #T"+id+" #scol").droppable({
		accept:"#datasettree .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			if(tp == 1 && ($(this).attr("id") == 'scol' || $(this).attr("id") == 'xcol' )){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#ff0000");
			}
			
			if(tp == 2 && ($(this).attr("id") == "ycol" || $(this).attr("id") == 'y2col' || $(this).attr("id") == 'y3col')){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#ff0000");
			}
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#7F9DB9");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var id = $(this).parents(".comp_table").attr("id").replace("T","");
			var json = findCompById(Number(id));
			//清除边框样式
			$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#7F9DB9");
			//获取TREE
			var node = $("#datasettree").tree("getNode", source);
			
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//判断拖入的维度及度量是否和以前维度及度量在同一个表。
			if(json.cubeId != undefined){
				if(json.cubeId != node.attributes.cubeId){
					msginfo("您拖入的"+ (node.attributes.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
					return;
				}
			}
			
			//判断拖入的度量是否是（同比、环比），如果是，需要判断当前维度是否有date类型
			if(node.attributes.calc_kpi == 1){
				if(!isExistDateDim(json, 'chart')){
					msginfo("您拖入的度量需要图形中有时间类型的维度(年/季度/月/日)。");
					return;
				}
			}
		
			json.cubeId = node.attributes.cubeId;
			json.dsid = node.attributes.dsid;
			json.dsetId = node.attributes.dsetId;
			json.chartJson.label = "PIC";
			
			if(json.kpiJson == undefined){
				json.kpiJson = [];
			};
			
			//拖放度量后，判断维度是否在params中
			if(node.attributes.col_type == 1){
				var dimId = node.attributes.col_id;
				if(findDimById(dimId, json.chartJson.params) != null){
					msginfo("您拖放的维度已存在于钻取维中，不能拖放。")
					return;
				}
			}
			
			if(node.attributes.col_type == 2 && $(this).attr("id") == "ycol"){
				if(!json.kpiJson){
					json.kpiJson = [null, null, null];
				}
				//判断度量是否存在
				if((json.kpiJson[1] != null && json.kpiJson[1].kpi_id == node.attributes.col_id) || (json.kpiJson[2] != null && json.kpiJson[2].kpi_id == node.attributes.col_id)){
					msginfo("您拖放的度量已存在当前图表中。")
					return;
				}
				json.kpiJson[0] = {"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate,"calc":node.attributes.calc};
				json.chartJson.ycol = {"type":"kpi"};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'ycol','"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				if(json.chartJson.type == 'scatter'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null){
						chartview(json, id);
					}
				}
				if(json.chartJson.type == 'bubble'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null && json.kpiJson[2] != null){
						chartview(json, id);
					}
				}
			}
			if(node.attributes.col_type == 2 && $(this).attr("id") == "y2col"){
				if(!json.kpiJson){
					json.kpiJson = [null, null, null];
				}
				//判断度量是否存在
				if((json.kpiJson[0] != null && json.kpiJson[0].kpi_id == node.attributes.col_id) || (json.kpiJson[2] != null && json.kpiJson[2].kpi_id == node.attributes.col_id)){
					msginfo("您拖放的度量已存在当前图表中。")
					return;
				}
				var kpi = {"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate,"calc":node.attributes.calc};
				json.kpiJson[1] = kpi;
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'y2col','"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				if(json.chartJson.type == 'scatter'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null){
						chartview(json, id);
					}
				}
				if(json.chartJson.type == 'bubble'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null && json.kpiJson[2] != null){
						chartview(json, id);
					}
				}
			}
			if(node.attributes.col_type == 2 && $(this).attr("id") == "y3col"){
				if(!json.kpiJson){
					json.kpiJson = [null, null, null];
				}
				//判断度量是否存在
				if((json.kpiJson[0] != null && json.kpiJson[0].kpi_id == node.attributes.col_id) || (json.kpiJson[1] != null && json.kpiJson[1].kpi_id == node.attributes.col_id)){
					msginfo("您拖放的度量已存在当前图表中。")
					return;
				}
				var kpi = {"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate,"calc":node.attributes.calc};
				json.kpiJson[2] = kpi;
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'y3col','"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				if(json.chartJson.type == 'scatter'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null){
						chartview(json, id);
					}
				}
				if(json.chartJson.type == 'bubble'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null && json.kpiJson[2] != null){
						chartview(json, id);
					}
				}
			}
			if(node.attributes.col_type == 1 && $(this).attr("id") == "xcol"){
				//判断是否在xcol中已经存在
				if(json.chartJson.scol != undefined && json.chartJson.scol.id == node.attributes.col_id){
					msginfo("您拖放的维度已存在于图例项中，不能拖放。")
					return;
				}
				
				//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
				var gt = node.attributes.grouptype;
				if(gt != null && gt != ''){
					if(json.chartJson.scol != undefined && json.chartJson.scol.grouptype == gt){
						msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
						return;
					}
				}
				
				json.chartJson.xcol = {"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "dim_name":node.attributes.dim_name, "grouptype":node.attributes.grouptype,"valType":node.attributes.valType, "ordcol":node.attributes.ordcol,"calc":node.attributes.calc};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.attributes.col_id+",'xcol', '"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				if(json.chartJson.type == 'scatter'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null){
						chartview(json, id);
					}
				}
				if(json.chartJson.type == 'bubble'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null && json.kpiJson[2] != null){
						chartview(json, id);
					}
				}
			}
			if(node.attributes.col_type == 1 && $(this).attr("id") == "scol"){
				//判断是否在xcol中已经存在
				if(json.chartJson.xcol != undefined && json.chartJson.xcol.id == node.attributes.col_id){
					msginfo("您拖放的维度已存在于横轴中，不能拖放。")
					return;
				}
				
				//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
				var gt = node.attributes.grouptype;
				if(gt != null && gt != ''){
					if(json.chartJson.xcol != undefined && json.chartJson.xcol.grouptype == gt){
						msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
						return;
					}
				}
				
				json.chartJson.scol = {"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "dim_name":node.attributes.dim_name, "grouptype":node.attributes.grouptype,"valType":node.attributes.valType, "ordcol":node.attributes.ordcol,"calc":node.attributes.calc};
				$(this).html("<span title=\""+node.text+"\" class=\"charttxt\">" + node.text + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this,"+node.attributes.col_id+", 'scol', '"+node.text+"')\"></span>");
				curTmpInfo.isupdate = true;
				if(json.chartJson.type == 'scatter'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null){
						chartview(json, id);
					}
				}
				if(json.chartJson.type == 'bubble'){
					if(json.kpiJson[0] != null && json.kpiJson[1] != null && json.kpiJson[2] != null){
						chartview(json, id);
					}
				}
			}
		}
	});
}
//回写横轴、纵轴、图例等内容
function backChartData(comp){
	var id = comp.id;
	if(!$.isEmptyObject(comp.chartJson.xcol)){
		var node = comp.chartJson.xcol;
		$("#T" + id + " #xcol").html("<span title=\""+node.dimdesc+"\" class=\"charttxt\">" + node.dimdesc + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.id+",'xcol', '"+node.dimdesc+"')\"></span>");
	}
	if(!$.isEmptyObject(comp.chartJson.ycol)){
		var node = comp.kpiJson[0];
		$("#T" + id + " #ycol").html("<span title=\""+node.kpi_name+"\" class=\"charttxt\">" + node.kpi_name + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.kpi_id+",'ycol','"+node.kpi_name+"')\"></span>");
	}
	/**
	气泡图3个度量，散点图两个度量
	**/
	//回写y2
	if(comp.kpiJson && (comp.chartJson.type == 'scatter' || comp.chartJson.type == 'bubble')){
		var node = comp.kpiJson[1];
		if(node != null){
			$("#T" + id + " #y2col").html("<span title=\""+node.kpi_name+"\" class=\"charttxt\">" + node.kpi_name + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.kpi_id+",'y2col','"+node.kpi_name+"')\"></span>");
		}
		
		//回写y3
		node = comp.kpiJson[2];
		if(node != null){
			$("#T" + id + " #y3col").html("<span title=\""+node.kpi_name+"\" class=\"charttxt\">" + node.kpi_name + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.kpi_id+",'y3col','"+node.kpi_name+"')\"></span>");
		}
	}
	if(!$.isEmptyObject(comp.chartJson.scol)){
		if(comp.chartJson.type != 'pie' && comp.chartJson.type != 'gauge'){
			var node = comp.chartJson.scol;
			$("#T" + id + " #scol").html("<span title=\""+node.dimdesc+"\" class=\"charttxt\">" + node.dimdesc + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this,"+node.id+", 'scol', '"+node.dimdesc+"')\"></span>");
		}
	}
}

function chartmenu(ts, id, tp, name){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获取
	curTmpInfo.ckid = id;
	curTmpInfo.tp = tp;
	curTmpInfo.compId = $(ts).parents(".comp_table").attr("id").replace("T","");
	curTmpInfo.dimname = name;
	
	if(tp == 'ycol' || tp == 'y2col' || tp=='y3col'){
		$("#chartoptmenu").menu("enableItem", $("#m_set"));
	}else{
		$("#chartoptmenu").menu("disableItem", $("#m_set"));
	}
	$("#chartoptmenu").menu("show", {left:offset.left, top:offset.top + 20});
}
function chartsort(sorttp){
	var tp = curTmpInfo.tp;
	var compId = curTmpInfo.compId;
	var id = curTmpInfo.ckid;
	var json = findCompById(compId);
	
	if(tp == 'xcol'){
		//清除度量排序,因为度量排序最优先
		delete json.kpiJson[0].sort;
		json.chartJson.xcol.dimord = sorttp;
	}
	if(tp == 'ycol'){
		json.kpiJson[0].sort = sorttp;
	}
	if(tp == 'scol'){
		//清除度量排序
		delete json.kpiJson[0].sort;
		json.chartJson.scol.dimord = sorttp;
	}
	curTmpInfo.isupdate = true;
	chartview(json, compId);
}
function delChartKpiOrDim(){
	var tp = curTmpInfo.tp;
	var compId = curTmpInfo.compId;
	var id = curTmpInfo.ckid;
	var json = findCompById(compId);
	
	if(tp == 'xcol'){
		json.chartJson.xcol = {};
		$("#T"+compId+" #xcol").html("<span class=\"charttip\">将维度拖到这里</span>");
		curTmpInfo.isupdate = true;
		chartview(json, compId);
	}
	if(tp == 'ycol'){
		json.chartJson.ycol = {};
		if(json.kpiJson.length > 1){
			json.kpiJson[0] = null;
		}else{
			json.kpiJson = [];
		}
		$("#T"+compId+" #ycol").html("<span class=\"charttip\">将度量拖到这里</span>");
	}
	if(tp == 'y2col'){
		if(json.kpiJson.length > 1){
			json.kpiJson[1] = null;
		}else{
			json.kpiJson = [];
		}
		$("#T"+compId+" #y2col").html("<span class=\"charttip\">将度量拖到这里</span>");
	}
	if(tp == 'y3col'){
		json.kpiJson[2] = null;
		$("#T"+compId+" #y3col").html("<span class=\"charttip\">将度量拖到这里</span>");
	}
	if(tp == 'scol'){
		json.chartJson.scol = {};
		$("#T"+compId+" #scol").html("<span class=\"charttip\">将维度拖到这里</span>");
		curTmpInfo.isupdate = true;
		chartview(json, compId);
	}
}
function setChartKpi(){
	var tp = curTmpInfo.tp;
	if(tp == 'xcol' || tp == 'scol'){
		return;
	}
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var kpi = null;
	if(tp == 'ycol'){
		kpi = comp.kpiJson[0];
	}else if(tp == 'y2col'){
		kpi = comp.kpiJson[1];
	}else if(tp == 'y3col'){
		kpi = comp.kpiJson[2];
	}
	var ctx = "<div style='line-height:25px; margin:5px;'>度量名称："+kpi.kpi_name+"<br>所 属 表： "+comp.tname+"<br>度量单位：<select id=\"kpiunit\" name=\"kpiunit\"><option value='1'></option><option value='1000'>千</option><option value='10000'>万</option><option value='1000000'>百万</option><option value='100000000'>亿</option></select>"+kpi.unit+"<br>格 式 化："+
		"<select id=\"fmt\" name=\"fmt\"><option value=\"###,##0\">整数</option><option value=\"###,##0.0\">小数</option><option value=\"0.00%\">百分比</option></select>" + "</div>";
	$('#pdailog').dialog({
		title: '度量属性',
		width: 280,
		height: 260,
		closed: false,
		cache: false,
		modal: true,
		content: ctx,
		toolbar:null,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						kpi.fmt = $("#pdailog #fmt").val();
						kpi.rate = Number($("#pdailog #kpiunit").val());
						$('#pdailog').dialog('close');
						curTmpInfo.isupdate = true;
						chartview(comp, compId);
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	$("#pdailog #fmt").find("option[value='"+kpi.fmt+"']").attr("selected",true);
	$("#pdailog #kpiunit").find("option[value='"+kpi.rate+"']").attr("selected",true);
	
}
function chartfilterDims(){
	var tp = curTmpInfo.tp;
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId.replace("T", "");
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var dim = null;
	if(tp == 'xcol'){
		dim = comp.chartJson.xcol;
	}else if(tp == 'scol'){
		dim = comp.chartJson.scol;
	}else{
		//度量筛选页面
		//return setChartKpi(dimid, compId, comp, name);
		return kpiFilter('chart');
	}
	
	$('#pdailog').dialog({
		title: name + ' - 维度筛选',
		width: 300,
		height: 321,
		closed: false,
		cache: false,
		modal: true,
		content:'<div id="div_chartfilter"><div class="panel-loading">Loading...</div></div>',
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						//获取选择项
						var tab = $('#dimfiltertab').tabs('getSelected');
						var index = $('#dimfiltertab').tabs('getTabIndex',tab);
						
						if("day" == dim.type && index == 0){
							var st = $("#dimfiltertab #dft2").val();
							var ed = $("#dimfiltertab #dft1").val();
							//判断是否st < ed
							if(Number(st.replace(/-/g, "")) > Number(ed.replace(/-/g, ""))){
								msginfo("您选择的开始日期不能大于结束日期。");
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
								msginfo("您选择的开始月份不能大于结束月份。");
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
								vals = vals + $(this).val();
								if(a != seles.size() - 1){
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
						chartview(comp, compId);
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
	var dimtp = dim.type;
	var curDim = dim;
	var filtertype = dim.filtertype == undefined ? "" : dim.filtertype;
	var url =  "DimFilter.action?dsid="+comp.dsid+"&cubeId="+comp.cubeId+"&dimType="+dimtp+"&filtertype="+filtertype+"&id="+dimid;
	if(dimtp == 'month'){
		url = url + "&st="+(curDim.startmt == undefined ? "" : curDim.startmt);
		url = url + "&end="+(curDim.endmt == undefined ? "" : curDim.endmt);
	}
	if(dimtp == 'day'){
		url = url + "&st="+(curDim.startdt == undefined ? "" : curDim.startdt);
		url = url + "&end="+(curDim.enddt == undefined ? "" : curDim.enddt);
		url = url + "&dateformat=" + curDim.dateformat;
	}
	$("#pdailog #div_chartfilter").load(url, {vals:dim.vals?dim.vals:""});
}
function exchangexs(compId, islink){
	var comp = findCompById(compId);
	if(comp.chartJson == undefined || (comp.chartJson.xcol == undefined && comp.chartJson.scol == undefined)){
		msginfo("您还未选择维度。");
	}
	var tmp = comp.chartJson.xcol;
	comp.chartJson.xcol = comp.chartJson.scol;
	comp.chartJson.scol = tmp;
	
	//更新显示内容
	if(comp.chartJson.xcol && comp.chartJson.xcol.id){	
		var node = comp.chartJson.xcol;
		$("#T" + compId + " #xcol").html("<span title=\""+(node.dimdesc ? node.dimdesc : "")+"\" class=\"charttxt\">" + (node.dimdesc ? node.dimdesc : "") + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.id+",'xcol', '"+node.dimdesc+"')\"></span>");
	}else{
		$("#T"+compId+" #xcol").html("<span class=\"charttip\">将维度拖到这里</span>");
	}
	if(comp.chartJson.scol && comp.chartJson.scol.id){	
		var node = comp.chartJson.scol;
		$("#T" + compId + " #scol").html("<span title=\""+(node.dimdesc ? node.dimdesc : "")+"\" class=\"charttxt\">" + (node.dimdesc ? node.dimdesc : "") + "</span><span class=\"charticon\" title=\"配置\" onclick=\"chartmenu(this, "+node.id+",'scol', '"+node.dimdesc+"')\"></span>");
	}else{
		$("#T"+compId+" #scol").html("<span class=\"charttip\">将维度拖到这里</span>");
	}
	curTmpInfo.isupdate = true;
	chartview(comp, compId);
	
	//判断图表是否有联动
	if(comp.complink && islink){
		var tableComp = findCompById(comp.complink);
		if(tableComp != null && isSameDimsInDrill(tableComp, comp)){ //必须维度相同才能联动。
			curTmpInfo.compId = "T" + tableComp.id;
			changecolrow(false);
		}
	}
}
function crtChartfromTab(){
	var compId = curTmpInfo.compId.replace("T", "");
	var comp = findCompById(compId);
	var rows = "";
	for(i=0; i<comp.rows.length; i++){
		var selected = "";
		if(i == comp.rows.length - 1){
			selected = "selected";
		}
		rows = rows + "<option value='"+comp.rows[i].id+"' "+selected+">"+comp.rows[i].dimdesc+"</option>";
	}
	var cols = "";
	for(i=0; i<comp.cols.length; i++){
		var selected = "";
		if(i == comp.cols.length - 1){
			selected = "selected";
		}
		cols = cols + "<option value='"+comp.cols[i].id+"' "+selected+">"+comp.cols[i].dimdesc+"</option>";
	}
	var ctx = "<div style='line-height:25px; margin:10px;'><span class=\"inputtext\">类型：</span><select id='charttype' class=\"inputform2\"><option value='line'>曲线图</option><option value='column'>柱状图</option><option value='pie'>饼图</option><option value='radar'>雷达图</option></select><br><span class=\"inputtext\">横轴：</span><select id='hz' class=\"inputform2\">"+rows+"</select><br/><span class=\"inputtext\">图例：</span><select id='zz' class=\"inputform2\">"+cols+"</select></div>";
	$('#pdailog').dialog({
		title: '通过表格数据生成图表',
		width: 320,
		height: 220,
		closed: false,
		cache: false,
		modal: true,
		content:ctx,
		toolbar:null,
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						var tp = $("#charttype").val();
						var xcol = $("#hz").val();
						var scol = $("#zz").val();
						var kpi = curTmpInfo.ckid;
						$('#pdailog').dialog('close');
						var chart = {id:2, name:"图表组件", type:"chart", chartJson:{type:tp,ycol:{type:"kpi"}, params:[]}, cubeId:comp.cubeId, tname:comp.tname, kpiJson:[], dsid:comp.dsid, dsetId:comp.dsetId, complink:comp.id}; //通过complink 实现图表和表格的联动
						comp.complink = chart.id; //设置表格和图表的联动
						//设置度量
						var k = eval("(" + JSON.stringify(findKpiById(kpi, comp.kpiJson)) + ")");
						chart.kpiJson.push(k);
						//设置y,ser
						if(xcol != null && xcol != ''){
							chart.chartJson.xcol = eval("(" + JSON.stringify(findDimById(xcol, comp.rows)) + ")");
						}
						if(scol != null && scol != ''){
							chart.chartJson.scol = eval("(" + JSON.stringify(findDimById(scol, comp.cols)) + ")");
						}
						//设置参数维
						for(k=0; k<comp.rows.length; k++){
							if(comp.rows[k].id == xcol || comp.rows[k].id == scol){
							}else{
								chart.chartJson.params.push(comp.rows[k]);
							}
						}
						for(k=0; k<comp.cols.length; k++){
							if(comp.cols[k].id == xcol || comp.cols[k].id == scol){
							}else{
								chart.chartJson.params.push(comp.cols[k]);
							}
						}
						curTmpInfo.isupdate = true;
						curTmpInfo.charttype = tp;
						addComp(chart.id, chart.name, null, false, chart.type, chart);
						//添加到组件
						pageInfo.comps[1] = chart;
						//切换选项卡
						$('a[data-toggle="tab"]').last().tab('show');
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
//导出图表到excel，次excel子包括数据，可以直接用来生成图表
function exportChart(compId){
	var json = findCompById(compId);
	if(json.kpiJson == undefined || json.kpiJson.length == 0){
		return;
	}
	var params = "[]";
	if(pageInfo.params && pageInfo.params.length > 0){
		params = JSON.stringify(pageInfo.params);
	}
	var chartJson = JSON.stringify(json.chartJson);
	var kpiJson = JSON.stringify(json.kpiJson);
	
	var form = $("<form name='exp' method='post' action=\"ChartView!export.action\" id='exp'><input type='hidden' id='chartJson' name='chartJson'><input type='hidden' id='compId' name='compId'><input type='hidden' id='kpiJson' name='kpiJson'><input type='hidden' id='params' name='params'></form>");
	form.appendTo("body");
	form.find("#chartJson").val(chartJson);
	form.find("#compId").val(compId);
	form.find("#kpiJson").val(kpiJson);
	form.find("#params").val(params);
	form.submit();
	form.remove();
}