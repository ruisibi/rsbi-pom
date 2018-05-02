if($ == undefined){
	$ = jQuery;
}
function selecttable(){
	$('#pdailog').dialog({
		title: '选择数据集',
		width: 400,
		height: 350,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:'<ul id="targettables"></ul>',
		onLoad:function(){
		},
		buttons:[{
				text:'确定',
				handler:function(){
					var node = $("#targettables").tree("getSelected");
					if(node == null){
						msginfo("请选择表!");
						return;
					}
					pageInfo.table = {dsetId:node.attributes.dsetId, dsid:node.attributes.dsid,dsetName:node.attributes.dsetName,priTable:node.attributes.priTable};
					$("#comp_tab").tabs("select", 2);
					initTableTree();
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
	$.getJSON("../model/listDataset.action", {t:Math.random()}, function(dt){
		for(i=0; i<dt.length; i++){
			dt[i].id = dt[i].dsetId;
			dt[i].text = dt[i].name + "(" + dt[i].priTable + ")";
			dt[i].iconCls = 'icon-table';
			dt[i].attributes = {dsetId: dt[i].dsetId,dsetName:dt[i].name,priTable:dt[i].priTable, dsid:dt[i].dsid};
		}
		$("#targettables").tree({
			data:dt
		});
	});
}
function initTableTree(){
	if(!pageInfo.table){
		$("#tabletree").tree({
			lines:true,
			data:[{id:'nodata', text:'您还未选择数据表!', iconCls:'icon-no'}]
		});
	}else{
		var t = pageInfo.table;
		var dt = {id:t.dsetId, text:t.dsetName+"("+t.priTable+")",iconCls:'icon-table', children:[]};
		$.getJSON("../model/getDatasetCfg.action", {dsetId:t.dsetId,t:Math.random()}, function(resp){
			ret = resp.cols;
			for(i=0; i<ret.length; i++){
				dt.children.push({id:ret[i].name, text:ret[i].name, iconCls:'icon-dscol',attributes:{id:ret[i].name,name:ret[i].name,dsetId:t.dsetId,dsid:t.dsid, tname:ret[i].tname,type:ret[i].type, expression: ret[i].expression}});
			}
			//添加动态字段
			dyna = resp.dynamic;
			for(i=0; dyna&&dyna!=null&&i<dyna.length; i++){
				var r = dyna[i];
				dt.children.push({id:r.name, text:r.name, iconCls:'icon-dscol',attributes:{id:r.name,name:r.name,dsetId:t.dsetId,dsid:t.dsid, tname:r.tname,type:r.type, expression: r.expression}});
			}
			$("#tabletree").tree({
				lines:true,
				dnd:true,
				data:[dt],
				onBeforeDrag:function(target){
					if(!target.attributes || target.attributes.tp == 'root'){
						return false;
					}
					return true;
				},
				onDragEnter:function(target, source){
					return false;
				},
				onContextMenu:function(e, node){
					e.preventDefault();
				}
			});
		});
	}
}
function editGridData(compId){
	if($("#dataProperty").size() == 0){
		$('#Jlayout').layout('add', {region:"south", id:"dataProperty", split:false, collapsible:false,height : 120, title:'编辑表格数据', tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "south");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "south").panel("setTitle", "编辑表格数据");
	}
	//切换到数据表
	$("#comp_tab").tabs("select", 2);
	var comp = findCompById(compId);
	var str = "";
	for(var i=0; comp.cols&&i<comp.cols.length; i++){
		var o = comp.cols[i];
		str = str + "<span id=\"d_"+o.id+"\" class=\"dimcol\"><span class=\"text\">"+o.name+"</span><div class=\"ibox-tools\"><button class=\"btn btn-outline btn-success btn-xs\" onclick=\"setGridCol(this, '"+o.id+"', '"+o.name+"','"+compId+"')\"><i class=\"fa fa-wrench\"></i></button></div></span>";
	}
	if(str == ""){
		str = "<div class=\"tipinfo\">拖拽数据表字段到此处作为表格的列字段</div>";
	}else{
		str = "<span id=\"tabRows\"><b>表格字段：</b>" + str + "</span>";
	}
	
	var ctx = "<div style=\"margin:10px;\"><div class=\"tableDatasty\" id=\"gridData\">"+str +"</div></div>";
	$("#dataProperty").html(ctx);
	//注册接收度量及维度拖放事件
	$("#gridData").droppable({
		accept:"#tabletree .tree-node",
		onDragEnter:function(e,source){
			//对维度拖拽设置图标
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
			$("#gridData").css("border", "1px solid #ff0000");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			$("#gridData").css("border", "1px dotted #666");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var grid = findCompById(compId);
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//清除边框颜色
			$("#gridData").css("border", "1px dotted #666");
			
			//获取TREE
			var node = $("#tabletree").tree("getNode", source);
			
			if(grid.dsetId && grid.dsetId != node.attributes.dsetId){
				msginfo("你拖入的字段"+node.text+"与表格已有的内容不在同一个表中，拖放失败！");
				return;
			}else{
				grid.dsetId = node.attributes.dsetId;
				grid.dsid = node.attributes.dsid;
			}
			if(!grid.cols){
				grid.cols = [];
			}
			//判断是否存在
			var exist = function(gid){
				var r = false;
				for(j=0; j<grid.cols.length; j++){
					if(grid.cols[j].id == gid){
						r = true;
						break;
					}
				}
				return r;
			};
			if(exist(node.id)){
				msginfo("您拖拽的字段 " + node.text+" 已经存在。");
				return;
			}
			grid.cols.push({id:node.id,name:node.attributes.name,tname:node.attributes.tname,type:node.attributes.type,expression:node.attributes.expression});
			var str = "<span id=\"d_"+node.id+"\" class=\"dimcol\"><span class=\"text\">"+node.text+"</span><div class=\"ibox-tools\"><button class=\"btn btn-outline btn-success btn-xs\" onclick=\"setGridCol(this, '"+node.id+"', '"+node.text+"','"+compId+"')\"><i class=\"fa fa-wrench\"></i></button></div></span>";
			var obj = $("#gridData");
			if(obj.find("#tabRows").size() == 0){
				obj.html("<span id=\"tabRows\"><b>表格字段：</b>"+str+"</span>");
			}else{
				$("#gridData #tabRows").find("span.dimcol").last().after(str);
			}
			curTmpInfo.isupdate = true;
			gridView(grid);
		}
	});
}
function gridView(grid){
	if(!grid){
		return;
	}
	if(!grid.cols || grid.cols.length==0){
		return;
	}
	var json = eval("("+JSON.stringify(grid)+")");
	json.portalParams = pageInfo.params;
	__showLoading();
	$.ajax({
	   type: "POST",
	   url: "GridView.action",
	   contentType : "application/json",
	   dataType:"html",                                            
	   data: JSON.stringify(json),
	   success: function(resp){
		   __hideLoading();
		   $("#c_" + grid.id + " div.cctx div.ccctx").html(resp);
	   },
	   error:function(resp){
		   __hideLoading();
		   $.messager.alert('出错了','系统出错，请查看后台日志。','error');
	   }
	});
}
function setGridCol(ts, id, name, compId){
	var offset = $(ts).offset();
	//放入临时对象中，方便下次获
	curTmpInfo.ckid = id;
	curTmpInfo.compId = compId;
	curTmpInfo.dimname = name;
	var comp = findCompById(compId);
	var col = findColById(id, comp);
	if(col.sort == 'asc'){
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord1")).target, iconCls:"icon-ok"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord2")).target, iconCls:"icon-blank"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord3")).target, iconCls:"icon-blank"});
	}else if(col.sort == 'desc'){
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord1")).target, iconCls:"icon-blank"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord2")).target, iconCls:"icon-ok"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord3")).target, iconCls:"icon-blank"});
	}else{
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord1")).target, iconCls:"icon-blank"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord2")).target, iconCls:"icon-blank"});
		$("#gridoptmenu").menu("setIcon", {target:$("#gridoptmenu").menu("getItem", $("#col_ord3")).target, iconCls:"icon-ok"});
	}
	$("#gridoptmenu").menu("show", {left:offset.left, top:offset.top - 96});
}
function gridColsort(tp){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
	var col = findColById(id, comp);
	//清楚其他字段的排序
	for(i=0; i<comp.cols.length; i++){
		delete comp.cols[i].sort;
	}
	if(tp != ""){
		col.sort = tp;
	}
	curTmpInfo.isupdate = true;
	gridView(comp);
}
function setGridColProp(){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
	var col = findColById(id, comp);
	
	var fmtstr = "";
	if(col.type == "Double" || col.type == "Int"){
		fmtstr =  "<span class='inputtext'>格 式 化：</span><select id=\"fmt\" name=\"fmt\" class=\"inputform2\"><option value=\"\"></option><option value=\"###,##0\" "+(col.fmt=="###,##0"?"selected":"")+">整数</option><option value=\"###,##0.0\" "+(col.fmt=="###,##0.0"?"selected":"")+">小数(保留1位)</option><option value=\"###,##0.00\" "+(col.fmt=="###,##0.00"?"selected":"")+">小数(保留2位)</option><option value=\"0.00%\" "+(col.fmt=="0.00%"?"selected":"")+">百分比</option></select><br/>";
	}
	if(col.type == "Date" || col.type == "Datetime"){
		fmtstr = "<span class='inputtext'>格 式 化：</span><input type='text' id='fmt' name='fmt' class='inputform2' value=\""+(col.fmt?col.fmt:"")+"\"><br/>";
	}
	
	var ctx = "<div class=\"textpanel\"><span class='inputtext'>显示名称：</span><input type=\"text\" id=\"dispName\" name=\"dispName\" class=\"inputform2\" value=\""+(col.dispName?col.dispName:"")+"\"><br><span class='inputtext'>所 属 表： </span>"+col.tname+"<br><span class='inputtext'>对应字段：</span> "+col.name+"<br>"+fmtstr+"<span class='inputtext'>位置：</span><select id=\"palign\" name=\"palign\" class=\"inputform2\"><option value=\"\"></option><option value=\"left\" "+(col.align=="left"?"selected":"")+">居左</option><option value=\"center\" "+(col.align=="center"?"selected":"")+">居中</option><option value=\"right\" "+(col.align=="right"?"selected":"")+">居右</option></select></div>";
	$('#pdailog').dialog({
		title: '表格字段属性',
		width: 350,
		height: 270,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
					text:'确定',
					iconCls:"icon-ok",
					handler:function(){
						var dispName = $("#pdailog #dispName").val();
						var fmt = $("#pdailog #fmt").val();
						var align = $("#pdailog #palign").val();
						col.dispName = dispName;
						col.fmt = fmt;
						col.align = align;
						$('#pdailog').dialog('close');
						curTmpInfo.isupdate = true;
						gridView(comp);
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
function tableColmove(tp){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
	var dims = comp.cols;
	if(dims.length <= 1){
		msginfo('无效移动。');
		return;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == id){
			if(tp == 'left'){
				if(i <= 0){
					msginfo('无效移动。');
					return;
				}else{
					var tp = dims[i - 1];
					dims[i - 1] = dims[i];
					dims[i] = tp;
					//交换维度
					$("#gridData #d_"+id).prev().before($("#gridData #d_"+id));
					curTmpInfo.isupdate = true;
					gridView(comp);
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
					$("#gridData #d_"+id).next().after($("#gridData #d_"+id));
					curTmpInfo.isupdate = true;
					gridView(comp);
					return;
				}
			}
			break;
		}
	}
}
function delGridCol(){
	var id = curTmpInfo.ckid;
	var compId = curTmpInfo.compId;
	var comp = findCompById(compId);
	if(comp.cols.length == 1){
		msginfo("表格至少需要含有一个字段。");
		return;
	}
	//从json移除
	var idx = -1;
	for(i=0; i<comp.cols.length; i++){
		var p = comp.cols[i];
		if(p.id == id){
			idx = i;
			break;
		}
	}
	comp.cols.splice(idx, 1);
	$("#gridData #d_" + id).remove();
	
	curTmpInfo.isupdate = true;
	gridView(comp);
}
function setGridProperty(comp){
	if($("#compSet").size() == 0){
		$('#Jlayout').layout('add', {region:"east", split:false, width:240, title:"表格属性配置", collapsible:false, id:"compSet",  tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "east");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "east").panel("setTitle", "表格属性配置");
	}
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
			}else{
				if(comp[col] == val){
					return; //值未变
				}
				comp[col] = val;
			}
			if( col == "lockhead" || col == "isnotfy" || col == "pageSize"){
				gridView(comp);
			}
		},
		data:[
			{name:'表格标题',col:'name', value:(comp.name?comp.name:""), group:'表格属性', editor:'text'},
			{name:'是否显示标题',col:'showtitle', value:(comp.showtitle?comp.showtitle:"true"), group:'表格属性', editor:{
				type:"checkbox",
				options:{"on":true, "off":false}
			}},
			{name:'禁用分页',col:'isnotfy', value:(comp.isnotfy?comp.isnotfy:""), group:'表格属性', editor:{
				type:"checkbox",
				options: {"on":true, "off":false}
			}},
			{name:'每页显示条数',col:'pageSize', value:(comp.pageSize?comp.pageSize:"10"), group:'表格属性', editor:{type:'numberspinner',options:{min:1,max:100,increment:5}}}
			]
		});
}
function setBoxProperty(comp){
	if($("#compSet").size() == 0){
		$('#Jlayout').layout('add', {region:"east", split:false, width:240, title:"数据块属性配置", collapsible:false, id:"compSet",  tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "east");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "east").panel("setTitle", "数据块属性配置");
	}
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
			}else if(col == "bgcolor"){
				comp[col] = val;
				if(val == ""){ //
					$("#c_"+comp.id + " div.ibox-content").css("background-color", "inherit");
				}else{
					$("#c_"+comp.id + " div.ibox-content").css("background-color", val);
				}
			}else if(col == "showtitle" ){
				comp[col] = val;
			}else{
				if(comp.kpiJson[col] == val){ //值未改变
					return;
				}
				comp.kpiJson[col] = val;
				boxView(comp);
			}
		},
		data:[
			{name:'标题',col:'name', value:(comp.name?comp.name:""), group:'数据块属性', editor:'text'},
			{name:'单位',col:'unit', value:(comp.kpiJson&&comp.kpiJson!=null?comp.kpiJson.unit:""), group:'数据块属性', editor:'text'},
			{name:'格式化',col:'fmt', value:(comp.kpiJson&&comp.kpiJson!=null?comp.kpiJson.fmt:""), group:'数据块属性', editor:{
				type:'combobox',
				options:{data:fmtJson}
			}},
			{name:'度量比例',col:'rate', value:(comp.kpiJson&&comp.kpiJson!=null?comp.kpiJson.rate:""), group:'数据块属性', editor:{
				type:'combobox',
				options:{data:kpirate}
			}},
			{name:'字体大小',col:'tfontsize', value:(comp.kpiJson&&comp.kpiJson.tfontsize?comp.kpiJson.tfontsize:"32"), group:'数据块属性', editor:{type:'numberspinner',options:{min:9,max:100,increment:3}}},
			{name:'字体颜色',col:'tfontcolor', value:(comp.kpiJson&&comp.kpiJson.tfontcolor?comp.kpiJson.tfontcolor:""), group:'数据块属性', editor:{
				type:'combobox',
				options:{data:colorJson, formatter:function(row){
					return "<div style=\"background-color:"+row.value+"\">"+row.text+"</div>";
				}}
			}},
			{name:'背景颜色',col:'bgcolor', value:(comp.bgcolor?comp.bgcolor:""), group:'数据块属性', editor:{
				type:'combobox',
				options:{data:colorJson, formatter:function(row){
					return "<div style=\"background-color:"+row.value+"\">"+row.text+"</div>";
				}}
			}}
		]
	});
}

