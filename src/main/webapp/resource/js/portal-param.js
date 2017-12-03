if($ == undefined){
	$ = jQuery;
}
function initParams(){
	//参数拖拽
	$('#param_tree').tree({
		dnd:true,
		onBeforeDrag:function(target){
			return true;
		},
		onDragEnter:function(target, source){
			return false;
		}
	});
	//参数接收
	$("#optparam").droppable({
		accept:"#param_tree .tree-node",
		onDragEnter:function(e,source){
			$("#optparam").css("border", "1px solid #ff0000");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
		},
		onDragLeave:function(e,source){
			$("#optparam").css("border", "1px solid #d3d3d3");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			
		},
		onDrop:function(e,source){
			$("#optparam").css("border", "1px solid #d3d3d3");
			var node = $("#param_tree").tree("getNode", source);
			newparam("insert", node.attributes.tp);
		}

	});
	
	//参数初始化
	var strs = "";
	for(i=0; pageInfo.params&&i<pageInfo.params.length; i++){
		var obj = pageInfo.params[i];
		strs = strs + "<span id=\"p"+obj.id+"\" class=\"pppp\"><span class=\"text\" onclick=\"newparam('update','"+obj.type+"','"+obj.id+"')\" title=\"编辑\">"+obj.name+"("+getParamTypeDesc(obj.type)+")</span><div class=\"ibox-tools\" style=\"margin-top:3px;\"><button onclick=\"optParam(this,'"+obj.id+"', '"+obj.type+"')\" title=\"设置\" class=\"btn btn-outline btn-success btn-xs\"><i class=\"fa fa-wrench\"></i></button> <button onclick=\"deleteParam('"+obj.id+"')\" title=\"删除\" class=\"btn btn-outline btn-danger btn-xs\"><i class=\"fa fa-times\"></i></button></div></span>";
	}
	if(strs != ""){
		$("#optparam").html(strs);
	}
}
function moveparam(pos){
	var pid = curTmpInfo.paramId;
	var idx = findParamById(pid, true);
	if(idx == 0 && pos == "left"){
		msginfo("参数已在最左边，无法移动。");
		return;
	}else if(idx == pageInfo.params.length - 1 && pos == "right"){
		msginfo("参数已在最右边，无法移动。");
		return;
	}
	var pms = pageInfo.params;
	if(pos == "left"){
		var tp = pms[idx - 1];
		pms[idx - 1] = pms[idx];
		pms[idx] = tp;
		//交换参数位置
		$("#optparam #p"+pid).prev().before($("#optparam #p"+pid));
		curTmpInfo.isupdate = true;
	}else if(pos == "right"){
		var tp = pms[idx + 1];
		pms[idx + 1] = pms[idx];
		pms[idx] = tp;
		//交换参数位置
		$("#optparam #p"+pid).next().after($("#optparam #p"+pid));
		curTmpInfo.isupdate = true;
	}
}
function newparam(tp, paramType, pid){
	var param = null;
	if(!paramType){
		paramType = curTmpInfo.paramType;
	}
	if(!pid){
		pid = curTmpInfo.paramId;
	}
	curTmpInfo.paramvals = [];
	if(tp == 'update'){
		param = findParamById(pid);
		if(param.values){
			curTmpInfo.paramvals = param.values;
		}
	}
	var str = "";
	var defstr = "";
	if(paramType == "dateselect"){
		defstr = "now表示默认当前日期";
		var datetype = ['yyyyMMdd', 'yyyy-MM-dd', 'yyyy年MM月dd日'];
		var datestr = "<option></option>";
		for(i=0; i<datetype.length; i++){
			datestr = datestr + "<option value='"+datetype[i]+"' "+(param != null && datetype[i] == param.dtformat ?"selected":"")+">"+datetype[i]+"</option>";
		}
		str = "<br/><span class=\"inputtext\">日期格式：</span><select id='dtformat' name='dtformat' class='inputform2'>"+datestr+"</select><br/><span class=\"inputtext\">最小值：</span><input type=\"text\" class=\"inputform2\" name=\"minval\" id=\"minval\" value=\""+(param==null?"":param.minval)+"\" ><br/><span class=\"inputtext\">最大值：</span><input type=\"text\" class=\"inputform2\" name=\"maxval\" id=\"maxval\" value=\""+(param==null?"":param.maxval)+"\" >";
	}
	if(paramType == "monthselect"){
		defstr = "now表示默认当前月份";
		var datetype = ['yyyyMM', 'yyyy-MM', 'yyyy年MM月'];
		var datestr = "<option></option>";
		for(i=0; i<datetype.length; i++){
			datestr = datestr + "<option value='"+datetype[i]+"' "+(param != null && datetype[i] == param.dtformat ?"selected":"")+">"+datetype[i]+"</option>";
		}
		str = "<br/><span class=\"inputtext\">月份格式：</span><select id='dtformat' name='dtformat' class='inputform2'>"+datestr+"</select><br/><span class=\"inputtext\">最小值：</span><input type=\"text\" class=\"inputform2\" name=\"minval\" id=\"minval\" value=\""+(param==null?"":param.minval)+"\" ><br/><span class=\"inputtext\">最大值：</span><input type=\"text\" class=\"inputform2\" name=\"maxval\" id=\"maxval\" value=\""+(param==null?"":param.maxval)+"\" >";
	}
	if(paramType == "yearselect"){
		defstr = "now表示默认当前年份";
		var datetype = ['yyyy', 'yyyy年'];
		var datestr = "<option></option>";
		for(i=0; i<datetype.length; i++){
			datestr = datestr + "<option value='"+datetype[i]+"' "+(param != null && datetype[i] == param.dtformat ?"selected":"")+">"+datetype[i]+"</option>";
		}
		str = "<br/><span class=\"inputtext\">年份格式：</span><select id='dtformat' name='dtformat' class='inputform2'>"+datestr+"</select><br/><span class=\"inputtext\">最小值：</span><input type=\"text\" class=\"inputform2\" name=\"minval\" id=\"minval\" value=\""+(param==null?"":param.minval)+"\" ><br/><span class=\"inputtext\">最大值：</span><input type=\"text\" class=\"inputform2\" name=\"maxval\" id=\"maxval\" value=\""+(param==null?"":param.maxval)+"\" >";
	}
	var tmp = "";
	if(paramType == "checkbox" || paramType == "radio"){
		//获取所有用户的表
		$.ajax({
			type:"post",
			url:"../model/listCube.action",
			data: {t: Math.random()},
			dataType:"json",
			async:false,
			success: function(resp){
				for(k=0; k<resp.length; k++){
					tmp = tmp + "<option value='"+resp[k].cubeId+"@"+resp[k].cubeName+"@"+resp[k].dsId+"' "+(param != null && param.option && resp[k].cubeId == param.option.tableId ?"selected":"" )+">"+resp[k].cubeName+"</option>";
				}
			}
		});
	}
	
	//获取动态值得value/text字段的 option
	var valOption = "";
	if(param != null && param.option && param.valtype=="dynamic" && param.option.tableId && param.option.tableId != ''){
		$.ajax({
			type:"post",
			url:"../bireport/queryDims.action",
			data: {cubeId: param.option.tableId},
			dataType:"json",
			async:false,
			success: function(resp){
				for(k=0; k<resp.length; k++){
					var name = resp[k].dim_desc;
					var id =  resp[k].dim_id;
					var alias = resp[k].alias;
					valOption = valOption + "<option value=\""+id+"@"+alias+"\" "+(alias==param.option.alias?"selected":"")+">"+name+"</option>";
				}
			}
		});
	}
	
	var values = reloadParamVals(true);
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">参数标识：</span><input type=\"text\" class=\"inputform2\" name=\"paramid\" id=\"paramid\" value=\""+(param==null?"":param.paramid)+"\" "+(tp=='insert'?"":"readonly")+" placeholder=\"创建后不能更改\"><br/><span class=\"inputtext\">显示名称：</span><input type=\"text\" class=\"inputform2\" name=\"paramname\" id=\"paramname\" value=\""+(param==null?"":param.name)+"\"><br/><span class=\"inputtext\">长度：</span><input type=\"text\" size=\"5\" name=\"size\" class=\"inputform2\" id=\"size\" value=\""+(param!=null&&param.size?param.size:"")+"\" placeholder=\"取值5-30\"><br/><span class=\"inputtext\">默认值：</span><input type=\"text\" size=\"15\" name=\"defvalue\" id=\"defvalue\" value=\""+(param==null?"":param.defvalue)+"\" class=\"inputform2\" placeholder=\""+defstr+"\">"+str +"<br/><span class=\"inputtext\">隐藏参数：</span><div class=\"checkbox checkbox-info checkbox-inline\" style=\"line-height:20px;\"><input type='checkbox' id='hiddenprm' name='hiddenprm' value='y' "+(param!=null&&param.hiddenprm=='y'?"checked":"")+"><label for=\"hiddenprm\">隐藏参数不会在页面中显示</label></div>" + (paramType=="radio"||paramType=="checkbox"?"<div id=\"values\"><fieldset><legend>值列表</legend><div style='margin:0px 3px 3px 3px;'><div class=\"radio radio-info radio-inline\" style=\"line-height:20px;\"><input type='radio' id='valtype1' name='valtype' value=\"static\" "+(param==null||param.valtype=='static'?"checked":"")+"><label for=\"valtype1\">静态值</label></div> <div class=\"radio radio-info radio-inline\" style=\"line-height:20px;\"><input type='radio' id='valtype2' name='valtype' value=\"dynamic\" "+(param!=null&&param.valtype=='dynamic'?"checked":"")+"><label for=\"valtype2\">动态值</label></div></div><div class=\"param_left\" style=\"display:"+(param==null||param.valtype=='static'?"block":"none")+"\"><table cellspacing=\"0\" cellpadding=\"0\" class=\"grid3\"><tr><th width='33%'>Value</th><th width='33%'>Text</th><th width='33%'>操作</th></tr>"+values+"</table></div><div style=\"display:"+(param==null||param.valtype=='static'?"block":"none")+"\" class=\"param_right\"><a href=\"javascript:newparamval(false);\"><img src='../resource/img/edit_add.png' border='0' title='新增'></a><br/></div><div id=\"dynamic_div\" style=\"display:"+(param!=null&&param.valtype=='dynamic'?"block":"none")+"\"><span class=\"inputtext\">数据：</span><select id=\"dataset\" name=\"dataset\" class=\"inputform2\"><option vlaue=''></option>"+tmp+"</select><br/><span class=\"inputtext\">映射字段：</span><select id=\"param_option_val\" name=\"param_option_val\" class=\"inputform2\">"+valOption+"</select></div></fieldset></div>":"") +"</div>";
	var tpname = getParamTypeDesc(paramType);
	$('#pdailog').dialog({
		title: (tp == 'insert' ? '创建参数' : '编辑参数') + " - " + tpname,
		width: 410,
		height: paramType == "dateselect" || paramType == "monthselect"||paramType == "yearselect" ? 340 : (paramType=="text"?240:490),
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		onLoad:function(){},
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var paramid = $("#pdailog #paramid").val();
				if(paramid == ''){
					msginfo("请填写参数标识!");
					$("#pdailog #paramid").focus();
					return;
				}
				if(ischinese($("#pdailog #paramid").val())){
					msginfo("参数标识必须是英文字符!");
					$("#pdailog #paramid").select();
					return;
				}
				var name = $("#pdailog #paramname").val();
				var defvalue = $("#pdailog #defvalue").val();
				var size = $("#pdailog #size").val();
				var tpname = getParamTypeDesc(paramType);
				if(isNaN(size)){
					msginfo("长度必须是数字!");
					$("#pdailog #size").select();
					return;
				}
				if(size != ""){
					if( size < 5 || size > 30){
						msginfo("长度取值5-30!");
						$("#pdailog #size").select();
						return;
					}
				}
				var hiddenprm = $("#pdailog input[name=\"hiddenprm\"]:checked").val();
				
				//判断是否有option值
				if( paramType == 'radio' || paramType == 'checkbox'){
					var r = $("#pdailog input[name=\"valtype\"]:checked").val();
					if(r == 'static'){
						if(!curTmpInfo.paramvals || curTmpInfo.paramvals.length == 0){
							msginfo("您还未设置参数值。");
							return;
						}
					}else {
						if($("#pdailog #dataset").val() == '' || $("#pdailog #param_option_val").val() == '' || $("#pdailog #param_option_text").val() == ''){
							msginfo("您的参数还未绑定到数据。");
							return;
						}
					}
				}
				var r = $("#pdailog input[name=\"valtype\"]:checked").val();
				if(tp == 'insert'){
					if($("#optparam span.charttip").size() > 0){
						$("#optparam span.charttip").remove();
					}
					var obj = {id:newGuid(), type:paramType, paramid:paramid, name:name,defvalue:defvalue, size:size, hiddenprm:hiddenprm};
					if(paramType == "dateselect" || paramType == "monthselect" || paramType == "yearselect"){
						obj.maxval = $("#pdailog #maxval").val();
						obj.minval = $("#pdailog #minval").val();
						obj.dtformat = $("#pdailog #dtformat").val();
 					}
					if( paramType == 'radio' || paramType == 'checkbox'){
						obj.valtype = r;
						if(r == 'static'){
							obj.values = curTmpInfo.paramvals;
						}else{
							var val = $("#pdailog #param_option_val").val();
							var vls = val.split("@");
							var ts = $("#pdailog #dataset").val();
							var tss = ts.split("@");
							obj.option = {"tableId":tss[0], "tname":tss[1],"dsource":tss[2],"dimId":vls[0], "alias":vls[1]};
						}
						
					}
					var str = "<span id=\"p"+obj.id+"\" class=\"pppp\"><span class=\"text\" onclick=\"newparam('update','"+paramType+"','"+obj.id+"')\" >"+name+"("+tpname+")</span><div class=\"ibox-tools\" style=\"margin-top:3px;\"><button class=\"btn btn-outline btn-success btn-xs\"  onclick=\"optParam(this,'"+obj.id+"', '"+obj.type+"')\" title=\"设置\"><i class=\"fa fa-wrench\"></i></button> <button class=\"btn btn-outline btn-danger btn-xs\" onclick=\"deleteParam('"+obj.id+"')\" title=\"删除\"><i class=\"fa fa-times\"></i></button></div></span>";
					$("#optparam").append(str);
					if(!pageInfo.params){
						pageInfo.params = [];
					}
					pageInfo.params.push(obj);
				}else{
					param.name = name;
					param.defvalue = defvalue;
					param.size = size;
					param.hiddenprm = hiddenprm;
					if(paramType == "dateselect" || paramType == "monthselect" || paramType == "yearselect"){
						param.maxval = $("#pdailog #maxval").val();
						param.minval = $("#pdailog #minval").val();
						param.dtformat = $("#pdailog #dtformat").val();
 					}
					if(paramType == 'radio' || paramType == 'checkbox'){
						param.valtype = r;
						if(r == 'static'){
							param.values = curTmpInfo.paramvals;
							delete param.option;
						}else{
							var val = $("#pdailog #param_option_val").val();
							var vls = val.split("@");
							var ts = $("#pdailog #dataset").val();
							var tss = ts.split("@");
							param.option = {"tableId":tss[0], "tname":tss[1],"dsource":tss[2],"dimId":vls[0], "alias":vls[1]};
							delete param.values;
						}
					}
					$("#p" + param.id + " span.text").text(name + "("+tpname+")");
				}
				curTmpInfo.isupdate = true;
				$('#pdailog').dialog('close');
			}
		}
		,{
			text:'取消',
			iconCls:"icon-cancel",
			handler:function(){
				$('#pdailog').dialog('close');
			}
		}]
	});
	$("#pdailog #valtype1,#pdailog #valtype2").bind("click", function(){
		var val = $(this).val();
		if(val == 'static'){
			$("#pdailog #dynamic_div").css("display", "none");
			$("#pdailog .param_left").css("display", "block");
			$("#pdailog .param_right").css("display", "block");
		}else{
			$("#pdailog #dynamic_div").css("display", "block");
			$("#pdailog .param_left").css("display", "none");
			$("#pdailog .param_right").css("display", "none");
		}
	});
	//参数绑定到数据集，设置VALUE,TEXT 方法。
	$("#pdailog #dataset").bind("change", function(){
		var t1 = "param_option_val";
		document.getElementById(t1).options.length = 0;
		var tp = $(this).attr("id");
		var val = $(this).val();
		if(val == ""){
			return;
		}
		var tid = val.split("@")[0];
		$.ajax({
			type:"post",
			url:"../bireport/queryDims.action",
			data: {cubeId: tid},
			dataType:"json",
			success: function(resp){
				for(k=0; k<resp.length; k++){
					var varItem = new Option(resp[k].dim_desc + "(" + resp[k].alias + ")", resp[k].dim_id +"@" + resp[k].alias );
					document.getElementById(t1).options.add(varItem);
				}
			}
		});
	});
}
function optParam(ts, paramId, paramType){
	var offset = $(ts).offset();
	curTmpInfo.paramId = paramId;
	curTmpInfo.paramType = paramType;
	$("#param_menu").menu("show", {left:offset.left, top:offset.top + 20});
}
function reloadParamVals(isreturn){
	$("#pdailog #values table tr").each(function(index, b){
		if(index > 0){
			$(this).remove();
		}
	});
	var str = "";
	for(var i=0; i<curTmpInfo.paramvals.length; i++){
		var o = curTmpInfo.paramvals[i];
		str = str + "<tr><td  class=\"kpiData1 grid3-td\">"+o.value+"</td><td  class=\"kpiData1 grid3-td\">"+o.text+"</td><td class=\"kpiData1 grid3-td\"><a href=\"javascript:newparamval(true,'"+o.value+"');\"><img title='编辑' src='../resource/img/pencil.png' border='0'></a> &nbsp; <a href=\"javascript:paramdelvals('"+o.value+"');\"><img title='删除' src='../resource/img/closeme.png' border='0'></a></td></tr>";
	}
	for(var i=curTmpInfo.paramvals.length; i<5; i++){
		str = str + "<tr>";
		for(j=0; j<3; j++){
			str = str + "<td class=\"kpiData1 grid3-td\"> &nbsp; </td>";
		}
		str = str + "</tr>";
	}
	if(isreturn == true){
		return str;
	}else{
		$(str).insertAfter("#pdailog #values table tr");
	}
}
function paramdelvals(val){
	var idx = -1;
	for(var i=0; i<curTmpInfo.paramvals.length; i++){
		if(curTmpInfo.paramvals[i].value == val){
			idx = i;
			break;
		}
	}
	curTmpInfo.paramvals.splice(idx, 1);
	reloadParamVals();
}
function delallparamval(){
	curTmpInfo.paramvals = [];
	reloadParamVals();
	curTmpInfo.isupdate = true;
}
function newparamval(isupdate, valId){
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	var t = null;
	if(isupdate && valId){
		for(var i=0; i<curTmpInfo.paramvals.length; i++){
			if(curTmpInfo.paramvals[i].value == valId){
				t = curTmpInfo.paramvals[i];
				break;
			}
		}
	}
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">Value：</span><input type=\"text\"  id=\"val\" name=\"val\" class=\"inputform\" value=\""+(t==null?"":t.value)+"\"><span class=\"inputtext\">Text：</span><input type=\"text\"  id=\"txt\" name=\"txt\" class=\"inputform\" value=\""+(t==null?"":t.text)+"\"></div>";
	$('#dsColumn_div').dialog({
		title: (isupdate == false ? '添加值':'编辑值'),
		width: 300,
		height: 170,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		onLoad:function(){},
		onClose:function(){
			$('#dsColumn_div').dialog('destroy');
		},
		buttons:[{
				text:'确定',
				handler:function(){
					if(isupdate){
						t.value = $("#dsColumn_div #val").val();
						t.text = $("#dsColumn_div #txt").val();
					}else{
						curTmpInfo.paramvals.push({value:$("#dsColumn_div #val").val(), text:$("#dsColumn_div #txt").val()});
					}
					reloadParamVals();
					$('#dsColumn_div').dialog('close');
				}
			},{
				text:'取消',
				handler:function(){
					$('#dsColumn_div').dialog('close');
				}
			}]
	});
}
function getParamTypeDesc(paramType){
		var tpname = "";
		if(paramType == "text"){
			tpname = "输入框";
		}else if(paramType == "radio"){
			tpname = "单选框";
		}else if(paramType == "checkbox"){
			tpname = "多选框";
		}else if(paramType == "dateselect"){
			tpname = "日历框";
		}else if(paramType == "monthselect"){
			tpname = "月份框";
		}else if(paramType == "yearselect"){
			tpname = "年份框";
		}
		return tpname;
}

