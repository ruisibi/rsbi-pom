if($ == undefined){
	$ = jQuery;
}
var dateformat = ['yyyymmdd', 'yyyy-mm-dd', 'yyyy年mm月dd日', 'yyyymm', 'yyyy-mm', 'yyyy年mm月', 'yyyy', 'yyyy年'];
function initcubeTable(){
    if($("#cubetable").size() > 0){
	$("#cubetable").datagrid("load", {t:Math.random()});
	return;
    }
    var ctx = "<table id=\"cubetable\" title=\"立方体管理\" ><thead><tr><th data-options=\"field:'ck',checkbox:true\"></th><th data-options=\"field:'cubeId',width:80,align:'center'\">标识</th><th data-options=\"field:'cubeName',width:120\">立方体名称</th><th data-options=\"field:'desc',width:120\">立方体说明</th><th data-options=\"field:'dsetName',width:120,align:'center'\">数据集</th></tr></thead></table>";
    $("#optarea").html(ctx);
    $("#cubetable").datagrid({
	singleSelect:true,
	collapsible:false,
	pagination:false,
	border:false,
	fit:true,
	url:'listCube.action',
	toolbar:[{
	  text:'新增',
	  iconCls:'icon-add',
	  handler:function(){
	    newCube(false);
	  }
	},{
	  text:'修改',
	  iconCls:'icon-edit',
	  handler:function(){
		var row = $("#cubetable").datagrid("getChecked");
		if(row == null || row.length == 0){
			$.messager.alert("出错了。","您还未勾选数据。", "error");
			return;
		}
		 newCube(true, row[0].cubeId);
	  }
	},{
	  text:'删除',
	  iconCls:'icon-cancel',
	  handler:function(){
		var row = $("#cubetable").datagrid("getChecked");
		if(row == null || row.length == 0){
			$.messager.alert("出错了。","您还未勾选数据。", "error");
			return;
		}
		delCube(row[0].cubeId);
	  }
	}]
    });
}
function delCube(id){
	if(confirm("是否确认删除？")){
		$.ajax({
			type:"POST",
			url:"delCube.action",
			dataType:"json",
			data:{cubeId:id},
			success:function(){
				$('#cubetable').datagrid('load',{
					t:Math.random()
				});
			},
			error:function(){
				msginfo("删除立方体出错。");
			}
		});
	}
}
function newCube(isupdate, cubeId){
	//清空 delObj 对象， 这个对象用在编辑时，判断哪些内容被删除了。
	window.delObj = [];
	var cube;
	if(isupdate){
		$.ajax({
			type:"POST",
			url:"getCube.action",
			async: false,
			dataType:"JSON",
			data:{cubeId:cubeId},
			success:function(resp){
				cube = resp;
			}
		});
	}
	//数据集
	var dsetls = "";
	if(isupdate){
		dsetls = "<option value='"+cube.dsetId+"'>"+cube.dsetName+'('+cube.priTable+')'+"</option>";
	}else{
		$.ajax({
			type:"POST",
			url:"listDataset.action",
			async: false,
			dataType:"JSON",
			data:{},
			success:function(resp){
				for(i=0; i<resp.length; i++){
					var r = resp[i];
					dsetls = dsetls + "<option value='"+r.dsetId+"'>"+r.name+'('+r.priTable+')'+"</option>";
				}
			}
		});
	}
	
	//立方体
	var cstr = "<div style='margin-top:10px;'><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td valign=\"top\" align=\"right\"><div class=\"easyui-panel\" data-options=\"width:220,height:380,cls:'cubecfg'\" title=\"待选字段\"><ul id=\"cubelefttree\"></ul></div></td> <td align=\"center\" valign=\"top\"><p style=\"height:150px;\"></p><input type=\"button\" title=\"选择\" value=\"&gt;\" onclick=\"ds2cube()\" class=\"btn btn-primary btn-sm\"><br/><br/><input type=\"button\" onclick=\"cube2ds()\" value=\"&lt;\" title=\"移除\" class=\"btn btn-primary btn-sm\"></td><td valign=\"top\"><div class=\"easyui-panel\" data-options=\"width:220,height:380,cls:'cubecfg'\" title=\"维度和度量\"><ul id=\"cuberighttree\"></ul></div></td><td valign=\"top\"><div style=\"width:60px;\"><a href=\"javascript:addgroup();\" id=\"crtfz\" data-options=\"plain:true,iconCls:'icon-add'\">分组</a><br/><a href=\"javascript:editCalcKpi(false);\" id=\"crtcalckpi\" data-options=\"plain:true,iconCls:'icon-add2'\">度量</a><br/><a href=\"javascript:editcubecol();\" id=\"dim_editbtn\" data-options=\"plain:true,iconCls:'icon-edit'\">编辑</a><br/><a href=\"javascript:cube2ds();\"  id=\"dim_delbtn\" data-options=\"plain:true,iconCls:'icon-remove'\">删除</a></div></td></tr></table></div>";
	
	var ctx = "<div id=\"crtdataset\" data-options=\"fit:true,border:false,tabPosition:'left'\"><div title=\"基本信息\"><div class=\"textpanel\"><span class=\"inputtext\">立方体名称：</span><input type=\"text\" value=\""+(cube?cube.cubeName:"")+"\" class=\"inputform2\" id=\"name\"><br/><span class=\"inputtext\">立方体说明：</span><input type=\"text\" value=\""+(!cube||cube.desc==null?"":cube.desc)+"\" size=\"50\" id=\"note\" class=\"inputform2\"><br/><span class=\"inputtext\">对应数据集：</span><select id=\"dsetId\" class=\"inputform2\">"+dsetls+"</select>"+(isupdate?" (禁止修改)":"")+"</div></div><div title=\"立方体信息\">"+cstr+"</div></div>";
	$('#pdailog').dialog({
		title: isupdate?'编辑立方体':'新建立方体',
		width: 760,
		height: 490,
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
				var dsetId = $("#pdailog #dsetId").val();
				var note = $("#pdailog #note").val();
				if(name == ''){
					$("#crtdataset").tabs("select", 0);
					msginfo("请填写立方体名称！");
					return;
				}
				var c = {};
				c.cubeName =  name;
				c.desc = note;
				c.dsetId = dsetId;
				if(isupdate){
					c.cubeId = cube.cubeId;
				}
				if(savecubecfg(c, isupdate)){
					$('#pdailog').dialog('close');
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
	$(".delcolbtn").linkbutton({plain:true, "iconCls":"icon-cancel"});
	$("#crtfz,#crtcalckpi,#dim_editbtn,#dim_delbtn,#adddynacol").linkbutton({});
	$("#crtdataset").tabs({});
	//初始化左边树形状
	var leftTreeView = function(dset, cube){
		 // var cld = [];
		 // var dt = [{id:'leftroot',text:dset.master,iconCls:'icon-table', children:cld}];
		  //获取表
		  var tbs = [];
		  var tabExist = function(tname){
			  var ret = false;
			  for(k=0; k<tbs.length; k++){
				  if(tbs[k] == tname){
					  ret = true;
					  break;
				  }
			  }
			  return ret;
		  }
		  var c = dset;
		  for(i=0; i<c.cols.length; i++){
			  var r = c.cols[i];
			  if(!tabExist(r.tname)){
				tbs.push(r.tname);
			  }
		  }
		  var findcols = function(tname){
			  var ret = [];
			  for(j=0; j<c.cols.length; j++){
				  if(c.cols[j].tname == tname){
					  ret.push(c.cols[j]);
				  }
			  }
			  return ret;
		  }
		  //获取表
		  var dt = [];
		  for(i=0; i<tbs.length; i++){
			  var ccld = [];
			  var nd = {id:tbs[i],text:tbs[i],iconCls:'icon-table', children:ccld};
			  dt.push(nd);
			  var cols = findcols(tbs[i]);
			  for(l=0; l<cols.length; l++){
				   var r = cols[l];
				  var node = {id:r.name,text:r.name,iconCls:'icon-dscol',attributes:{tp:'node', vtype:r.type, col:r.name, tname:r.tname, expression:r.expression}}
				  ccld.push(node);
			  }
		  }
		  //动态字段
		  if(c.dynamic && c.dynamic != null && c.dynamic.length > 0){
			  var dynas = {id:'dynaroot', text:"动态字段", iconCls:'icon-table', children:[]};
			  dt.push(dynas);
			  for(i=0; i<c.dynamic.length; i++){
				  var r = c.dynamic[i];
				   var node = {id:r.name,text:r.name,iconCls:'icon-dscol',attributes:{tp:'node', vtype:r.type, col:r.name, tname:r.tname, expression:r.expression}}
					dynas.children.push(node);
			  }
		  }
		  $("#cubelefttree").tree({
			  data:dt,
			  onLoadSuccess:function(){
				  if(isupdate){
				   //隐藏已选择的维度和指标 列
					var cubeObj = c;
					var findcol = function(cid){
						var ret = null;
						for(j=0;j<cubeObj.dims.length;j++){
							if(cubeObj.dims[j].alias == cid){
								ret = cubeObj.dims[j];
								break;
							}
						}
						if(ret == null){
							for(j=0;j<cubeObj.kpis.length;j++){
								if(cubeObj.kpis[j].alias == cid){
									ret = cubeObj.kpis[j];
									break;
								}
							}
						}
						return ret;
					};
					window.setTimeout(function(){
						 var nodes = [];
							var roots = $("#cubelefttree").tree("getRoots");
							for(j=0; j<roots.length; j++){
								var r = roots[j];
								nodes = nodes.concat($("#cubelefttree").tree("getChildren", r.target));
							}
							for(i=0; i<nodes.length; i++){
								var id = nodes[i].id;
								if(findcol(id) != null){
									$(nodes[i].target).attr("hide", "y").hide();
								}
							}
					}, 200);
				  
				  }
			  }
		  });
	};
	var initlefttree = function(){
		$.ajax({
			type:"POST",
			url:"getDatasetCfg.action",
			dataType:"JSON",
			data:{dsetId:$("#pdailog #dsetId").val()},
			success:function(resp){
				var dset = resp;
				  leftTreeView(dset);
			}
		});
	};
	if(isupdate){
		leftTreeView(cube);
	}else{
		initlefttree();
	}
	$("#pdailog #dsetId").change(function(){
		initlefttree();
	});
	//初始化右边树形状
	initRightCubeTree(cube);
}
function initRightCubeTree(cube){
	//加载立方体字段
	var targdt = [{id:'cbroot', text:'数据立方体', iconCls:'icon-cube', children:[]}];
	targdt[0].children.push({id:"cubewd", text:"维度",iconCls:'icon-dim2', children:[]});
	targdt[0].children.push({id:"cubedl", text:"度量",iconCls:'icon-kpigroup', children:[]});
	if(cube){ //给立方体添加维度及指标
		var dims = targdt[0].children[0].children;
		var groupexist = function(groupid){
			var ls = dims;
			var ret = null;
			for(k=0; k<ls.length; k++){
				if(ls[k].id == groupid){
					ret = ls[k];
					break;
				}
			}
			return ret;
		}
		for(i=0; i<cube.dims.length; i++){
			var d = cube.dims[i];
			var obj = {id:d.id, text:d.text, attributes:{tp:"dim",drag:true,col:d.col_name,tname:d.tname,dispName:d.text,vtype:d.valType,alias:d.alias, dimtype:d.dim_type,colTable:(d.tableName==null?"":d.tableName),colkey:(d.tableColKey==null?"":d.tableColKey), coltext:(d.tableColName==null?"":d.tableColName), dimord:(d.dimord==null?"":d.dimord), dateformat:(d.dateformat==null?"":d.dateformat), calc:d.iscalc==1?true:false, targetId:d.col_id },iconCls:"icon-dim"};
			
			if(d.grouptype != "" && d.grouptype != null){
				var group = groupexist(d.grouptype);
				if(group == null){
					obj = {id:d.grouptype,text:d.groupname, "iconCls":"icon-group", children:[obj],attributes:{tp:'group',dispName:d.groupname,drag:true,targetId:d.grouptype}};
					targdt[0].children[0].children.push(obj);
				}else{
					group.children.push(obj); 
				}
			}else{
				targdt[0].children[0].children.push(obj);
			}
		}
		var kpis = targdt[0].children[1].children;
		for(i=0; i<cube.kpis.length; i++){
			var k = cube.kpis[i];
			//对于计算指标，colname 存的是计算公式，而对于非计算指标，需要取alias来代替colname, 在保存的时候会自动拼接
			var col = k.alias;
			if(k.calcKpi == 1){  //新增度量那创建的计算指标
				col = k.colname;
			}else if(k.calc == 1){  //数据集创建的动态字段
				col = k.colname.substring(k.colname.indexOf('(')+1, k.colname.indexOf(')'));
			}
			kpis.push({id:k.id, text:k.aggre+'('+k.text+")",attributes:{tp:"kpi",drag:true,aggre:k.aggre,col:col,tname:k.tname, unit:(k.unit==null?"":k.unit), fmt:(k.fmt==null?"":k.fmt), dispName:k.text, alias:k.alias,kpinote:(k.kpi_desc_key==null?"":k.kpi_desc_key),calc:(k.calc==0?false:true),calcKpi:k.calcKpi,targetId:k.colid},iconCls:(k.calcKpi==0?"icon-kpi":"icon-ckpi")});
		}
	}
	 $("#cuberighttree").tree({
		  data:targdt,
		  dnd:true,
		  onBeforeDrag:function(target){
				if(target.attributes && target.attributes.drag){
					return true;
				}else{
					return false;
				}
				//return false;
			},
			onDragEnter:function(target, source){
				var node = $("#cuberighttree").tree("getNode", target);
				if(!node.attributes || node.attributes.drag ==false ){
					return false;
				}
				//指标不能拖放到维度区域
				if(source.attributes.tp == 'kpi' && node.attributes.tp == 'dim'){
					return false;
				}
				//维度不能拖到指标区域
				if(node.attributes.tp == 'kpi' && source.attributes.tp == 'dim'){
					return false;
				}
				//分组不能拖到KPI区域
				if(source.attributes.tp == 'group' && node.attributes.tp == 'kpi'){
					return false;
				}
				//分组不能拖到分组的下边
				var parent = $("#cuberighttree").tree("getParent", target);
				if(source.attributes.tp == 'group' && parent.attributes &&  parent.attributes.tp == 'group'){
					return false;
				}
				return true;
			},
			onBeforeDrop:function(target, source, point){
				var node = $("#cuberighttree").tree("getNode", target);
				if(!node.attributes || node.attributes.drag ==false ){
					return false;
				}
				//指标和维度不能拖放到某个指标或维度下边, 只有group 可以
				if(node.attributes.tp == 'kpi' && point == 'append'){
					return false;
				}
				if(node.attributes.tp == 'dim' && point == 'append'){
					return false;
				}
				//指标不能拖放到维度区域
				if(source.attributes.tp == 'kpi' && node.attributes.tp == 'dim'){
					return false;
				}
				//维度不能拖到指标区域
				if(node.attributes.tp == 'kpi' && source.attributes.tp == 'dim'){
					return false;
				}
				//分组不能拖到KPI区域
				if(source.attributes.tp == 'group' && node.attributes.tp == 'kpi'){
					return false;
				}
				//分组不能拖到分组的下边
				var parent = $("#cuberighttree").tree("getParent", target);
				if(source.attributes.tp == 'group' && parent.attributes &&  parent.attributes.tp == 'group'){
					return false;
				}
				//分组不能拖放到分组的里面
				if(source.attributes.tp == 'group' && node.attributes.tp == 'group' && point == 'append'){
					return false;
				}
				return true;
			},
			onDblClick:function(node){
				editcubecol( );
			},
			onDrop:function(target, source, point){
				source.attributes.isupdate = 'y';//拖拽了即设置为已修改
			}
	  });
}
function ds2cube(){
	var left = $("#cubelefttree").tree("getSelected");
	if(left == null){
		$.messager.alert("出错了","您还未从左边选择字段。", "error");
		return;
	}
	if($(left.target).attr("hide") == 'y'){
		return;
	}
	var right = $("#cuberighttree").tree("getSelected");
	if(right == null){
		$.messager.alert("出错了","您还未选择右边度量或维度。", "error");
		return;
	}
	var parent = $("#cuberighttree").tree("getParent", right.target);
	var isCalc = true; //是否是公式？
	if(!left.attributes.expression||left.attributes.expression==null||left.attributes.expression==""){
		isCalc = false;
	}		
	if(right.text == '度量' || parent.text == '度量'){
		//生成ID
		var cid = findCubeMaxId($("#cuberighttree").tree("find", "cubedl").target);
		var o = {id:cid, text:'sum('+left.text+")",attributes:{tp:"kpi",drag:true,aggre:"sum",col:(!isCalc?left.attributes.col:left.attributes.expression), tname:left.attributes.tname,dispName:left.text,alias:left.id,calc:isCalc,calcKpi:0},iconCls:"icon-kpi"};
		if(right.text == '度量'){
			$("#cuberighttree").tree("append",  {parent:right.target,data:o});
		}else{
			$("#cuberighttree").tree("insert",  {after:right.target,data:o});
		}
		$(left.target).attr("hide", "y").hide();
	}else if(right.text == '维度' || parent.text == '维度' || parent.attributes.tp == 'group'){
		var cid = findCubeMaxId($("#cuberighttree").tree("find", "cubewd").target);
		
		var o = {id:cid, text:left.text, attributes:{tp:"dim",drag:true,col:!isCalc?left.attributes.col:left.attributes.expression,tname:left.attributes.tname,dispName:left.text,tname:left.attributes.tname,vtype:left.attributes.vtype,alias:left.attributes.col,calc:isCalc},iconCls:"icon-dim", targetId:""};  //通过targetId 来指引对应数据库的的字段 ID, 用在修改上
		if(right.text == '维度' || (parent.text == '维度' && right.attributes.tp == 'group')){
			$("#cuberighttree").tree("append",  {parent:right.target,data:o});
		}else{
			$("#cuberighttree").tree("insert",  {after:right.target,data:o});
		}
		$(left.target).attr("hide", "y").hide();
	}
}
function editcubecol(){
	var right = $("#cuberighttree").tree("getSelected");
	if(right == null || !right.attributes){
		msginfo("您还未选择需要编辑的度量或维度。");
		return;
	}
	var colid = right.id;
	if(!colid){
		return;
	}
	//计算指标特殊处理
	if(right.attributes.tp == 'kpi' && right.attributes.calcKpi == 1){
		editCalcKpi(true, right.id);
		return;
	}
	var ctx = "";
	var atp = ["sum","avg","count", "count(distinct)", "max", "min"];
	if(right.attributes.tp == 'dim'){
		var cols = $("#cubelefttree").tree("getRoots");
		var tabstr = "<option value=\"\"></option>";
		var keystr = "<option value=\"\"></option>";
		var txtstr = "<option value=\"\"></option>";
		var tables = [];
		for(i=0; i<cols.length; i++){
			var clds = cols[i].children;
			for(j=0; j<clds.length; j++){
				if(clds[j].attributes){
					var tname = clds[j].attributes.tname;
					tables.push(tname);
				}
			}
		}
		tables = tables.uniqueArray();
		for(i=0; i<tables.length; i++){
			tabstr = tabstr + "<option value=\""+tables[i]+"\" "+(right.attributes.colTable == tables[i]?"selected":"")+">"+tables[i]+"</option>";
		}
		
		var fmtstr = "<option value=\"\"></option>";
		for(i=0; i<dateformat.length; i++){
			fmtstr = fmtstr + "<option value=\""+dateformat[i]+"\" "+(right.attributes.dateformat==dateformat[i]?"selected":"")+">"+dateformat[i]+"</option>";
		}
		ctx = "<div class=\"textpanel\"><span class=\"inputtext\">维度字段：</span>"+right.attributes.col+"<br/><span class=\"inputtext\">别名：</span>"+right.attributes.alias+"<br/><span class=\"inputtext\">显示名称：</span><input type=\"text\" id=\"dimname\" name=\"dimname\" class=\"inputform2\" value=\""+right.attributes.dispName+"\"><br/><span class=\"inputtext\">维度类型：</span><select id=\"dimtype\" name=\"dimtype\" class=\"inputform2\"><option value=\"\"></option><option value=\"year\" "+(right.attributes.dimtype=='year'?"selected":"")+">年</option><option value=\"quarter\" "+(right.attributes.dimtype=='quarter'?"selected":"")+">季度</option><option value=\"month\" "+(right.attributes.dimtype=='month'?"selected":"")+">月</option><option value=\"day\" "+(right.attributes.dimtype=='day'?"selected":"")+">日</option><option value=\"prov\" "+(right.attributes.dimtype=='prov'?"selected":"")+">省份</option><option value=\"city\" "+(right.attributes.dimtype=='city'?"selected":"")+">地市</option></select><br/><span class=\"inputtext\">维度格式：</span><select id=\"dateformat\" class=\"inputform2\">"+fmtstr+"</select><br/><span class=\"inputtext\">维度对应表：</span><select id=\"colTable\" class=\"inputform2\" name=\"colTable\">"+tabstr+"</select><br/><span class=\"inputtext\">维度Key字段：</span><select id=\"colkey\" class=\"inputform2\" name=\"colkey\">"+keystr+"</select><br/><span class=\"inputtext\">维度Text字段：</span><select id=\"coltext\" name=\"coltext\" class=\"inputform2\">"+txtstr+"</select><br/><span class=\"inputtext\">排序方式：</span><select id=\"dimord\" name=\"dimord\" class=\"inputform2\"><option value=\"\"></option><option "+(right.attributes.dimord=="asc"?"selected":"")+" value=\"asc\">正序</option><option value=\"desc\" "+(right.attributes.dimord=="desc"?"selected":"")+">倒叙</option></select></div>";
	}else if(right.attributes.tp == 'kpi'){
		var tpstr = "";
		for(i=0; i<atp.length; i++){
			tpstr = tpstr + "<option value=\""+atp[i]+"\" "+(atp[i] == right.attributes.aggre ? "selected":"")+">"+atp[i]+"</option>";
		}
		ctx = "<div class=\"textpanel\"><span class=\"inputtext\">度量字段：</span>"+right.attributes.col+"<br/><span class=\"inputtext\">别名：</span>"+right.attributes.alias+"<br/><span class=\"inputtext\">显示名称：</span><input type=\"text\" id=\"kpiname\" name=\"kpiname\" class=\"inputform2\" value=\""+right.attributes.dispName+"\"><br/>"
		+ "<span class=\"inputtext\">计算方式：</span><select id=\"kpiaggre\" name=\"kpiaggre\" class=\"inputform2\">"+tpstr+"</select> <br>"
		+ "<span class=\"inputtext\">度量单位：</span><input type=\"text\" id=\"kpiunit\" name=\"kpiunit\" class=\"inputform2\" value=\""+(right.attributes.unit?right.attributes.unit:"")+"\"> <br>"
		+ "<span class=\"inputtext\">格式化：</span>" + ftmstr("kpifmt","inputform2",right.attributes.fmt?right.attributes.fmt:"") + "<br/><span class=\"inputtext\">度量解释：</span><textarea name=\"kpinote\" id=\"kpinote\"  cols=\"25\" class=\"inputform2\" style=\"height:32px;\" rows=\"2\">"+(right.attributes.kpinote?right.attributes.kpinote:"")+"</textarea></div>";
	}else if(right.attributes.tp == 'group'){
		ctx = "<div class=\"textpanel\"><span class=\"inputtext\">分组名称：</span><input type=\"text\" id=\"groupname\" name=\"groupname\" value=\""+right.attributes.dispName+"\" class=\"inputform2\"><br/></div>";
	}
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	$('#dsColumn_div').dialog({
		title: right.attributes.tp == 'group' ? "编辑分组" : "编辑维度及度量",
		width: 350,
		height:  right.attributes.tp == 'group' ? 150 :340,
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
					if(right.attributes.tp == 'kpi'){
						right.attributes.aggre = $("#dsColumn_div #kpiaggre").val();
						right.attributes.fmt = $("#dsColumn_div #kpifmt").val();
						right.attributes.unit = $("#dsColumn_div #kpiunit").val();
						right.attributes.dispName = $("#dsColumn_div #kpiname").val();
						right.attributes.kpinote = $("#dsColumn_div #kpinote").val();
						right.attributes.isupdate = "y";  //表示指标已经更改过了。
						$("#cuberighttree").tree("update", {target:right.target, text: right.attributes.aggre+ "(" + right.attributes.dispName+")"})
					}else
					if(right.attributes.tp == 'dim'){
						//设置了时间类型维度后，必须设置维度格式
						var dtp = $("#dsColumn_div #dimtype").val();
						var dtfmt = $("#dsColumn_div #dateformat").val();
						if(dtp != "" && (dtp == "year" || dtp == "month" || dtp == "quarter" || dtp == "day") && dtfmt == "" ){
							msginfo("请选择时间维度格式。", function(){
								$("#dsColumn_div #dateformat").select();
							});
							return;
						}
						right.attributes.dispName = $("#dsColumn_div #dimname").val();
						right.attributes.dimtype = dtp;
						right.attributes.colTable = $("#dsColumn_div #colTable").val();
						right.attributes.colkey = $("#dsColumn_div #colkey").val();
						right.attributes.coltext = $("#dsColumn_div #coltext").val();
						right.attributes.dimord = $("#dsColumn_div #dimord").val();
						right.attributes.dateformat = dtfmt;
						right.attributes.isupdate = "y";  //表示维度已经更改过了。
						$("#cuberighttree").tree("update", {target:right.target, text:$("#dsColumn_div #dimname").val()})
					}else if(right.attributes.tp == 'group'){
						right.attributes.dispName =  $("#dsColumn_div #groupname").val();
						//right.attributes.grouptype =  $("#dsColumn_div #grouptype").val();
						right.attributes.isupdate = "y";  //表示分组已经更改过了。
						$("#cuberighttree").tree("update", {target:right.target, text:$("#dsColumn_div #groupname").val()})
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
	if(right.attributes.tp == 'dim'){
		var upcolfunc = function(tname, colkey, coltext){
			var keystr = "<option value=\"\"></option>";
			var txtstr = "<option value=\"\"></option>";
			var cols = $("#cubelefttree").tree("getRoots");
			for(i=0; i<cols.length; i++){
				var c = cols[i];
				for(j =0; c.children&&j<c.children.length; j++){
					var t = c.children[j];
					if(t.attributes && t.attributes.tname == tname){
						keystr = keystr + "<option value=\""+t.id+"\" "+(colkey==t.id?"selected":"")+">"+t.id+"</option>";
						txtstr = txtstr + "<option value=\""+t.id+"\" "+(coltext==t.id?"selected":"")+">"+t.id+"</option>";
					}
				}
			}
			$("#dsColumn_div #colkey").html(keystr);
			$("#dsColumn_div #coltext").html(txtstr);
		}
		$("#dsColumn_div #colTable").change(function(){
			upcolfunc($(this).val());
		});
		if(right.attributes.colTable && right.attributes.colTable != ''){
			upcolfunc(right.attributes.colTable, right.attributes.colkey, right.attributes.coltext);
		}
	}	
}
function addgroup(){
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	var gctx = "<div class=\"textpanel\"><span class=\"inputtext\">分组名称：</span><input type=\"text\" value=\"\" id=\"groupname\" name=\"groupname\" class=\"inputform2\"></div>";
	$('#dsColumn_div').dialog({
		title: "创建维度分组",
		width: 300,
		height: 180,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:gctx,
		onLoad:function(){},
		onClose:function(){
			$('#dsColumn_div').dialog('destroy');
		},
		buttons:[{
			text:'确定',
			iconCls:"icon-ok",
			handler:function(){
				var name = $("#dsColumn_div #groupname").val();
				if(name == ''){
					msginfo("请填写分组名称！");
					$("#dsColumn_div #groupname").focus();
					return;
				}
				var cid = newGuid();
				var dt = {id:cid,text:name, "iconCls":"icon-group", attributes:{tp:'group',dispName:name,drag:true}};
				$("#cuberighttree").tree("append",{parent:$("#cuberighttree").tree("find", "cubewd").target, data:[dt]});
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
function editCalcKpi(update, kpiId){
	var kpi;
	if(update){
		kpi = $("#cuberighttree").tree("getSelected");
	}
	var atp = ["sum","avg","count","count(distinct)", "max", "min"];
	var tpstr = "";
	for(i=0; i<atp.length; i++){
		tpstr = tpstr + "<option value=\""+atp[i]+"\" "+(kpi && atp[i] == kpi.attributes.aggre ? "selected":"")+">"+atp[i]+"</option>";
	}
	//查询已选指标
	var kpiStr = "";
	var ls = [];
	var roots = $("#cubelefttree").tree("getRoots");
	for(i=0; i<roots.length; i++){
		var c = roots[i].children;
		for(j=0; j<c.length; j++){
			ls.push(c[j]);
		}
	}
	for(i=0; i<ls.length; i++){
		var k = ls[i].attributes;
		kpiStr = kpiStr + "<button name=\""+k.col+"\" class=\"btn btn-primary btn-xs\">"+ k.col+"</button> ";
	}
	kpiStr = kpiStr + "<br/>";
	for(i=0; i<atp.length; i++){
		kpiStr = kpiStr + "<button name=\""+atp[i]+"( )\" class=\"btn btn-primary btn-xs\">"+ atp[i]+"</button> ";
	}
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">度量标识：</span><input type=\"text\" class=\"inputform2\" name=\"alias\" id=\"alias\" value=\""+(kpi?kpi.attributes.alias:"")+"\">(英文字符)<br/><span class=\"inputtext\">显示名称：</span><input type=\"text\" class=\"inputform2\" name=\"kpiname\" id=\"kpiname\" value=\""+(kpi?kpi.attributes.dispName:"")+"\"><br/><table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td valign=\"top\"><span class=\"inputtext\">表 达 式：</span></td><td><textarea rows=\"2\" style=\"height:52px;\" cols=\"40\" id=\"expression\" name=\"expression\" class=\"inputform2\">"+(kpi?kpi.attributes.col:"")+"</textarea></td></tr></tbody></table><div class=\"actColumn\">"+kpiStr+"</div><span class=\"inputtext\">计算方式：</span><select id=\"kpiaggre\" name=\"kpiaggre\" class=\"inputform2\">"+tpstr+"</select><br><span class=\"inputtext\">度量单位：</span><input type=\"text\" value=\""+(kpi?kpi.attributes.unit:"")+"\" class=\"inputform2\" name=\"kpiunit\" id=\"kpiunit\"><br/><span class=\"inputtext\">格式化：</span>" + ftmstr("kpifmt","inputform2",(kpi?kpi.attributes.fmt:"")) + "<br/><span class=\"inputtext\">指标解释：</span><textarea name=\"kpinote\" id=\"kpinote\"  cols=\"25\" style=\"height:32px;\" class=\"inputform2\" rows=\"2\">"+(kpi?kpi.attributes.kpinote:"")+"</textarea></div>";
	if($("#dsColumn_div").size() == 0){
		$("<div id=\"dsColumn_div\" class=\"easyui-menu\"></div>").appendTo("body");
	}
	$('#dsColumn_div').dialog({
		title: update?"编辑表达式度量":"创建表达式度量",
		width: 420,
		height:  390,
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
					var alias = $("#dsColumn_div #alias").val();
					var name = $("#dsColumn_div #kpiname").val();
					var expression = $("#dsColumn_div #expression").val();
					if(alias == ""){
						msginfo("请填写度量标识。");
						$("#dsColumn_div #alias").focus();
						return;
					}
					if(ischinese(alias)){
						msginfo("度量标识只能是英文字符。");
						$("#dsColumn_div #alias").focus();
						return;
					}
					if(name == ''){
						msginfo("请填写度量名称。");
						$("#dsColumn_div #kpiname").focus();
						return;
					}
					if(expression == ''){
						msginfo("请填写度量表达式。");
						$("#dsColumn_div #expression").focus();
						return;
					}
					if(update){
						kpi.attributes.aggre = $("#dsColumn_div #kpiaggre").val();
						kpi.attributes.fmt = $("#dsColumn_div #kpifmt").val();
						kpi.attributes.unit = $("#dsColumn_div #kpiunit").val();
						kpi.attributes.dispName = name;
						kpi.attributes.kpinote = $("#dsColumn_div #kpinote").val();
						kpi.attributes.col = expression;
						kpi.attributes.alias = $("#dsColumn_div #alias").val();
						kpi.attributes.isupdate = "y";  //表示计算指标已经更改过了。
						$("#cuberighttree").tree("update", {target:kpi.target, text:kpi.attributes.aggre+"("+name+")"});
					}else{
						var cid = findCubeMaxId($("#cuberighttree").tree("find","cubedl").target);
						var o = {id:cid, text:$("#dsColumn_div #kpiaggre").val()+"("+name+")",attributes:{tp:"kpi",calc:true,drag:true,aggre:$("#dsColumn_div #kpiaggre").val(),col:expression, alias:$("#dsColumn_div #alias").val(), dispName:name,tname:"",fmt:$("#dsColumn_div #kpifmt").val(),unit:$("#dsColumn_div #kpiunit").val(),kpinote:$("#dsColumn_div #kpinote").val(),calcKpi:1},iconCls:"icon-ckpi"};
						$("#cuberighttree").tree("append", {parent:$("#cuberighttree").tree("find", "cubedl").target, data:[o]});
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
	$("#dsColumn_div .actColumn button").bind("click", function(){
		var txt = $(this).attr("name");
		insertText2focus(document.getElementById("expression"), txt+" ");
	});
}
function findCubeMaxId(target){
	var ret = 0;
	var ls = $("#cuberighttree").tree("getChildren", target);
	for(i=0; i<ls.length; i++){
		if(Number(ls[i].id) > ret){
			ret = Number(ls[i].id);
		}
	}
	return ret + 1;
}
function cube2ds(){
	var right = $("#cuberighttree").tree("getSelected");
	if(right == null || !right.attributes){
		$.messager.alert("出错了","您还未选择需要删除的度量或维度。","error");
		return;
	}
	if(right.attributes.tp == 'group'){
		if($("#cubelefttree").tree("getChildren", right.target).length > 0){
			$.messager.alert("出错了","您要删除的分组含有维度，不能删除。", "error");
			return;
		}
	}
	if(right.attributes.tp != 'group'){ //分组删除不用关联左边树
		var id = right.attributes.alias;   //通过 refId 引用s数据集的字段ID
		var cld = [];
		var ls = $("#cubelefttree").tree("getRoots");
		for(i=0; i<ls.length; i++){
			var c = ls[i].children;
			for(j=0; j<c.length; j++){
				cld.push(c[j]);
			}
		}
		for(i=0; i<cld.length; i++){
			if(cld[i].id == id){
				$(cld[i].target).attr("hide", "n").show();
				break;
			}
		}
	}
	if(window.delObj){
		window.delObj.push({'type':right.attributes.tp, id: right.attributes.targetId}); //在修改立方体时用来删除的内容
	}
	
	$("#cuberighttree").tree("remove", right.target);
}
function ftmstr(id, cls, curfmt){
	var str = "<select id=\""+id+"\" name=\""+id+"\" class=\""+cls+"\">";
	str = str + "<option value=\"\"></option><option "+(curfmt=='#,###'?"selected":"")+" value=\"#,###\">整数</option><option "+(curfmt=='#,###.00'?"selected":"")+" value=\"#,###.00\">小数(保留两位)</option><option "+(curfmt=='#,###.0000'?"selected":"")+" value=\"#,###.0000\">小数(保留四位)</option><option "+(curfmt=='0.00%'?"selected":"")+" value=\"0.00%\">百分比</option>";
	str = str + "</select>";
	return str;
}
function savecubecfg(pageJson, update){
	var cubeDim = [];
	var dims = $("#cuberighttree").tree("getChildren", $("#cuberighttree").tree("find", "cubewd").target);
	if(dims.length == 0){
		$("#crtdataset").tabs("select", 1);
		msginfo("您还未配置维度。");	
		return false;
	}
	var curGroup = null;
	for(i=0; i<dims.length; i++){
		var d = dims[i];
		if(d.attributes.tp == "group"){
			curGroup = d;
		}else{
			var obj = {name:d.attributes.dispName, type:d.attributes.dimtype,col:d.attributes.col, tname:d.attributes.tname, alias:d.attributes.alias, vtype: d.attributes.vtype, colTable:d.attributes.colTable,colkey:d.attributes.colkey,coltext:d.attributes.coltext,dimord:d.attributes.dimord, dateformat:d.attributes.dateformat,calc:(d.attributes.calc&&d.attributes.calc==true?1:0),targetId:d.attributes.targetId,isupdate:d.attributes.isupdate};
			var p = $("#cuberighttree").tree("getParent", d.target);
			if(p.attributes && p.attributes.tp == "group"){
				obj.groupName = p.text;
				obj.groupId = p.id;
			}else{
				obj.groupName = "";
				obj.groupId = "";
			}
			cubeDim.push(obj);
		}
	}
	var cubeKpi = [];
	var kpis = $("#cuberighttree").tree("getChildren", $("#cuberighttree").tree("find", "cubedl").target); 
	if(kpis.length == 0){
		$("#crtdataset").tabs("select", 1);
		msginfo("您还未配置度量。");
		return false;
	}
	for(i=0; i<kpis.length; i++){
		var t = kpis[i];
		cubeKpi.push({name:t.attributes.dispName,col:t.attributes.col,tname:t.attributes.tname,alias:t.attributes.alias,fmt:t.attributes.fmt,unit:t.attributes.unit,aggre:t.attributes.aggre,kpinote:t.attributes.kpinote,calc:(t.attributes.calc&&t.attributes.calc==true?1:0),calcKpi:t.attributes.calcKpi,targetId:t.attributes.targetId,isupdate:t.attributes.isupdate});
	}
	pageJson.dims = cubeDim;
	pageJson.kpis = cubeKpi;
	if(update){
		pageJson.delObj = window.delObj;
	}
	var json = JSON.stringify(pageJson);
	__showLoading();
	if(update){
		$.ajax({
			type:"POST",
			url:"updateCube.action",
			contentType : "application/json",
			dataType:"JSON",
			data:json,
			success:function(resp){
				__hideLoading();
				if(resp.result == 1){
					$.messager.alert('提示信息', "立方体更新成功。", "info");
					$('#cubetable').datagrid('load',{
						t:Math.random()
					});
				}else{
					msginfo("立方体更新失败。" + resp.msg);
				}
			},
			error:function(){
				__hideLoading();
				msginfo("立方体更新失败。");
			}
		});
	}else{
		$.ajax({
			type:"POST",
			url:"saveCube.action",
			dataType:"JSON",
			contentType : "application/json",   
			data:json,
			success:function(resp){
				__hideLoading();
				$.messager.alert('提示信息', "立方体创建成功。", "info", function(){
					$('#cubetable').datagrid('load',{
						t:Math.random()
					});
				});
			},
			error:function(){
				__hideLoading();
				msginfo("立方体创建失败。");
			}
		});
	}
	return true;
}