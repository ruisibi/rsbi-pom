function postpage(pageObj, servid, method, fromMV, subm, check, confirmState, exportDG, issubmit){
	var obj = document.forms[pageObj.formId];
	obj.elements[pageObj.sidKey].value = servid;
	obj.elements[pageObj.midKey].value = method;
	obj.elements[pageObj.fromId].value = fromMV;
	obj.elements[pageObj.exportKey].value = exportDG;
	obj.method = subm;
	if(!check){
		obj.onsubmit = null;
	}
	pageObj.needConfirm = confirmState;
	
	if(issubmit){
		//如果需要check 判断 checkRequire 是否返回 true
		if(check && checkRequire(obj)){
			obj.submit();
		}
		//如果不需要check, 直接提交
		if(!check){
			obj.submit();
		}
	}
}

//展示遮罩
function showMark(state){
	if(jQuery('#markDiv').size() == 0){
		var newMask=document.createElement("div"); 
		newMask.id="markDiv"; 
		newMask.style.position="absolute"; 
		newMask.style.zIndex="900"; 
		_scrollWidth=Math.max(document.body.scrollWidth,document.documentElement.scrollWidth); 
		_scrollHeight=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight); 
		// _scrollHeight = Math.max(document.body.offsetHeight,document.documentElement.scrollHeight); 
		newMask.style.width=_scrollWidth+"px"; 
		newMask.style.height=_scrollHeight+"px"; 
		newMask.style.top="0px"; 
		newMask.style.left="0px"; 
		newMask.style.background="#33393C"; 
		//newMask.style.background = "#FFFFFF"; 
		newMask.style.filter="alpha(opacity=40)"; 
		newMask.style.opacity="0.40"; 
		newMask.style.display='none'; 
		document.body.appendChild(newMask); 
	}
	if(state == true){
	 jQuery('#markDiv').css("display","");
	}else{
		jQuery('#markDiv').css("display", "none");
	}
}

//检查checkBox是否勾选
function checkRadio(ff, targetId, tp){
	if (tp == 'radio') {
		var obj = ff.elements[targetId];
		if (obj == null || obj == undefined) {
			return false;
		}
		if (obj.length == undefined) {
			return obj.checked;
		}
		var isExist = false;
		for (i = 0; i < obj.length; i++) {
			if (obj[i].checked == true) {
				isExist = true;
				break;
			}
		}
		return isExist;
	}else{
		var obj = ff.elements[targetId];
		if (obj == null || obj == undefined) {
			return false;
		}
		if(obj.value == ''){
			return false;
		}
		return true;
	}
}

function ext_selectTree(){
	
}

//改变box close图标
function chgCloseIcon(ts, target){
	var st = ts.getAttribute("state");
	if(st == 2){
		ts.src = "../ext-res/image/plus.gif";
		ts.setAttribute("state", 1);
		$(target).show();
	}else{
		ts.src = "../ext-res/image/minus.gif";
		ts.setAttribute("state", 2);
		$(target).hide();
	}
}

//全选
function selectAll(ts, targId){
	var o = ts.form.elements[targId];
	if(o.length == undefined){
		o.checked = ts.checked;
		return;
	}
	for(i=0; i<o.length; i++){
		o[i].checked = ts.checked;
	}
}
	

//分页提交
function gotopage(vf,str,cp,fromId){
	var ff = document.forms[vf.formId];
	ff.elements[cp].value=str;
	ff.elements[vf.sidKey].value = vf.sidValue;
	ff.elements[vf.midKey].value = vf.midValue;
	ff.elements[vf.fromId].value = fromId;
	ff.method = "post";
	ff.submit();
}

