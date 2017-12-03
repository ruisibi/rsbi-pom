<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>手机报表分类管理</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/animate.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
<script language="javascript" src="../resource/js/json.js"></script>
<script language="javascript" src="../ext-res/js/ext-base.js"></script>
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/locale/easyui-lang-zh_CN.js"></script>
</head>

<script language="javascript">
$(function(){
	var dt = [{id:'zty', text:'手机报表分类', iconCls:'icon-subject', children:${str}}];
	$("#typetree").tree({
		data:dt,
		onContextMenu: function(e, node){
			e.preventDefault();
			$('#typetree').tree('select', node.target);
			if(node.id == 'zty'){
				$('#typeMenu').menu("disableItem", $("#typeMenu #mod"));
				$('#typeMenu').menu("disableItem", $("#typeMenu #del"));
			}else{
				$('#typeMenu').menu("enableItem", $("#typeMenu #mod"));
				$('#typeMenu').menu("enableItem", $("#typeMenu #del"));
			}
			$('#typeMenu').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		}
	});
});
function addType(update){
	var node = $("#typetree").tree("getSelected");
	var obj;
	if(update){
		$.ajax({
			   type: "GET",
			   async: false,
			   url: "getType.action?t="+Math.random(),
			   dataType:"JSON",
			   data: {"id":node.id},
			   success: function(resp){
				  obj = resp;
			   }
		});
	}
	var ord = $("#typetree").tree("getChildren", $("#typetree").tree("find","zty").target).length + 1 ;
	var ctx = "<div class=\"textpanel\"><span class=\"inputtext\">名称：</span><input type=\"text\" id=\"name\" class=\"inputform\" value=\""+(obj&&obj.name!=null?obj.name:"")+"\"><br/><span class=\"inputtext\">说明：</span><input type=\"text\" id=\"note\" class=\"inputform\" value=\""+((obj&&obj.note!=null?obj.note:""))+"\"><br/><span class=\"inputtext\">排序：</span><input type=\"text\" id=\"order\" class=\"inputform\" value=\""+(obj&&obj.ord!=null?obj.ord:ord)+"\"><br/></div>";
	$('#pdailog').dialog({
		title: update?'修改分类':'新建分类',
		width: 420,
		height: 240,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content: ctx,
		buttons:[{
				text:'确定',
				iconCls:'icon-ok',
				handler:function(){
					var name = $("#pdailog #name").val();
					var note = $("#pdailog #note").val();
					var order = $("#pdailog #order").val();
					if(name == ''){
						$.messager.alert("出错了","名称必须填写。", "error", function(){
							$("#pdailog #name").focus();
						});
						return;
					}
					if(isNaN(order)){
						$.messager.alert("出错了","排序字段必须是数字类型。", "error", function(){
							$("#pdailog #order").select();
						});
						return;
					}
					if(update==false){
						$.ajax({
						   type: "POST",
						   url: "addType.action",
						   dataType:"JSON",
						   data: {"name":name,"note":note,"ord":order},
						   success: function(resp){
							   $("#typetree").tree("append", {parent:$("#typetree").tree("find", "zty").target, data:[{id:resp.rows,text:name,iconCls:'icon-subject3'}]});
						   }
						});
					}else{
						$.ajax({
						   type: "POST",
						   url: "updateType.action",
						   dataType:"text",
						   data: {"name":name,"note":note,"ord":order, "id":node.id},
						   success: function(resp){
							   $("#typetree").tree("update", {target:node.target, text:name});
						   },
						   error: function(a, b, c){
							   $.messager.alert("出错了。","修改出错。", "error");
						   }
						});
					}
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
function delType(){
		if(confirm('是否确认删除？')){
			var node = $("#typetree").tree("getSelected");
			$.ajax({
			   type: "POST",
			   url: "deleteType.action",
			   dataType:"JSON",
			   data: {"id":node.id},
			   success: function(resp){
				   if(resp.result == 1){
				   		$("#typetree").tree("remove", node.target);
				   }else{
					   $.messager.alert("出错了。", resp.msg, "error");
				   }
			   },
			   error: function(){
				   $.messager.alert("出错了。","删除出错。", "error");
			   }
			});
		}
	}
</script>

<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInDown">
 <div class="row">
				<div class="col-sm-12">
	<div class="ibox">

					<div class="ibox-title">
                        <h5>手机报表分类管理</h5>
                    </div>
<div class="ibox-content">
 <div class="row">
    <div class="col-sm-5">
     <ul id="typetree" style="width:200px;"></ul>
	 </div>
	 <div class="col-sm-6">
    <p class="text-warning">在分类上点击鼠标右键来新建或编辑分类。</p>
	</div>
</div>
</div>

</div>
 </div>
 </div>
</div>






<div id="pdailog"></div>
<div id="typeMenu" class="easyui-menu">
	<div onclick="addType(false)" id="add">新增...</div>
    <div onclick="addType(true)" id="mod">修改...</div>
    <div onclick="delType()" id="del">删除</div>
</div>


</body>
</html>