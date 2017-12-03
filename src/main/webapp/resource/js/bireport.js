if($ == undefined){
	$ = jQuery;
}
function reloadDatasetTree(){
	$("#datasettreediv ul").remove();
	$("#datasettreediv").append("<ul id=\"datasettree\"></ul>");
	if(pageInfo.selectDs == null || pageInfo.selectDs == "null"){
		$('#datasettree').tree({
			dnd:false,
			data:[{"id":"err","text":"数据还未创建立方体。", "iconCls":"icon-no"}]
		});
		return
	}else if(pageInfo.selectDs == ''){
		$('#datasettree').tree({
			dnd:false,
			data:[{"id":"err","text":"还未选择数据。", "iconCls":"icon-no"}]
		});
		return
	}else{
		$('#datasettree').tree({
			url:'../model/treeCube.action?cubeId=' + pageInfo.selectDs,
			dnd:true,
			lines:false,
			onBeforeDrag:function(target){
				if(!target.attributes || target.attributes.tp == 'root'){
					return false;
				}
				return true;
			},
			onDragEnter:function(target, source){
				return false;
			}
		});
	}
}

function newpage(){
	var url = 'ReportDesign.action?menus='+curTmpInfo.menus+'&showtit='+showtit;
	if(curTmpInfo.isupdate == true){
		if(confirm('页面还未保存\n是否保存当前页面？')){
			savepage(function(){
				location.href = url;
			});
		}else{
			location.href = url;
		}
	}else{
		location.href = url;
	}
}
function initparam(){
	//回写参数值
	if(pageInfo.params && pageInfo.params.length>0){
		$("#p_param div.ptabhelpr").remove();
		$("#p_param").append("<b>参数： </b>");
		for(i=0; i<pageInfo.params.length; i++){
			var obj = $("#p_param");
			var str = "<span class=\"pppp\" id=\"pa_"+pageInfo.params[i].id+"\"><span title=\"筛选\" onclick=\"paramFilter('"+pageInfo.params[i].id+"', '"+pageInfo.params[i].type+"', '"+pageInfo.params[i].name+"')\" class=\"text\">"+pageInfo.params[i].name+"(";
			if(pageInfo.params[i].type == 'day' || pageInfo.params[i].type == 'month'){
				str = str + pageInfo.params[i].st + " 至 " + pageInfo.params[i].end;
			}else{
				str = str  + (!pageInfo.params[i].valStrs || pageInfo.params[i].valStrs == ''?"无":pageInfo.params[i].valStrs);
			}
			str = str + ")</span><button title=\"删除\" class=\"btn btn-default btn-xs\" onclick=\"deleteParam('"+pageInfo.params[i].id+"')\"><i class=\"fa fa-remove\"></i></button></span>";
			obj.append(str);
		}
	}
	//注册接收维度拖拽事件
	$("#p_param").droppable({
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
			$(this).css("border", "1px solid #d3d3d3");
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
		},
		onDrop:function(e,source){
			e.cancelBubble=true;
			e.stopPropagation(); //阻止事件冒泡
			$(this).css("border", "1px solid #d3d3d3");
			var node = $("#datasettree").tree("getNode", source);
			var tp = node.attributes.col_type;
			if(tp == 1){
				if(!pageInfo.params){
					pageInfo.params = [];
				}
				//判断是否存在
				if(findParamById(node.attributes.col_id) != null){
					msginfo("您已经添加了该参数！", "error");
					return;
				}
				var id = node.attributes.col_id;
				var p = {"id":id, "name":node.text, "type":node.attributes.dim_type, "colname":node.attributes.col_name,"alias":node.attributes.alias, "tname":node.attributes.tname,"cubeId":node.attributes.cubeId,"valType":node.attributes.valType,"tableName":node.attributes.tableName, "tableColKey":node.attributes.tableColKey,"tableColName":node.attributes.tableColName, "dimord":node.attributes.dimord, "grouptype":node.attributes.grouptype,"dateformat":(node.attributes.dateformat==null?"":node.attributes.dateformat),dsid:node.attributes.dsid};
				pageInfo.params.push(p);
				var obj = $(this);
				obj.find("div.ptabhelpr").remove();
				if(obj.find("b").size() == 0){
					obj.append("<b>参数： </b>");
				}
				obj.append("<span class=\"pppp\" id=\"pa_"+id+"\"><span title=\"筛选\" onclick=\"paramFilter('"+id+"', '"+node.attributes.dim_type+"','"+node.text+"')\" class=\"text\">"+node.text+"(无)</span><button class=\"btn btn-default btn-xs\" title=\"删除\" onclick=\"deleteParam('"+id+"')\"><i class=\"fa fa-remove\"></i></button></span>");
				//弹出筛选窗口
				paramFilter(id, p.type, p.name);
			}
		}
	});
}
function paramFilter(id, type, name){
	var param = findParamById(id);
	$('#pdailog').dialog({
		title: name+' - 参数值筛选',
		width: 290,
		height: param.type == 'month' || param.type == 'day' ? 240 : 320,
		closed: false,
		cache: false,
		modal: true,
		content:'<div id="div_paramfilter"><div class="panel-loading">Loading...</div></div>',
		buttons:[{
				text:'确定',
				iconCls:'icon-ok',
				handler:function(){
					var vals = "";
					var valStrs = "";
					if(param.type == 'month'){
						param.st =  $("#pdailog #dfm2").val();
						param.end =  $("#pdailog #dfm1").val();
						//判断是否st < ed
						if(Number(param.st) > Number(param.end)){
							msginfo("您选择的开始月份不能大于结束月份。", "error");
							return;
						}
						$("#p_param #pa_"+id+" span.text").text(name + "("+ param.st + " 至 " + param.end+")");
					}else if(param.type == 'day'){
						param.st =  $("#pdailog #dft2").val();
						param.end =  $("#pdailog #dft1").val();
						//判断是否st < ed
						if(Number(param.st.replace(/-/g, "")) > Number(param.end.replace(/-/g, ""))){
							msginfo("您选择的开始日期不能大于结束日期。", "error");
							return;
						}
						$("#p_param #pa_"+id+" span.text").text(name + "("+ param.st + " 至 " + param.end+")");
					}else{
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
								valStrs = valStrs + $(this).attr("desc");
								if(a == seles.size() - 1 || a == 9){
									
								}else{
								   valStrs = valStrs + ',';
								}
						});
						$("#p_param #pa_"+id+" span.text").text(name+"("+(valStrs == '' ? '无':valStrs)+")");
						param.vals = vals;
						param.valStrs = valStrs;
					}
					$('#pdailog').dialog('close');
					curTmpInfo.isupdate = true;
					flushPage();
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#pdailog').dialog('close');
				}
			}]
	});
	var url =  (curTmpInfo.filterUrl ? curTmpInfo.filterUrl :"paramFilter.action") + "?cubeId="+param.cubeId+"&id="+id+"&dsid="+param.dsid;
	if(param.type == "month"){
		url = url + "&st="+(param.st?param.st:"")+"&end="+(param.end?param.end:"");
	}else if(param.type == "day"){
		url = url + "&st="+(param.st?param.st:"")+"&end="+(param.end?param.end:"");
	}else{
		//url = url + "&vals="+(!param.vals || param.vals =='' ? '':param.vals );;
	}
	$("#pdailog #div_paramfilter").load(url, {vals:(!param.vals || param.vals =='' ? '':param.vals),t:Math.random()});
}
function searchDims2(val, id){
	var param = findParamById(id);
	var url = "paramSearch.action?cubeId="+param.cubeId+"&id="+id+"&dsid=" + param.dsid ;
	$.ajax({
		type:"POST",
		url:url,
		data:{keyword:val, vals:(!param.vals || param.vals =='' ? '':param.vals), t:Math.random()},
		dataType:'HTML',
		success:function(resp){
			$("#pdailog .dfilter").html(resp);
		}
	});
}
function flushPage(){
	//刷新页面
	for(var k=0; pageInfo.comps&&k<pageInfo.comps.length; k++){
		var tp = pageInfo.comps[k].type;
		if(tp == 'table'){
			/**
			如果表格组件的时间维度和参数的时间维度不一致，删除计算度量
			**/
			var comp = pageInfo.comps[k];
			if(!paramsamedimdate(comp)){
				for(i=0; comp.kpiJson&&i<comp.kpiJson.length; i++){
					delete comp.kpiJson[i].compute;
				}
			}
			tableView(pageInfo.comps[k], pageInfo.comps[k].id);
		}else if(tp == 'chart'){
			chartview(pageInfo.comps[k], pageInfo.comps[k].id);
		}
	}
}
function deleteParam(id){
	$("#p_param #pa_" + id).remove();
	var idx = -1;
	for(i=0; pageInfo.params&&i<pageInfo.params.length; i++){
		var p = pageInfo.params[i];
		if(p.id == id){
			idx = i;
			break;
		}
	}
	pageInfo.params.splice(idx, 1);
	if(pageInfo.params.length == 0){
		$("#p_param").html("<div class=\"ptabhelpr\">拖拽维度到此处作为页面参数</div>");
	}
	flushPage();
}

