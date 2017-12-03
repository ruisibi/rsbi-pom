<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<div class="chartselect">
<div class="selleft">
<ul>
<li cid="1">曲线图</li>
<li cid="2">柱状图</li>
<li cid="8">条形图</li>
<li cid="9">面积图</li>
<li cid="3">饼图</li>
<li cid="4">仪表盘</li>
<li cid="5">雷达图</li>
<li cid="6">散点图</li>
<li cid="7">气泡图</li>
<li cid="10">地图</li>
</ul>
</div>
<div class="selright">
<div class="one" id="schart1" align="center" style="display:block;" tp="line">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c1.gif" alt="曲线图" title="曲线图">
曲线图
</span>
<span class="charttype" index='2'>
 <img src="../resource/img/chart/c12.gif" title="双轴曲线图">
 双轴曲线图
</span>
</div>
<div class="one" id="schart2" align="center" tp="column">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c2.gif" title="柱状图">
柱状图
</span>
<span class="charttype" index='2'>
 <img src="../resource/img/chart/c22.gif" title="双轴柱状图">
 双轴柱状图
</span>
<span class="charttype" index='3'>
 <img src="../resource/img/chart/c23.png" alt="堆积图" title="堆积图">
 堆积图
</span>
<span class="charttype" index='4'>
 <img src="../resource/img/chart/c24.png" alt="双轴堆积图" title="双轴堆积图">
 双轴堆积图
</span>
</div>
<div class="one" id="schart3" align="center" tp="pie">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c3.gif" title="饼图">
饼图
</span>
<span class="charttype" index='2'>
<img src="../resource/img/chart/c32.gif" title="环形图">
环形图
</span>
<span class="charttype" index='3'>
<img src="../resource/img/chart/c33.gif" title="嵌套环形图">
嵌套环形图
</span>
</div>
<div align="center" tp="gauge" id="schart4" class="one" style="display: block;">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c4.gif" title="仪表盘">
仪表盘
</span>
</div>
<div class="one" id="schart5" align="center" tp="radar">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c5.gif" title="雷达图">
雷达图
</span>
</div>
<div class="one" id="schart6" align="center" tp="scatter">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c6.gif" title="散点图">
散点图
</span>
</div>
<div class="one" id="schart7" align="center" tp="bubble">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c7.gif" title="气泡图"><br/>
气泡图
</span>
</div>
<div class="one" id="schart8" align="center" tp="bar">
<span class="charttype" index='1'>
<img src="../resource/img/chart/bar.gif" title="条形图">
条形图
</span>
</div>
<div class="one" id="schart9" align="center" tp="area">
<span class="charttype" index='1'>
<img src="../resource/img/chart/area.gif" title="面积图">
面积图
</span>
</div>
<div class="one" id="schart10" align="center" tp="map">
<span class="charttype" index='1'>
<img src="../resource/img/chart/c8.gif" title="地图">
地图
</span>
<span class="charttype" index='2'>
<img src="../resource/img/chart/c82.png" title="地图">
地图散点图
</span>
<br/>
<div>
地图区域：<select id="maparea">
<option value="china,全国">全国</option>
<option value="beijing,北京">北京</option>
<option value="tianjin,天津">天津</option>
<option value="shanghai,上海">上海</option>
<option value="chongqing,重庆">重庆</option>
<option value="hebei,河北">河北</option>
<option value="shanxi,山西">山西</option>
<option value="neimenggu,内蒙古">内蒙古</option>
<option value="liaoning,辽宁">辽宁</option>
<option value="jilin,吉林">吉林</option>
<option value="heilongjiang,黑龙江">黑龙江</option>
<option value="jiangsu,江苏">江苏</option>
<option value="zhejiang,浙江">浙江</option>
<option value="anhui,安徽">安徽</option>
<option value="fujian,福建">福建</option>
<option value="jiangxi,江西">江西</option>
<option value="shandong,山东">山东</option>
<option value="henan,河南">河南</option>
<option value="hubei,湖北">湖北</option>
<option value="hunan,湖南">湖南</option>
<option value="guangdong,广东">广东</option>
<option value="guangxi,广西">广西</option>
<option value="hainan,海南">海南</option>
<option value="sichuan,四川">四川</option>
<option value="guizhou,贵州">贵州</option>
<option value="yunnan,云南">云南</option>
<option value="xizang,西藏">西藏</option>
<option value="shanxi1,陕西">陕西</option>
<option value="gansu,甘肃">甘肃</option>
<option value="qinghai,青海">青海</option>
<option value="ningxia,宁夏">宁夏</option>
<option value="xinjiang,新疆">新疆</option>
<option value="xianggang,香港">香港</option>
</select>
</div>
</div>
</div>
</div>