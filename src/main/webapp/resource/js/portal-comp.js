if($ == undefined){
	$ = jQuery;
}
var fmtJson = [{
	"text":"整数",
	"value":"#,##0"
},{
	"text":"小数(保留一位)",
	"value":"#,##0.0"
},{
	"text":"小数(保留两位)",
	"value":"#,##0.00"
},{
	"text":"小数(保留四位)",
	"value":"#,##0.0000"
},{
	"text":"百分比",
	"value":"#,##0.00%"
}];
var kpirate = [{
	"text":"1",
	"value":"1"
},{
	"text":"千",
	"value":"1000"
},{
	"text":"万",
	"value":"10000"
},{
	"text":"百万",
	"value":"1000000"
},{
	"text":"亿",
	"value":"100000000"
}];
var colorJson = [{
	"text":"无",
	"value":""
},{
	"text":"黑色",
	"value":"#000000"
},{
	"text":"白色",
	"value":"#FFFFFF"
},{
	"text":"红色",
	"value":"#FF0000"
},{
	"text":"鲜绿色",
	"value":"#00FF00"
},{
	"text":"蓝色",
	"value":"#0000FF"
},{
	"text":"黄色",
	"value":"#FFFF00"
},{
	"text":"粉红色",
	"value":"#FF00FF"
},{
	"text":"青绿色",
	"value":"#00FFFF"
},{
	"text":"深红色",
	"value":"#800000"
},{
	"text":"绿色",
	"value":"#008000"
},{
	"text":"深蓝色",
	"value":"#000080"
},{
	"text":"深黄色",
	"value":"#808000"
},{
	"text":"紫罗兰",
	"value":"#800080"
},{
	"text":"青色",
	"value":"#008080"
},{
	"text":"灰－25％",
	"value":"#C0C0C0"
},{
	"text":"灰－50％",
	"value":"#808080"
},{
	"text":"海螺色",
	"value":"#9999FF"
},{
	"text":"梅红色",
	"value":"#993366"
},{
	"text":"象牙色",
	"value":"#FFFFCC"
},{
	"text":"浅青绿",
	"value":"#CCFFFF"
},{
	"text":"深紫色",
	"value":"#660066"
},{
	"text":"珊瑚红",
	"value":"#FF8080"
},{
	"text":"海蓝色",
	"value":"#0066CC"
},{
	"text":"冰蓝",
	"value":"#CCCCFF"
},{
	"text":"深蓝色",
	"value":"#000080"
},{
	"text":"粉红色",
	"value":"#FF00FF"
},{
	"text":"黄色",
	"value":"#FFFF00"
},{
	"text":"青绿色",
	"value":"#00FFFF"
},{
	"text":"紫罗兰",
	"value":"#800080"
},{
	"text":"深红色",
	"value":"#800000"
},{
	"text":"青色",
	"value":"#008080"
},{
	"text":"蓝色",
	"value":"#0000FF"
},{
	"text":"天蓝色",
	"value":"#00CCFF"
},{
	"text":"浅青绿",
	"value":"#CCFFFF"
},{
	"text":"浅绿色",
	"value":"#CCFFCC"
},{
	"text":"浅黄色",
	"value":"#FFFF99"
},{
	"text":"淡蓝色",
	"value":"#99CCFF"
},{
	"text":"玫瑰红",
	"value":"#FF99CC"
},{
	"text":"淡紫色",
	"value":"#CC99FF"
},{
	"text":"茶色",
	"value":"#FFCC99"
},{
	"text":"浅蓝色",
	"value":"#3366FF"
},{
	"text":"水绿色",
	"value":"#33CCCC"
},{
	"text":"酸橙色",
	"value":"#99CC00"
},{
	"text":"金色",
	"value":"#FFCC00"
},{
	"text":"浅橙色",
	"value":"#FF9900"
},{
	"text":"橙色",
	"value":"#FF6600"
},{
	"text":"蓝－灰",
	"value":"#666699"
},{
	"text":"灰－40％",
	"value":"#969696"
},{
	"text":"深青",
	"value":"#003366"
},{
	"text":"海绿",
	"value":"#339966"
},{
	"text":"深绿",
	"value":"#003300"
},{
	"text":"橄榄色",
	"value":"#333300"
},{
	"text":"褐色",
	"value":"#993300"
},{
	"text":"梅红色",
	"value":"#993366"
},{
	"text":"靛蓝色",
	"value":"#333399"
},{
	"text":"灰－80％",
	"value":"#333333"
}];

function flushPage(){
	for(var k=0; curTmpInfo.comps&&k<curTmpInfo.comps.length; k++){
		var tp = curTmpInfo.comps[k].type;
		if(tp == 'table'){
			tableView(curTmpInfo.comps[k], curTmpInfo.comps[k].id);
		}else if(tp == 'chart'){
			chartview(curTmpInfo.comps[k], curTmpInfo.comps[k].id);
		}else if(tp == "box"){
			boxView(curTmpInfo.comps[k]);
		}else if(tp == "grid"){
			gridView(curTmpInfo.comps[k]);
		}
	}
}

