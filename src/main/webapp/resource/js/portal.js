if($ == undefined){
	$ = jQuery;
}
/*布局器*/
var layout = {};
layout.l1_json = {tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]};
layout.l2_json = {tr1:[{colspan:1, rowspan:1, width:50, height:100, id:1},{colspan:1, rowspan:1, width:50, height:100, id:2}]};
layout.l3_json = {tr1:[{colspan:2, rowspan:1, width:100, height:50, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:50, id:2},{colspan:1, rowspan:1, width:50, height:50, id:3}]};
layout.l4_json = {tr1:[{colspan:2, rowspan:1, width:100, height:33, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:33, id:2},{colspan:1, rowspan:1, width:50, height:33, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:33, id:4}]};
layout.l5_json = {tr1:[{colspan:2, rowspan:1, width:100, height:20, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:20, id:2},{colspan:1, rowspan:1, width:50, height:20, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:20, id:4}],tr4:[{colspan:1, rowspan:1, width:50, height:20, id:5},{colspan:1, rowspan:1, width:50, height:20, id:6}],tr5:[{colspan:2, rowspan:1, width:100, height:20, id:7}]}; 

function backpage(){
	if(curTmpInfo.isupdate == true){
		if(confirm("您已对页面进行了修改，是否保存再退出？")){
			var bk = function(){
				if(pageInfo.id && pageInfo.id != ''){
					if(curTmpInfo.is3g=="y"){
						location.href = "../m/PushManager.action";
					}else{
						location.href = 'show.action?pageId='+pageInfo.id;
					}
				}else{
					if(curTmpInfo.is3g=="y"){
						location.href = "../m/PushManager.action";
					}else{
						location.href = "PortalIndex.action";
					}
				}
			}
			savepage(bk);
		}else{
			if(pageInfo.id && pageInfo.id != ''){
				if(curTmpInfo.is3g=="y"){
					location.href = "../m/PushManager.action";
				}else{
					location.href = 'show.action?pageId='+pageInfo.id;
				}
			}else{
				if(curTmpInfo.is3g=="y"){
					location.href = "../m/PushManager.action";
				}else{
					location.href = "PortalIndex.action";
				}
			}
		}
	}else{
		if(pageInfo.id && pageInfo.id != ''){
			if(curTmpInfo.is3g=="y"){
				location.href = "../m/PushManager.action";
			}else{
				location.href = 'show.action?pageId='+pageInfo.id;
			}
		}else{
			if(curTmpInfo.is3g=="y"){
				location.href = "../m/PushManager.action";
			}else{
				location.href = "PortalIndex.action";
			}
		}
	}
}
function resetComppos(){
	//重新规划组件顺序
	for(var i=1; true; i++){
		var tr = pageInfo.body["tr"+i];
		if(!tr || tr == null){
			break;
		}
		for(var j=0; j<tr.length; j++){
			var td = tr[j];
			td.children = []; //先清除子
			var cld = $("#layout_" + td.id).children();
			if(cld && cld.size() > 0){
				var ls = cld;
				for(var k=0; ls&&k<ls.size(); k++){
					td.children.push(findCompById(ls[k].id.replace("c_", "")));
				}
			}
		}
	}
}
function savepage(cb){
	resetComppos();
	var pageId = pageInfo.id;
	if(pageId == undefined || pageId == null){
		pageId = "";
	}
	//处理3g报表， 包括分类
	if(curTmpInfo.is3g == 'y'){
		if(pageId == ''){ //未保存过，提示用户输入名称
			var ctx = "<div style=\"margin:5px 20px 5px 20px;\"><span style=\"display:inline-block;width:60px;\"> 名 称： </span><input type=\"text\" style=\"width:187px;\" id=\"pageName\"><div style=\"margin-top:5px;\"><table cellspacing=\"0\" cellpadding=\"0\"><tr><td valign=\"top\"><span style=\"display:inline-block;width:60px;\"> 目 录：</span></td><td><ul id=\"reportcatalist\"></ul></td></tr></table></div></div>";
			$('#pdailog').dialog({
			title: '保存报表',
			width: 330,
			height: 260,
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
							msginfo("您还未录报表名称。");
							$("#pdailog #pageName").focus();
							return;
						}
						var cata = $("#reportcatalist").tree("getSelected");
						if(cata == null || cata.id == '0'){
							msginfo("您还未选择报表目录。");
							return;
						}
						$.post("save.action", {pageInfo:JSON.stringify(pageInfo), pageName:name, "cataId":cata.id, "is3g":"y"}, function(resp){
							pageInfo.id = resp.rows;
							msginfo("保存成功！","suc");
							//更新页面为未修改
							curTmpInfo.isupdate = false;
							if(cb){
								cb();
							}
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
			//加载路径树
			$("#pdailog #reportcatalist").tree({
				url:'../m/typeTree.action',
				dnd:false,
				data: [{id:'0', text:'报表目录', state:'closed'}],
				onBeforeLoad: function(node){
					if(!node || node == null){
						return false;
					}
				}
			});
			$('#reportcatalist').tree("expand", $('#reportcatalist').tree("getRoot").target);
		}else{ //已经保存过，直接update
			$.post("save.action", {"pageInfo": JSON.stringify(pageInfo), "pageId":pageId}, function(resp){
				msginfo("保存成功！", "suc");
				//更新页面为未修改
				curTmpInfo.isupdate = false;
				if(cb){
					cb();
				}
			});
		}
	}else{
		//处理PC端报表， 不包括分类
		if(pageId == ''){ //未保存过，提示用户输入名称
			$.messager.prompt('报表保存', '请输入新的报表名称？', function(r){
				if (r){
					$.ajax({
						type:"POST",
						url: 'save.action',
						async: false,
						data:{pageInfo:JSON.stringify(pageInfo), pageName:r},
						success: function(resp){
							pageInfo.id = resp.rows;
							msginfo("保存成功！","suc");
							//更新页面为未修改
							curTmpInfo.isupdate = false;
							if(cb){
								cb();
							}
						}
					});
				}
			});
		}else{ //已经保存过，直接update
			$.post("save.action", {"pageInfo": JSON.stringify(pageInfo), "pageId":pageId}, function(resp){
				msginfo("保存成功！", "suc");
				//更新页面为未修改
				curTmpInfo.isupdate = false;
				if(cb){
					cb();
				}
			});
		}
	}
	
}
function regCompTree(){
	$('#comp_tree').tree({
		dnd:true,
		onBeforeDrag:function(target){
			return true;
		},
		onDragEnter:function(target, source){
			return false;
		},
		onStartDrag:function(node){
			resetWindows('min');
		},
		onStopDrag:function(node){
			$(".indicator").hide();
			resetWindows('max');
		}
	});
}

function helper(){
	var ctx = "<div class=\"window_ctx\">您可以通过拖拽的方式，定义自己的数据报表，报表支持图形、表格、文本、日历、地图等多种展现方式。<br/>"+
	"1.选择数据。<br/><img src=\"../resource/img/ybp1.gif\"><br/>"+
	"2.选择组件。<br/><img src=\"../resource/img/ybp2.gif\"><br/>"+
	"3.配置组件数据。<br/><img src=\"../resource/img/ybp3.gif\"><br/>"+
	"睿思BI-数据报表V3.0 <br/> <b>北京睿思科技有限公司 版权所有</b></div>";
	$('#pdailog').dialog({
		title: '帮助',
		width: 730,
		height: 440,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		onLoad:function(){},
		content:ctx,
		buttons:[{
				text:'关闭',
				handler:function(){
					$('#pdailog').dialog('close');
				}
			}]
	});
}

function printpage(){
	resetComppos();
	var json = JSON.stringify(pageInfo);
	var url2 = "about:blank";
	var name = "printwindow";
	window.open(url2, name);
	var ctx = "<form name='prtff' method='post' target='printwindow' action=\"print.action\" id='expff'><input type='hidden' name='pageInfo' id='ppageInfo'></form>";
	var o = $(ctx).appendTo("body");
	$("#ppageInfo").val(json);
	o.submit().remove();
}
//导出页面
function exportPage(){
	var ctx = "<form name='expff' method='post' action=\"export.action\" id='expff'><input type='hidden' name='type' id='type'><input type='hidden' name='json' id='json'><input type='hidden' name='picinfo' id='picinfo'><div class='exportpanel'><span class='exptp select' tp='html'><img src='../resource/img/export-html.gif'><br>HTML</span>"+
			"<span class='exptp' tp='csv'><img src='../resource/img/export-csv.gif'><br>CSV</span>" +
			"<span class='exptp' tp='excel'><img src='../resource/img/export-excel.gif'><br>EXCEL</span>" + 
			"<span class='exptp' tp='word'><img src='../resource/img/export-word.gif'><br>WORD</span>" + 
			"<span class='exptp' tp='pdf'><img src='../resource/img/export-pdf.gif'><br>PDF</span></div></form>";
	$('#pdailog').dialog({
		title: '导出数据',
		width: 376,
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
						resetComppos();
						var tp = curTmpInfo.expType;
						$("#expff #type").val(tp);
						//把图形转换成图片
						var strs = "";
						if(tp == "pdf" || tp == "excel" || tp == "word"){
							$("div.chartUStyle").each(function(index, element) {
                                var id = $(this).attr("id");
								id = id.substring(1, id.length);
								var chart = echarts.getInstanceByDom(document.getElementById(id));
								var str = chart.getDataURL({type:'png', pixelRatio:1, backgroundColor: '#fff'});
								str = str.split(",")[1]; //去除base64标记
								str = $(this).attr("label") + "," + str+","+$("#"+id).width(); //加上label标记,宽度
								strs = strs  +  str;
								if(index != $("div.chartUStyle").size() - 1){
									strs = strs + "@";
								}
								
                            });
						}
						$("#expff #picinfo").val(strs);
						$("#expff #json").val(JSON.stringify(pageInfo));
						$("#expff").submit();
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
	curTmpInfo.expType = "html";
	//注册事件
	$(".exportpanel span.exptp").click(function(e) {
		$(".exportpanel span.exptp").removeClass("select");
        $(this).addClass("select");
		curTmpInfo.expType = $(this).attr("tp");
    });
}
function selectdataset(){
	$('#pdailog').dialog({
		title: '选择数据模型(立方体)',
		width: 520,
		height: 320,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:"<table id=\"subjectlist\" title=\"\" ><thead><tr><th data-options=\"field:'ck',checkbox:true\"><th data-options=\"field:'cubeName',width:160\">名称</th><th data-options=\"field:'desc',width:200\">说明</th><th data-options=\"field:'dsetName',width:100\">数据集</th></tr></thead></table>",
		buttons:[{
					text:'确定',
					iconCls:'icon-ok',
					handler:function(){
						 var row = $("#subjectlist").datagrid("getChecked");
						 if(row == null || row.length == 0){
							msginfo("请勾选数据。");
							return;
						  }
						pageInfo.selectDs = row[0].cubeId;
						$('#pdailog').dialog('close');
						//更新页面为已修改
						curTmpInfo.isupdate = true;
						//更新数据集
						reloadDatasetTree();
						$("#comp_tab").tabs("select", 1);
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#pdailog').dialog('close');
					}
				}]
	});
	$("#subjectlist").datagrid({
		singleSelect:true,
		collapsible:false,
		pagination:true,
		fit:true,
		pageSize:20,
		border:true,
		url:'../model/pageCube.action',
		method:'post',
		queryParams:{t: Math.random()}
	});
}
function reloadDatasetTree(){
	if(pageInfo.selectDs){
		$('#datasettree').tree({
			url:'../model/treeCube.action?cubeId=' + (pageInfo.selectDs?pageInfo.selectDs:""),
			dnd:true,
			lines:true,
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
	}else{
		$('#datasettree').tree({
			data:[{"id":"err","text":"还未选择立方体!", "iconCls":"icon-no"}]
		});
	}
	
}
function resetWindows(tp){
	for(var i=0; curTmpInfo.comps&&i<curTmpInfo.comps.length; i++){
		var compId = curTmpInfo.comps[i].id;
		if(tp == "min"){
			$("#c_"+compId + " div.cctx").hide();
		}else{
			$("#c_"+compId + " div.cctx").show();
		}
	}
}
function setlayout(){
	var ctx = "<div class=\"textpanel\"><br/>";
	for(var i=1; i<=6; i++){
		ctx = ctx + "<span class=\"rlayout\"><div class=\"onelayout\" tp=\""+i+"\"><label for=\"lay"+i+"\"><img src=\"../resource/img/layout/l"+i+".png\"></lable><br/><input id=\"lay"+i+"\" type=\"radio\" name=\"sellayout\" value=\""+i+"\" "+(i == pageInfo.layout ? "checked" : "")+" ></div></span>";
	}
	ctx = ctx + "</div>";
	$('#pdailog').dialog({
		title: '设置报表布局',
		width: 430,
		height: 340,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		onLoad:function(){},
		content:ctx,
		buttons:[{
				text:'确定',
				iconCls:"icon-ok",
				handler:function(){
					var comps = curTmpInfo.comps;
					var s = $("input[name=\"sellayout\"]:checked").val();
					pageInfo.layout = Number(s);
					//更新布局区域
					var json = null;
					if(s == 1){
						json = layout.l1_json;
					}else if(s == 2){
						json = layout.l2_json;
					}else if(s == 3){
						json = layout.l3_json;
					}else if(s == 4){
						json = layout.l4_json;
					}else if(s == 5){
						json = layout.l5_json;
					}else if(s == 6){
						$('#pdailog').dialog('close');
						autoLayout();
						return;
					}
					pageInfo.body = json = eval("("+JSON.stringify(json)+")"); //复制一份
					//把组件都放入布局1
					var ids = [];
					for(i=0; comps&&i<comps.length; i++){
						ids.push(comps[i]);
					}
					json.tr1[0].children = ids;
					crtLayoutHTML(json, true);
					curTmpInfo.isupdate = true;
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
	$("span.rlayout div.onelayout").click(function(){
		var tp = $(this).attr("tp");
		var s = $("input[name=\"sellayout\"][value=\""+tp+"\"]");
		s.attr("checked","checked");
	});
}
/**
自定义布局
**/
/**
自定义布局
**/
function autoLayout(){
	var json2table = function(json){
		var ret = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"r_layout\" id=\"autoLayoutTable\">";
		for(var i=1; true; i++){
			var tr = json["tr"+i];
			if(!tr || tr == null){
				break;
			}
			ret = ret + "<tr>";
			for(var j=0; j<tr.length; j++){
				var td = tr[j];
				ret = ret + "<td class=\"laytd\" height=\""+td.height+"%\" width=\""+td.width+"%\" colspan=\""+td.colspan+"\" rowspan=\""+td.rowspan+"\" \">";
				ret = ret + "&nbsp; </td>";
			}
			ret = ret + "</tr>";
		}
		ret = ret + "</table>";
		return ret;
	}
	var layoutJson = pageInfo.body;
	
	var ctx = json2table(layoutJson);
	$('#pdailog').dialog({
		title: '自定义布局',
		width: 540,
		height: 350,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		onLoad:function(){},
		content:ctx,
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var ljson = {};
				var rows = document.getElementById("autoLayoutTable").rows;
				var pidx = 0;
				for(var i=0;i<rows.length;i++){
					var cells = rows[i].cells;
					var tds = [];
					ljson["tr"+(i+1)] = tds;
					for(var j=0;j<cells.length;j++){
						var cell = $(cells[j]);
						var obj = {};
						obj.colspan = cell.attr("colspan")?cell.attr("colspan"):"1";
						obj.rowspan = (cell.attr("rowspan")?cell.attr("rowspan"):"1");
						obj.height = Number(cell.attr("height").replace("%", ''));
						obj.width = Number(cell.attr("width").replace("%", ''));
						obj.id = pidx;
						pidx=pidx+1;
						tds.push(obj);
					}
				}
				pageInfo.body = json = ljson;
				//把组件都放入第一个td中
				for(var i=0; curTmpInfo.comps && i<curTmpInfo.comps.length; i++){
					if(!json.tr1[0].children){
						json.tr1[0].children = [];
					}
					json.tr1[0].children.push(curTmpInfo.comps[i]);
				}
				
				initlayout(false);
				//initCompDropEvent();
				curTmpInfo.isupdate = true;
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
	updateHeightWidth();
	var selFunc = function(ts){
		$("#autoLayoutTable td").removeClass("tdselect");
		$(ts).addClass("tdselect");
	}
	var areaSelFunc = function(start, end){
		$("#autoLayoutTable td").removeClass("tdselect");
		var p1 = $(start).attr("pos").split(",");
		var p2 = $(end).attr("pos").split(",");
		//反向选择的时候，交换位置
		if(p1[0] > p2[0] || p1[1] > p2[1]){
			tmp = p1;
			p1 = p2;
			p2 = tmp;
		}
		
		for(i=p1[0]; i<=p2[0]; i++){
			for(j = p1[1]; j<=p2[1]; j++){
				$("#autoLayoutTable td[pos='"+(i+","+j)+"']").addClass("tdselect");
			}
		}
	}
	//注册布局器编辑事件
	var issel = false;
	var start = null;
	$("#autoLayoutTable").on("click", 'td.laytd', function(){
		selFunc(this);
	}).on("mousedown", "td.laytd", function(e){
		issel = true;
		start = this;
	}).on("mouseup","td.laytd", function(e){
		issel = false;
	}).on("mousemove","td.laytd", function(e){
		if(issel){
			areaSelFunc(start, this);
		}
	}).on("contextmenu","td.laytd", function(e){
		e.preventDefault();
		e.stopPropagation();
		curTmpInfo.curtabtd = this;
		//选中单元格
		if($("#autoLayoutTable td.tdselect").size() <= 1){
			selFunc(this);
		}
		//设置菜单disable
		if($(this).attr("colspan") > 1 || $(this).attr("rowspan") > 1){
			$("#autolayoutmenu").menu("enableItem", $("#lyt_unmergeCell"));
		}else{
			$("#autolayoutmenu").menu("disableItem", $("#lyt_unmergeCell"));
		}
		$('#autolayoutmenu').menu('show', {
			left: e.pageX,
			top: e.pageY
		});
	});
}
function lyt_mergeCell(){
	var p1 = null;
	var p2 = null;
	var size = $("#autoLayoutTable td.tdselect").size();
	if(size <= 1){
		return;
	}
	var endTd = null;
	$("#autoLayoutTable td.tdselect").each(function(index, element) {
		if(index == 0){
			p1 = $(this).attr("pos").split(",");
		}
		if(index == size - 1){
			p2 = $(this).attr("pos").split(",");
			endTd = $(this);
		}
        if(index > 0){
			$(this).remove();
		}
    });
	//结束单元格的colspan,  rowspan 影响宽度,高度
	var colspan = endTd.attr("colspan")?Number(endTd.attr("colspan")):1;
	var rowspan = endTd.attr("rowspan")?Number(endTd.attr("rowspan")):1;
	$("#autoLayoutTable td.tdselect").attr("rowspan", Math.abs(p1[0] - p2[0] + (rowspan - 1)) + 1).attr("colspan", Math.abs(p1[1] - p2[1] +(colspan - 1) ) + 1);
	updateHeightWidth(true);
}
function lyt_unmergeCell(){
	var td = $(curTmpInfo.curtabtd);
	var colspan = td.attr("colspan") ? Number(td.attr("colspan")) : 1;
	var rowspan = td.attr("rowspan") ? Number(td.attr("rowspan")) : 1;
	td.attr("colspan", 1);
	td.attr("rowspan", 1);
	for(i=1; i<=rowspan; i++){
		var str = "";
		for(j=1; j<(i == 1 ? colspan : colspan + 1); j++){
			str = str + "<td class=\"laytd\"></td>";
		}
		if(i == 1){
			td.after(str);  //第一行，直接追加
		}else{
			var zuobiao = td.attr("pos").split(",");
			var node = $("#autoLayoutTable td[pos='"+((Number(zuobiao[0])+i-1) +","+ (Number(zuobiao[1]) - 1))+"']") //求当前td的下一个的前一个
			if(node.size() == 0){  //如果查找的TD不存在
				//开始查询后一个
				node = $("#autoLayoutTable td[pos='"+((Number(zuobiao[0])+i-1) +","+ (Number(zuobiao[1]) + colspan))+"']") //求当前td的下一个的后一个
				if(node.size() > 0){
					node.before(str);
				}else{
					//还是未找到，直接追加
					var tr = td.parent();  //查找当前TR
					for(k=1; k<=i-1; k++){
						tr = tr.next();
					}
					tr.append(str);
				}
			}else{
				node.after(str);  
			}
			
		}
	}
	updateHeightWidth();
}
function lyt_insertRow(){
	var td = curTmpInfo.curtabtd;
	//定义判断新增加的单元格是否属于一个合并单元格的内容。
	var tdInCells = function(rowIndex, colIndex){
		var returnTd = null;
		$("#autoLayoutTable td").each(function(index, element) {
            var pos = $(element).attr("pos").split(",");
			var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
			var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
			if(rowspan > 1){
				if(rowIndex > Number(pos[0]) && rowIndex <= Number(pos[0])+ rowspan && 
					colIndex >= Number(pos[1]) && colIndex < Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
					returnTd = $(element);
				}
			}
        });
		return returnTd;
	};
	
	var colCount = 0;
	var cells = document.getElementById("autoLayoutTable").rows[0].cells;
	for(i=0; i<cells.length; i++){
		var colspan = $(cells[i]).attr("colspan") ? Number($(cells[i]).attr("colspan")) : 1;
		colCount = colCount + colspan;
	}
	var pos = $(td).attr("pos").split(",");
	var row = Number(pos[0]) + 1;
	var rowspan = $(td).attr("rowspan")?Number($(td).attr("rowspan")):1;
	row = row + rowspan - 1; //如果rowspan>1 计算新的行(row)
	var str = "<tr>";
	for(i=0; i<colCount; i++){
		var curTd = $("#autoLayoutTable td[pos='"+row+","+i+"']");
		if(curTd.size() == 0){   //如果需要添加的td不存在，并且属于一个合并单元格的内容，为当前合并单元格增加1个rowspan
			var retTd = tdInCells(row, i);
			if(retTd != null){
				var r = Number(retTd.attr("rowspan")) + 1;
				retTd.attr("rowspan", r);
				//如果retTd的colspan > 1, 为i 追加 rowspan - 1, 不然rowspan 会被加多次
				var c = Number(retTd.attr("colspan"));
				if(c > 1){
					i = i + c - 1;
				}
				continue;
			}
		}
		str = str + "<td class=\"laytd\">";
		str = str + "</td>";
	}
	str = str + "</tr>";
	var obj = $(td).parent();   //rowspan 影响插入的位置
	for(i=1; i<rowspan; i++){
		obj = obj.next();
	}
	obj.after(str);
	updateHeightWidth();
}
function lyt_insertCol(){
	var td = curTmpInfo.curtabtd;
	//定义判断新增加的单元格是否属于一个合并单元格的内容。
	var tdInCells = function(rowIndex, colIndex){
		var returnTd = null;
		$("#autoLayoutTable td").each(function(index, element) {
            var pos = $(element).attr("pos").split(",");
			var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
			var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
			if(colspan > 1){
				if(rowIndex >= Number(pos[0]) && rowIndex < Number(pos[0])+ rowspan && 
					colIndex > Number(pos[1]) && colIndex <= Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
					returnTd = $(element);
				}
			}
        });
		return returnTd;
	};
	
	var rows = document.getElementById("autoLayoutTable").rows;
	//获取当前TD的index
	var pos = $(td).attr("pos").split(",");
	var idx = Number(pos[1]);
	var colspan = $(td).attr("colspan") ? Number($(td).attr("colspan")) : 1;
	if(colspan > 1){
		idx = idx + colspan - 1; //当前td的colspan影响插入列的位置
	}
	var insertArray = [];
	for(i=0; i<rows.length; i++){
		var ctd = null;
		var curTd = $("#autoLayoutTable td[pos='"+i+","+(idx)+"']");
		if(curTd.size() == 0){   //如果当前td不存在，并且属于一个合并单元格的内容，为当前合并单元格增加1个colspan
			var retTd = tdInCells(i, idx);
			if(retTd != null){
				var r = Number(retTd.attr("colspan")) + 1;
				retTd.attr("colspan", r);
				var c = Number(retTd.attr("rowspan"));
				if(c > 1){
					i = i + c - 1;
				}
				continue;
			}
		}else{
			//如果当前td存在，并且colspan > 1, 为当前td 添加一个colspan
			var r = curTd.attr("colspan") ? Number(curTd.attr("colspan")) : 1;
			var c = Number(curTd.attr("rowspan"));   //rowspan 影响数据行
			if(c > 1){
				i = i + c - 1;
			}
			if(r > 1){
				curTd.attr("colspan", r + 1);
				continue;
			}
			ctd = curTd;
		}
		var rspan = ctd.attr("rowspan") ? Number(ctd.attr("rowspan")) : 1;
		var cspan = ctd.attr("colspan") ? Number(ctd.attr("colspan")) : 1; 
		//当前插入的TD跨行和列，需要设置新的 colspan, rowspan
		var str = "<td class=\"laytd\" rowspan=\""+rspan+"\" colspan=\""+cspan+"\"></td>";
		//ctd.after(str);
		insertArray.push({"obj":ctd, "str" : str});
	}
	for(i=0; i<insertArray.length; i++){
		insertArray[i].obj.after(insertArray[i].str);
	}
	updateHeightWidth();
}
function lyt_deleteCol(){
	var td = $(curTmpInfo.curtabtd);
	var rows = document.getElementById("autoLayoutTable").rows;
	//定义判断需要删除的单元格是否属于一个合并单元格的内容。
	var tdInCells = function(rowIndex, colIndex){
		var returnTd = null;
		$("#autoLayoutTable td").each(function(index, element) {
            var pos = $(element).attr("pos").split(",");
			var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
			var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
			if(colspan > 1){
				if(rowIndex >= Number(pos[0]) && rowIndex < Number(pos[0])+ rowspan && 
					colIndex > Number(pos[1]) && colIndex <= Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
					returnTd = $(element);
				}
			}
        });
		return returnTd;
	};
	//获取当前TD的index
	var pidx = Number(td.attr("pos").split(",")[1]);
	var removes = [];
	//对于colspan > 1 的单元格删除，需要删除多列
	var tdcspan = td.attr("colspan") ? Number(td.attr("colspan")) : 1;
	for(k=0; k<tdcspan; k++){
		var idx = pidx + k;
		for(i=0; i<rows.length; i++){
			var curTd = $("#autoLayoutTable td[pos='"+i+","+(idx)+"']");
			if(curTd.attr("pos") == td.attr("pos")){  //需要移除的td刚好是当前选择的TD，不用判断直接移除
				removes.push(curTd);
				var c = Number(curTd.attr("rowspan"));  //rowspan影响列
				if(c > 1){
					i = i + c - 1;
				}
				continue;
			}
			if(curTd.size() == 0){   //如果当前td不存在，并且属于一个合并单元格的内容，为当前合并单元格减少1个colspan
				var retTd = tdInCells(i, idx);
				if(retTd != null){
					var r = Number(retTd.attr("colspan")) - 1;
					retTd.attr("colspan", r);
					var c = Number(retTd.attr("rowspan"));
					if(c > 1){
						i = i + c - 1;
					}
					continue;
				}
			}else{
				//如果当前td存在，并且colspan > 1, 为当前td 减少一个colspan
				var r = curTd.attr("colspan") ? Number(curTd.attr("colspan")) : 1;

				//有rowspan > 1, 影响多行
				var c = curTd.attr("rowspan") ? Number(curTd.attr("rowspan")) : 1;
				if(c > 1){
					i = i + c - 1;
				}
				if(r > 1){
					curTd.attr("colspan", r - 1);
					continue;
				}
			}
			
			removes.push(curTd);;
		}
	}
	for(i=0; i<removes.length; i++){
		$(removes[i]).remove();
	}
	updateHeightWidth();
}
function lyt_deleteRow(){
	var td = $(curTmpInfo.curtabtd);
	var colCount = 0;
	var cells = document.getElementById("autoLayoutTable").rows[0].cells;
	for(i=0; i<cells.length; i++){
		var colspan = $(cells[i]).attr("colspan") ? Number($(cells[i]).attr("colspan")) : 1;
		colCount = colCount + colspan;
	}
	//定义判断需要删除的单元格是否属于一个合并单元格的内容。
	var tdInCells = function(rowIndex, colIndex){
		var returnTd = null;
		$("#autoLayoutTable td").each(function(index, element) {
            var pos = $(element).attr("pos").split(",");
			var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
			var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
			if(rowspan > 1){
				if(rowIndex > Number(pos[0]) && rowIndex <= Number(pos[0] + rowspan) && 
					colIndex >= Number(pos[1]) && colIndex < Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
					returnTd = $(element);
				}
			}
        });
		return returnTd;
	};
	var deltrs = [];
	var pos = $(td).attr("pos").split(",");
	var nrow = Number(pos[0]);
	var delrowspan = td.attr("rowspan") ? Number(td.attr("rowspan")) : 1;  //rowspan 影响删除的行数
	for(n=0; n<delrowspan; n++){
		for(i=0; i<colCount; i++){
			var row = nrow + n;
			var curTd = $("#autoLayoutTable td[pos='"+row+","+i+"']");
			if(curTd.size() == 0){
				//需要删除的单元格不存在，并且属于一个合并单元格中，需要把合并单元格的rowspan - 1
				var retTd = tdInCells(row, i);
				if(retTd != null){
					var r = Number(retTd.attr("rowspan")) - 1;
					retTd.attr("rowspan", r);
					//如果retTd的colspan > 1, 为i 追加 rowspan - 1, 不然rowspan 会被加多次
					var c = Number(retTd.attr("colspan"));
					if(c > 1){
						i = i + c - 1;
					}
				}
			}else{
				//需要删除的单元格存在，并且占用多行(row), 减少rowspan,  并且把td放入下一行
				if(Number(curTd.attr("rowspan")) > 1){
					curTd.attr("rowspan", Number(curTd.attr("rowspan")) - 1);
					var isdeal = false;
					var l = i -1;
					while(l>=0){   //向前查找是否有对象
						var target = $("#T"+compId+" td[pos='"+(row+1)+","+(l)+"']");
						if(target.size() > 0){
							target.after(curTd);
							isdeal = true;
							break;
						}
						l = l - 1;
					}
					if(isdeal == false){
						l = i + 1;
						while(l < colCount){ //向后查找是否有对象
							var target = $("autoLayoutTable td[pos='"+(row+1)+","+(l)+"']");
							if(target.size() > 0){
								target.before(curTd);
								isdeal = true;
								break;
							}
							l = l + 1;
						}
					}
				}
				var c = Number(curTd.attr("colspan"));  //如果colspan > 1, 夸多列处理
				if(c > 1){
					i = i + c - 1;
				}
				
			}
		}
		deltrs.push($("#autoLayoutTable tr").get(row));
	}
	for(i=0; i<deltrs.length; i++){
		$(deltrs[i]).remove();
	}	
	updateHeightWidth();
}
function updateHeightWidth(noSetPos){
	//获取第一行
	var cells = document.getElementById("autoLayoutTable").rows[0].cells;
	var cols = 0;  //获取宽度
	for(i=0; i<cells.length; i++){
		cols = cols + Number(($(cells[i]).attr("colspan")?$(cells[i]).attr("colspan"):1));
	}
	var effectRow = {}; // 在rowspan 的单元格中需要影响后面行的宽度，定义 行数+逗号+列+after/before后的影响行数MAP对象. 比如 {"1,1after":2}, after/befroe表示插入的前还是后
	var rows = document.getElementById("autoLayoutTable").rows;
	var rowLength = rows.length; //行数
	for(j=0; j<rowLength; j++){
		cells = rows[j].cells;
		var wposIndex = 0; // 行pos位置
		for(i=0; i<cells.length; i++){
			var colspan = $(cells[i]).attr("colspan")?Number($(cells[i]).attr("colspan")):1;
			var rowspan = $(cells[i]).attr("rowspan")?Number($(cells[i]).attr("rowspan")):1;
			var wd = ((100/cols) * colspan);
			var hd = ((100/rowLength) * rowspan);
			$(cells[i]).attr({"width" : Math.round(wd) + "%", "height":Math.round(hd)+"%"});  //定义单元格宽度，高度
			
			if(noSetPos && noSetPos==true){
				continue;
			}
			if(rowspan > 1){  //会影响后面行的pos
				for(k=1; k<rowspan; k++){
					//判断启用before 还是 after, before 表示影响的行前面没有单元格（td）
					var st = "before";
					//i == 0)  //第0列肯定是before
					for(m=0;m<i;m++){
						var rs = ($(cells[m]).attr("rowspan")?Number($(cells[m]).attr("rowspan")):1) - 1;
						if(rs < k){   //如果当前单元格的跨度  <  影响的行, 说明影响的行的单元格前面存在单元格，
							st = "after";   
							break;
						}
					}
					
					effectRow[(j+k)+","+(st=="before"?wposIndex:wposIndex-1)+st] = colspan;  //占位影响的行, 需要考虑before/after
				}
			}
			//如果是第一行，先判断是否需要追加 占位位置，  需考虑连续追加
			for(l=wposIndex-1; i==0&&l<cols; l++){
				if(effectRow[j+","+(wposIndex)+"before"]){
					wposIndex = wposIndex + effectRow[j+","+(wposIndex)+"before"];
				}else{
					break;
				}
			}
			$(cells[i]).attr({"pos":j+","+wposIndex});
			wposIndex = wposIndex + 1;
			if(colspan > 1){  //会影响本行后面的pos
				wposIndex = wposIndex + (colspan - 1);
			}
			//wposIndex追加 占位 位置, 需考虑连续追加
			for(l=wposIndex-1; l<cols; l++){  //考虑连续追加，两个竖向合并单元格
				if(effectRow[j+","+(l) + "after"]){
					wposIndex = wposIndex + effectRow[j+","+(l) + "after"];
				}else{
					break;
				}
			}
		}
	}
}
//portal首页的布局显示函数
function initPortalLayout(){
	var json = pageInfo.body;
	var cps = [];
	var ret = "<table border=\"0\" style=\"width:1020px;\" cellspacing=\"0\" cellpadding=\"0\" class=\"r_layout\" id=\"layout_table\">";
	for(var i=1; true; i++){
		var tr = json["tr"+i];
		if(!tr || tr == null){
			break;
		}
		ret = ret + "<tr>";
		for(var j=0; j<tr.length; j++){
			var td = tr[j];
			ret = ret + "<td class=\"laytd2\" height=\""+td.height+"%\" width=\""+td.width+"%\" colspan=\""+td.colspan+"\" rowspan=\""+td.rowspan+"\" >";
			if(td.children){
				for(var k=0; k<td.children.length; k++){
					var comp = findTCompById(td.children[k]);
					var str = compStr(comp, false);
					ret = ret + str;
					cps.push(comp);
				}
			}
			ret = ret + "</td>";
		}
		ret = ret + "</tr>";
	}
	ret = ret + "</table>";
	$("#optarea").html(ret);
	for(var i=0; i<cps.length; i++){
		var comp = cps[i];
		var url =  '../' + comp.url;
		var param = comp.dayParam && comp.dayParam != '' ? "({" + comp.dayParam + ":'" + curDt + "'})" : "({})";
		$("#c_"+comp.id + " div.cctx").html("<div style='padding:5px;'>加载中...</div>").load(url, eval(param), function(){
		});
	}
}
function initlayout(){
	var id = pageInfo.layout;
	var json = pageInfo.body;
	crtLayoutHTML(json, true);
	//注册window resize 事件, 改变图形大小 
	$(window).on("resizeend", function(e){
		resetCharts();
	});
	//注册布局切换事件，改变图形大小
	$("#Jlayout").layout({
		onAdd:function(c){
			if(c == "east"){
				window.setTimeout(function(){resetCharts();}, 200);
				resetCharts();
			}
		},
		onRemove:function(c){
			if(c == "east"){
				window.setTimeout(function(){resetCharts();}, 200);
			}
		}
	});
}
/*改变图像大小*/
function resetCharts(){
	for(i=0; i<curTmpInfo.comps.length; i++){
		var c = curTmpInfo.comps[i];
		var id = c.id;
		if(c.type == "chart"){
			var chart = echarts.getInstanceByDom(document.getElementById('C'+id));
			chart.resize($("#C"+id).width(), $("#C"+id).height());
		}
	}
}
/**
isbind 是否绑定事件
*/
function crtLayoutHTML(json, isbind){
	var cps = [];
	var ret = "<table border=\"0\"  style=\"width:"+(curTmpInfo.is3g=="y"?"460px":"100%")+";\" cellspacing=\"0\" cellpadding=\"0\" class=\"r_layout\" id=\"layout_table\">";
	for(var i=1; true; i++){
		var tr = json["tr"+i];
		if(!tr || tr == null){
			break;
		}
		ret = ret + "<tr>";
		for(var j=0; j<tr.length; j++){
			var td = tr[j];
			ret = ret + "<td class=\"laytd\" height=\""+td.height+"%\" width=\""+td.width+"%\" colspan=\""+td.colspan+"\" rowspan=\""+td.rowspan+"\" id=\"layout_"+td.id+"\">";
			if(td.children){
				for(var k=0; k<td.children.length; k++){
					var str = addComp(td.children[k], td.id, false); 
					ret = ret + str;
					cps.push(td.children[k]);
				}
			}
			ret = ret + "</td>";
		}
		ret = ret + "</tr>";
	}
	ret = ret + "</table>";
	curTmpInfo.comps = cps;
	$("#optarea").html(ret);
	if(isbind){
		for(i=0; i<cps.length; i++){
			bindCompEvent(cps[i]);
			//注册组件 resize 事件
			bindResizeEvent(cps[i].id, cps[i].type);
			if(cps[i].type == "table"){
				tableView(cps[i], cps[i].id);
			}else if(cps[i].type == "chart"){
				chartview(cps[i], cps[i].id);
			}else if(cps[i].type == 'grid'){
				gridView(cps[i]);
			}else if(cps[i].type == "box"){
				boxView(cps[i]);
			}
		}
	}
	//注册每个TD的接收组件拖放事件
	$("#layout_table td.laytd").droppable({
		accept:"div.ibox, #comp_tree .tree-node",
		onDragEnter:function(e,source){
			var obj = $(this);
			if(obj.children().size() == 0){
				$(".indicator").css({
					display:'block',
					left:obj.offset().left,
					top:obj.offset().top - 3
				});
			}else{
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
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").addClass("tree-dnd-yes");
		},
		onDragLeave:function(e,source){
			$(source).draggable('proxy').find("span").addClass("tree-dnd-no");
			$(source).draggable('proxy').find("span").removeClass("tree-dnd-yes");
			delete curTmpInfo.id;
		},
		onDrop:function(e,source){
			$(".indicator").hide();
			if($(source).hasClass("ibox")){ //组件间的拖拽
				if(!curTmpInfo.mouseOnDiv){
					$(this).append(source);
				}else{
					if(curTmpInfo.tp == "before"){
						$("#"+curTmpInfo.id).before(source);
					}else{
						$("#"+curTmpInfo.id).after(source);
					}
				}
				window.setTimeout(function(){
					var id = $(source).attr("id").replace("c_", "");
					var comp = findCompById(id);
					if(comp.type == "chart"){  //拖拽后重新调整图形大小
						var chart = echarts.getInstanceByDom(document.getElementById('C'+comp.id));
						chart.resize($("#C"+comp.id).width(), $("#C"+comp.id).height());
					}
				}, 200);
			}else{
				var node = $("#comp_tree").tree("getNode", source);
				//从组件树拖拽， 创建组件
				var layoutId = $(this).attr("id").split("_")[1];
				var tp = node.attributes.tp;
				if(tp == "text"){
					insertText("insert", layoutId, '', curTmpInfo.id, curTmpInfo.tp);
				}else if(tp == "table"){
					var comp = {"id":newGuid(), "name":"交叉表", "type":"table"};
					var str = addComp(comp, layoutId, true);
					if(!curTmpInfo.id){
						$("#layout_"+layoutId).append(str);
					}else{
						if(curTmpInfo.tp == "before"){
							$("#"+curTmpInfo.id).before(str);
						}else{
							$("#"+curTmpInfo.id).after(str);
						}
					}
					//注册拖放事件
					bindCompEvent(comp);
					bindResizeEvent(comp.id, 'table');
					//滚动位置
					window.setTimeout(function(){
						$("#optarea").scrollTop($("#c_"+comp.id).offset().top);
					}, 500);
				}else if(tp == "chart"){
					setcharttype(true, layoutId, curTmpInfo.id, curTmpInfo.tp)					
				}else if(tp == "grid"){
					var comp = {"id":newGuid(), "name":"表格", "type":"grid"};
					var str = addComp(comp, layoutId, true);
					if(!curTmpInfo.id){
						$("#layout_"+layoutId).append(str);
					}else{
						if(curTmpInfo.tp == "before"){
							$("#"+curTmpInfo.id).before(str);
						}else{
							$("#"+curTmpInfo.id).after(str);
						}
					}
					//注册拖放事件
					bindCompEvent(comp);
					bindResizeEvent(comp.id, 'grid');
					//滚动位置
					window.setTimeout(function(){
						$("#optarea").scrollTop($("#c_"+comp.id).offset().top);
					}, 500);
				}else if(tp == "box"){
					var comp = {"id":newGuid(), "name":"数据块", "type":"box"};
					var str = addComp(comp, layoutId, true);
					if(!curTmpInfo.id){
						$("#layout_"+layoutId).append(str);
					}else{
						if(curTmpInfo.tp == "before"){
							$("#"+curTmpInfo.id).before(str);
						}else{
							$("#"+curTmpInfo.id).after(str);
						}
					}
					//注册拖放事件
					bindCompEvent(comp);
					//resize事件
					bindResizeEvent(comp.id, 'box');
				}
				
			}
			delete curTmpInfo.tp;
			delete curTmpInfo.id;
			delete curTmpInfo.mouseOnDiv;
			curTmpInfo.isupdate = true;
		}

	});
}
function compevent(compId){
	if(!compId){
		compId = curTmpInfo.compId;
	}
	var comp = findCompById(compId);
	if(comp.type == 'chart' || comp.type == 'table'){
	}else{
		return;
	}
	var clink;
	var linkaccept;
	if(comp.type == "chart" && comp.chartJson){
		clink = comp.chartJson.link;
		linkaccept = comp.chartJson.linkAccept;
	}else{
		clink = comp.link;
		linkaccept = comp.linkAccept;
	}
	var str = "<select id=\"linkcomp\" name=\"linkcomp\" class=\"inputform2\"><option value=\"\"></option>";
	for(i=0; i<curTmpInfo.comps.length; i++){
		var o = curTmpInfo.comps[i];
		if(o.type == 'chart' || o.type == 'table'){
			if(o.id != compId){  //不添加它自己
				str = str + "<option value=\""+o.id+"\" "+(clink&&clink.target==o.id?"selected":"")+" >"+o.name+"</option>";
			}
		}
	}
	str = str + "</select>";
	var cols;
	var findCubeCols = function(cubeId){
		var ret = "";
		$.ajax({
			type:"post",
			url:"../bireport/queryDims.action",
			data: {cubeId: cubeId},
			dataType:"json",
			async:false,
			success: function(resp){
				cols = resp;
				for(k=0; k<resp.length; k++){
					ret = ret + "<option value=\""+resp[k].alias+"\" "+(linkaccept&&linkaccept.alias==resp[k].alias?"selected":"")+">"+resp[k].dim_desc+"</option>";
				}
			}
		});
		return ret;
	};
	var str2 = "<select id=\"acceptCol\" name=\"acceptCol\" class=\"inputform2\"><option value=\"\"></option>";
	str2 = str2 + findCubeCols(comp.cubeId);
	str2 = str2 + "</select>";
	var ctx = "<div id=\"compevent_tab\" style=\"height:auto; width:auto;\"><div title=\"事件发起\"><div class=\"textpanel\"><span class=\"inputtext\">联动组件：</span>"+str+"<br/> &nbsp; &nbsp; ->或-> <br/><span class=\"inputtext\">链接到URL：</span><input type=\"text\" name=\"linkurl\" id=\"linkurl\" class=\"inputform2\" value=\""+(clink&&clink.url?clink.url:"")+"\"><br/><a href=\"javascript:;\" id=\"cleanPostEvent\">清除事件发起</a></div></div><div title=\"事件接收\"><div class=\"textpanel\"><span class=\"inputtext\">接收字段：</span>"+str2+"<br/><span class=\"inputtext\">默认值：</span><input type=\"text\" name=\"dftval\" id=\"dftval\" class=\"inputform2\" value=\""+(linkaccept&&linkaccept.dftval?linkaccept.dftval:"")+"\"><br/><span class=\"inputtext\">默认值类型：</span><select name=\"valtype\" id=\"valtype\" class=\"inputform2\"><option value=\"\"></option><option value=\"number\" "+(linkaccept&&linkaccept.valType=="number"?"selected":"")+">数字类型</option><option value=\"string\" "+(linkaccept&&linkaccept.valType=="string"?"selected":"")+">字符类型</option></select><br/><a href=\"javascript:;\" id=\"cleanAcceptEvent\">清除事件接收</a></div></div></div>";
	$('#pdailog').dialog({
		title: '组件事件设置',
		width: 330,
		height: (comp.type=="table"?290:250),
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var tab = $("#pdailog #compevent_tab").tabs("getSelected");
				var idx = $("#pdailog #compevent_tab").tabs("getTabIndex", tab);
				if(idx == 0){
					var linkcompId = $("#compevent_tab #linkcomp").val();
					var url = $("#compevent_tab #linkurl").val();
					var sendCol = $("#compevent_tab #sendCol").val();
					if(linkcompId == '' && url == ""){
						curTmpInfo.isupdate = true;
						$('#pdailog').dialog('close');
						return;
					}
					var linkComp = findCompById(linkcompId);
					if(comp.type == "chart"){
						comp.chartJson.link = {target:linkcompId, type:(linkComp==null?"":(linkComp.type == 'table' ? "cross": linkComp.type)), url:url, alias: sendCol};
					}else{
						comp.link = {target:linkcompId, type:(linkComp==null?"":(linkComp.type == 'table' ? "cross": linkComp.type)), url:url, alias:sendCol};
					}
					
				}else{
					var col = $("#compevent_tab #acceptCol").val();
					var dim = null;
					for(c=0; c<cols.length; c++){
						if(cols[c].alias == col){
							dim = cols[c];
						}
					}
					var val = $("#compevent_tab #dftval").val();
					var valType = $("#compevent_tab #valtype").val();
					if(col == '' && val == ''){
						curTmpInfo.isupdate = true;
						$('#pdailog').dialog('close');
						return;
					}
					if(comp.type == "chart"){
						comp.chartJson.linkAccept = {col:dim.col_name, alias:dim.alias, type:dim.dim_type, dftval: val, valType: valType, tname:dim.tname,dim_tname:dim.dim_tname};
						chartview(comp, comp.id);
					}else{
						comp.linkAccept = {col:dim.col_name, alias:dim.alias, type:dim.dim_type, dftval: val, valType: valType, tname:dim.tname, dim_tname:dim.dim_tname};
					}
				}
				curTmpInfo.isupdate = true;
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
	$("#pdailog #compevent_tab").tabs({
		border:false,
		fit:true
	});
	$("#compevent_tab #cleanPostEvent").bind("click", function(){
		$("#compevent_tab #linkcomp").val("");
		$("#compevent_tab #linkurl").val("");
		$("#compevent_tab #sendCol").val("");
		if(comp.type == "chart"){
			delete comp.chartJson.link;
		}else{
			delete comp.link;
		}
	});
	$("#compevent_tab #cleanAcceptEvent").bind("click", function(){
		$("#compevent_tab #acceptCol").val("");
		$("#compevent_tab #dftval").val("");
		$("#compevent_tab #valtype").val("");
		if(comp.type == "chart"){
			delete comp.chartJson.linkAccept;
			chartview(comp, comp.id);
		}else{
			delete comp.linkAccept;
		}
	});
}
/**
发布报表到菜单
**/
function pushpage(){
	if(!pageInfo.id || pageInfo.id == ""){
		msginfo("请先保存报表再发布报表。");
		return;
	}
	var ctx = '<div style="padding:10px;"><span class=\"inputtext\">名称：</span><input type=\"text\" id=\"name\" class=\"inputform2\"><br/><span class=\"inputtext\">排序：</span><input type=\"text\" id=\"ord\" class=\"inputform2\" value=\"1\"><br/><span class=\"inputtext\">图标：</span><input type=\"text\" id=\"avatar\" class=\"inputform2\"><table><tr><td valign=\"top\"><span class=\"inputtext\">上级菜单：</span></td><td><ul id=\"ggcatatree\" style=\"width:100%\"></ul></td></tr></table></div>';
	$('#pdailog').dialog({
		title: '发布报表到菜单',
		width: 380,
		height: 300,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var name = $("#pdailog #name").val();
				var ord = $("#pdailog #ord").val();
				if(name == ''){
					msginfo("名称必须填写。");
					return;
				}
				if(ord == ''){
					msginfo("排序必须填写。");
					return;
				}
				if(isNaN(ord)){
					msginfo("排序必须是数字类型。");
					return;
				}
				var node = $("#pdailog #ggcatatree").tree("getSelected");
				if(node == null){
					msginfo("请选择上级菜单。");
					return;
				}
				var avatar = $("#pdailog #avatar").combobox("getValue");
				//新增只能配置3级菜单
				var p1 = $("#pdailog #ggcatatree").tree("getParent", node.target);
				if(p1 != null){
					var p2 = $("#pdailog #ggcatatree").tree("getParent", p1.target);
					if(p2 != null){
						var p3 = $("#pdailog #ggcatatree").tree("getParent", p2.target);
						if(p3 != null && p3.id == "0"){
							$.messager.alert("出错了。","菜单只能建3级", "error");
							return;
						}
					}
				}
				var url = "../portal/show.action?income=menu&pageId=" + pageInfo.id;
				$.ajax({
					type:"POST",
					url:"../control/extControl?serviceid=frame.Menu&methodId=saveMenu&t_from_id=frame.Menu",
					data:{"name":name,"note":"","order":ord, "url":url,"avatar":avatar, "pid":node.id,urls:"portal/Export.action,portal/print.action,portal/show.action"},
					dataType:"html",
					success:function(){
						msginfo("菜单推送成功。", "suc");
					},
					error:function(){
						msginfo("系统出错。");
					}
				});
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
	//初始化菜单
	$('#ggcatatree').tree({
		url:'../control/extControl?serviceid=frame.Menu&methodId=loadData&t_from_id=frame.Menu&t='+Math.random(),
		dnd:false,
		animate:true,
		data: [{id:'0', text:'系统菜单', state:'closed', iconCls:"icon-earth"}],
		onBeforeLoad: function(node){
			if(!node || node == null){
				return false;
			}
		}
	});
	var node = $('#ggcatatree').tree("getRoot");
	$('#ggcatatree').tree("expand", node.target);
	//初始化图标
	$("#pdailog #avatar").combobox({
		url:'../resource/fonts/menu-icons.json',
		valueField:'cls',
		textField:'text',
		height:25,
		formatter:function(row){
			return "<i class=\""+row.cls+"\"></i> "+row.text;
		}
	});
}
//设置报表风格样式
/**
function setpagestyle(){
	var s = pageInfo.stylename;
	var ctx = "<div style='margin:10px;'><br/><span class='rlayout'><div class='pagestyle' tp=\"def\" style='background-color:#eeeeee;'> &nbsp; </div><input type=\"radio\" "+(s&&s=="def"?"checked":"")+" value=\"def\" name=\"selstyle\">默认</span><span class='rlayout'><div class='pagestyle' tp=\"black\" style='background-color:#000000;'> &nbsp; </div><input type=\"radio\" value=\"black\" "+(s&&s=="black"?"checked":"")+" name=\"selstyle\">黑色</span><span class='rlayout'><div class='pagestyle' style='background-color:#00F;' tp=\"blue\"> &nbsp; </div><input type=\"radio\"  value=\"blue\" name=\"selstyle\" "+(s&&s=="blue"?"checked":"")+">蓝色</span><span class='rlayout'><div class='pagestyle' style='background-color:#F00;' tp=\"red\"> &nbsp; </div><input type=\"radio\" "+((s&&s=="red"?"checked":""))+"  value=\"red\" name=\"selstyle\">红色</span><span class='rlayout'><div class='pagestyle' style='background-color:#FF3;' tp=\"yellow\"> &nbsp; </div><input type=\"radio\" value=\"yellow\" name=\"selstyle\" "+((s&&s=="yellow"?"checked":""))+">黄色</span></div>";
	$('#pdailog').dialog({
		title: '报表样式设置',
		width: 430,
		height: 320,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		onLoad:function(){},
		buttons:[{
				text:'确定',
				handler:function(){
					var s = $("input[name=\"selstyle\"]:checked").val();
					pageInfo.stylename = s;
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
	$("span.rlayout div.pagestyle").click(function(){
		var tp = $(this).attr("tp");
		var s = $("input[name=\"selstyle\"][value=\""+tp+"\"]");
		s.attr("checked","checked");
	});
}
**/
function msginfo(input, tp){
	var str = null;
	if(tp && tp == 'suc'){
		str = "<div class='msginfo msgsuc'>" + input +"</div>";
	}else{
		str = "<div class='msginfo msgerr'>" + input+"</div>";
	}
	$.messager.show({
		title: (tp && tp == 'suc')? '成功了' : '出错了',
		msg:str,
		showType:'fade',
		timeout:2000,
		style:{
			right:'',
			top:document.body.scrollTop+document.documentElement.scrollTop + 10,
			bottom:''
		}
	});
}
/**
图形格式化函数
shortname == true 表示显示缩写, 分为k,m
**/
function formatNumber(num,pattern, shortname){
  var shortdw;
   if(shortname && num > 1000000){
	 num = num / 1000000;
	 shortdw = "百万";
  }else if(shortname && num > 10000){
	  num = num / 10000;
	  shortdw = "万";
  }else if(shortname && num > 1000){
	  num = num / 1000;
	  shortdw = "千";
  }
  if(pattern.indexOf("%") > 0){
	  num = num * 100;
  }
  var fmtarr = pattern?pattern.split('.'):[''];
  var retstr='';
  
  //先对数据做四舍五入
  var xsw = 0;
  if(fmtarr.length > 1){
	  xsw = fmtarr[1].length;
  }
  var bl = 1;
  for(i=0; i<xsw; i++){
	  bl = bl * 10;
  }
  num = num * bl;
  num = Math.round(num);
  num = num / bl;
  
  var strarr = num?num.toString().split('.'):['0'];
 
  // 整数部分
  var str = strarr[0];
  var fmt = fmtarr[0];
  var i = str.length-1;  
  var comma = false;
  for(var f=fmt.length-1;f>=0;f--){
    switch(fmt.substr(f,1)){
      case '#':
        if(i>=0 ) retstr = str.substr(i--,1) + retstr;
        break;
      case '0':
        if(i>=0) retstr = str.substr(i--,1) + retstr;
        else retstr = '0' + retstr;
        break;
      case ',':
        comma = true;
        retstr=','+retstr;
        break;
    }
  }
  if(i>=0){
    if(comma){
      var l = str.length;
      for(;i>=0;i--){
        retstr = str.substr(i,1) + retstr;
        if(i>0 && ((l-i)%3)==0) retstr = ',' + retstr; 
      }
    }
    else retstr = str.substr(0,i+1) + retstr;
  }

  retstr = retstr+'.';
  // 处理小数部分
  str=strarr.length>1?strarr[1]:'';
  fmt=fmtarr.length>1?fmtarr[1]:'';
  i=0;
  for(var f=0;f<fmt.length;f++){
    switch(fmt.substr(f,1)){
      case '#':
        if(i<str.length) retstr+=str.substr(i++,1);
        break;
      case '0':
        if(i<str.length) retstr+= str.substr(i++,1);
        else retstr+='0';
        break;
    }
  }

  var r = retstr.replace(/^,+/,'').replace(/\.$/,''); 
  if(pattern.indexOf("%") > 0){
	  r = r + "%";
  } 
  if(shortdw){
	  r = r + shortdw;
  }
  return r;
}
//从写表格链接组件方法
function tableUpdateComp(config){
	var obj = jQuery('#' + config.id);
	obj.on('click', '.row-link', function(e){
		alert("定制模式下点击无效。");
	});
}
//从写图形组件链接方法
function chartComp_Link(){
	alert("定制模式下点击无效。");
}
//从布局器中查询td(容器)
function findLayoutById(layoutId){
	var ret = null;
	for(var i=1; true; i++){
		var tr = pageInfo.body["tr"+i];
		if(!tr || tr == null){
			break;
		}
		for(var j=0; j<tr.length; j++){
			var td = tr[j];
			if(td.id == layoutId){
				ret = td;
				break;
			}
		}
	}
	return ret;
}