<%@ page language="java" contentType="text/html; charset=utf-8" import="com.ruisi.ext.engine.ExtConstants"%>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>
 <%
 String returnJsp = request.getParameter(ExtConstants.returnJspFlag);
 if("false".equalsIgnoreCase(returnJsp)){
 %>
 	 <ext:display/>
 <%
}else{
 %>
<!DOCTYPE html>
<html lang="en">
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>EXT2</title>
    <base target="_self">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
	<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
	<link href="../resource/css/animate.css" rel="stylesheet">
	<link href="../resource/css/style.css" rel="stylesheet">
	<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
	<link href="../resource/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
	<script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
	<script language="javascript" src="../ext-res/js/ext-base.js"></script>
	<script type="text/javascript" src="../ext-res/js/bootstrap.min.js?v=3.3.6"></script>
	<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
	<script language="javascript" src="../ext-res/js/sortabletable.js"></script>
  </head>
 
  <body class="gray-bg">
    <ext:display/>
  </body>
</html>
<%
}
%>