//state = 'insert/update' 表示文本组件当前是新添加还是修改内容
//layoutId 所属编辑器的ID
function insertText(state, layoutId, compId){
	$('#pdailog').dialog({
		title: '请输入文本内容 - 文本框',
		width: 490,
		height: 240,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: '<div class="textpanel"><textarea name="txtctx" id="txtctx" style=\"width:450px;height:145px;\"></textarea></div>',
		buttons:[{
					text:'确定',
					handler:function(){
						if(state == 'insert'){
							var txt = $("#txtctx").val();
							var obj = {"id":newGuid(), type:'text', name:"文本", desc:txt};
							var str = addComp(obj, layoutId, true);
							$("#layout_"+layoutId).append(str.replace(/\n/g,"<br>"));
							//移动滚动条
							$("#optarea").scrollTop($("#c_"+obj.id).offset().top);
							//注册拖放事件
							bindCompEvent(obj);
						}
						if(state == 'update'){
							var txt = $("#txtctx").val();
							var comp = findCompById(compId);
							comp.desc = txt;
							$("#c_"+compId+" div.cctx").html(txt.replace(/\n/g,"<br>"));
						}
						//更新页面为已修改
						curTmpInfo.isupdate = true;
						$('#pdailog').dialog('close');
					}
				},{
					text:'取消',
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	if(state == 'update'){
		var comp = findCompById(compId);
		$("#txtctx").val(comp.desc);
	}
	$("#txtctx").focus();
}
//根据ispush来判断是否把组件放入JSON对象中
function addComp(comp, layoutId, ispush){
	var json = comp;
	var layout = findLayoutById(layoutId);
	if(ispush){
		if(!layout.children){
			layout.children = [];
		}
		layout.children.push(json);
		if(!curTmpInfo.comps){
			curTmpInfo.comps = [];
		}
		curTmpInfo.comps.push(json);
	}
	//生成标题的样式
	var style = "";
	if(json.style){
		var sty = json.style;
		if(json.style.align && json.style.align != ''){
			style = style +"text-align:"+json.style.align+";";
		}
		if(json.style.fontsize && json.style.fontsize != ''){
			style = style + "font-size:"+json.style.fontsize+"px;";
		}
		if(json.style.fontcolor && json.style.fontcolor != ''){
			style = style + "color:"+json.style.fontcolor+";";
		}
		if(sty.fontweight && sty.fontweight=="true"){
			style = style + "font-weight:bold;";
		}
		if(sty.italic && sty.italic =="true"){
			style = style + "font-style:italic;";
		}
		if(sty.underscore && sty.underscore =="true"){
			style = style + "text-decoration: underline;";
		}
		if(sty.bgcolor && sty.bgcolor != ''){
			style = style + "background-color:"+sty.bgcolor+";";
		}
	}
	//生成文本组件的样式
	var textcss = "";
	if(json.style){
		var sty = json.style;
		if(json.style.talign && json.style.talign != '' && json.type != 'input'){  //input类型的 talign 特殊处理
			textcss = textcss +"text-align:"+json.style.talign+";";
		}
		if(json.style.tfontsize && json.style.tfontsize != ''){
			textcss = textcss + "font-size:"+json.style.tfontsize+"px;";
		}
		if(json.style.tfontcolor && json.style.tfontcolor != ''){
			textcss = textcss + "color:"+json.style.tfontcolor+";";
		}
		if(sty.tfontweight && sty.tfontweight=="true"){
			textcss = textcss + "font-weight:bold;";
		}
		if(sty.titalic && sty.titalic == "true"){
			textcss = textcss + "font-style:italic;";
		}
		if(sty.tunderscore && sty.tunderscore == 'true'){
			textcss = textcss + "text-decoration: underline;";
		}
		if(sty.tbgcolor && sty.tbgcolor != '' ){
			textcss = textcss + "background-color:"+sty.tbgcolor+";";
		}
		//判断input类型的 theight
		if(sty.theight && sty.theight != '' && json.type == 'input'){
			textcss = textcss + "height:"+sty.theight+"px;";
		}
	}
	if(json.type == "box" && json.bgcolor && json.bgcolor!=""){
		textcss = textcss + "background-color:"+json.bgcolor+";";
	}
	var str = "<div class=\"ibox\" id=\"c_"+json.id+"\"><div class=\"ibox-title\"><div title=\"双击改名\" ondblclick=\"chgcompname(this, '"+json.id+"')\" class=\"ctit\" style=\""+style+"\"><h5>"+json.name+"</h5></div>"+"<div class=\"ibox-tools\"><button class=\"btn btn-outline btn-success btn-xs mvcomp\" title=\"移动组件\" cid=\""+json.id+"\"><i class=\"fa fa-hand-grab-o\"></i></button> <button class=\"btn btn-outline btn-success btn-xs\" onclick=\"showcompmenu(this,'"+layoutId+"','"+comp.id+"')\" title=\"设置组件\" ><i class=\"fa fa-wrench\"></i></button> <button class=\"btn btn-outline btn-danger btn-xs\" onclick=\"deletecomp('"+layoutId+"', '"+comp.id+"');\" title=\"删除组件\" cid=\""+json.id+"\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"cctx ibox-content\" style=\""+textcss+"\">";
	if(json.type == 'text'){
		str = str + comp.desc.replace(/\n/g,"<br>")
	}else if(json.type == "table"){
		var ret = "<div align=\"center\" class=\"tipinfo\">(点击组件右上角设置按钮配置交叉表的数据)</div>";
		str = str + ret;
	}else if(json.type == "chart"){
		var ret = "<div align=\"center\" class=\"tipinfo\">(点击组件右上角设置按钮配置图形数据)</div>";
		str = str + ret;
	}else if(json.type == 'grid'){
		var ret = "<div align=\"center\" class=\"tipinfo\">(点击组件右上角设置按钮配置表格数据)</div>";
		str = str + ret;
	}else if(json.type == "box"){
		var ret = "<div align=\"center\" class=\"tipinfo\">(点击组件右上角设置按钮配置数据块显示的度量)</div>";
		str = str + ret;
	}
	str = str + "</div></div>";
	return str;
}
function chgcompname(ts, compId){
	var comp = findCompById(compId);
	$.messager.prompt('组件标题', '请输入新的组件标题：', function(msg){
		if(msg){
			comp.name = msg;
			$("#c_"+compId+" .ctit h5").text(msg);
			curTmpInfo.isupdate = true;
		}
	});
	$(".messager-input").val(comp.name).select();
}
function showcompmenu(ts, layoutId, compId){
	var offset = $(ts).offset();
	var divId = "";
	var comp = findCompById(compId);
	if(comp.type == "chart"){
		divId = "chart_menu";
	}else if(comp.type == "table"){
		divId = "table_menu";
	}else if(comp.type == "text"){
		divId = "text_menu";
	}else if(comp.type == "grid"){
		divId = "grid_menu";
	}else if(comp.type == "box"){
		divId = "box_menu";
	}
	curTmpInfo.layoutId = layoutId;
	curTmpInfo.compId = compId;
	$("#" + divId).menu("show", {left:offset.left, top:offset.top + 20});
}
function bindCompEvent(obj){
	//注册移动事件
	$("#c_" + obj.id).draggable({
		revert:true,
		handle:$("#c_" + obj.id + " button.mvcomp"),
		proxy:function(source){
			var width = $(source).width();
			var height = $(source).height();
			var p = $('<div style="border:1px solid #999999;background-color:#cccccc; opacity:0.8; filter:alpha(opacity=50); width:'+width+'px; height:'+height+'px;">'+obj.name+'</div>');
			p.appendTo('body');
			return p;
		},
		onStartDrag:function(e){
			resetWindows('min');
		},
		onStopDrag:function(e){
			$(".indicator").hide();
			resetWindows('max');
		}
	});
	
	$("#c_" + obj.id).droppable({
		accept:"div.ibox, #comp_tree .tree-node",
		onDragEnter:function(e,source){
			curTmpInfo.id = $(this).attr("id");
			curTmpInfo.tp = "before";
			$(".indicator").css({
				display:'block',
				left:$(this).offset().left,
				top:$(this).offset().top - 10
			});
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			if($(this).hasClass("div.ibox")){
				var obj = $(this).parent();
				var last = obj.children().last();
				if(last.attr("id") ==  $(source).attr("id")){
					last = last.prev();
				}
				if(last.size() == 0){
					$(".indicator").css({
						display:'block',
						left:obj.offset().left,
						top:obj.offset().top - 10
					});
				}else{
					curTmpInfo.id = last.attr("id");
					curTmpInfo.tp = "after";
					$(".indicator").css({
						display:'block',
						left:last.offset().left,
						top:last.offset().top + last.height()
					});
				}
					
			}
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡			
		},
		onDrop:function(e,source){
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡		
		}

	});
}
function editComp(layoutId, compId){
	if(!layoutId){
		layoutId = curTmpInfo.layoutId;
	}
	if(!compId){
		compId = curTmpInfo.compId;
	}
	$('#Jlayout').layout("remove", "east");
	var comp = findCompById(compId);
	if(comp.type == "text"){
		insertText("update", layoutId, compId);
	}else if(comp.type == "table"){
		editTableData(compId);
	}else if(comp.type == "chart"){
		editChartData(compId, layoutId);
	}else if(comp.type == 'input'){
		editInputData(comp);
	}else if(comp.type == 'grid'){
		editGridData(compId);
	}else if(comp.type == "box"){
		editBoxData(compId);
	}
}
function setComp(layoutId, compId){
	if(!layoutId){
		layoutId = curTmpInfo.layoutId;
	}
	if(!compId){
		compId = curTmpInfo.compId;
	}
	$('#Jlayout').layout("remove", "south");
	var comp = findCompById(compId);
	if(comp.type == "text"){
		setTextProperty(comp);
	}else if(comp.type == "table"){
		setTableProperty(comp);
	}else if(comp.type == "chart"){
		setChartProperty(comp);
	}else if(comp.type == 'input'){
		setInputProperty(comp);
	}else if(comp.type == "grid"){
		setGridProperty(comp);
	}else if(comp.type == "box"){
		setBoxProperty(comp);
	}
}
function editTableData(compId){
	if($("#dataProperty").size() == 0){
		$('#Jlayout').layout('add', {region:"south", id:"dataProperty", split:false, collapsible:false,height : 120, title:'编辑交叉表数据', tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "south");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "south").panel("setTitle", "编辑交叉表数据");
	}
	//切换选项卡到立方体
	$("#comp_tab").tabs("select", 1);
	
	var comp = findCompById(compId);
	var str = "";
	for(var i=0; comp.rows&&i<comp.rows.length; i++){
		str = str + "<span id=\"d_"+comp.rows[i].id+"\" class=\"dimcol\"><span class=\"text\">"+comp.rows[i].dimdesc+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setRdimInfo(this, "+comp.rows[i].id+", '"+comp.rows[i].dimdesc+"','"+compId+"')\"> &nbsp; </a></span>";
	}
	for(var i=0; comp.kpiJson&&i<comp.kpiJson.length; i++){
		str = str + "<span id=\"k_"+comp.kpiJson[i].kpi_id+"\" class=\"col\"><span class=\"text\">"+comp.kpiJson[i].kpi_name+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setKpiInfo(this,"+comp.kpiJson[i].kpi_id+",'"+compId+"');\"> &nbsp; </a></span>";
	}
	if(str == ""){
		str = "<div class=\"tipinfo\">拖拽立方体维度或度量到此处作为交叉表的字段</div>";
	}else{
		str = "<span id=\"tabRows\"><b>交叉表字段：</b>" + str + "</span>";
	}
	var colstr = "";
	for(var i=0; comp.cols&&i<comp.cols.length; i++){
		var o = comp.cols[i];
		colstr = colstr + "<span id=\"d_"+o.id+"\" class=\"dimcol\"><span class=\"text\">"+o.dimdesc+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setCdimInfo(this, "+o.id+", '"+o.dimdesc+"','"+compId+"')\"> &nbsp; </a></span>";
	}
	if(colstr != ''){
		colstr = "<span id=\"tabCols\"> &nbsp; &nbsp; <b>列字段：</b>" + colstr + "</span>";
	}
	
	var ctx = "<div style=\"margin:10px;\"><div class=\"tableDatasty\" id=\"tableData\">"+str + colstr +"</div></div>";
	$("#dataProperty").html(ctx);
	//注册接收度量及维度拖放事件
	$("#tableData").droppable({
		accept:"#datasettree .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			
			//对维度拖拽设置图标
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
			$("#tableData").css("border", "1px solid #ff0000");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			$("#tableData").css("border", "1px dotted #666");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var id = compId
			var json = findCompById(id);
			
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//清除边框颜色
			$("#tableData").css("border", "1px dotted #666");
			
			//获取TREE
			var node = $("#datasettree").tree("getNode", source);
			
			//判断拖入的维度及度量是否和以前维度及度量在同一个表。
			if(json.cubeId != undefined){
				if(json.cubeId != node.attributes.cubeId){
					msginfo("您拖入的"+ (node.attributes.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
					return;
				}
			}else{
				json.cubeId = node.attributes.cubeId;
				json.dsetId = node.attributes.dsetId;
				json.dsid = node.attributes.dsid;			
			}
			
			if(!json.kpiJson){
				json.kpiJson = [];
			};
			if(!json.cols){
				json.cols = [];
			}
			if(!json.rows){
				json.rows = [];
			}
			//写度量
			if(node.attributes.col_type == 2){
				//如果度量存在就忽略
				if(!kpiExist(node.attributes.col_id, json.kpiJson)){
					json.kpiJson.push({"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate});
				}else{
					msginfo("度量已经存在。");
					return;
				}
				//添加字段
				var str = "<span id=\"k_"+node.attributes.col_id+"\" class=\"col\"><span class=\"text\">"+node.text+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setKpiInfo(this,"+node.attributes.col_id+",'"+json.id+"');\"> &nbsp; </a></span>";
				var obj = $("#tableData");
				if(obj.find("#tabRows").size() == 0){
					obj.html("<span id=\"tabRows\"><b>交叉表字段：</b>"+str+"</span>");
				}else{
					if($("#tableData #tabRows").find("span.col").size() == 0){
						$("#tableData #tabRows").append(str);
					}else{
						$("#tableData #tabRows").find("span.col").last().after(str);
					}
				}
				
				curTmpInfo.isupdate = true;
				tableView(json, id);
			}
			//写维度
			if(node.attributes.col_type == 1){
				//写row维度
				//if($(this).attr("id") == "d_rowDims"){
					if(!dimExist(node.attributes.col_id, json.rows) && !dimExist(node.attributes.col_id, json.cols)){
						json.rows.push({"id":node.attributes.col_id, "dimdesc" : node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"tname":node.attributes.tname,"iscas":node.attributes.iscas, "tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "dim_name":node.attributes.dim_name,"grouptype":node.attributes.grouptype,"valType":node.attributes.valType,"ordcol":node.attributes.ordcol,"alias":node.attributes.alias,"calc":node.attributes.calc});
					}else{
						msginfo("维度已经存在。");
						return;
					}
					//添加字段
					var str = "<span id=\"d_"+node.attributes.col_id+"\" class=\"dimcol\"><span class=\"text\">"+node.text+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setRdimInfo(this, "+node.attributes.col_id+", '"+node.text+"','"+json.id+"')\"> &nbsp; </a></span>";
					var obj = $("#tableData");
					if(obj.find("#tabRows").size() == 0){
						obj.html("<span id=\"tabRows\"><b>交叉表字段：</b>"+str+"</span>");
					}else{
						if($("#tableData #tabRows").find("span.dimcol").size() == 0){
							$("#tableData #tabRows").find("b").after(str);
						}else{
							$("#tableData #tabRows").find("span.dimcol").last().after(str);
						}
					}
					curTmpInfo.isupdate = true;
					tableView(json, id);
				//}
			}
		}
	});
}
//从交叉表JSON中删除KPI
function delJsonKpiOrDim(tp){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
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
		$("#tableData #k_"+id).remove();
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
		$("#tableData #d_"+id).remove();
		if(pos == "col"){
			if(dims.length == 0){
				$("#tableData #tabCols").remove();
			}
		}else if(pos == "row"){
			if(dims.length == 0){
				//$("#tableData #tabRows").remove();
				//$("#tableData").html("<div class=\"tipinfo\">拖拽立方体维度或度量到此处作为交叉表的字段</div>");
				//$("#c_"+compId+" .cctx").html("");
			}
		}
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
}
function setTableProperty(comp){
	if($("#compSet").size() == 0){
		$('#Jlayout').layout('add', {region:"east", split:false, width:240, title:"交叉表属性配置", collapsible:false, id:"compSet",  tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "east");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "east").panel("setTitle", "交叉表属性配置");
	}
	if(!comp.style){
		comp.style = {};
	}
	var s = comp.style;
	$('#compSet').propertygrid({
		showGroup:true,
		border:false,
		showHeader:false,
		scrollbarSize: 0,
		fitColumns:false,
		onAfterEdit: function(rowIndex,rowData,changes){
			var val = rowData.value;
			var col = rowData.col;
			curTmpInfo.isupdate = true;
			if(col == "name"){
				comp.name = val;
				$("#c_"+comp.id + " div.ctit h5").text(val);
			}else if(col == "showtitle"){
				comp.showtitle = val;
			}else if(col == "lockhead" || col == "height"){
				comp[col] = val;
				tableView(comp, comp.id);
			}
		},
		data:[
			{name:'交叉表标题',col:'name', value:(comp.name?comp.name:""), group:'交叉表属性', editor:'text'},
			{name:'是否显示标题',col:'showtitle', value:(comp.showtitle?comp.showtitle:"true"), group:'交叉表属性', editor:{
				type:"checkbox",
				options:{"on":true, "off":false}
			}},
			{name:'锁定表头',col:'lockhead', value:(comp.lockhead?comp.lockhead:""), group:'交叉表属性', editor:{
				type:"checkbox",
				options: {"on":true, "off":false}
			}},
			{name:'锁定后交叉表高度',col:'height', value:(comp.height?comp.height:""), group:'交叉表属性', editor:"numberbox"},
			{name:"交叉表下钻",col:"xxx",value:"<div align=\"center\"><a href='javascript:;' onclick=\"crossdrill('"+comp.id+"')\">设置</a></div>",group:"交叉表属性"}
			]
		});
}
function crossdrill(compId){
	var comp = findCompById(compId);
	if(comp.rows.length != 1){
		msginfo("交叉表行标签只有一个维度的时候才能配置交叉表钻取。");
		return;
	}
	var dd;
	if(!comp.drillDim){
		comp.drillDim = [];
	}else{
		dd = comp.drillDim[0];
	}
	var dims = null;
	var s = "<option value=\"\">--不启用--</option>";
	$.ajax({
		type:"post",
		url:"../bireport/queryDims.action",
		data: {cubeId: comp.cubeId},
		dataType:"json",
		async:false,
		success: function(resp){
			dims = resp;
			for(k=0; k<resp.length; k++){
				var name = resp[k].dim_desc;
				var id =  resp[k].col_name;
				var alias = resp[k].alias;
				s=s+"<option value=\""+alias+"\" "+(dd&&dd.code == alias?"selected":"")+">"+name+"</option>";
			}
		}
	});
	var findDim = function(alias){
		var ret = null;
		for(k=0; k<dims.length; k++){
			var t = dims[k];
			if(t.alias == alias){
				ret = t;
				break;
			}
		}
		return ret;
	}
	var row = comp.rows[0];
	var ctx = "<div class=\"textpanel\">当前交叉表行维度："+row.dimdesc+"<br/> <span class=\"inputtext\">钻取维度：</span><select id=\"drillDim\" name=\"drillDim\" class=\"inputform\">"+s+"</select></div>";
	$('#pdailog').dialog({
			title: "交叉表钻取配置",
			width: 310,
			height: 200,
			closed: false,
			cache: false,
			modal: true,
			content:ctx,
			buttons:[{
				text:'确定',
				iconCls:"icon-ok",
				handler:function(){
					var dimid = $("#pdailog #drillDim").val();
					if(dimid == ''){
						delete comp.drillDim;
					}else{
						var dim = findDim(dimid);
						comp.drillDim[0] = {name:dim.dim_desc,code:dim.alias,type:dim.dim_type,tableColKey:dim.tableColKey,tableColName:dim.tableColName,dimord:dim.dim_ord,colname:dim.col_name,tname:dim.tname,calc:dim.calc};
						
					}
					tableView(comp, comp.id);
					curTmpInfo.isupdate = true;
					$('#pdailog').dialog("close");
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#pdailog').dialog("close");
				}
			}]
	});
}
function setTextProperty(comp){
	if($("#compSet").size() == 0){
		$('#Jlayout').layout('add', {region:"east", split:false, width:240, title:"文本属性配置", collapsible:false, id:"compSet",  tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "east");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "east").panel("setTitle", "文本属性配置");
	}
	if(!comp.style){
		comp.style = {};
	}
	s = comp.style;
	$('#compSet').propertygrid({
		showGroup:true,
		border:false,
		showHeader:false,
		scrollbarSize: 0,
		fitColumns:false,
		onAfterEdit: function(rowIndex,rowData,changes){
			var val = rowData.value;
			var col = rowData.col;
			curTmpInfo.isupdate = true;
			
			if(col == "name"){
				comp.name = val;
				$("#c_"+comp.id + " div.ctit h5").text(val);
			}else if(col == "showtitle"){
				comp.showtitle = val;
			}else{
				comp.style[col] = val;
				var o = $("#c_"+comp.id+" .cctx");
				if(col == "tfontsize"){
					if(val == ''){
						o.css("font-size", "inherit");
					}else{
						o.css("font-size", val+"px");
					}
				}else if(col == "talign"){
					o.css("text-align", val);
				}else if(col == "tfontcolor"){
					o.css("color", val);
				}else if(col == "tfontweight"){
					if(val == "true"){
						o.css("font-weight", "bold");
					}else{
						o.css("font-weight", "normal");
					}
				}else if(col == "titalic"){
					if(val == "true"){
						o.css("font-style","italic");
					}else{
						o.css("font-style","normal");
					}
				}else if(col == "tunderscore"){
					if(val == "true"){
						o.css("text-decoration","underline");
					}else{
						o.css("text-decoration","inherit");
					}
				}else if(col=="tbgcolor"){
					if(val == ""){
						o.css("background-color", "inherit");
					}else{
						o.css("background-color", val);
					}
				}else if(col == "tlineheight"){
					if(val == '' || val == null){
						o.css("line-height", "inherit");
					}else{
						o.css("line-height",val+"px");
					}
				}
			}
			
		},
		data:[
			{name:'是否显示标题',col:'showtitle', value:(comp.showtitle?comp.showtitle:"true"), group:'文本属性', editor:{
				type:"checkbox",
				options:{"on":true, "off":false}
			}},
			{name:'标题',col:'name', value:(comp.name?comp.name:""), group:'文本属性', editor:'text'},
			{name:'位置', col:'talign', value:(s.talign?s.talign:""), group:'文本属性', editor:{
				type:'combobox',
				options:{data:[{value:'left',text:'left'},{value:'center',text:'center'},{value:'right',text:'right'}]} 
			}},
			{name:'背景颜色', col:'tbgcolor', value:(s.tbgcolor?s.tbgcolor:""), group:'文本属性',  editor:{
				type:'combobox',
				options:{data:colorJson, formatter:function(row){
					return "<div style=\"background-color:"+row.value+"\">"+row.text+"</div>";
				}}
			}},
			{name:'行高(lineHeight)',col:'tlineheight', value:(s.tlineheight?s.tlineheight:""), group:'文本属性', editor:'numberbox'},
			{name:'字体大小',col:'tfontsize', value:(s.tfontsize?s.tfontsize:""), group:'文本字体', editor:'numberbox'},
			{name:'字体颜色',col:'tfontcolor', value:(s.tfontcolor?s.tfontcolor:""), group:'文本字体', editor:{
				type:'combobox',
				options:{data:colorJson, formatter:function(row){
					return "<div style=\"background-color:"+row.value+"\">"+row.text+"</div>";
				}}
			}},
			{name:'是否粗体',col:'tfontweight', value:(s.tfontweight?s.tfontweight:""), group:'文本字体', editor:{
				type:"checkbox",
				options:{"on":true, "off":false}
			}},
			{name:'是否斜体',col:'titalic', value:(s.titalic?s.titalic:""), group:'文本字体', editor:{
				type:"checkbox",
				options: {"on":true, "off":false}
			}},
			{name:'是否下划线',col:'tunderscore', value:(s.tunderscore?s.tunderscore:""), group:'文本字体', editor:{
				type:"checkbox",
				options: {"on":true, "off":false}
			}}
		]
	});
}
function tableView(table, compId){
	if(table.kpiJson == undefined){
		return;
	}	//如果没有度量，维度等内容，返回界面到初始状态
	if(table.kpiJson.length == 0 && table.cols.length == 0 && table.rows.length == 0){
		$("#T" + compId + " div.ctx").html("<div align=\"center\" class=\"tipinfo\">(点击编辑按钮配置交叉表的列)</div>");
		return;
	}
	var json = JSON.parse(JSON.stringify(table));
	json.portalParams = pageInfo.params;
	__showLoading();
	$.ajax({
	   type: "POST",
	   url: "TableView.action",
	   contentType : "application/json",
	   dataType:"html",
	   data: JSON.stringify(json),
	   success: function(resp){
		  __hideLoading();
		  $("#c_" + compId + " div.cctx").html(resp);
	   },
	   error:function(resp){
		    __hideLoading();
		   $.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
}
function dimsort(tp){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
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
}
function kpisort(tp){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
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
//添加维度聚合项
function aggreDim(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
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
	
	
	var ctx = "<div style='line-height:30px; margin:20px 5px 5px 10px;'><label><input value='auto' id='autoaggre' name='autoaggre' type='checkbox'>自动聚合</label> (设置后，聚合方式的选择功能既无效)<br/>聚合方式：<select id=\"dimaggre\" name=\"dimaggre\"><option value=\"sum\">求和</option><option value=\"count\">计数</option><option value=\"avg\">平均</option><option value=\"max\">最大</option><option value=\"min\">最小</option><option value=\"var\">方差</option><option value=\"sd\">标准差</option><option value=\"middle\">中位数</option></select></div>";
	$('#pdailog').dialog({
		title: '维度聚合',
		width: 320,
		height: 200,
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
							var autoaggre = $("#pdailog input[name='autoaggre']:checked").size();
							if(autoaggre == 1){
								dim.aggre = "auto";
							}else{
								dim.aggre = $("#pdailog #dimaggre").val();
							}
							dim.issum = 'y';
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
	$("#pdailog input[name='autoaggre']").click(function(){
		var sel = $(this).attr("checked");
		if(sel){
			$("#pdailog #dimaggre").attr("disabled", "true");
		}else{
			$("#pdailog #dimaggre").removeAttr("disabled");
		}
	});
}
function dimkpimove(tp){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var pos  = curTmpInfo.pos;
	var name = curTmpInfo.dimname;
	//获取组件的JSON对象
	var comp = findCompById(compId);
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else if(pos =="row"){
		dims = comp.rows;
	}else if(pos == "kpi"){
		dims = comp.kpiJson;
	}
	if(dims.length <= 1){
		msginfo('无效移动。');
		return;
	}
	for(var i=0; i<dims.length; i++){
		if((pos=="kpi"?dims[i].kpi_id:dims[i].id) == dimid){
			if(tp == 'left'){
				if(i <= 0){
					msginfo('无效移动。');
					return;
				}else{
					var tp = dims[i - 1];
					dims[i - 1] = dims[i];
					dims[i] = tp;
					//交换维度
					$("#tableData #"+(pos=="kpi"?"k":"d")+"_"+dimid).prev().before($("#tableData #"+(pos=="kpi"?"k":"d")+"_"+dimid));
					curTmpInfo.isupdate = true;
					tableView(comp, compId);
					return;
				}
			}else
			if(tp == 'right'){
				if( i >= dims.length - 1){
					msginfo('无效移动。');
					return;
				}else{
					var tp = dims[i + 1];
					dims[i + 1] = dims[i];
					dims[i] = tp;
					//交换维度
					$("#tableData #"+(pos=="kpi"?"k":"d")+"_"+dimid).next().after($("#tableData #"+(pos=="kpi"?"k":"d")+"_"+dimid));
					curTmpInfo.isupdate = true;
					tableView(comp, compId);
					return;
				}
			}
			break;
		}
	}
}
//维度交换行列
function dimexchange(){
	var dimid = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
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
		comp.cols.splice(idx, 1);
		//再添加维度
		comp.rows.push(tmp);
		//移除维度dom
		$("#tableData #d_"+dimid).remove();
		//列字段添加维度
		var o = "<span id=\"d_"+tmp.id+"\" class=\"dimcol\"><span class=\"text\">"+tmp.dimdesc+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setRdimInfo(this, "+tmp.id+", '"+tmp.dimdesc+"','"+compId+"')\"> &nbsp; </a></span>";
		if($("#tableData #tabRows span.dimcol").size() > 0){
			$("#tableData #tabRows span.dimcol").last().after(o);
		}else{
			$("#tableData #tabRows b").after(o);
		}
		if(comp.cols.length == 0){
			$("#tableData #tabCols").remove();
		}
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
		comp.rows.splice(idx, 1);
		//再添加维度
		comp.cols.push(tmp);
		//移除维度dom
		$("#tableData #d_"+dimid).remove();
		//列字段添加维度
		var cols = comp.cols;
		if(cols.length == 1){
			$("#tableData").append("<span id=\"tabCols\"> &nbsp; &nbsp; <b>列字段：</b></span>");
		}
		$("#tableData #tabCols").append("<span id=\"d_"+tmp.id+"\" class=\"dimcol\"><span class=\"text\">"+tmp.dimdesc+"</span><a style=\"opacity: 0.6;\" href=\"javascript:;\" onclick=\"setCdimInfo(this, "+tmp.id+", '"+tmp.dimdesc+"','"+compId+"')\"> &nbsp; </a></span>");
	}
	curTmpInfo.isupdate = true;
	tableView(comp, compId);
}
function kpiproperty(){
	var kpiId = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
	var kpi = findKpiById(kpiId, comp.kpiJson);
	var ctx = "<div id=\"table_cell_tab\" style=\"height:auto; width:auto;\"><div title=\"基本信息\"><div style='line-height:25px; margin:10px;'><span class=\"inputtext\">度量名称：</span><input type=\"text\" id=\"name\" name=\"name\" class=\"inputform2\" value=\""+(kpi.kpi_name)+"\"><br><span class=\"inputtext\">所 属 表：</span> "+comp.tname+"<br><span class=\"inputtext\">对应字段：</span>"+kpi.col_name+"<br><span class=\"inputtext\">度量单位：</span><select id=\"kpiunit\" name=\"kpiunit\" class=\"inputform2\"><option value='1'></option><option value='1000'>千</option><option value='10000'>万</option><option value='1000000'>百万</option><option value='100000000'>亿</option></select>"+kpi.unit+"<br><span class=\"inputtext\">格 式 化：</span>"+
		"<select id=\"fmt\" name=\"fmt\" class=\"inputform2\"><option value=\"###,##0\">整数</option><option value=\"###,##0.0\">小数(保留1位)</option><option value=\"###,##0.00\">小数(保留2位)</option><option value=\"0.00%\">百分比</option></select><br/><span class=\"inputtext\">表头排序：</span><div class=\"checkbox checkbox-info checkbox-inline\" style=\"line-height:20px;\"><input type=\"checkbox\" id=\"headsort\" name=\"headsort\" "+(kpi.order&&kpi.order=="y"?"checked":"")+"><label for=\"headsort\"> </label></div></div></div><div title=\"回调函数\"><div class=\"textpanel\">function <input type=\"text\" id=\"funcname\" name=\"funcname\" style=\"width:120px;\" class=\"inputform2\" value=\""+(kpi.funcname?kpi.funcname:"")+"\">(<b>value</b>, <b>col</b>, <b>row</b>, <b>data</b>){<br/><textarea id=\"code\" name=\"code\" cols=\"50\" rows=\"5\">"+(kpi.code?unescape(kpi.code):"")+"</textarea><br/>}<br/><a target=\"_blank\" href=\"../helper/callback.html\" id=\"helper\">帮助</a></div></div>";
	$('#pdailog').dialog({
		title: '度量属性',
		width: 400,
		height: 320,
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
						kpi.kpi_name = $("#pdailog #name").val();
						var headsort =  $("#pdailog input[name='headsort']:checked").size();
						if(headsort == 0){
							kpi.order = "n";
						}else{
							kpi.order = "y";
						}
						
						var funcname = $("#table_cell_tab #funcname").val();
						var code =  $("#table_cell_tab #code").val();
						if(funcname == "" && code == ""){
							delete kpi.funcname;
							delete kpi.code;
						}else{
							if(funcname == ""){
								$("#pdailog #table_cell_tab").tabs("select", 1);
								msginfo("函数名是必填项！");
								$("#table_cell_tab #funcname").focus();
								return;
							}
							if(code == ""){
								$("#pdailog #table_cell_tab").tabs("select", 1);
								msginfo("函数内容是必填项！");
								$("#table_cell_tab #code").focus();
								return;
							}
							kpi.funcname = funcname;
							kpi.code = escape(code);
						}
						
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
	$("#pdailog #table_cell_tab").tabs({border:false,fit:true});
	$("#pdailog #table_cell_tab #helper").linkbutton({iconCls:'icon-tip'});
	//让格式化、聚合方式选中
	$("#pdailog #fmt").find("option[value='"+kpi.fmt+"']").attr("selected",true);
	$("#pdailog #kpiunit").find("option[value='"+kpi.rate+"']").attr("selected",true);
	$("#pdailog #aggreType").find("option[value='"+kpi.aggre+"']").attr("selected",true);
}
function setKpiInfo(ts, id, compId){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获取
	curTmpInfo.ckid = id;
	curTmpInfo.compId = compId;
	curTmpInfo.pos = "kpi";
	var comp = findCompById(compId);
	//设置度量排序的标识
	var kpi = findKpiById(id, comp.kpiJson);
	if(kpi.sort == 'asc'){
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-ok"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-blank"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-blank"});
	}else if(kpi.sort == 'desc'){
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-blank"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-ok"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-blank"});
	}else{
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord1")).target, iconCls:"icon-blank"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord2")).target, iconCls:"icon-blank"});
		$("#kpioptmenu").menu("setIcon", {target:$("#kpioptmenu").menu("getItem", $("#k_kpi_ord3")).target, iconCls:"icon-ok"});
	}
	$("#kpioptmenu").menu("show", {left:offset.left, top:offset.top - 100});
}
function setCdimInfo(ts, id, name, compId){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获
	curTmpInfo.ckid = id;
	curTmpInfo.compId = compId;
	curTmpInfo.pos = "col";
	curTmpInfo.dimname = name;
	//设置聚合菜单
	var issum = false;
	var comp = findCompById(compId);
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
	$("#dimoptmenu").menu("setText", {target:aggr.target, text:"移至行字段"});
	
	$("#dimoptmenu").menu("show", {left:offset.left, top:offset.top - 124});
}
function setRdimInfo(ts, id, name, compId){
	var offset = $(ts).offset();
	curTmpInfo.ckid = id;
	curTmpInfo.compId =compId;
	curTmpInfo.pos = "row";
	curTmpInfo.dimname = name;
	
	//设置聚合菜单
	var issum = false;
	var comp = findCompById(compId);
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
		$("#dimoptmenu").menu("setText", {target:aggr.target, text:"聚合"});
	}
	$("#dimoptmenu").menu("setText", {target:$("#m_moveto"), text:"移至列字段"});
	$("#dimoptmenu").menu("show", {left:offset.left, top:offset.top - 120});
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
			if(comp.cols[i].grouptype == 'date'){
				ret = true;
				break;
			}
		}
		if( !comp.rows){
			return ret;
		}
		for(var i=0; i<comp.rows.length; i++){
			if(comp.rows[i].grouptype == 'date'){
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
			if(comp.chartJson.params[i].grouptype == 'date'){
				ret = true;
				break;
			}
		}
		if(!comp.chartJson || !comp.chartJson.xcol){
			return ret;
		}
		if(comp.chartJson.xcol.grouptype == 'date'){
			ret = true;
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
function deletecomp(layoutId, compId){
	if(!confirm("是否确认删除组件？")){
		return;
	}
	//从布局器中删除，
	var td = findLayoutById(layoutId);
	var compIdx = -1;
	for(var i=0; i<td.children.length; i++){
		if(td.children[i].id == compId){
			compIdx = i;
			break;
		}
	}
	td.children.splice(compIdx, 1);
	
	//从临时组件列表中移除
	var idx = findCompById(compId, true);
	curTmpInfo.comps.splice(idx, 1);
	
	//页面移除
	$("#c_"+compId).remove();
	//移除数据面板
	 $('#Jlayout').layout("remove", "south");
	 //移除属性面板
	 $('#Jlayout').layout("remove", "east");
	 curTmpInfo.isupdate = true;
}
function findCompById(compId, returnIndex){
	var idx = -1;
	var comp = null;
	for(var i=0; curTmpInfo.comps&&i<curTmpInfo.comps.length; i++){
		if(curTmpInfo.comps[i].id == compId){
			comp = curTmpInfo.comps[i];
			idx = i;
			break;
		}
	}
	//返回序列号
	if(returnIndex && returnIndex == true){
		return idx;
	}else{
		return comp; //返回对象
	}
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
function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      //if((i==8)||(i==12)||(i==16)||(i==20))
      //  guid += "-";
    }
    return guid;    
}
