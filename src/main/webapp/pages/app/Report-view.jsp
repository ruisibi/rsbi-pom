<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>手机报表 - 报表展现</title> 
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <script language="javascript" src="../ext-res/js/jquery.min.js"></script>
    <script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
    <script language="javascript" src="../ext-res/js/ext-base.js?v2"></script>
    <script language="javascript" src="../ext-res/js/sortabletable.js"></script>
    <script type="text/javascript" src="../ext-res/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="../ext-res/js/jquery.resizeend.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
	<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
  </head>
   <style>
table.r_layout {
	table-layout:fixed;
	width:100%;
}
table.r_layout td.layouttd {
	padding:10px;
}
.inputform2 {
	width:120px;
}
.inputtext {
	width:90px;
}
</style>
<script language="javascript">
$(function(){
	//注册resize调整图形事件
	$(window).on("resizeend", function(e){
		$("div.chartUStyle").each(function(index, element) {
			var id = $(this).attr("id");
			id = id.substring(1, id.length);
			var chart = echarts.getInstanceByDom(document.getElementById(id));
			chart.resize($("#C"+id).width(), $("#C"+id).height());
		});
	});
});
</script>
<body class="gray-bg">
${str}
</body>
    </html>