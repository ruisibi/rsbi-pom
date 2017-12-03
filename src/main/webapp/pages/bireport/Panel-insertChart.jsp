<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="chartselect">
<div class="selleft">
<ul>
<li <c:if test="${tp == 'line'}">class="select"</c:if> cid="1">曲线图</li>
<li <c:if test="${tp == 'column'}">class="select"</c:if> cid="2">柱状图</li>
<li <c:if test="${tp == 'pie'}">class="select"</c:if> cid="3">饼图</li>
<li <c:if test="${tp == 'bar'}">class="select"</c:if> cid="10">条形图</li>
<li <c:if test="${tp == 'area'}">class="select"</c:if> cid="9">面积图</li>
<li <c:if test="${tp == 'gauge'}">class="select"</c:if> cid="4">仪表盘</li>
<li <c:if test="${tp == 'radar'}">class="select"</c:if> cid="5">雷达图</li>
<li <c:if test="${tp == 'scatter'}">class="select"</c:if> cid="6">散点图</li>
<li <c:if test="${tp == 'bubble'}">class="select"</c:if> cid="7">气泡图</li>
</ul>
</div>
<div class="selright">
<div class="one" id="schart1" align="center" style="display:block;" tp="line">
<img src="../resource/img/chart/c1.gif">
</div>
<div class="one" id="schart2" align="center" tp="column">
<img src="../resource/img/chart/c2.gif">
</div>
<div class="one" id="schart3" align="center" tp="pie">
<img src="../resource/img/chart/c3.gif">
</div>
<div class="one" id="schart10" align="center" tp="bar">
<img src="../resource/img/chart/bar.gif">
</div>
<div class="one" id="schart9" align="center" tp="area">
<img src="../resource/img/chart/area.gif">
</div>
<div class="one" id="schart4" align="center" tp="gauge">
<img src="../resource/img/chart/c4.gif">
</div>
<div class="one" id="schart5" align="center" tp="radar">
<img src="../resource/img/chart/c5.gif">
</div>
<div class="one" id="schart6" align="center" tp="scatter">
<img src="../resource/img/chart/c6.gif">
</div>
<div class="one" id="schart7" align="center" tp="bubble">
<img src="../resource/img/chart/c7.gif">
</div>
</div>
</div>
<script language="javascript">
$(function(){
	chartcss();
});
</script>