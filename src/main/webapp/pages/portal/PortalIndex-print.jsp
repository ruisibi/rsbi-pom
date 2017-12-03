<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>报表打印</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
    <script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
	<script language="javascript" src="../ext-res/js/ext-base.js"></script>
	<link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/animate.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
<link href="../resource/css/font-awesome.css?v=4.4.0" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
	<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="../ext-res/js/echarts.min.js"></script>
	<script language="javascript" src="../ext-res/js/sortabletable.js"></script>
    

   
</head>
<style>

</style>

<script language="javascript">
jQuery(function(){
	window.setTimeout(function(){
		print();
	}, 2000);
});
</script>

 <body class="gray-bg">
<div class="wrapper wrapper-content">
<div class="row">
 <div class="col-sm-12">
${str}
 </div>
</div>
</div>
</body>
</html>