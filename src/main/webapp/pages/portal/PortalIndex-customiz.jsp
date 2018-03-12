<%@ page language="java" contentType="text/html; charset=utf-8" import="com.ruisitech.bi.util.RSBIUtils" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
	 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>睿思BI - 数据报表</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
   <link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<link href="../resource/css/portal.css" rel="stylesheet">
<link href="../resource/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet">
   <script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
   <script type="text/javascript" src="../resource/js/json.js"></script>
   <script type="text/javascript" src="../ext-res/js/ext-base.js"></script>
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
	<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="../resource/jquery-easyui-1.4.4/locale/easyui-lang-zh_CN.js"></script>
    <script type="text/javascript" src="../ext-res/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="../resource/js/portal.js"></script>
    <script type="text/javascript" src="../resource/js/portal-comp.js"></script>
    <script type="text/javascript" src="../resource/js/portal-chart.js"></script>
    <script type="text/javascript" src="../resource/js/portal-param.js"></script>
    <script type="text/javascript" src="../resource/js/portal-table.js"></script>
	<script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
    <script type="text/javascript" src="../ext-res/js/sortabletable.js"></script>
    <script type="text/javascript" src="../ext-res/js/jquery.resizeend.min.js"></script>
	<script type="text/javascript" src="../ext-res/js/jquery-resizable.js"></script>
</head>

<script language="javascript">
<c:if test="${pageInfo == null || pageInfo == '' }">
var pageInfo = {"layout":1, "body":{tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]}};
</c:if>
<c:if test="${pageInfo != null && pageInfo != ''}">
var pageInfo = ${pageInfo};
</c:if>
var curTmpInfo = {is3g:'${is3g}'};

jQuery(function(){
	//初始化数据
	reloadDatasetTree();
	//初始化已选表
	initTableTree();
	//初始化布局
	initlayout();
	//初始化组件拖拽
	regCompTree();
	//初始化参数及拖拽
	initParams();
});
</script>

<body class="easyui-layout" id="Jlayout">
<div data-options="region:'north',border:false" style="height:32px; overflow:hidden;">
  <div class="panel-header" style="padding:3px;">
  			<%if(RSBIUtils.isShowMenu("back", request)){%>
        	<a href="javascript:backpage();" id="mb1" class="easyui-linkbutton" plain="true" iconCls="icon-back">返回</a>
             <%}%>
             <%if(RSBIUtils.isShowMenu("save", request)){%>
            <a href="javascript:savepage();" id="mb2" class="easyui-linkbutton" plain="true" iconCls="icon-save">保存</a>
             <%}%>
            <a href="javascript:setlayout();" id="mb3" class="easyui-linkbutton" plain="true" iconCls="icon-layout" title="">布局</a>
             <a href="javascript:;" menu="#selectinfo" id="mb4" class="easyui-menubutton" plain="true" iconCls="icon-dataset">数据</a>
<!--              <a href="javascript:setpagestyle();" id="mb5" class="easyui-linkbutton" plain="true" iconCls="icon-styles">样式</a> -->
                <%if(RSBIUtils.isShowMenu("export", request)){%>
              <a href="javascript:exportPage()" id="mb6" class="easyui-linkbutton" plain="true" iconCls="icon-export">导出</a>
               <%}%>
                <%if(RSBIUtils.isShowMenu("print", request)){%>
             <a href="javascript:printpage()" id="mb10" class="easyui-linkbutton" plain="true" iconCls="icon-print">打印</a>
             <%}%>
			 <a href="javascript:pushpage()" id="mb10" class="easyui-linkbutton" plain="true" iconCls="icon-push">发布</a>
             <a href="javascript:helper()" id="mb10" class="easyui-linkbutton" plain="true" iconCls="icon-help">帮助</a>
   </div>
   
</div>

<div data-options="region:'west',split:true,title:'对象面板'"  style="width:190px;">
<div id="comp_tab" data-options="fit:true,border:false" class="easyui-tabs" style="height:auto; width:auto;">
	<div title="组件">
		<ul id="param_tree" data-options="onContextMenu:function(e){e.preventDefault();}">
			<li>
			<span>参数</span>
			 <ul>
				<li data-options="attributes:{tp:'text'},iconCls:'icon-param'"><span>输入框</span></li>
				<li data-options="attributes:{tp:'radio'},iconCls:'icon-param'"><span>单选框</span></li>
				<li data-options="attributes:{tp:'checkbox'},iconCls:'icon-param'"><span>多选框</span></li>
				<li data-options="attributes:{tp:'dateselect'},iconCls:'icon-param'"><span>日历框</span></li>
				<li data-options="attributes:{tp:'monthselect'},iconCls:'icon-param'"><span>月份框</span></li>
				<li data-options="attributes:{tp:'yearselect'},iconCls:'icon-param'"><span>年份框</span></li>
			 </ul>
			</li>
			</ul>
		<ul id="comp_tree" data-options="onContextMenu:function(e){e.preventDefault();}">
			<li data-options="attributes:{tp:'text'}, iconCls:'icon-text'"><span>文本</span></li>
			<li data-options="attributes:{tp:'box'}, iconCls:'icon-box'"><span>数据块</span></li>
			<li data-options="attributes:{tp:'chart'},iconCls:'icon-chart'"><span>图表</span></li>
			<li data-options="attributes:{tp:'grid'},iconCls:'icon-table'"><span>表格</span></li>
			<li data-options="attributes:{tp:'table'},iconCls:'icon-cross'"><span>交叉表</span></li>
		</ul>

    </div>
	<div title="立方体" style="">
        <ul id="datasettree" class="easyui-tree">
        </ul>
    </div>
    <div title="数据表" style="">
        <ul id="tabletree" class="easyui-tree">
        </ul>
    </div>
 </div>
