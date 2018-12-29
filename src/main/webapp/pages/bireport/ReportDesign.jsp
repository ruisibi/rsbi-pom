<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>多维分析工具(OLAP)</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/animate.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<link href="../resource/sweetalert/sweetalert.css" rel="stylesheet">
<link href="../resource/css/bireport.css" rel="stylesheet">
<link href="../resource/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet">
<script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
<script type="text/javascript" src="../ext-res/js/bootstrap.min.js?v=3.3.6"></script>
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css"/>
<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css"/>
<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
<script type="text/javascript" src="../resource/sweetalert/sweetalert.min.js"></script>
<script type="text/javascript" src="../ext-res/My97DatePicker/WdatePicker.js"></script>
<!--
<script language="javascript" src="../resource/js/bireport-compress.js?v6"></script>
-->
<script language="javascript" src="../resource/js/bitable.js"></script>
<script language="javascript" src="../resource/js/bidrill.js"></script>
<script language="javascript" src="../resource/js/bichart.js"></script>
<script language="javascript" src="../resource/js/bireport.js"></script>
<script language="javascript" src="../resource/js/json.js"></script>
<script type="text/javascript" src="../ext-res/js/ext-base.js"></script>
<script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
</head>

<script language="javascript">

<%
String pageInfo = (String)request.getAttribute("pageInfo");
if(pageInfo == null){
	%>
	var pageInfo = {"selectDs":'${selectDs}',tab:"1", comps:[{"name":"表格组件","id":1, "type":"table"},{"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]}], params:[]};
	var isnewpage = true;
	<%
}else{
%>
	var pageInfo = <%=pageInfo%>;
	var isnewpage = false;
<%}%>
var showtit = true;
var curTmpInfo = {"menus":"${menus}"}; //临时对象
curTmpInfo.isupdate = false; //页面是否已经修改
curTmpInfo.chartpos = "left";  //too/left 表示图表配置属性的位
$(function(){
	
	//初始化数据集
	reloadDatasetTree();
	if(pageInfo.selectDs == ''){
		$("#datasettree").tree("options").dnd = false;
	}
	
	//初始化参数
	initparam();
	
	//初始化默认组件
	for(i=0;i<pageInfo.comps.length; i++){
		var t = pageInfo.comps[i];
		var str = t.type == 'text' ? t.text.replace(/\n/g,"<br>") : null;
		addComp(t.id, t.name, str, false, t.type, isnewpage ? null : t);	
	}
	//初始化选项卡
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = $(e.target).attr("idx"); 
		pageInfo.idx = activeTab;
		if(pageInfo.idx == "2"){  //图
			$("#datasettree").removeClass("tableTreeCss").addClass("chartTreeCss");
		}else{  //表
			$("#datasettree").removeClass("chartTreeCss").addClass("tableTreeCss");
		}
	});
	if(pageInfo.idx == "2"){
		$('a[data-toggle="tab"]').last().tab('show');
	}
	//图标事件
	$("#chartarea").on("mouseover", "span.charticon", function(){
		$(this).css("opacity", 1);
	}).on("mouseout", "span.charticon", function(){
		$(this).css("opacity", 0.6);
	});
	$("#optarea").on("mouseover", "a.dimDrill", function(){
		$(this).css("opacity", 1);
	}).on("mouseout", "a.dimDrill", function(){
		$(this).css("opacity", 0.6);
	});
	$("#optarea").on("mouseover", "a.dimoptbtn", function(){
		$(this).css("opacity", 1);
	}).on("mouseout", "a.dimoptbtn", function(){
		$(this).css("opacity", 0.6);
	});
});

</script>
<style>
.panel-body {
	overflow:hidden;
}
</style>

<body class="gray-bg">

<nav class="navbar navbar-default animated fadeInDown" role="navigation" style="margin-bottom:0px;">
    <div>
        <!--向左对齐-->
        <ul class="nav navbar-nav navbar-left">
		<li class="dropdown">
        	<a href="#"  class="dropdown-toggle" data-toggle="dropdown">
            	<i class="fa fa-file"></i>文件
                <b class="caret"></b>
            </a>
        	<ul class="dropdown-menu">
                <li><a href="javascript:openreport();">打开</a></li>
                <li><a href="javascript:newpage();">新建</a></li>
                <li><a href="javascript:savepage();">保存</a></li>
            </ul>
        </li>
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
		<li><a href="javascript:printData();"><i class="fa fa-print"></i>打印</a></li>
		<li><a href="javascript:kpidesc();"><i class="fa fa-list-alt"></i>解释</a></li>
        </ul>
    </div>
</nav>

<div class="wrapper wrapper-content">
	<div class="row">
		<div class="col-sm-3">
			<div class="ibox">
				<div class="ibox-title">
					<h5>数据模型</h5>
				</div>
				<div class="ibox-content">
					<button class="btn btn-block btn-primary" onclick="selectdataset()"><i class="fa fa-refresh"></i> 切换数据</button>
					<p class="text-warning">拖拽数据到表格或图表中展现</p>
					<div id="datasettreediv"></div>
				</div>
			</div>
		</div>
		
		<div class="col-sm-9 animated fadeInRight">
			<div class="ibox">
				<div class="ibox-content" id="p_param" style="padding:5px;">
					<div class="ptabhelpr">拖拽维度到此处作为筛选条件</div>
				</div>
			</div>
			
					<div class="tabs-container">
						<ul class="nav nav-tabs">
							<li class="active"><a data-toggle="tab" idx="1" href="#tab-1" aria-expanded="true"> 表格</a>
							</li>
							<li><a data-toggle="tab" idx="2" href="#tab-2" aria-expanded="false">图表</a>
							</li>
							<p class="navbar-form navbar-right" role="search">
							<button type="button" class="btn btn-default btn-xs btn-outline" onclick="cleanData()">清除数据</button>
						</p>
						</ul>
					</div>
					
					<div class="tab-content">
                        <div id="tab-1" class="tab-pane active">
                            <div class="panel-body">
                               <div id="optarea" style="padding:5px; overflow:auto;"></div>
                            </div>
                        </div>
                        <div id="tab-2" class="tab-pane">
                            <div class="panel-body">
								<button class="btn btn-block btn-default" onclick="updateChart()">切换图表类型</button>
                               <div id="chartarea" style="padding:5px;"></div>
                            </div>
                        </div>
                    </div>
			
		</div>
	</div>
</div>	  

<div id="pdailog"></div>
<div id="kpioptmenu" class="easyui-menu">
	<div>
    	<span>计算</span>
   	   <div style="width:120px;">
    	<div onclick="kpicompute('sq')">上期值</div>
        <div onclick="kpicompute('tq')">同期值</div>
        <div onclick="kpicompute('zje')">增减额</div>
        <div onclick="kpicompute('hb')">环比(%)</div>
        <div onclick="kpicompute('tb')">同比(%)</div>
        <div class="menu-sep"></div>
        <div onclick="kpicompute('sxpm')">升序排名</div>
        <div onclick="kpicompute('jxpm')">降序排名</div>
        <div onclick="kpicompute('zb')">占比(%)</div>
        <div onclick="kpicompute('ydpj')">移动平均</div>
       </div>
    </div>
	<div onclick="kpiproperty()">属性...</div>
    <div onclick="crtChartfromTab()">图表...</div>
    <div onclick="kpiFilter('table')">筛选...</div>
    <div onclick="kpiwarning()">预警...</div>
    <div>
    <span>排序</span>
    <div style="width:120px;">
    	<div id="k_kpi_ord1" onclick="kpisort('asc')">升序</div>
        <div id="k_kpi_ord2"  onclick="kpisort('desc')">降序</div>
        <div id="k_kpi_ord3" iconCls="icon-ok" onclick="kpisort('')">默认</div>
    </div>
    </div>
    <div iconCls="icon-remove" onclick="delJsonKpiOrDim('kpi')">删除</div>
</div>
<div id="dimoptmenu" class="easyui-menu">
	<div onclick="dimsort('asc')">升序</div>
    <div onclick="dimsort('desc')">降序</div>
    <div>
    <span>移动</span>
    <div style="width:120px;">
    	<div iconCls="icon-back" onclick="dimmove('left')">左移</div>
        <div iconCls="icon-right" onclick="dimmove('right')">右移</div>
        <div id="m_moveto" onclick="dimexchange()">移至</div>
    </div>
    </div>
    <div iconCls="icon-reload" onclick="changecolrow(true)">行列互换</div>
    <div iconCls="icon-filter" onclick="filterDims()">筛选...</div>
    <div iconCls="icon-sum" onclick="aggreDim()" id="m_aggre">聚合</div>
    <div onclick="getDimTop()" id="m_aggre">取Top...</div>
    <div onclick="delJsonKpiOrDim('dim')" iconCls="icon-remove">删除</div>
</div>
<div id="chartoptmenu" class="easyui-menu">
	<div onclick="chartsort('asc')">升序</div>
    <div onclick="chartsort('desc')">降序</div>
    <div iconCls="icon-filter" onclick="chartfilterDims()" >筛选...</div>
    <div onclick="setChartKpi()" id="m_set">属性...</div>
    <div onclick="delChartKpiOrDim()" iconCls="icon-remove">清除</div>
</div>
</body>
</html>