function openreport(){
	var ctx = "<div class=\"openlistbody\"><div style=\"margin:5px 5px 5px 1px;float:left;\"><a id=\"rename\">更名</a> <a id=\"delreport\">删除</a></div><div align=\"right\" style=\"margin:5px;\"><input id=\"subSearchBox\" style=\"width:160px\"></input></div><div class=\"openlist\"></div></div>";
	$('#pdailog').dialog({
		title: '打开报表',
		width: 620,
		height: 400,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		onLoad:function(){},
		buttons:[{
				text:'确定',
				iconCls:'icon-ok',
				handler:function(){
					var r = $("input[name=\"reportId\"]:checked").val();
					if(!r || r == null){
						msginfo("请至少选择一个报表！", "error");
						return;
					}
					$('#pdailog').dialog('close');
					$(this).attr("href", "#");
					var url = 'ReportDesign.action?pageId='+r+'&showtit='+showtit+'&menus='+curTmpInfo.menus;
					if(curTmpInfo.isupdate == true){
						if(confirm('页面还未保存\n是否保存当前页面？')){
							savepage(function(){
								location.href = url;
							});
						}else{
							location.href = url;
						}
					}else{
						location.href = url;
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
	$("#rename").linkbutton({'iconCls':'icon-edit', plain:true}).click(function(){
		var r = $("input[name=\"reportId\"]:checked").val();
		if(!r || r == null){
			msginfo("请至少选择一个报表！", "error");
			return;
		}
		$.messager.prompt('报表改名', '请输入新的报表名称？', function(msg){
			if(msg){
				$.ajax({
					  type: "POST",
					   url: "renameReport.action",
					   dataType:"HTML",
					   data: {pageId:r, pageName:msg},
					   success: function(resp){
						   $('#pdailog .openlist').load('listReport.action?t='+Math.random());
					   },
					   error:function(){
						  
					   }
				});
			}
		});
	});
	$("#delreport").linkbutton({'iconCls':'icon-remove', plain:true}).click(function(){
		var r = $("input[name=\"reportId\"]:checked").val();
		if(!r || r == null){
			msginfo("请至少选择一个报表！", "error");
			return;
		}
		if(confirm('是否确认删除？')){
			$.ajax({
				  type: "POST",
				   url: "deleteReport.action",
				   dataType:"HTML",
				   data: {id:r},
				   success: function(resp){
					   $('#pdailog .openlist').load('listReport.action?t='+Math.random());
				   },
				   error:function(){
					  
				   }
			});
		}
	});
	$("#subSearchBox").searchbox({
		 searcher:function(value,name){
			$('#pdailog .openlist').load('listReport.action',{"keyword":value,"t":Math.random()});
		},
		prompt:'请输入查询关键字.'
	});
	$('#pdailog .openlist').load('listReport.action?t='+Math.random());
}

/**
function delComp(id){
	//从全局对象中移除
	var idx = -1;
	for(i=0;i<pageInfo.comps.length; i++){
		var t = pageInfo.comps[i];
		if(t.id == id){
			idx = i;
			break;
		}
	}
	pageInfo.comps.splice(idx, 1);
	$("#T" + id).remove();
	if(pageInfo.comps.length == 0){
		$("#optarea").append("<div class='tabhelpr'>请先添加组件再进行多维分析(点击<strong>插入</strong>按钮)。</div>");
	}
}
**/
/**
* tp = table, chart, text 3种内置类型
  name : 组件标题
  ispush:是否添加到组件视图树
  curComp:组件配置信息
  ctx:组件InnerHTML  
**/
function addComp(id, name, ctx, ispush, tp, curComp){
	if(ctx == null || ctx == undefined){
		if(tp =='table'){
			//判断是新增，还是回写已有的
			if(curComp == null || curComp == undefined){
				ctx = crtCrossTable();
			}else{
				if(curComp.cols == undefined || curComp.kpiJson == undefined){ //添加了组件，但未选度量
					ctx = crtCrossTable();
				}else{
					ctx = "";
				}
			}
		}else if(tp == 'chart'){
			ctx = crtChart(id);
		}
	}
	
	//是否向全局对象中添加内容
	if(ispush == true){
		pageInfo.comps.push({"id":id, "name":name, "type":tp});
		curTmpInfo.isupdate= true;
	}
	var titleHTML="<div class=\"comp_table\" tp=\""+tp+"\" id=\"T"+id+"\">" +		
			"<div class=\"ctx\">"+(ctx == null ? "" : ctx)+"</div>" +
			"</div>";
	if(tp == "table"){
		$("#optarea").html(titleHTML);
	}else if(tp == "chart"){
		$("#chartarea").html(titleHTML);
	}
	//如果是表格或图形，增加接受拖拽事件
	if(tp == 'table'){
		btns=[];
		//表格接收拖拽事件
		if(curComp != null && curComp != undefined){
			if(curComp.cols == undefined || curComp.kpiJson == undefined){ //添加了组件，但未选度量,需要添加拖放度量事件
				initDropDiv(id);
			}else{
				tableView(curComp, id);
			}
		}else{
			initDropDiv(id);
		}
	}
	
	if(tp == 'chart'){
		//如果是回写，更新图形数据
		if(curComp != null && curComp != undefined){
			chartview(curComp, id);
			//回写配置信息
			backChartData(curComp);
			//图形接收拖拽事件
			if(curComp.chartJson.type == 'bubble' || curComp.chartJson.type == 'scatter'){
				initChartByScatter(id);
			}else{
				initChartKpiDrop(id)
			}
		}else{
			//或者是新增
			//图形接收拖拽事件
			if(curTmpInfo.charttype == 'bubble' || curTmpInfo.charttype == 'scatter'){
				initChartByScatter(id);
			}else{
				initChartKpiDrop(id)
			}
		}
	}
}
function selectdataset(){
	$('#pdailog').dialog({
		title: '选择数据模型 ',
		width: 520,
		height: 400,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:"<div align=\"right\" style=\"margin:5px;\"><input id=\"subSearchBox\" style=\"width:200px\"></input></div><table id=\"subjectlist\" title=\"\" style=\"width:510px;height:300px;\" ><thead><tr><th data-options=\"field:'ck',checkbox:true\"><th data-options=\"field:'cubeName',width:160\">名称</th><th data-options=\"field:'desc',width:300\">说明</th></tr></thead></table>",
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						 var row = $("#subjectlist").datagrid("getChecked");
						 if(row == null || row.length == 0){
							msginfo("请勾选数据。", "error");
							return;
						  }
						pageInfo.selectDs = row[0].cubeId;
						$('#pdailog').dialog('close');
						//更新页面为已修改
						curTmpInfo.isupdate = true;
						//更新数据集
						reloadDatasetTree();
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	$("#subSearchBox").searchbox({
		 searcher:function(value,name){
			$("#subjectlist").datagrid("load",{"id":"0", key:value,t:Math.random()});
		},
		prompt:'请输入查询关键字.'
	});
	$("#subjectlist").datagrid({
		singleSelect:true,
		collapsible:false,
		pagination:true,
		pageSize:20,
		border:true,
		url:'../model/pageCube.action',
		method:'post',
		queryParams:{id:"0", t: Math.random()}
	});
}
/**
保存页面
@param  {Function} 保存完成后回调函数
*/
function savepage(cb){
	for(k=0; k<pageInfo.comps.length; k++){
		var cmp=pageInfo.comps[k];
		var tp = cmp.type,id=cmp.id;
	}
	var jsonStr = JSON.stringify(pageInfo);
	var pageId = pageInfo.id;
	if(pageId == undefined || pageId == null){
		pageId = "";
	}
	if(pageId == ''){ //未保存过，提示用户输入名称
		var ctx = "<div style=\"margin:10px 20px 5px 20px;\"><br/><span style=\"display:inline-block;width:60px;\"> 报表名称： </span><input type=\"text\" style=\"width:187px;\" id=\"pageName\"></div>";
		$('#pdailog').dialog({
		title: '保存报表',
		width: 330,
		height: 160,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
				text:'确定',
				iconCls:'icon-ok',
				handler:function(){
					var name = $("#pdailog #pageName").val();
					if(name == ''){
						msginfo("您还未录入文件名称。", "error");
						$("#pdailog #pageName").focus();
						return;
					}
					$.post("saveReport.action", {"pageInfo": jsonStr, "pageId":"", "pageName" : name}, function(resp){
						if(resp.result == 0){
							msginfo("保存失败，名称存在重复。", "error");
							return;
						}
						pageInfo.id = Number(resp.rows);
						if(cb != undefined){
							cb();
						}else{
							
						}
						msginfo("保存成功！", "success");
						//更新页面为未修改
						curTmpInfo.isupdate = false;
						$('#pdailog').dialog('close');
					});
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#pdailog').dialog('close');
				}
			}]
		});
	}else{ //已经保存过，直接update
		$.post("saveReport.action", {"pageInfo": jsonStr, "pageId":pageId}, function(resp){
			if(cb != undefined){
				cb();
			}else{
			}
			msginfo("保存成功！", "success");
			//更新页面为未修改
			curTmpInfo.isupdate = false;
		});
	}
}
//打印页面
function printData(){
	var tabId = $("div.tabs-container li.active a").attr("idx");
	var info = JSON.parse(JSON.stringify(pageInfo));  //复制对象
	var comp = findCompById(tabId, info);
	info.comps = [comp];
	var json =  JSON.stringify(info);
	var url2 = "about:blank";
	var name = "printwindow";
	window.open(url2, name);
	var ctx = "<form name='prtff' method='post' target='printwindow' action=\"print.action\" id='expff'><input type='hidden' name='pageInfo' id='ppageInfo'></form>";
	var o = $(ctx).appendTo("body");
	$("#ppageInfo").val(json);
	o.submit().remove();
}
//导出页面
function exportPage(tp){
	var ctx = "<form name='expff' method='post' action=\"ReportExport.action\" id='expff'><input type='hidden' name='type' id='type'><input type='hidden' name='json' id='json'><input type='hidden' name='picinfo' id='picinfo'></form>";
	if($("#expff").size() == 0){
		$(ctx).appendTo("body");
	}
	var tabId = $("div.tabs-container li.active a").attr("idx");
	var info = JSON.parse(JSON.stringify(pageInfo));  //复制对象
	var comp = findCompById(tabId, info);
	delete comp.dims;
	info.comps = [comp];
	$("#expff #type").val(tp);
	$("#expff #json").val(JSON.stringify(info));
	//把图形转换成图片
	var strs = "";
	if(tp == "pdf" || tp == "excel" || tp == "word"){
		$("div.chartUStyle").each(function(index, element) {
			var id = $(this).attr("id");
			id = id.substring(1, id.length);
			var chart = echarts.getInstanceByDom(document.getElementById(id));
			var str = chart.getDataURL({type:'png', pixelRatio:1, backgroundColor: '#fff'});
			str = str.split(",")[1]; //去除base64标记
			str = $(this).attr("label") + "," + str; //加上label标记
			strs = strs  +  str;
			if(index != $("div.chartUStyle").size() - 1){
				strs = strs + "@";
			}
			
		});
	}
	$("#expff #picinfo").val(strs);
	$("#expff").submit();
}
function cleanData(){
	var idx = pageInfo.idx ? pageInfo.idx : "1";
	if(idx == "1"){
		pageInfo.comps[0] = {"name":"表格组件","id":1, "type":"table"};
		$("#T1 div.ctx").html(crtCrossTable());
		initDropDiv("1");
	}else if(idx == "2"){
		pageInfo.comps[1] = {"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]};
		$("#T2 div.ctx").html(crtChart(2));
		initChartKpiDrop(2)
	}
}
function kpidesc(){
	$('#pdailog').dialog({
		title: '度量解释',
		width: 600,
		height: 350,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		buttons:[{
					text:'关闭',
					iconCls:"icon-ok",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	$('#pdailog').dialog('refresh', "kpidesc.action?cubeId="+pageInfo.selectDs, {t:Math.random()});
}