<%@page contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="<%=path%>/resource/img/rs_favicon.ico">
    <title>未登录</title>
	<link href="<%=path%>/ext-res/css/bootstrap.min.css" rel="stylesheet">
	<link href="<%=path%>/resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
	<link href="<%=path%>/resource/css/animate.css" rel="stylesheet">
	<link href="<%=path%>/resource/css/style.css" rel="stylesheet">
	<link href="<%=path%>/resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
	<script type="text/javascript" src="<%=path%>/ext-res/js/jquery.min.js"></script>
	<script type="text/javascript" src="<%=path%>/ext-res/js/bootstrap.min.js?v=3.3.6"></script>
 <script type="text/javascript">
 	setTimeout(function(){
 		document.location.href='<%=path%>/Login.action';
 	},3000);
 </script>
    
  </head>
 
  <body class="gray-bg">
 
 <div class="wrapper wrapper-content  animated fadeInDown">
	<div class="row">
		<div class="col-sm-12">
			<div class="ibox">
				<div class="ibox-content text-center">
                        <h4 class="m-b-xxs">
						<img style="margin:10px;" src="<%=path%>/resource/img/icon-error.gif">
						您还未登录或登录信息已经失效, 系统将在3秒钟后自动跳转至登录页面!
						</h4>
						如果未自动跳转，请点击<a style="font-size: 14px; color: red" href='<%=path%>/Login.action'>登录！</a>
                    </div>
			</div>
		</div>
	</div>
 </div>
 

  </body>
</html>
