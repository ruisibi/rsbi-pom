<%@ page language="java" contentType="text/html;charset=UTF-8" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>睿思BI - 数据可视化分析系统</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/animate.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
<link href="../resource/sweetalert/sweetalert.css" rel="stylesheet">
<script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
<script type="text/javascript" src="../ext-res/js/ext-base.js"></script>
<script type="text/javascript" src="../ext-res/js/bootstrap.min.js?v=3.3.6"></script>
<script type="text/javascript" src="../resource/sweetalert/sweetalert.min.js"></script>
<script type="text/javascript" src="../resource/metisMenu/jquery.metisMenu.js"></script>
<script type="text/javascript" src="../resource/slimscroll/jquery.slimscroll.min.js"></script>
<script type="text/javascript" src="../resource/layer/layer.min.js"></script>
<script type="text/javascript" src="../resource/js/hAdmin.js"></script>
<script type="text/javascript" src="../resource/validate/jquery.validate.min.js"></script>
<script type="text/javascript" src="../resource/validate/messages_zh.min.js"></script>
</head>

<script language="javascript" type="text/javascript">
	function logout(){
		swal({
		  title: "",
		  text: "是否确认退出登录？",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#27c24c",
		  confirmButtonText: "确定",
		  cancelButtonText: "取消",
		  closeOnConfirm: true
		},
		function(){
		  location.href = 'Logout.action';
		});
	}
	function showDailog(tp){
		if(tp == "userInfo"){
			$("#modelDiv .modal-title").html("用户信息");
			$.getJSON("User.action", function(json){
				$("#modelDiv .modal-body").html("<dl class=\"dl-horizontal\"><dt>登录名：</dt><dd>" + json.staffId+"</dd><dt>用户名：</dt><dd>" + json.loginName+"</dd><dt>所属企业：</dt><dd>北京睿思科技有限公司</dd><dt>账号状态：</dt><dd>"+(json.state==1?"正常":(json.state==2?"试用":"停用"))+"</dd><dt>登录次数：</dt><dd>"+json.logCnt+"次</dd><dt>上次登录时间：</dt><dd>" + json.loginTime+"</dd> </div>");
				$("#savepsdbtn").hide();
				$("#modelDiv").modal("show");
			});
			
		}else if(tp == "chgPsd"){
			$("#modelDiv .modal-title").html("修改密码");
			$("#modelDiv .modal-body").html("<div class=\"form-group\"><label class=\"col-sm-4 control-label\" for=\"password1\">原密码：</label><input id=\"password1\" name=\"password1\" class=\"form-control\" type=\"password\" required=\"true\" minlength=\"6\"></div><div class=\"form-group\"><label class=\"col-sm-4 control-label\" for=\"password2\">新密码：</label><input id=\"password2\" name=\"password2\" class=\"form-control\" type=\"password\" required=\"true\" minlength=\"6\"></div><div class=\"form-group\"><label class=\"col-sm-4 control-label\" for=\"password3\">重复密码：</label><input id=\"password3\" name=\"password3\" class=\"form-control\" type=\"password\" required=\"true\" minlength=\"6\"  equalTo=\"#password2\"></div>");
			$("#savepsdbtn").show();
			$("#modelDiv").modal("show");
		}
	}
	$(function(){
		$("#form1").validate({
			submitHandler:function(form){
			   $.ajax({
				    type:"POST",
					data:$(form).serialize(),
					url:'chgPsd.action',
					dataType:'json',
					success:function(ret){
						if(ret.result == 0){
							msginfo(ret.msg, "error");
						}else{
							$('#modelDiv').modal('hide');
							msginfo("密码修改成功", "success");
						}
					}
			   });
			}    
		});
		
	});
