<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>数据建模工具</title>
<link rel="shortcut icon" type="image/x-icon" href="../resource/img/rs_favicon.ico">
   <link href="../ext-res/css/bootstrap.min.css" rel="stylesheet">
<link href="../resource/css/style.css" rel="stylesheet">
   <script type="text/javascript" src="../ext-res/js/jquery.min.js"></script>
	<script type="text/javascript" src="../ext-res/My97DatePicker/WdatePicker.js"></script>
	<script language="javascript" src="../resource/js/json.js"></script>
    <script language="javascript" src="../ext-res/js/ext-base.js"></script>
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/gray/easyui.css">
	<link rel="stylesheet" type="text/css" href="../resource/jquery-easyui-1.4.4/themes/icon.css">
	<script type="text/javascript" src="../resource/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="../resource/jquery-easyui-1.4.4/locale/easyui-lang-zh_CN.js"></script>
	<script language="javascript" src="../resource/js/model.js"></script>
	<script language="javascript" src="../resource/js/model-dsource.js"></script>
	<script language="javascript" src="../resource/js/model-dset.js"></script>
	<script language="javascript" src="../resource/js/model-cube.js"></script>
</head>

<script language="javascript">

$(function(){
	initModelTree();
});

$(document).ready(function(){  
    //禁止退格键 作用于Firefox、Opera   
    document.onkeypress = banBackSpace;  
    //禁止退格键 作用于IE、Chrome  
    document.onkeydown = banBackSpace;  
}); 

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外   
function banBackSpace(e){  
    //alert(event.keyCode)  
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源       
    var t = obj.type || obj.getAttribute('type');//获取事件源类型       
    //获取作为判断条件的事件类型   
    var vReadOnly = obj.readOnly;  
    var vDisabled = obj.disabled;  
    //处理undefined值情况   
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;  
    vDisabled = (vDisabled == undefined) ? true : vDisabled;  
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，    
    //并且readOnly属性为true或disabled属性为true的，则退格键失效    
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);  
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效      
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";  
    //判断     
    if (flag2 || flag1){   
        event.returnValue = false;//这里如果写 return false 无法实现效果   
		return false;
	}
}  
</script>
<style>
.msginfo{
	width:85%;
	height:90%;
	padding-left:40px;
	line-height:20px;
}
.msgerr{
	background-image:url(../resource/img/icon-error.gif);
	background-position:left center;
	background-repeat:no-repeat;
}
.msgsuc{
	background-image:url(../resource/img/icon-suc.gif);
	background-position:left center;
	background-repeat:no-repeat;
}
</style>


<body id="metalayout" class="easyui-layout">


	<div data-options="region:'west',split:true,title:'数据建模'"  style="width:210px;">
    	 <ul id="modeltree"></ul>
    </div>
    
	<div data-options="region:'center',title:''" id="optarea">
	</div>
    
    <div id="pdailog"></div>
    
</body>
</html>