function editBoxData(compId){
	if($("#dataProperty").size() == 0){
		$('#Jlayout').layout('add', {region:"south", id:"dataProperty", split:false, collapsible:false,height : 100, title:'绑定数据块度量', tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "south");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "south").panel("setTitle", "绑定数据块度量");
	}
	//切换选项卡到立方体
	$("#comp_tab").tabs("select", 1);
	
	var comp = findCompById(compId);
	var str = "";
	if(!comp.kpiJson){
		str = "<div class=\"tipinfo\">拖拽需要展现的立方体度量到此处。</div>";
	}
	var colstr = "";
	var o = comp.kpiJson;
	if(o){
		colstr = "<span id=\"d_"+o.kpi_id+"\" class=\"boxcol\"><span class=\"text\">"+o.kpi_name+"</span></span>";
	}
	var ctx = "<div style=\"margin:10px;\"><div class=\"tableDatasty\" id=\"boxData\">"+str + colstr +"</div></div>";
	$("#dataProperty").html(ctx);
	//注册接收度量及维度拖放事件
	$("#dataProperty #boxData").droppable({
		accept:"#datasettree .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			//只能拖拽度量
			if(tp == 2){
			}else{
				return;
			}
			
			//对维度拖拽设置图标
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
			$(this).css("border", "1px solid #ff0000");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			$(this).css("border", "1px dotted #666");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			var id = compId
			var json = findCompById(id);
			
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			
			//清除边框颜色
			$(this).css("border", "1px dotted #666");
			
			//获取TREE
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			//只能拖拽度量
			if(tp == 2){
			}else{
				msginfo("只能拖拽度量到数据块中显示。");
				return;
			}
			
			json.dsetId = node.attributes.dsetId;
			json.dsid = node.attributes.dsid;
			json.kpiJson = {"kpi_id":node.attributes.col_id, "kpi_name" : node.text, "col_name":node.attributes.col_name, "aggre":node.attributes.aggre, "fmt":node.attributes.fmt, "alias":node.attributes.alias,"tname":node.attributes.tname,"unit":node.attributes.unit,"rate":node.attributes.rate};
			$("#dataProperty #boxData").html("<span id=\"k_"+node.attributes.col_id+"\" class=\"boxcol\"><span class=\"text\">"+node.text+"</span></span>");
			//设置title
			comp.name = node.text;
			$("#c_" + comp.id + " div.ctit h5").html(comp.name);
			curTmpInfo.isupdate = true;
			boxView(comp);
		}
	});
}
function boxView(comp){
	if(!comp.kpiJson){
		return;
	}
	var json = {"kpiJson":comp.kpiJson, height:comp.height, "dsid":comp.dsid, "dsetId":comp.dsetId, portalParams:pageInfo.params,params:comp.params};
	__showLoading();
	$.ajax({
	   type: "POST",
	   url: "BoxView.action",
	   contentType : "application/json",
	   dataType:"html",                                            
	   data: JSON.stringify(json),
	   success: function(resp){
		   __hideLoading();
		  $("#c_"+comp.id + " div.cctx div.ccctx").html(resp);
	   },
	   error:function(resp){
		   __hideLoading();
		   $.messager.alert('出错了','系统出错，请查看后台日志。','error');
	   }
	});
}
function findColById(id, comp){
	var ret;
	for(i=0; i<comp.cols.length; i++){
		var p = comp.cols[i];
		if(p.id == id){
			ret = p;
			break;
		}
	}
	return ret;
}