</script>
<style>
.nav > li > a {
    font-weight: 600;
}
</style>
<body class="fixed-sidebar full-height-layout gray-bg" style="overflow:hidden">
    <div id="wrapper">
        <!--左侧导航开始-->
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div class="nav-close"><i class="fa fa-times-circle"></i>
            </div>
            <div class="sidebar-collapse">
                <ul class="nav" id="side-menu">
                    <li class="nav-header" style="padding:0px;">
                        <div class="dropdown profile-element">
                            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                                <span class="clear">
                                    <span class="block m-t-xs" style="font-size:20px;">
                                        <img src="../resource/img/frame3/log2.png">
                                    </span>
                                </span>
                            </a>
                        </div>
                        <div class="logo-element">睿思BI
                        </div>
                    </li>
                    
					<c:forEach var="ent" items="${ menus }">
					<li>
                        <a <c:if test="${ ent.children.size() == 0 }">class="J_menuItem" href="${ent.menuUrl}"</c:if>>
                            <c:if test="${ent.avatar != null && ent.avatar != '' }"><i class="${ent.avatar}"></i></c:if>
                            <span class="nav-label">${ent.menuName}</span>
							<c:if test="${ ent.children.size() > 0 }"><span class="fa arrow"></span></c:if>
                        </a>
						<c:if test="${ ent.children.size() > 0 }">
							<ul class="nav nav-second-level">
								<c:forEach var="child" items="${ ent.children }">
									 <li>
										<a <c:if test="${ child.children.size() == 0 }">class="J_menuItem" href="${child.menuUrl}" </c:if> >
											<c:if test="${child.avatar != null && child.avatar != '' }"><i class="${child.avatar}"></i></c:if>
											<span class="nav-label">${child.menuName}</span>
											<c:if test="${ child.children.size() > 0 }"><span class="fa arrow"></span></c:if>
										</a>
										<c:if test="${ child.children.size() > 0 }">
											<ul class="nav nav-third-level">
												<c:forEach var="sub" items="${ child.children }">
													 <li>
														<a class="J_menuItem" href="${sub.menuUrl}">
															<c:if test="${sub.avatar != null && sub.avatar != '' }"><i class="${sub.avatar}"></i></c:if>
															<span class="nav-label">${sub.menuName}</span>
														</a>
													</li>
												</c:forEach>
											</ul>
										</c:if>
									</li>
								</c:forEach>
							</ul>
						</c:if>
                    </li>
					</c:forEach>
                </ul>
            </div>
        </nav>
        <!--左侧导航结束-->
        <!--右侧部分开始-->
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <div class="row border-bottom">
                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                    <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2 btn btn-info " href="javascript:;"><i class="fa fa-bars"></i> </a>
					<!--
                        <form role="search" class="navbar-form-custom" method="post" action="search_results.html">
                            <div class="form-group">
                                <input type="text" placeholder="请输入您需要查找的内容 …" class="form-control" name="top-search" id="top-search">
                            </div>
                        </form>
						-->
                    </div>
                    <ul class="nav navbar-top-links navbar-right">
						
                        <li class="dropdown">
                            <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                                <i class="fa fa-user"></i>${uinfo.loginName}
                            </a>
                            <ul class="dropdown-menu dropdown-alerts">
								
								<li>
                                    <a href="javascript:showDailog('userInfo');">
                                        <div>个人信息</div>
                                    </a>
                                </li>
								<li>
                                    <a href="http://www.ruisitech.com/suggest.html" target="_blank">
                                        <div>问题反馈</div>
                                    </a>
                                </li>
								<li>
                                    <a href="http://www.ruisibi.cn/book.htm" target="_blank">
                                        <div>使用手册</div>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:showDailog('chgPsd');">
                                        <div>修改密码</div>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:logout()">
                                        <div> 退出登录</div>
                                    </a>
                                </li>
                           
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="row J_mainContent" id="content-main">
                <iframe id="J_iframe" width="100%" height="100%" src="Welcome.action" frameborder="0" seamless></iframe>
            </div>
        </div>
        <!--右侧部分结束-->
    </div>
	
	<!-- 共用模态框 -->
	<div class="modal inmodal fade" id="modelDiv" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
			<form class="" id="form1" name="form1">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title">XXX</h4>
				</div>
				<div class="modal-body">
					
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
					<button type="submit" id="savepsdbtn" class="btn btn-success">保存</button>
				</div>
			</form>
			</div>
		</div>
	</div>
</body>
</html>
