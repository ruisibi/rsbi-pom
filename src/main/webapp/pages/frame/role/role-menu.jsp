<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="false" buffer="none" %>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>
<div align="left" style="margin:0px 10px 10px 10px;">
 &nbsp; <a href="javascript:t_expandAll()">全部展开</a> &nbsp;&nbsp; <a href="javascript:t_collapseAll()">全部关闭</a>
 </div>
<ul id="menutree"></ul>
<script language="javascript">
	var $ = jQuery;
	$(function(){
		$('#menutree').tree({
			data: ${datas},
			dnd:false,
			animate:true,
			checkbox:true,
			lines:true,
			onBeforeLoad: function(node){
				if(!node || node == null){
					return false;
				}
			}
		});
		//var node = $('#menutree').tree("getRoot");
		//$('#menutree').tree("expand", node.target);
	});
	function t_expandAll(){
		$('#menutree').tree("expandAll");
	}
	function t_collapseAll(){
		$('#menutree').tree("collapseAll");
	}
	function getMenuIds(){
		var ids = getMenuId();
		//alert(ids);
		
		jQuery('#menuIds').val(ids);
		var pageObj = v${mvInfo.formId};
		document.forms[pageObj.formId].elements[pageObj.fromId].value = "frame.Role-roleMenuList";
		document.forms[pageObj.formId].elements[pageObj.midKey].value = "roleMenuAdd";
		document.forms[pageObj.formId].submit();
	}
	function getMenuId(){
		var ids = "";
		var nodes = $('#menutree').tree("getChecked",['checked','indeterminate']);
		for(i=0; nodes&&i<nodes.length; i++){
			if(nodes[i].id == "root"){
				continue;
			}
			ids = ids + nodes[i].id;
			if(i != nodes.length - 1){
				ids = ids + ",";
			}
		}
		return ids;
	}
</script>