//返回日历格式mm/dd/yyyy
function convertDate(inp, type){
	var str1,str2,str3;
	if(inp != ''){
		str1 = inp.substring(0,4);
		str2 = inp.substring(4,6);
		str3 = inp.substring(6,8);
	}else{
		var d = new Date();
		str1 = d.getFullYear();
		str2 = d.getMonth() + 1;
		str3 = d.getDate();
	}
	if(type == 1){
		return str2 +'/'+str1;
	}else{
		return str2 + '/' + str3 + '/' + str1;
	}
}

//级联获取select
function cascadeParam(url, targ, sel, params){
	jQuery('#'+targ).bind('change',function(event){
		jQuery.ajax({'url':url + "&cascade="+sel, type:'post',dataType:'json', data:params+jQuery('#' + targ).val(), success:function(opts){
			document.getElementById(sel).options.length = 0;
			for(i=0; i<opts.length; i++){
				var vl = opts[i].value ?  opts[i].value : opts[i].VALUE;
				if(vl == null){
					vl = "";
				}
				var varItem = new Option(opts[i].text ? opts[i].text : opts[i].TEXT, vl);
				document.getElementById(sel).options.add(varItem);
			}
		}});
	});
}

//table ajax 分页
function gotobyajax(pinfo,dgId, pageSize, currPage, params, fromMVId){
	var url =  "";
	if(pinfo == null){
		url =  "../control/extControl?serviceid=ext.sys.fenye.ajax&currPage="+currPage+"&id="+dgId+"&pageSize="+pageSize+"&t_from_id="+fromMVId;
	}else{
		url = pinfo.resPath + "control/" + pinfo.extAction+"?"+pinfo.sidKey+"=ext.sys.fenye.ajax&currPage="+currPage+"&id="+dgId+"&pageSize="+pageSize+"&"+pinfo.fromId+"="+fromMVId;
	}
	__showLoading();
	jQuery.ajax({
	   type: "POST",
	   url: url,
	   dataType:"html",
	   data: params,
	   success: function(resp){
	   		__hideLoading();
		   jQuery("#" + dgId).html(resp);
	   },
	   error:function(resp){
	   		__hideLoading();
		   jQuery.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
}

function keygoto(evt, pinfo, dgId, pageSize, currPage, params, fromMVId){
	evt = window.event || evt;
    if(evt.keyCode==13){//如果取到的键值是回车
         gotobyajax(pinfo, dgId, pageSize, currPage, params, fromMVId);       
     }

}

function keygoto2(evt, vf,str,cp,fromId){
	evt = window.event || evt;
    if(evt.keyCode==13){//如果取到的键值是回车
    	var ff = document.forms[vf.formId];
		ff.elements[cp].value=str;
		ff.elements[vf.sidKey].value = vf.sidValue;
		ff.elements[vf.midKey].value = vf.midValue;
		ff.elements[vf.fromId].value = fromId;
		ff.method = "post";
		//ff.submit();
     }
}
//交叉表的body进行滚动时，header也进行滚动
function tableBodyscroll(id){
	$("#"+id+" .lock-dg-body").scroll(function(){
		var left = $(this).scrollLeft();
		$("#"+id+" .lock-dg-header").css("margin-left", "-"+left+"px");
	});
}

function linkbycol(url, targetHtml){
	if(jQuery("#"+targetHtml).size() == 0){
		alert('配置的 htmlTarget ：' + targetHtml + '未在页面定义.');
		return;
	}
	jQuery("#"+targetHtml).load(url);
}


//table的head排序操作
function extColOrder(dgId, order, fromMVId, params){
	if(jQuery('#ext_order_state').val() == 'a'){
		jQuery('#ext_order_state').val('d');
	}else{
		jQuery('#ext_order_state').val('a');
	}
	var url = extAction+"?"+sidKey+"=ext.sys.fenye.ajax&ext_col_order="+order+"&id="+dgId+"&ext_order_state="+jQuery('#ext_order_state').val()+"&"+fromId+"="+fromMVId;
	jQuery.post(url, params, function(resp){
		jQuery("#"+dgId).html(resp);
	}, "html");
}
/**
提交到多个组件
**/
function post2Comps(ids, urls, paramNames){
	for(k=0; k<ids.length; k++){
		var t = ids[k];
		var u = urls[k];
		post2Comp(t, u, null, paramNames);
	}
}

/**
 * 提交到一个组件
 * @param mvId
 * @param params
 * @return
 */
function post2Comp(targetId, url, ff, paramNames){
	var parms = '';
	for(var i=0; i<paramNames.length; i++){
		var p = paramNames[i];
		
		//采用jQuery方式取值
		if(jQuery('#'+p).attr('type') == 'radio'){
			var val = jQuery('input:radio[name='+p+']:checked').val();
			parms = parms +  p  + "=" + (val?val:"") + "&";
		}else if(jQuery('#'+p).attr('type') == 'checkbox'){
			jQuery("input[name='"+p+"']:checkbox:checked").each(function(){ 
				parms = parms +  p  + "=" + jQuery(this).val() + "&";
			});
		}else{
			var val = jQuery('#'+p).val();
			parms = parms +  p  + "=" + val + "&";
		}
		
		/**
		var rets = document.forms[ff.name].elements[p];
		if(rets.length == 1){
			parms = parms +  p  + "=" + rets.value+"&";
		}else{
			//是checkbox或radio
			for(var j=0; j<rets.length; j++){
				if(rets[j].checked){
					parms = parms +  p  + "=" + rets[j].value+"&";
				}
			}
		}
		**/
	}
	$("#"+targetId).html("<div align='center'><img src='../ext-res/image/large-loading.gif'></div>");
	jQuery.post(url, parms, function(resp){
		jQuery("#"+targetId).html(resp);
	}, "html");
}

/***
 * 提交到一个MV
 */
function post2MV(config){
	for(i=0; i<config.length; i++){
		__post2MV(config[i].target, config[i].url, config[i].paramNames, config[i].fname);
	}
}

function __post2MV(targetId, url, paramNames, fname){
	var parms = "";
	for(var i=0; i<paramNames.length; i++){
		var tp = paramNames[i].type;
		var p = paramNames[i].name;
		
		//采用jQuery方式取值
		if(tp == 'radio'){
			var val = jQuery('input:radio[name='+p+']:checked').val();
			if(!val){
				val = "";
			}
			parms = parms +  p  + "=" + val + "&";
		}else if(tp == 'checkBox'){
			$("input[name=\""+p+"\"]:checked").each(function(a, b){
				var v = $(b).val();
				parms = parms + p + "=" + v + "&";
			});
		}else{
			var val = null;
			if(paramNames[i].type == 'mselect'){ //多选需要特殊处理
				val = jQuery('#'+p).combobox("getValues");
				jQuery('#'+p).combobox("destroy");
			}else if(paramNames[i].type == 'tree'){  //tree类型参数特殊处理
				val = jQuery('#'+p).combobox("getValue");
				//选择完后需要destory组件, 防止以前的HTML在页面堆积
				jQuery('#'+p).combobox("destroy");
			}else{
				val = jQuery('#'+p).val();
			}
			parms = parms +  p  + "=" + val + "&";
		}
		
		/**
		var rets = document.forms[fname].elements[p];
		var tp = jQuery(rets).attr('type');
		if(tp != 'radio' && tp != 'checkbox'){
			parms = parms +  p  + "=" + rets.value+"&";
		}else{
			//是checkbox或radio
			for(var j=0; j<rets.length; j++){
				if(rets[j].checked){
					parms = parms +  p  + "=" + rets[j].value+"&";
				}
			}
		}
		**/
		
	}
	jQuery(document.getElementById(targetId)).html("数据重新加载中...");
	jQuery.ajax({
	   type: "POST",
	   url: url,
	   dataType:"html",
	   data: parms,
	   success: function(resp){
		   jQuery(document.getElementById(targetId)).html(resp);
	   },
	   error:function(resp){
		   jQuery.messager.alert('出错了','系统出错，请联系管理员。','error');
	   }
	});
}

/**
 * 通过点击表格更新组件
 * @return
 */
function tableUpdateComp(config){
	var obj = jQuery('#' + config.id + ' .row-link');
	
	obj.live('click', function(e){
		var tz = jQuery(this);
		var a = tz.find('a.lka');
		if(a.size() > 0){
			
			jQuery('#' + config.id + " .row-link").removeClass('link-selected');
			tz.addClass('link-selected');
			
			for(i=0; i<config.url.length; i++){
				u = config.url[i].url;
				t = config.url[i].target;
				tp = config.url[i].type;
				var pp = {};
				var p = a.attr('parms' + i).split("&");
				for(j=0; j<p.length; j++){
					var tmp = p[j].split("=");
					var k = tmp[0];
					var v = tmp[1];
					pp[k] = v;
				}
				jQuery("#"+(tp=="chart"?"p":"")+t).load(u, pp);
				
			}
		}

	});
}

function tableCell2MV(config){
	var obj = jQuery('#' + config.id + ' .cell-link');
	obj.live('click', function(e){
			var tz = jQuery(this);
			location.href = config.url  + '&'+  tz.attr('parms');
	});
}

function tableCellUpdateComp(config){
	var obj = jQuery('#' + config.id + ' .cell-link');
	obj.live('click', function(e){
		var tz = jQuery(this);
		for(i=0; i<config.url.length; i++){
			url = config.url[i].url;
			t = config.url[i].target;
			tp = config.url[i].type;
			__showLoading();
			jQuery.post(url,  tz.attr('parms'), function(resp){
				__hideLoading();
				jQuery("#"+(tp=="chart"?"p":"")+t).html(resp);
			}, "html");
		}
	});
}

function changeTabId(tabId, value){
	jQuery('#' + tabId).val(value);
}

/**
 * 可以点击的radio
 * @return
 */
function radiolink(url, target, divId){
	var pms = target+"="+jQuery("input[name='"+target+"']:checked").val();
	jQuery.post(url, pms, function(resp){
		jQuery("#"+divId).html(resp);
	}, "html");
}

function goto2(ff,str,count){
	if(isNaN(str)){
		str = 1;
	}
	if(str == ''){
		str = 1;
	}
	if(str>count){
		str = count;
	}
	str = str -1;
	gotopage(ff,str);
}
/**
图形钻取（地图）
**/
function chart_Drill(x, xval, url, pms, compId){
	pms = pms + x+"="+xval;
	var pp = {};
	var p = pms.split("&");
	for(i=0; i<p.length; i++){
		var tmp = p[i].split("=");
		var k = tmp[0];
		var v = tmp[1];
		pp[k] = v;
	}
	//设置钻取的字段，用该字段来区分当前是钻取还是未钻取
	pp.drillDim = x;
	var u = url;
	var d = compId;
	__showLoading();
	jQuery("#p"+d).load(u, pp, function(){
		__hideLoading();
	});
}
/**
图形上卷
**/
function chart_drillUp(url, pms, compId){
	__showLoading();
	jQuery("#p"+compId).load(url, pms, function(){
		__hideLoading();
	});
}
/**
* 图形,表格连接
**/
function chartComp_Link(x, xval, url, pms, compId, tps){
	if(url == null || url == 'null'){
		alert("未定义接收组件。");
		return;
	}
	pms = pms + x+"="+xval;
	var pp = {};
	var p = pms.split("&");
	for(i=0; i<p.length; i++){
		var tmp = p[i].split("=");
		var k = tmp[0];
		var v = tmp[1];
		pp[k] = v;
	}
	for(i=0; i<url.length; i++){
		var u = url[i];
		var d = compId[i];
		__showLoading();
		jQuery("#"+(tps[i]=="chart"?"p":"")+d).load(u, pp, function(){
			__hideLoading();
		});
	}
}
/**
 * 维度钻取
 * @return
 */
function fieldDirll(config){
	var fields = jQuery('#' + config.table + " td[drillid='"+config.pid+"'] .crossDirll").bind('click', function(e){
		var thiz = jQuery(this);
		if(thiz.attr('isopen') == 0){
			var tabTr = thiz.parent().css('font-weight', 'bold').parents("tr.tr-row1,tr.tr-row2");
			//获取内容
			__showLoading();
			var parms = thiz.attr('parms');
			if(config.text != undefined && config.text != ""){
				parms = parms + '&text=' + jQuery.fn.toJSON(config.text);
			}
			
			jQuery.ajax({url: config.url, data: parms, type:'POST', dataType:'html', success: function(resp){
				jQuery(resp).insertAfter(tabTr);
				__hideLoading();
			}});
			thiz.addClass('crossDirll-open');
			thiz.attr('isopen', '1');
		}else{
			__nodeRemove(thiz.parent().css('font-weight', 'normal'), config);
			thiz.removeClass('crossDirll-open');
			thiz.attr('isopen', '0');
		}
	});
}

function __nodeRemove(target, config){
	var pid = target.children('.crossDirll').attr('pid');
	jQuery('#' + config.table+' td[drillid="'+pid+'"]').each(function(a, b){
			__nodeRemove(jQuery(b), config);
			jQuery(b).parent().remove();
	});
}

function __showLoading(){
	var sload = jQuery('#ext2_Loading');
	if(sload.size() == 0){
		sload = jQuery('<div id="ext2_Loading" class="ext-el-mask-msg x-mask-loading"><div>请稍后...</div></div>').appendTo('body');
	}
	var doc = jQuery(document);
	var win = jQuery(window);
	var t = doc.scrollTop() + win.height()/2 - 50;
	var l = doc.scrollLeft() + win.width()/2 - 50;
	sload.css({'top':t, 'left':l});
		
	sload.show();
}

function __hideLoading(){
	jQuery('#ext2_Loading').hide();
}

/**
 * 列上加链接
 * 连接面板在页面中只存在一个，id为compLinkPanel
 * @param url
 * @return
 */
function rowLinkFireTR(config){
	jQuery('#' + config.id + ' .row-link a.lka').bind('click', function(e){
		var tz = jQuery(this);
		if(config.type == 'open'){
			var panel = null;
			if(Ext.get('compLinkPanel') == null){
		    	//创建面板
				panel = new Ext.Window({
		    		id: 'compLinkPanel',
		    		title: '指标分析',
		    		renderTo: document.body,
		    		layout: {type: 'absolute'},
		    		width: 590,
		    		height: 410,
		    		draggable: true,
		    		resizable: false,
		    		closeAction : 'hide',
		    		shadow: false,
		    		autoScroll : true,
		    		html: "<div id='compLinkPanelctx'></div>"
		    	});
		    	panel.render();
		    }else{
		    	panel = Ext.getCmp('compLinkPanel');
		    }
		    panel.show();
		}else if(config.type == 'new'){
			location.href = config.url;
			return;
		}else{
			var tabTr = tz.parent().parent();
			jQuery('#compLinkPanelctxTr').remove();
			jQuery("<tr class='row-link' id='compLinkPanelctxTr'><td colspan='"+config.colspan+"'><div class='linkPanelClose' id='linkPanelClose'></div><div id='compLinkPanelctx'></div></td></tr>").insertAfter(tabTr);
			jQuery('#linkPanelClose').bind('click', function(){
				jQuery('#compLinkPanelctxTr').remove();
			});
		}
		jQuery("#compLinkPanelctx").load(config.url, tz.attr('parms'));
	});
}
function formatCol(val, row){
	var fmt = crtfmt[this.field];
	var ret = formatNumber(val, fmt);
	if(this.finfmt && this.finfmt==true){
		if(val > 0){
			ret = "<font class=\"kpi_up\">"+ret+"</font>";
		}else if(val < 0){
			ret = "<font class=\"kpi_down\">"+ret+"</font>";
		}
	}
	return ret;
}
/**
配置气泡大小
转换到 10 到 50
**/
function bubbleSize(maxval, minval, val, targetMax){
	if(maxval == minval){
		return 40;
	}
	if(!targetMax){
		targetMax = 50;
	}
	var r = (targetMax-10)/(maxval-minval)*(val-minval)+10;
	return r;
}
function formatNumber(num,pattern, shortname){
 if(!pattern || pattern.length == 0){
 	return num;
 }
 var shortdw;
   if(shortname && num > 1000000){
	 num = num / 1000000;
	 shortdw = "百万";
  }else if(shortname && num > 10000){
	  num = num / 10000;
	  shortdw = "万";
  }else if(shortname && num > 1000){
	  num = num / 1000;
	  shortdw = "千";
  }
  if(pattern.indexOf("%") > 0){
	  num = num * 100;
  }
  var fmtarr = pattern?pattern.split('.'):[''];
  var retstr='';
  
  //先对数据做四舍五入
  var xsw = 0;
  if(fmtarr.length > 1){
	  xsw = fmtarr[1].length;
  }
  var bl = 1;
  for(i=0; i<xsw; i++){
	  bl = bl * 10;
  }
  num = num * bl;
  num = Math.round(num);
  num = num / bl;
  
  var strarr = num?num.toString().split('.'):['0'];
 
  // 整数部分
  var str = strarr[0];
  var fmt = fmtarr[0];
  var i = str.length-1;  
  var comma = false;
  for(var f=fmt.length-1;f>=0;f--){
    switch(fmt.substr(f,1)){
      case '#':
        if(i>=0 ) retstr = str.substr(i--,1) + retstr;
        break;
      case '0':
        if(i>=0) retstr = str.substr(i--,1) + retstr;
        else retstr = '0' + retstr;
        break;
      case ',':
        comma = true;
        retstr=','+retstr;
        break;
    }
  }
  if(i>=0){
    if(comma){
      var l = str.length;
      for(;i>=0;i--){
        retstr = str.substr(i,1) + retstr;
        if(i>0 && ((l-i)%3)==0) retstr = ',' + retstr; 
      }
    }
    else retstr = str.substr(0,i+1) + retstr;
  }

  retstr = retstr+'.';
  // 处理小数部分
  str=strarr.length>1?strarr[1]:'';
  fmt=fmtarr.length>1?fmtarr[1]:'';
  i=0;
  for(var f=0;f<fmt.length;f++){
    switch(fmt.substr(f,1)){
      case '#':
        if(i<str.length) retstr+=str.substr(i++,1);
        break;
      case '0':
        if(i<str.length) retstr+= str.substr(i++,1);
        else retstr+='0';
        break;
    }
  }

  var r = retstr.replace(/^,+/,'').replace(/\.$/,''); 
  if(pattern.indexOf("%") > 0){
	  r = r + "%";
  } 
  if(shortdw){
	  r = r + shortdw;
  }
  return r;
}
function getCalendar(divId, dt, minval, maxval){
	var url = '../control/Calendar.action';
	$("#"+divId).load(url, {dt:dt, "max":maxval, "min":minval});
}
/**
日历提交
**/
function calendarPost(event, ts,value, cb){
	$("table.calen td").removeClass("curdt");
	$(ts).parent().addClass("curdt");
	if(cb){
		cb(event, ts, value);
	}
}
function selectyearmonth(){
	var isopen = $("#selyearmonth").attr("isopen");
	if(isopen && "y" == isopen){
		$("#selyearmonth").css("display","none").attr("isopen", "n");
	}else{
		$("#selyearmonth").css("display","block").attr("isopen", "y");
	}
}