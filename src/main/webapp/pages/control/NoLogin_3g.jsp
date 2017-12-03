<%@ page language="java" pageEncoding="UTF-8" import="com.ruisi.ext.engine.ExtConstants"%>
<%@ page session="false" buffer="none" %>

<%
String path = request.getContextPath();
//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <head>
    
    <title>未登录</title>
	
 <script type="text/javascript">
 	setTimeout(function(){
 		document.location.href='<%=path%>/Login3G.action';
 	},3000);
 </script>
 <style>
 <!--
.p_err {
	  width:300px;
	  margin:0 auto;
	   border: 1px solid #BBBBBB;
    border-radius: 8px 8px 8px 8px;
    box-shadow: 5px 5px 5px #DDDDDD;
	background-color:#FFF;
	line-height:20px;
	font-size:14px;
	height:60px;
  }
-->
 </style>
    
  </head>

 
  <body>
  <br/><br/><br/><br/>
  <div class="p_err" align="center">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><img style="margin:10px;" src="<%=path%>/resource/img/icon-error.gif"></td>
    <td>
    <div style="font-size: 16px; font-weight:bold; margin-bottom:5px; margin-top:10px;">登录信息已超时,<br/> 系统将在3秒钟后自动登录!</div>
    </td>
  </tr>
</table>
	</div>
  </body>
</html>
