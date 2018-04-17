<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>报表查看</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/animate.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
<script type="text/javascript" src="../ext-res/js/bootstrap.min.js?v=3.3.6"></script>
<script type="text/javascript" src="../ext-res/js/ext-base.js"></script>
<script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
<script type="text/javascript" src="../ext-res/js/sortabletable.js"></script>
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
<script type="text/javascript" src="../ext-res/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../ext-res/js/jquery.resizeend.min.js"></script>

</head>
<script language="javascript">
$(function(){
	__showLoading();
	$("#optarea").load("view.action",{pageId:'${pageId}', t:Math.random()}, function(){
		 __hideLoading();
	});
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
function getPageParam(){
	var pms = null;
	$.ajax({
		type:"post",
		url:"getReportJson.action",
		data: {reportId: '${pageId}'},
		dataType:"json",
		async:false,
		success: function(resp){
			pms = resp.params;
		}
	});
	var pstr = "";
	for(i=0; pms!=null&&i<pms.length; i++){
		var pid = pms[i].paramid;
		var ptype = pms[i].type;
		var val = null;
		if(ptype=="text" || ptype == "dateselect" || ptype == "monthselect" || ptype == "yearselect" || ptype == "radio"){
			val = $("#"+pid).val().replace(/^\s+|\s+$/g,"");
		}else if(ptype == "checkbox"){
			val = $('#'+pid).combobox("getValues");
		}
		pstr = pstr + pid+"="+val;
		if(i != pms.length - 1){
			pstr = pstr + "&";
		}
	}
	return pstr;
}
function printpage() {
	var pms = getPageParam();
	var url2 = "about:blank";
	var name = "printwindow";
	window.open(url2, name);
	var ctx = "<form name='prtff' method='post' target='printwindow' action=\"print.action?"+pms+"\" id='expff'><input type='hidden' name='pageId' id='pageId' value='${pageId}'></form>";
	$(ctx).appendTo("body").submit().remove();
}
function exportPage(tp){
	var pms = getPageParam();
	var expType = "html";
	var ctx = "<form name='expff' method='post' action=\"export.action?"+pms+"\" id='expff'><input type='hidden' name='type' id='type'><input type='hidden' name='pageId' id='pageId' value='${pageId}'><input type='hidden' name='picinfo' id='picinfo'></form>";
	if($("#expff").size() == 0 ){
		$(ctx).appendTo("body");
	}
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
			str = $(this).attr("label") + "," + str+","+$("#"+id).width(); //加上label标记,由于宽度是100%,需要加上宽度
			strs = strs  +  str;
			if(index != $("div.chartUStyle").size() - 1){
				strs = strs + "@";
			}
			
		});
	}
	$("#expff #picinfo").val(strs);
	$("#expff").submit();
}
</script>
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
<body class="gray-bg">
<nav class="navbar navbar-default" role="navigation" style="margin-bottom:0px;">
    <div>
        <!--向左对齐-->
        <ul class="nav navbar-nav navbar-left">
		<c:if test="${ income != 'menu' }">
		<li><a href="customization.action?pageId=${pageId}"><i class="fa fa-edit"></i>定制</a></li>
		</c:if>
		<li class="dropdown">
        	<a href="#" class="dropdown-toggle" data-toggle="dropdown">
            	<i class="fa fa-file-excel-o"></i>导出
                <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
                <li><a href="javascript:exportPage('html');">HTML</a></li>
                <li><a href="javascript:exportPage('csv');">CSV</a></li>
                <li><a href="javascript:exportPage('excel');">EXCEL</a></li>
                <li><a href="javascript:exportPage('word');">WORD</a></li>
				<li><a href="javascript:exportPage('pdf');">PDF</a></li>
            </ul>
        </li>
		<li><a href="javascript:printpage();"><i class="fa fa-print"></i>打印</a></li>
		<c:if test="${ income != 'menu' }">
		<li><a href="PortalIndex.action"><i class="fa fa-arrow-left"></i>返回</a></li>
		</c:if>
        </ul>
    </div>
</nav>
<div class="animated fadeInDown" style="margin:10px;">
<div id="optarea"></div>
</div>

</body>
</html>