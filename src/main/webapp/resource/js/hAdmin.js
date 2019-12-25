/*
 * Copyright 2018 本系统版权归成都睿思商智科技有限公司所有 
 * 用户不能删除系统源码上的版权信息, 使用许可证地址:
 * https://www.ruisitech.com/licenses/index.html
 */

//自定义js

//公共配置


$(document).ready(function () {

    // MetsiMenu
    $('#side-menu').metisMenu();
    
    //固定菜单栏
    $(function () {
        $('.sidebar-collapse').slimScroll({
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        });
    });
    // 侧边栏高度
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    }
    fix_height();

    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    //侧边栏滚动
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    /**
    // 打开右侧边栏
    $('.right-sidebar-toggle').click(function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

   


    // 菜单切换
    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });


    // 侧边栏高度
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    }
    fix_height();

    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    //侧边栏滚动
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    $('#side-menu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function () {
        if ($(window).width() < 769) {
            NavToggle();
        }
    });

    $('.nav-close').click(NavToggle);

    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }
    **/
    
    $('#side-menu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function () {
        if ($(window).width() < 769) {
            NavToggle();
        }
    });
    
    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }
    
    //右上角tab控制按钮
    var closeevent = null;
    $("#taboptbtn").hover(function(){
    	var p = $(this).offset();
    	var l = p.left;
    	var t = p.top;
    	$("#taboptdiv").css({top:t+40, left:l-70,minWidth:120}).show();
    }, function(){
    	closeevent = window.setTimeout(function(){
    		$("#taboptdiv").hide('fast');
    	}, 200);
    });
    
    $("#taboptdiv").hover(function(){
    	if(closeevent){
    		clearTimeout(closeevent);
    		closeevent = null;
    	}
    }, function(){
    	$(this).hide('fast');
    });
    
    var closeuinfoevent = null;
    $("#uinfobtn").hover(function(){
    	var p = $(this).offset();
    	var l = p.left;
    	var t = p.top;
    	$("#uinfodiv").css({top:t+26,left:l}).show();
    }, function(){
    	closeuinfoevent = window.setTimeout(function(){
    		$("#uinfodiv").hide('fast');
    	}, 200);
    });
    $("#uinfodiv").hover(function(){
    	if(closeuinfoevent){
    		clearTimeout(closeuinfoevent);
    		closeuinfoevent = null;
    	}
    }, function(){
    	$(this).hide('fast');
    });
    
    //点击后窗口关闭事件
    $("#uinfodiv li a").click(function(){
    	$("#uinfodiv").hide('fast');
    });
    $("#taboptdiv li a").click(function(){
    	$("#taboptdiv").hide('fast');
    });
});

/**
function showusermenu(ts){
	var p = $(ts).offset();
	var l = p.left;
	var t = p.top;
	$("#uinfodiv").css({top:t+25, left:l}).show();
}
**/
function swatch(ts){
	if($("body").hasClass("mini-navbar")){
		$('body').removeClass('mini-navbar');
		$(ts).removeClass("swatchBtn");
	}else{
		$('body').addClass('mini-navbar');
		$(ts).addClass("swatchBtn");
	}
	
	SmoothlyMenu();
}

$(window).bind("load resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('mini-navbar');
        $('.navbar-static-side').fadeIn();
    }
});

