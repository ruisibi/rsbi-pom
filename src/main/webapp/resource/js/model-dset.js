if($ == undefined){
	$ = jQuery;
}
var dataType = ["String", "Int", "Double", "Date", "Datetime"];
function initdsetTable(){
    if($("#dsettable").size() > 0){
	$("#dsettable").datagrid("load", {t:Math.random()});
	return;
    }
    var ctx = "<table id=\"dsettable\" title=\"数据集管理\" ><thead><tr><th data-options=\"field:'ck',checkbox:true\"></th><th data-options=\"field:'name',width:120\">名称</th><th data-options=\"field:'priTable',width:200,align:'left'\">主表</th><th data-options=\"field:'dsname',width:120,align:'center'\">数据源</th><th data-options=\"field:'useType',width:120,align:'center'\">连接</th></tr></thead></table>";
    $("#optarea").html(ctx);
    $("#dsettable").datagrid({
	singleSelect:true,
	collapsible:false,
	pagination:false,
	border:false,
	fit:true,
	url:'listDataset.action',
	toolbar:[{
	  text:'新增',
	  iconCls:'icon-add',
	  handler:function(){
	    newdset(false);
	  }
	},{
	  text:'修改',
	  iconCls:'icon-edit',
	  handler:function(){
		var row = $("#dsettable").datagrid("getChecked");
		if(row == null || row.length == 0){
			$.messager.alert("出错了。","您还未勾选数据。", "error");
			return;
		}
		 newdset(true, row[0].dsetId);
	  }
	},{
		text:"刷新",
		iconCls:"icon-reload",
		handler:function(){
			var row = $("#dsettable").datagrid("getChecked");
			if(row == null || row.length == 0){
				$.messager.alert("出错了。","您还未勾选数据。", "error");
				return;
			}
			__showLoading();
			$.ajax({
				type:'get',
				url:'reloadDset.action',
				dataType:'json',
				data:{"dsetId":row[0].dsetId, "dsid":row[0].dsid},
				success: function(dt){
					__hideLoading();
					if(dt.result == 0){
						$.messager.alert("出错了。",dt.msg, "error");
					}else{
						$.messager.alert("成功了。","字段刷新成功。", "info");
					}
				},
				error:function(){
					__hideLoading();
					$.messager.alert("出错了。","系统异常。", "error");
				}
			});
		}
	},{
	  text:'删除',
	  iconCls:'icon-cancel',
	  handler:function(){
		var row = $("#dsettable").datagrid("getChecked");
		if(row == null || row.length == 0){
			$.messager.alert("出错了。","您还未勾选数据。", "error");
			return;
		}
		delDset(row[0].dsetId);
	  }
	}]
    });
}
function delDset(dsetId){
	if(confirm("是否确认删除？")){
		$.ajax({
			url:'deleteDset.action',
			data: {dsetId:dsetId},
			type:'POST',
			dataType:'json',
			success:function(){
				$("#dsettable").datagrid("reload", {t:Math.random});
			},
			error:function(){
				msginfo("系统出错，请查看后台日志。");
			}
		});
	}
}
function newdset(isupdate, dsetId){
	var transform = {};
	var treeStr = "";
	var tables = "";
	if(isupdate){
		$.ajax({
		   type: "POST",
		   async:false,
		   url: "getDatasetCfg.action",
		   dataType:"json",
		   data: {"dsetId": dsetId},
		   success: function(resp){
			   transform = resp;
		   }
		});
		treeStr = treeStr + "<li data-options=\"id:'"+transform.master+"',iconCls:'icon-table'\"><span>"+transform.master+"</span></li>"; //添加主表
		tables = tables + "<option value=\""+transform.master+"\" selected>"+transform.master+"</option>";
		var tbs = [];
		for(i=0; transform.joininfo&&i<transform.joininfo.length; i++){
			var t = transform.joininfo[i].ref;
			if(tbs.indexOf(t) == -1){
				tbs.push(t);
				treeStr = treeStr + "<li data-options=\"id:'"+t+"',iconCls:'icon-table'\"><span>"+t+"</span></li>";  //添加关联表
			}else{
				continue;
			}
		}
		
	}
	//数据源列表
	var dsls = "";
	$.ajax({
		type:'GET',
		url:'listDataSource.action',
		dataType:'JSON',
		data:{},
		async:false,
		success: function(resp){
		   for(i=0; i<resp.length; i++){
			   var t = resp[i];
			   dsls = dsls + "<option value='"+t.dsid+"' "+(t.dsid == transform.dsid?"selected":"")+">"+t.dsname+"</option>";
		   }
		}
	});
	var ctx = "<div id=\"crtdataset\"><div title=\"基本信息\"><div class=\"textpanel\"><span class=\"inputtext\">数据集名称：</span><input type=\"text\" id=\"name\" name=\"name\" value=\""+(transform.name?transform.name:"")+"\" class=\"inputform\"><br/><span class=\"inputtext\">数据源：</span><select id=\"dsid\" class=\"inputform\">"+dsls+"</select><br/><span class=\"inputtext\" style=\"width:120px;\">选择表：</span><br/><div class=\"tablesleft\"><div class=\"tabletitle\">待选表</div><ul id=\"allTablesTree\" style=\"height:270px; width:100%; overflow:auto\"></ul></div><div class=\"tablescenter\"><input id=\"left2right\" type=\"button\" style=\"margin-top:120px;\" value=\">\" title=\"选择\" class=\"btn btn-primary btn-sm\"><br/><br/><input type=\"button\" id=\"right2left\"  value=\"<\" title=\"移除\" class=\"btn btn-primary btn-sm\"></div><div class=\"tablesright\"><div class=\"tabletitle\">已选表</div><ul id=\"selTablesTree\" class=\"easyui-tree\" style=\"height:270px; width:100%; overflow:auto\">"+treeStr+"</ul></div></div></div><div title=\"表关联\"><div class=\"textpanel\"><div style=\"float:right\"><input type=\"button\" id=\"jointable\" value=\"关联\" class=\"btn btn-primary btn-xs\"> <br/> <input type=\"button\" id=\"unjointable\" value=\"取消\" class=\"btn btn-primary btn-xs\"></div><span class=\"inputtext\">主表： </span><select id=\"mastertable\" class=\"inputform\" style=\"width:300px;\" "+(isupdate?"disabled":"")+">"+tables+"</select>"+(isupdate?"<font color='#999'>(禁止更改)</font>":"")+"<br/><ul class=\"easyui-tree\" id=\"masterTableTree\" style=\"margin-left:100px;border:1px solid #999; width:300px; height:320px; overflow:auto\"></ul></div></div>"+(isupdate?"<div title=\"表字段\"></div><div title=\"动态字段\"></div>":"")+"</div>";
	$('#pdailog').dialog({
		title: isupdate?'编辑数据集':'创建数据集',
		width: 700,
		height: 470,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		onLoad:function(){
		},
		content: ctx,
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var name = $("#pdailog #name").val();
				if(name == ''){
					msginfo("请录入数据集名称。");
					$("#pdailog #crtdataset").tabs("select", 0);
					$("#pdailog #name").focus();
					return;
				}
				var cld = $("#selTablesTree").tree("getChildren");
				if(cld == null || cld.length == 0){
					msginfo("请选择表。");
					$("#pdailog #crtdataset").tabs("select", 0);
					return;
				}
				//判断是否关联
				if(cld.length > 1 && (!transform.joininfo || transform.joininfo.length != cld.length - 1)){
					msginfo("请建立表关联。");
					$("#pdailog #crtdataset").tabs("select", 1);
					return;
				}
				
				transform.name = name;
				transform.dsid = $("#pdailog #dsid").val();
				transform.dsetId = isupdate?transform.dsetId:newGuid();
				
				//新增需要获取字段
				if(!isupdate){
					$.ajax({
						type:'post',
						async: false,
						url:'queryDatasetMeta.action',
						dataType:'json',
						data:{"dsid":transform.dsid, "cfg":JSON.stringify(transform)},
						success: function(dt){
							transform.cols = dt;
						}
					});
				}
				
				__showLoading();
				$.ajax({
				   type: "POST",
				   async:false,
				   url: isupdate?"updateDset.action":"saveDset.action",
				   dataType:"HTML",
				   data: {cfg:JSON.stringify(transform), priTable: transform.master, name:transform.name,dsid:transform.dsid, dsetId:transform.dsetId},
				   success: function(resp){
					   __hideLoading();
					   $('#pdailog').dialog('close');
					   $("#dsettable").datagrid("reload", {t:Math.random});
				   },
				   error:function(er){
					   msginfo("系统出错，请查看后台日志。");
					   __hideLoading();
				   }
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
	//加载tabs
	$("#pdailog #crtdataset").tabs({fit:true,border:false,tabPosition:'left',onSelect:function(a, b){
			if(b == 3){
				reloadDynamicCol(transform);
			}else if(b == 2){ //加载表字段
				var pp = $('#pdailog #crtdataset').tabs('getSelected');
				var str = "<table class=\"grid3\" id=\"T_report54\" cellpadding=\"0\" cellspacing=\"0\">";
				str = str + "<tr><th width='20%'>字段名</th><th width='17%'>显示名</th><th width='13%'>类型</th><th width='30%'>来源表</th><th width='10%'>操作</th></tr>";
				for(var i=0; i<transform.cols.length; i++){
					m = transform.cols[i];
					str = str + "<tr><td class='kpiData1 grid3-td'>"+m.name+"</td><td class='kpiData1 grid3-td'><div id=\""+m.tname+"_"+m.name+"_disp\">"+(m.dispName == '' ? "&nbsp;":m.dispName)+"</div></td><td class='kpiData1 grid3-td'><div id=\""+m.tname+"_"+m.name+"_tp\">"+m.type+"</div></td><td class='kpiData1 grid3-td'>"+m.tname+"</td><td class='kpiData1 grid3-td'><button class=\"btn btn-info btn-xs\" cname='"+m.name+"' tname='"+m.tname+"' >编辑</buttton></td></tr>";
				}
				str = str + "</table>";
				$(pp).html(str);
				$("#crtdataset table.grid3 td button").click(function(){
					var name = $(this).attr("cname");
					var tname = $(this).attr("tname");
					editDsColumn(name, transform, tname);
				});
			}
		}
	});
	//加载目标表
	var initTablesFunc = function(dsid){
		//加载表列表树
		$.ajax({
			type:'post',
			url:'listTables.action',
			dataType:'json',
			data:{dsid:dsid},
			success: function(dt){
				$("#allTablesTree").tree({
					data: dt
				});
				if(isupdate){
					//隐藏已经选择的表
					$($("#allTablesTree").tree("find", transform.master).target).attr("hide", "y").hide();
					for(k=0; transform.joininfo&&k<transform.joininfo.length; k++){
						var j = transform.joininfo[k];
						$($("#allTablesTree").tree("find", j.ref).target).attr("hide", "y").hide();
					}
				}
			}
		});
	}
	initTablesFunc($("#pdailog #dsid").val());
	$("#pdailog #dsid").change(function(){
		initTablesFunc($(this).val());
	});
	//绑定选择事件
	$("#pdailog #left2right").bind("click", function(){
		var node = $("#allTablesTree").tree("getSelected");
		if(node == null || $(node.target).attr("hide") == 'y'){
			msginfo("请先从左边选择表。");
			return
		}
		$("#selTablesTree").tree("append", {parent:null, data:[{id:node.id, text:node.text, iconCls:node.iconCls}]});
		$(node.target).attr("hide", "y").hide();
		if(isupdate){
			//添加字段
			$.ajax({
				type:'GET',
				url:'listTableColumns.action',
				dataType:'json',
				data:{tname:node.id, dsid:$("#pdailog #dsid").val()},
				success: function(dt){
					//添加字段
					for(k=0; k<dt.length; k++){
						dt[k].tname = node.id; //tname
						transform.cols.push(dt[k]);
					}
				}
			});
		}else{
			//更新主表select的数据
			var sel = document.getElementById("mastertable");
			var sidx = sel.selectedIndex;
			sel.options.add(new Option(node.text, node.id));
			if(sidx == -1){  //说明是从无到有，更新表字段
				updateColsFunc(node.text);
				//并且设置为主表
				transform.master = node.id;
			}
		}
	});
	$("#pdailog #right2left").bind("click", function(){
		var node = $("#selTablesTree").tree("getSelected");
		if(node == null){
			msginfo("您还未选择需要移除的表。");
			return
		}
		if(isupdate && node.id == transform.master){
			msginfo("不能移除主表。");
			return;
		}
		var cld = $("#allTablesTree").tree("getChildren");
		for(i=0; i<cld.length; i++){
			if(cld[i].id == node.id){
				$(cld[i].target).attr("hide", "n").show();
				break;
			}
		}
		$("#selTablesTree").tree("remove", node.target);
		//更新主表select框中内容, 编辑状态下不要更新
		if(!isupdate){
			var sel = document.getElementById("mastertable");
			var sidx = sel.selectedIndex;
			var idx = 0;
			for(i=0; i<sel.options.length; i++){
				if(sel.options[i].value == node.id){
					idx = i;
					break;
				}
			}
			sel.options.remove(idx);
			if(sidx == idx){ //如果删除那个字段刚好是选择的字段，更新表字段
				updateColsFunc(sel.options[sel.selectedIndex].value);
				transform.master = sel.options[sel.selectedIndex].value;
			}
		}else{
			//编辑状态下移除字段
			var ret = [];
			for(i=0; i<transform.cols.length; i++){
				var t = transform.cols[i];
				if(t.tname != node.id){
					ret.push(t);
				}
			}
			transform.cols = ret;
			//移除关联
			var idx = -1;
			for(j=0; j<transform.joininfo.length; j++){
				if(transform.joininfo[j].ref == node.id){
					idx = j;
				}
			}
			if(idx != -1){
				transform.joininfo.splice(idx, 1);
			}
		}
	});
	//表关联 -- 取消关联按钮
	$("#unjointable").bind("click", function(){
		var node = $("#masterTableTree").tree("getSelected");
		if(node == null){
			msginfo("您还未从主表字段中选择需要删除关联的字段。");
			return;
		}
		delete node.attributes.ref;
		delete node.attributes.refKey;
		$("#masterTableTree").tree("update", {target:node.target, text:node.id, iconCls:"icon-dscol"});
		//从transform 移除关联
		var idx = -1;
		for(j=0; j<transform.joininfo.length; j++){
			if(transform.joininfo[j].col == node.id){
				idx = j;
			}
		}
		transform.joininfo.splice(idx, 1);
	});
	//表关联 -- 关联按钮
	$("#pdailog #jointable").click(function(){
		jointableFunc(transform);
	});
	//更新表关联表的字段
	var updateColsFunc = function(tname){
		$.ajax({
			type:'post',
			url:'listTableColumns.action',
			dataType:'json',
			data:{"tname": tname, dsid:$("#pdailog #dsid").val()},
			success: function(dt){
				var d = [];
				for(k=0; k<dt.length; k++){
					var obj = {id:dt[k].name, text:dt[k].name, iconCls:"icon-dscol", attributes:{}};
					if(isupdate){
						var joininfo = findJoinInfoById(transform, dt[k].name);
						if(joininfo != null){
							obj.iconCls = "icon-coljoin";
							obj.attributes.ref = joininfo.ref;
							obj.attributes.refKey = joininfo.refKey;
							obj.text = dt[k].name + " -> " + joininfo.ref + "." + joininfo.refKey;
						}
					}
					d.push(obj);
				}
				$("#masterTableTree").tree({
					data: d,
					onDblClick:function(node){
						jointableFunc(transform);
					}
				});
			}
		});
	}
	$("#mastertable").bind("change", function(){
		updateColsFunc($(this).val());
		transform.master = $(this).val(); //并且把选择表设置为主表
	});
	//如果是修改状态，获取主表的字段列表
	if(isupdate){
		updateColsFunc(transform.master);
	}
	
}
function editDsColumn(colId, dset, tname){
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	var tmp = null;
	for(var i=0; i<dset.cols.length; i++){
		if(dset.cols[i].name == colId && dset.cols[i].tname == tname){
			tmp = dset.cols[i];
			break;
		}
	}
	var tps = "";
	for(var i=0; i<dataType.length; i++){
		tps = tps + "<option value=\""+dataType[i]+"\" "+(tmp.type == dataType[i] ? "selected" : "")+">"+dataType[i]+"</option>";
	}
	var joinInfo = null;
	//查询表字段关联信息
	for(j=0; dset.joininfo && j<dset.joininfo.length; j++){
		//是主表，字段相同
		if( dset.master==tmp.tname && dset.joininfo[j].col == tmp.name){
			joinInfo = dset.joininfo[j];
			break;
		}else
		if(tmp.tname == dset.joininfo[j].ref && tmp.name == dset.joininfo[j].refKey ){
			joinInfo =  dset.joininfo[j];
			break;
		}
	}
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">字段名：</span>"+tmp.name+"<br/><span class=\"inputtext\">显示名：</span><input type=\"text\" name=\"coldispname\" id=\"coldispname\" value=\""+tmp.dispName+"\" class=\"inputform2\"><br/><span class=\"inputtext\">类型：</span><select id=\"coltype\" class=\"inputform2\">"+tps+"</select><br/><span class=\"inputtext\">来源表：</span>"+tmp.tname+"<br/><span class=\"inputtext\">字段关联：</span>"+(joinInfo==null?"字段无关联":dset.master+"."+joinInfo.col+" -> " + joinInfo.ref+"."+joinInfo.refKey)+(joinInfo!=null?"<br/><span class=\"inputtext\">关联类型：</span>"+(joinInfo.jtype=="all"?"全连接":(joinInfo.jtype=="left"?"左连接":"右连接")):"")+(joinInfo==null?"":"<br/><span class=\"inputtext\">强制连接：</span>"+(joinInfo.force=="y"?"是":"否"))+"</div>";
	$('#dsColumn_div').dialog({
		title: '编辑字段信息',
		width: joinInfo == null ? 350 : 450,
		height: joinInfo == null ? 240:300,
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
					tmp.dispName = $("#dsColumn_div #coldispname").val();
					tmp.type = $("#dsColumn_div #coltype").val();
					tmp.isupdate = 'y';
					//回写值
					$("#crtdataset #"+tmp.tname+"_"+tmp.name+"_disp").text(tmp.dispName);
					$("#crtdataset #"+tmp.tname+"_"+tmp.name+"_tp").text(tmp.type);
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
}
//动态字段
function reloadDynamicCol(transform){
	var str = "<a href=\"javascript:;\" style=\"margin:3px;\" id=\"dynamiccol\">新增</a><table class=\"grid3\" id=\"T_report54\" cellpadding=\"0\" cellspacing=\"0\">";
	str = str + "<tr><th width=\"15%\">字段名</th><th width=\"40%\">表达式</th><th width=\"15%\">值类型</th><th width=\"15%\">操作</th></tr>";
			
	for(var i=0; transform.dynamic && i<transform.dynamic.length; i++){
		var o = transform.dynamic[i];
		str = str + "<tr><td class=\"kpiData1 grid3-td\">"+o.name+"</td><td class=\"kpiData1 grid3-td\">"+o.expression.replace(/@/g,"'")+"</td><td class=\"kpiData1 grid3-td\">"+o.type+"</td><td class=\"kpiData1 grid3-td\"><button class=\"btn btn-info btn-xs\" col=\""+o.name+"\" id=\"dynamiccolupdate\">编辑</button> <button  col=\""+o.name+"\" id=\"dynamiccoldel\" class=\"btn btn-danger btn-xs\">删除</button></td></tr>";
	}
	if(!transform.dynamic || transform.dynamic.length==0){
		str = str + "<tr><td class=\"kpiData1 grid3-td\" align=\"center\" colspan=\"4\">无数据.</td></tr>";
	}
	str = str + "</table>";
	
	var pp = $('#pdailog #crtdataset').tabs('getSelected');
	$(pp).html(str);
	var dynamicfunc = function(ccol){
		//如果没有字段信息，不添加
		if(!transform.master){
			msginfo("还未选择表，请先选择表。");
			return;
		}
	    var tps = "";
		for(var i=0; i<dataType.length; i++){
			tps = tps + "<option value=\""+dataType[i]+"\" "+( ccol && ccol.type == dataType[i] ? "selected" : "")+">"+dataType[i]+"</option>";
		}
		var cols = "";
		$.ajax({
			type:"post",
			async:false,
			url:"listTableColumns.action",
			dataType:"json",
			data:{tname:transform.master,dsid:$("#pdailog #dsid").val()},
			success:function(resp){
				for(k=0; k<resp.length; k++){
					cols = cols + "<button name=\""+resp[k].name+"\" class=\"btn btn-primary btn-xs\">"+resp[k].name+"</button> ";
				}
			}
		});
		var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">字段名：</span><input type=\"text\" id=\"colname\" name=\"colname\" class=\"inputform2\" value=\""+(ccol?ccol.name:"")+"\">(英文字符)<br/><table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td valign=\"top\"><span class=\"inputtext\">表 达 式：</span></td><td><textarea name=\"expression\" id=\"expression\" class=\"inputform2\" style=\"width:200px;height:60px;\">"+(ccol?ccol.expression.replace(/@/g,"'"):"")+"</textarea></td></tr></tbody></table><div class=\"actColumn\" style=\"margin-top:12px;\">"+cols+"</div><span class=\"inputtext\">值类型：</span><select class=\"inputform2\" id=\"valtype\" class=\"inputform\">"+tps+"</select></div>";
		if($("#dsColumn_div").size() == 0){
			$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
		}
		$('#dsColumn_div').dialog({
			title: ccol ? '编辑动态字段' : '添加动态字段',
			width: 380,
			height: 290,
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
						var name = $("#dsColumn_div #colname").val();
						var expression =  $("#dsColumn_div #expression").val().replace(/'/g,"@");
						if(name == ''){
							msginfo("请录入字段名!", function(){
								$("#dsColumn_div #colname").focus();
							});
							return;
						}
						if(ischinese(name)){
							msginfo("字段名必须是英文字符。");
							$("#dsColumn_div #colname").focus();
							return;
						}
						if(expression == ''){
							msginfo("请录入表达式!", function(){
								$("#dsColumn_div #expression").focus();
							});
							return;
						}
						
						if(ccol){
							ccol.name = name
							ccol.type = $("#dsColumn_div #valtype").val();
							ccol.expression = expression
						}else{
							var obj = {name:name,tname:transform.master,type:$("#dsColumn_div #valtype").val(),expression:expression};
							if(!transform.dynamic){
								transform.dynamic = [];
							}
							transform.dynamic.push(obj);
						}
						$('#dsColumn_div').dialog('close');
						
						reloadDynamicCol(transform);
					}
				},{
					text:'取消',
					iconCls:"icon-cancel",
					handler:function(){
						$('#dsColumn_div').dialog('close');
					}
				}]
		});
		$("#dsColumn_div .actColumn button").bind("click", function(){
			var txt = $(this).attr("name");
			insertText2focus(document.getElementById("expression"),  txt);
		});
	};
	
	$("#crtdataset #dynamiccoldel").bind("click", function(){
		if(!confirm("是否确认删除？")){
			return;
		}
		var idx = -1;
		var name = $(this).attr("col");
		for(i=0; i<transform.dynamic.length; i++){
			if(transform.dynamic[i].name == name){
				idx = i;
				break;
			}
		}
		transform.dynamic.splice(idx, 1);
		reloadDynamicCol(transform);
	});
	$("#crtdataset #dynamiccolupdate").bind("click", function(){
		var name = $(this).attr("col");
		var o = null;
		for(i=0; i<transform.dynamic.length; i++){
			if(transform.dynamic[i].name == name){
				o = transform.dynamic[i];
				break;
			}
		}
		dynamicfunc(o);
	});
	$("#crtdataset #dynamiccol").bind("click", function(){
		dynamicfunc();
	}).linkbutton({iconCls:"icon-add"});
}
function jointableFunc(transform){
	var node = $("#masterTableTree").tree("getSelected");
	if(node == null){
		msginfo("您还未从主表字段中选择需要关联的字段。");
		return;
	}
	//获取关联对象
	var joinInfo = findJoinInfoById(transform, node.id);
	if(joinInfo == null){
		joinInfo = undefined;
	}
	//建立关联
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\"></div>").appendTo("body");
	}
	var tbs = "";
	var tname = null;
	var cld = $("#selTablesTree").tree("getChildren");
	for(i=0; i<cld.length; i++){
		if(cld[i].id != $("#mastertable").val()){
			tbs = tbs + "<option value=\""+cld[i].id+"\" "+(joinInfo&&joinInfo.ref==cld[i].id?"selected":"")+">"+cld[i].text+"</option>";
			if(tname == null){
				tname = cld[i].id;
			}
		}
	}
	var getSlaveColumns = function(tn){
		var slavecols = "";
		//获取选取从表的表字段
		if(tname != null){
			$.ajax({
				type:'post',
				async:false,
				url:'listTableColumns.action',
				dataType:'json',
				data:{"tname": tn,dsid:$("#pdailog #dsid").val()},
				success: function(dt){
					for(k=0; k<dt.length; k++){
						slavecols = slavecols + "<option value=\""+ dt[k].name+"\" "+(joinInfo&&joinInfo.refKey == dt[k].name?"selected":"")+">" + dt[k].name + "</option>";
					}
				}
			});
		}
		return slavecols;
	};
	
	var ctx = "<div class=\"textpanel\">主表 <b>"+$("#mastertable").val()+"</b> 字段 <b>"+node.id+"</b> <br/> &nbsp; &nbsp; &nbsp; =>关联到=> <br/>从表：<select id=\"slavetable\" class=\"inputform\" style=\"width:150px;\">"+tbs+"</select><br/>字段：<select id=\"slavetablecol\" class=\"inputform\" style=\"width:150px;\">"+getSlaveColumns(tname)+"</select><br/> 方式：<select id=\"jtype\" style=\"width:160px;\" class=\"inputform\"><option value=\"all\" "+(joinInfo&&joinInfo.jtype=="all"?"selected":"")+">全连接</option><option value=\"left\" "+(joinInfo&&joinInfo.jtype=="left"?"selected":"")+">左连接</option><option value=\"right\" "+(joinInfo&&joinInfo.jtype=="right"?"selected":"")+">右连接</option></select> </div>";
	$('#dsColumn_div').dialog({
		title: "关联维度表",
		width: 350,
		height: 240,
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
					//建立关联关系
					node.attributes.ref = $("#dsColumn_div #slavetable").val();
					node.attributes.refKey = $("#dsColumn_div #slavetablecol").val();
					node.attributes.jtype = $("#dsColumn_div #jtype").val();
					$("#masterTableTree").tree("update", {target:node.target, text:node.id + " -> " + node.attributes.ref + "." + node.attributes.refKey, iconCls:"icon-coljoin"});
					//给transform添加关联
					if(!transform.joininfo){
						transform.joininfo = [];
					}
					if(joinInfo){
						joinInfo.col = node.id;
						joinInfo.ref = node.attributes.ref;
						joinInfo.refKey = node.attributes.refKey;
						joinInfo.jtype = node.attributes.jtype;
					}else{
						transform.joininfo.push({col:node.id, ref:node.attributes.ref, refKey: node.attributes.refKey, jtype:node.attributes.jtype});
					}
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
	$("#slavetable").bind("change", function(){
		var s = getSlaveColumns($(this).val());
		$("#slavetablecol").html(s);
	});
}

function findJoinInfoById(transform, col){
	var ret = null;
	for(i=0; transform.joininfo&&i<transform.joininfo.length; i++){
		if(transform.joininfo[i].col == col){
			ret = transform.joininfo[i];
			break;
		}
	}
	return ret;
}