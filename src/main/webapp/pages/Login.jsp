<%@page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>睿思BI - 用户登录</title>
<meta name="keywords" content="睿思BI">
<meta name="description" content="“睿思BI”商业智能系统是由北京睿思科技有限公司自主研发的企业数据分析系统。 包含数据建模、数据报表、多维分析、仪表盘、移动BI等功能模块，方便企业快速建立一套易用，灵活、低成本的商业智能平台，实现数据的快速分析及可视化。 ">
<link rel="shortcut icon" type="image/x-icon" href="resource/img/rs_favicon.ico">
<link href="ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<link href="resource/css/animate.css" rel="stylesheet">
<link href="resource/css/style.css" rel="stylesheet">
<link href="resource/css/login.css" rel="stylesheet">
<link href="resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<link href="resource/sweetalert/sweetalert.css" rel="stylesheet">
<script type="text/javascript" src="ext-res/js/jquery.min.js"></script>
<script type="text/javascript" src="ext-res/js/ext-base.js"></script>
<script type="text/javascript" src="resource/validate/jquery.validate.min.js"></script>
<script type="text/javascript" src="resource/validate/messages_zh.min.js"></script>
<script type="text/javascript" src="ext-res/js/bootstrap.min.js?v=3.3.6"></script>
<script type="text/javascript" src="resource/sweetalert/sweetalert.min.js"></script>


<script language="javascript">
if(window.top != window.self){
	window.top.location.href = 'Login.action'
}
</script>
</head>

<body class="signin">
	  <c:if test="${requestScope.errorInfo != null}">
			<div class="panel panel-danger">
				<div class="panel-heading">
					${requestScope.errorInfo}
				</div>
			</div>
			<script>
			$(function(){
				window.setTimeout(function(){
					$("div.panel-danger").remove();
				}, 4000);
			});
			</script>
	  </c:if>
   <div class="signinpanel animated fadeInDown">
        <div class="row">
            <div class="col-sm-12">
				<div align="center" style="margin:10px;"><img src="resource/img/rsyun.png"></div>
                <form method="post" action="dologin.action">
					<div align="center"><img src="resource/img/logtitle.png"></div>
					<div class="row">
						<div class="col-sm-6"><div style="padding:20px 10px 20px 0px;"><img src="resource/img/xsqq.png"></div></div>
						<div class="col-sm-6">
							<input type="text" name="userName" value="${userName}" class="form-control uname" placeholder="您的账号" required="true" aria-required="true"/>
							<input type="password" name="password" value="${password}" class="form-control pword m-b" placeholder="您的密码" required="true" aria-required="true"/>
							<button class="btn btn-success btn-block full-width m-b" type="submit">登录</button>
							 <p>账号/密码： admin/123456 </p>
						</div>
					</div>
                </form>
            </div>
        </div>
        <div class="signup-footer">
            <div align="center"> 
               © <a href="http://www.ruisitech.com" target="_blank">成都睿思商智科技有限公司</a> 2018 版权所有
            </div>
        </div>
    </div>
</body>
</html>