function NavToggle() {
	swatch();
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(300);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(300);
            }, 300);
    } else {
        $('#side-menu').removeAttr('style');
    }
}
function menuflash(tp){
	if("closeAll" == tp){
		$("ul.tabpanel_mover li").each(function(a, b){
			var id = $(this).attr("id");
			if(id != "t_home"){
				$(this).remove();
			}
		});
		$("#t_home").addClass("active");
		$(".tabpanel_content .html_content").each(function(a, b){
			var id = $(this).attr("id");
			if(id != "b_home"){
				$(this).remove();
			}
		});
		$("#b_home").show();
		$(".tabpanel_mover").css("marginLeft", "0px");
	}else if("close" == tp){
		var node = $(".tabpanel_mover li.active");
		var cid = node.attr("id");
		$("ul.tabpanel_mover li").each(function(a, b){
			var id = $(this).attr("id");
			if(id == "t_home" || id == cid) {
				
			}else{
				$(this).remove();
			}
		});
		$("#" + cid).addClass("active");
		cid = "b_" + cid.split("_")[1];
		$(".tabpanel_content .html_content").each(function(a, b){
			var id = $(this).attr("id");
			if(id == "b_home" || id == cid){
				
			}else{
				$(this).remove();
			}
		});
		$("#"+cid).show();
		$(".tabpanel_mover").css("marginLeft", "0px");
	}else if("ref" == tp){
		var node = $(".tabpanel_mover li.active");
		var url = node.attr("u");
		var cid = node.attr("id");
		cid = "b_" + cid.split("_")[1];
		if(url){
			$("#"+cid+" iframe").attr("src", url);
		}
	}
}
function menuOper(mid, url){
	$(".tabpanel_mover li").removeClass("active");
	$(".tabpanel_mover #t_"+mid).addClass("active");
	$(".tabpanel_content .html_content").hide();
	$(".tabpanel_content #b_"+mid).show();
	if(url){
		$("#b_"+mid+" iframe").attr("src", url);
	}
}
function menuOpen(url, txt, mid, refresh){
	var url = url;
    var n = txt;
    var id = mid;
     //菜单窗口是否打开
     if($("#t_"+id).length > 0){  //已打开，切换tab
    	 menuOper(id, refresh?url:null);
     }else { //新建tab
     	/**
     	if($(".tabpanel_mover li").length >= 10){
     		msginfo("只能打开10个选项卡。");
     		return false;
     	}
     	**/
	        $(".tabpanel_mover li").removeClass("active");
	        var s = "<li id=\"t_"+id+"\" class=\"active\" u='"+url+"'><div class=\"title\">"+n+"</div><div class=\"closer fa fa-close\"></div></li>";
	        $(".tabpanel_tab_content .tabpanel_mover").append(s);
	        //注册关闭事件
	        $("#t_"+id+" .closer").click(function(){
	        	var nextId = $("#t_"+id).prev().attr("id").split("_")[1];
	        	$("#t_"+id).remove();
	        	$("#b_"+id).remove();
	        	menuOper(nextId);
	        });
	        
	        s = "<div class=\"html_content\" id=\"b_"+id+"\"><iframe width=\"100%\" height=\"100%\" src=\""+url+"\" frameborder=\"0\" seamless></iframe></div>";
	        $(".tabpanel_content").append(s);
	        
	        $(".tabpanel_content .html_content").hide();
	        $(".tabpanel_content .html_content:last").show();
     }
}
function gotab(pos){
	var o = $(".tabpanel_mover");
	var left = Number(o.css("marginLeft").replace("px", ""));
	if(pos =='left'){
		left = left - 110;
	}else{
		left = left + 110;
	}
	if(left > 0){
		left = 0;
	}
	var size = $(".tabpanel_mover li").length;
	if(Math.abs(left/110) < size){
		o.css("marginLeft", left+"px");
	}
}
function fullScreem(){
	//$(".navbar-static-side").css("display", "none");
	//$("#page-wrapper").css("margin", "0px");
	$('body').addClass("screem-navbar");
	$(".tabpanel_tab_content").css("display", "none");
	$(".J_mainContent2").css("height", "100%");
	window.setTimeout(function(){
		var element = document.documentElement;
	    if (element.requestFullscreen) {
	        element.requestFullscreen();
	    } else if (element.msRequestFullscreen) {
	        element.msRequestFullscreen();
	    } else if (element.mozRequestFullScreen) {
	        element.mozRequestFullScreen();
	    } else if (element.webkitRequestFullscreen) {
	        element.webkitRequestFullscreen();
	    }
	}, 1000);
	
}
$(function(){
	$(".tabpanel_mover").on("click", "li", function(){
		var id = $(this).attr("id").split("_")[1];
		menuOper(id);
	});
	
    //菜单点击
    $(".J_menuItem").on('click',function(){
    	var url = $(this).attr('href');
        var n = $(this).find(".nav-label").text();
        var id = $(this).attr("mid");
        menuOpen(url, n, id, false);
        return false;
    });
    
    var exitFull = function(){
    	//$(".navbar-static-side").css("display", "block");
    	//$("#page-wrapper").css("margin", "0 0 0 220px");
    	$('body').removeClass("screem-navbar");
    	$(".tabpanel_tab_content").css("display", "block");
    	$(".J_mainContent2").css("height", "calc(100% - 50px)");
    }
    
    //esc退出全屏
    $(document).keyup(function(event){
    	 switch(event.keyCode) {
    	 case 27:
    		 exitFull();
    		 break;
    	 case 96:
    		 break;
    	 }
    });
});