</div>

<div data-options="region:'center',border:true" title="操作区">
  <div class="easyui-layout" data-options="fit:true">
  	<div data-options="region:'north',split:false" id="optparam" style="height:44px">
    	<span class="charttip" style="font-size:14px; text-align:center;">报表参数区域<br/>把参数拖放此处作为报表查询条件</span>
    </div>
    <div data-options="region:'center'" id="optarea"  style="padding:5px;background-color:#dddddd;" align="center">
    
    </div>
  </div>
</div>

<div id="pdailog"></div>
<div class="indicator">==></div>
<div id="autolayoutmenu" class="easyui-menu">
    <div onclick="lyt_insertRow()" id="lyt_insertrow">插入行</div>
    <div onclick="lyt_insertCol()" id="lyt_insertcol">插入列</div>
    <div onclick="lyt_deleteRow()" id="lyt_deleterow">删除行</div>
    <div onclick="lyt_deleteCol()" id="lyt_deletecol">删除列</div>
    <div onclick="lyt_mergeCell()" id="lyt_mergeCell">合并</div>
    <div onclick="lyt_unmergeCell()" id="lyt_unmergeCell">取消合并</div>
</div>
<div id="dimoptmenu" class="easyui-menu">
	<div onclick="dimsort('asc')">升序</div>
    <div onclick="dimsort('desc')">降序</div>
    <div>
    <span>移动</span>
    <div style="width:120px;">
    	<div iconCls="icon-back" onclick="dimkpimove('left')">左移</div>
        <div iconCls="icon-right" onclick="dimkpimove('right')">右移</div>
        <div id="m_moveto" onclick="dimexchange()">移至</div>
    </div>
    </div>
    <div iconCls="icon-sum" onclick="aggreDim()" id="m_aggre">聚合...</div>
    <div onclick="delJsonKpiOrDim('dim')" iconCls="icon-remove">删除</div>
</div>
<div id="kpioptmenu" class="easyui-menu">
	<div onclick="kpiproperty()">属性...</div>
    <div>
    <span>排序</span>
    <div style="width:120px;">
    	<div id="k_kpi_ord1" onclick="kpisort('asc')">升序</div>
        <div id="k_kpi_ord2"  onclick="kpisort('desc')">降序</div>
        <div id="k_kpi_ord3" iconCls="icon-ok" onclick="kpisort('')">默认</div>
    </div>
    </div>
    <div>
    <span>移动</span>
    <div style="width:120px;">
    	<div iconCls="icon-back" onclick="dimkpimove('left')">左移</div>
        <div iconCls="icon-right" onclick="dimkpimove('right')">右移</div>
    </div>
    </div>
    <div iconCls="icon-remove" onclick="delJsonKpiOrDim('kpi')">删除</div>
</div>
<div id="chartoptmenu" class="easyui-menu">
	<div onclick="chartsort('asc')">升序</div>
    <div onclick="chartsort('desc')">降序</div>
    <div onclick="setChartKpi()" id="m_set">属性...</div>
    <div onclick="delChartKpiOrDim()" iconCls="icon-remove">清除</div>
</div>
<div id="table_menu" class="easyui-menu">
	<div iconCls="icon-dataset" onclick="editComp()">数据</div>
    <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
    <div onclick="compevent()">事件...</div>
    <div onclick="setComp()">属性...</div>
</div>
<div id="box_menu" class="easyui-menu">
	<div iconCls="icon-dataset" onclick="editComp()">数据</div>
    <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
    <div onclick="setComp()">属性...</div>
</div>
<div id="grid_menu" class="easyui-menu">
	<div iconCls="icon-dataset" onclick="editComp()">数据</div>
    <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
    <div onclick="setComp()">属性...</div>
</div>
<div id="text_menu" class="easyui-menu">
	<div onclick="editComp()">编辑</div>
    <div onclick="setComp()">属性...</div>
</div>
<div id="chart_menu" class="easyui-menu">
	<div onclick="setcharttype(false)">图表类型...</div>
	<div iconCls="icon-dataset" onclick="editComp()">数据</div>
    <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
    <div onclick="compevent()">事件...</div>
    <div onclick="setComp()">属性...</div>
</div>
<div id="param_menu" class="easyui-menu">
	<div iconCls="icon-edit" onclick="newparam('update')">编辑</div>
	<div iconCls="icon-back" onclick="moveparam('left')">左移</div>
    <div iconCls="icon-right" onclick="moveparam('right')">右移</div>
</div>
<div id="selectinfo" style="width:150px;">
    <div onclick="selectdataset()" >选择立方体...</div>
    <div onclick="selecttable()" >选择数据表...</div>
</div>
<div id="gridoptmenu" class="easyui-menu">
    <div>
    <span>排序</span>
    <div style="width:120px;">
    	<div id="col_ord1" onclick="gridColsort('asc')">升序</div>
        <div id="col_ord2"  onclick="gridColsort('desc')">降序</div>
        <div id="col_ord3" iconCls="icon-ok" onclick="gridColsort('')">默认</div>
    </div>
    </div>
    <div>
    <span>移动</span>
    <div style="width:120px;">
    	<div iconCls="icon-back" onclick="tableColmove('left')">左移</div>
        <div iconCls="icon-right" onclick="tableColmove('right')">右移</div>
    </div>
    </div>
    <div onclick="setGridColProp()" id="m_set">属性...</div>
    <div onclick="delGridCol()" iconCls="icon-remove">删除</div>
</div>
</body>
</html>