function deleteParam(id){
	if(!confirm("是否确认删除？")){
		return;
	}
	var idx = findParamById(id, true);
	if(idx != null){
		pageInfo.params.splice(idx, 1);
	}
	$("#p"+id).remove();
	if($("#optparam span.pppp").size() == 0){
		$("#optparam").html("<span style=\"font-size:14px; text-align:center;\" class=\"charttip\">查询条件区域<br>把参数放入此处作为报表查询条件</span>");
	}
	curTmpInfo.isupdate = true;
}

function paramevent(compId){
	var comp = findCompById(compId);
	var exist = function(id){
		var ret = false;
		for(k=0; comp.link&&k<comp.link.length; k++){
			if(comp.link[k] == id){
				ret = true;
				break;
			}
		}
		return ret;
	}
	var str = "";
	for(i=0; i<curTmpInfo.comps.length; i++){
		var o = curTmpInfo.comps[i];
		if(o.type == 'chart' || o.type == 'table'){
			if(o.id != compId){  //不添加它自己
				str = str + "<input type='checkbox' id='obj"+i+"' name='linkcomp' value=\""+o.id+"\" "+(exist(o.id)?"checked":"")+" ><label for='obj"+i+"'>"+o.name+"</label><br/>";
			}
		}
	}
	var ctx = '<div class="textpanel"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="10%" valign="top"><span class="inputtext">联动组件：</span></td><td>'+str+'</td></tr></table></div>';
	$('#pdailog').dialog({
		title: '参数事件设置',
		width: 300,
		height: 250,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
			text:'确定',
			handler:function(){
				var o = [];
				$("#pdailog input[name=\"linkcomp\"]:checked").each(function(a, b){
					o.push($(b).val());
				});
				comp.link = o;  //参数联动的组件
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
}
function editInputData(comp){
	if($("#dataProperty").size() == 0){
		$('#Jlayout').layout('add', {region:"south", id:"dataProperty", split:false, collapsible:false,height : 120, title:'配置参数数据', tools:[{
		 iconCls:'icon-cancel',
		 handler:function(){
			 $('#Jlayout').layout("remove", "south");
		}
	 }]});
	}else{
		$('#Jlayout').layout('panel', "south").panel("setTitle", "配置参数数据");
	}
	var str = "";
	if(comp.pcol){
		str = "<b>参数字段：</b><span id=\"d_"+comp.pcol.id+"\" class=\"dimcol\"><span class=\"text\">"+comp.pcol.name+"</span></span>";
	}else{
		str = "<div class=\"tipinfo\">拖拽维度到此处作为页面参数字段</div>";
	}
	var ctx = "<div style=\"margin:10px;\"><div class=\"tableDatasty\" id=\"tableData\">"+str+"</div></div>";
	$("#dataProperty").html(ctx);
	
	//注册接收维度拖放事件
	$("#tableData").droppable({
		accept:"#datasettree .tree-node",
		onDragEnter:function(e,source){
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			//对维度拖拽设置图标
			if(tp == 1 ){
				$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
				$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
				$(this).css("border", "1px solid #ff0000");
			}
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
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			$(this).css("border", "1px dotted #666");
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			if(tp == 1){
				if(comp.ctp == "dateselect" && node.attributes.dim_type != 'day'){
					msginfo("拖入日历控件的字段必须是日期类型。");
					return;
				}else if(comp.ctp != "dateselect" && node.attributes.dim_type == 'day' ){
					msginfo("字段不能是日期类型。");
					return;
				}
				var id = node.attributes.col_id;
				var p = {"id":id, "name":node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name, "tid":node.attributes.tid,"valType":node.attributes.valType,"tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "ordcol":node.attributes.ordcol, "alias":node.attributes.alias, tname:node.attributes.tname};
				comp.pcol = p; //设置组件的参数列
				$("#tableData").html("<b>参数字段：</b><span id=\"d_"+node.attributes.col_id+"\" class=\"dimcol\"><span class=\"text\">"+node.text+"</span></span>");
				//更新参数数据
				loadParamData(comp);
			}
		}
	});
}
function setcompfilter(compId){
	if(!compId){
		compId = curTmpInfo.compId;
	}
	var comp = findCompById(compId);
	var str = "<div style=\"margin:5px;\"><button style=\"margin-bottom:5px;\" class=\"btn btn-primary btn-sm\" onclick=\"newdatasetparam(false, '', '"+compId+"');\">新增筛选条件</button><table class=\"grid3\" id=\"T_report54\" cellpadding=\"0\" cellspacing=\"0\">";
	str = str + "<tr><th width='30%'>筛选字段</th><th width='15%'>判断条件</th><th width='20%'>筛选值</th><th width='15%'>值类型</th><th width='20%'>操作</th></tr>";
	var t = comp.params;
	for(var i=0; t&&i<t.length; i++){
		var o = t[i];
		str = str + "<tr><td class=\"kpiData1 grid3-td\">"+(comp.type=="grid"||comp.type=="box"?o.col:o.colname)+"/"+o.tname+"</td><td class=\"kpiData1 grid3-td\">"+o.type+"</td><td class=\"kpiData1 grid3-td\">"+(o.usetype!='param'?(o.val+(o.val2 =='' ? "":"/"+o.val2)):"连接到参数")+"</td><td class=\"kpiData1 grid3-td\">"+o.valuetype+"</td><td class=\"kpiData1 grid3-td\"><button onclick=\"newdatasetparam(true,'"+o.id+"','"+compId+"');\" class=\"btn btn-info btn-xs\">编辑</button> <button onclick=\"delDatasetFilter('"+o.id+"', '"+compId+"');\" class=\"btn btn-danger btn-xs\">删除</button></td></tr>";
	}
	str = str + "</table></div>";
	$('#pdailog').dialog({
		title: '组件筛选',
		width: 680,
		height: 400,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:str,
		onLoad:function(){},
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				if(comp.type == 'table'){
					tableView(comp, comp.id);
				}else if(comp.type == 'chart'){
					chartview(comp, comp.id);
				}
				$('#pdailog').dialog('close');
			}
		}
		,{
			text:'取消',
			iconCls:"icon-cancel",
			handler:function(){
				$('#pdailog').dialog('close');
			}
		}]
	});
}
function delDatasetFilter(paramId, compId){
	var comp = findCompById(compId);
	if(confirm("是否确认删除？")){
		var idx = -1;
		for(i=0;comp.params&&i<comp.params.length;i++){
			if(comp.params[i].id == paramId){
				idx = i;
			}
		} 
		comp.params.splice(idx, 1);
		setcompfilter(compId);
		curTmpInfo.isupdate = true;
	}
}
function newdatasetparam(isupdate, paramId, compId){
	var comp = findCompById(compId);
	
	var t = null;
	if(comp.params){
		for(i=0;comp.params&&i<comp.params.length;i++){
			if(comp.params[i].id == paramId){
				t = comp.params[i];
			}
		}
	}
	var dset;
	//获取字段
	if(!comp.dsetId || comp.dsetId== ""){
		msginfo("组件还未绑定数据。");
		return;
	}
	$.ajax({
		type:"POST",
		url:"../model/getDatasetCfg.action",
		dataType:'JSON',
		async:false,
		data: {dsetId:comp.dsetId},
		success: function(resp){
			dset = resp;
		}
	});
	
	var findTableCol = function(name, tname){
		var ret = null;
		for(k=0; k<dset.cols.length; k++){
			if(dset.cols[k].tname == tname && dset.cols[k].name == name){
				ret = dset.cols[k];
				break;
			}
		}
		return ret;
	}
	
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	var cols = "<select id=\"filtercolumn\" name=\"filtercolumn\" class=\"inputform2\"><option value=''></option>";
	var dsetCol = dset.cols;
	for(i=0; i<dsetCol.length; i++){
		cols = cols + "<option value=\""+dsetCol[i].name+","+dsetCol[i].tname+"\" "+( t!=null&&t.col==dsetCol[i].name?"selected":"" )+">"+ (dsetCol[i].tname+"."+dsetCol[i].name)+"</option>";
	}
	
	
	cols = cols + "</select>";
	var colLogic = ["=",">",">=","<", "<=", "!=", "between", "in", "like"];
	var ftp = "<select id=\"filtertype\" name=\"filtertype\" class=\"inputform2\">";
	for(i=0; i<colLogic.length; i++){
		ftp = ftp + "<option value=\""+colLogic[i]+"\" "+(t!=null&&t.type==colLogic[i]?"selected":"")+">"+colLogic[i]+"</option>";
	}
	ftp = ftp + "</select>";
	
	var pms = "<select id=\"linkparam\" name=\"linkparam\" class=\"inputform2\" "+(t==null||t.usetype=='gdz'?"style=\"display:none\"":"")+">";
	for(i=0;pageInfo.params&&i<pageInfo.params.length;i++){
		if(pageInfo.params[i].type == "casca"){  //处理级联
			var obj = pageInfo.params[i];
			for(k=0; k<obj.children.length; k++){
				var tt = obj.children[k];
				pms = pms + "<option value=\""+tt.paramid+"\" "+(t!=null&&tt.paramid==t.linkparam?"selected":"")+">"+tt.name+"</option>";	
			}
		}else{
			pms = pms + "<option value=\""+pageInfo.params[i].paramid+"\" "+(t!=null&&pageInfo.params[i].paramid==t.linkparam?"selected":"")+">"+pageInfo.params[i].name+"</option>";
		}
	}
	pms = pms + "</select>";
	var pms2 = "<select id=\"linkparam2\" name=\"linkparam2\" class=\"inputform2\" "+(t==null||t.usetype=='gdz'?"style=\"display:none\"":"")+">";
	for(i=0;pageInfo.params&&i<pageInfo.params.length;i++){
		if(pageInfo.params[i].type == "casca"){  //处理级联
			var obj = pageInfo.params[i];
			for(k=0; k<obj.children.length; k++){
				var tt = obj.children[k];
				pms2 = pms2 + "<option value=\""+tt.paramid+"\" "+(t!=null&&tt.paramid==t.linkparam2?"selected":"")+">"+tt.name+"</option>";	
			}
		}else{
			pms2 = pms2 + "<option value=\""+pageInfo.params[i].paramid+"\" "+(t!=null&&pageInfo.params[i].paramid==t.linkparam2?"selected":"")+">"+pageInfo.params[i].name+"</option>";
		}
	}
	pms2 = pms2 + "</select>";
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">筛选字段：</span>"+cols+"<br/><span class=\"inputtext\">判断条件：</span>"+ftp+"<br/><span class=\"inputtext\">筛选值：</span><input type=\"text\" name=\"filtervalue\" id=\"filtervalue\" "+(t!=null&&t.usetype=='param'?"style=\"display:none\"":"")+" value=\""+(t!=null?t.val:"")+"\" class=\"inputform2\">"+pms+"<span class=\"link_param icon-param\" tp=\""+(t!=null&&t.usetype=='param'?"param":"gdz")+"\" title=\"链接到参数\" onclick=\"chglinkparam(this, 1)\"></span><div id=\"selval2\" style=\""+(t != null && (t.type == 'between')?"display:block":"display:none")+"\"><span class=\"inputtext\">筛选值2：</span><input type=\"text\" name=\"filtervalue2\" id=\"filtervalue2\" value=\""+(t!=null?t.val2:"")+"\" "+(t!=null&&t.usetype=='param'?"style=\"display:none\"":"")+" class=\"inputform2\">"+pms2+"<span class=\"link_param icon-param\" tp=\""+(t!=null&&t.usetype=='param'?"param":"gdz")+"\" title=\"链接到参数\" onclick=\"chglinkparam(this, 2)\"></span></div><span class=\"inputtext\">筛选值类型：</span><select name=\"valuetype\" id=\"valuetype\" class=\"inputform2\"><option value=\"string\" "+(t!=null&&t.valuetype=='string'?"selected":"")+">字符类型</option><option value=\"number\" "+(t!=null&&t.valuetype=='number'?"selected":"")+">数字类型</option></select></div>";
	$('#dsColumn_div').dialog({
		title: (isupdate == false ? '添加筛选条件':'编辑筛选条件'),
		width: 380,
		height: 270,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		onLoad:function(){},
		onClose:function(){
			$('#dsColumn_div').dialog('destroy');
		},
		buttons:[{
				text:'确定',
				iconCls:"icon-ok",
				handler:function(){
					if(!comp.params){
						comp.params = [];
					}
					var col = $("#dsColumn_div #filtercolumn").val();
					if(!col || col == ""){
						msginfo("请选择筛选字段。");
						return
					}
					var colStrs = col.split(",");
					var col = colStrs[0];
					var colTname = colStrs[1];
					if(isupdate == true){
						t.col = col;
						var retCol = findTableCol(col, colTname);
						t.expression = retCol.expression;
						t.tname = colTname;
						t.vtype = retCol.type;
						t.type = $("#dsColumn_div #filtertype").val();
						t.val = $("#dsColumn_div #filtervalue").val();
						t.val2 = $("#dsColumn_div #filtervalue2").val();
						t.valuetype = $("#dsColumn_div #valuetype").val();
						t.linkparam = $("#dsColumn_div #linkparam").val() == null ?"":$("#dsColumn_div #linkparam").val();
						t.linkparam2 = $("#dsColumn_div #linkparam2").val() == null ? "":$("#dsColumn_div #linkparam2").val();
						t.usetype = $("#dsColumn_div .link_param").attr("tp");
					}else{
						var o = {id:newGuid(), type:$("#dsColumn_div #filtertype").val(), val:$("#dsColumn_div #filtervalue").val(), val2:$("#dsColumn_div #filtervalue2").val(), valuetype:$("#dsColumn_div #valuetype").val(), linkparam:($("#dsColumn_div #linkparam").val()==null?"":$("#dsColumn_div #linkparam").val()), linkparam2:($("#dsColumn_div #linkparam2").val()==null?"":$("#dsColumn_div #linkparam2").val()),usetype:$("#dsColumn_div .link_param").attr("tp")};
						o.col = col;
						//获取表达式,tname
						var retCol = findTableCol(col, colTname);
						o.expression = retCol.expression;
						o.tname = retCol.tname;
						o.vtype = retCol.type;
						comp.params.push(o);
					}
					setcompfilter(compId);
					$('#dsColumn_div').dialog('close');
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#dsColumn_div').dialog('close');
				}
			}]
	});
	$("#dsColumn_div #filtertype").change(function(){
		var val = $(this).val();
		if(val == 'between'){
			$("#dsColumn_div #selval2").css("display", "block");
		}else{
			$("#dsColumn_div #selval2").css("display", "none");
		}
	});
}
function chglinkparam(ts, pos){
	var tp = $(ts).attr("tp");
	if(tp == "gdz"){
		$(ts).attr("tp", "param").attr("title", "固定值");
		$("#dsColumn_div #linkparam" + (pos==2?"2":"")).css("display","inline-block");
		$("#dsColumn_div #filtervalue" + (pos==2?"2":"")).css("display","none");
	}else{
		$(ts).attr("tp", "gdz").attr("title", "链接到参数");
		$("#dsColumn_div #filtervalue" + (pos==2?"2":"")).css("display","inline-block");
		$("#dsColumn_div #linkparam" + (pos==2?"2":"")).css("display","none");
	}
}
function findParamById(id, retIndex){
	var ret = null;
	for(i=0; pageInfo.params&&i<pageInfo.params.length; i++){
		var p = pageInfo.params[i];
		if(p.id == id){
			if(retIndex){
				ret = i;
			}else{
				ret = p;
			}
		}
	}
	return ret;
}
function ischinese(a){
	if (/[\u4E00-\u9FA5]/i.test(a)) {
		return true;  
	}else{    return false }
}