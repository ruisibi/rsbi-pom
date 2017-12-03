<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>
<div align="left" style="margin:0px 10px 10px 10px;">
 &nbsp; <a href="javascript:t_expandAll()">全部展开</a> &nbsp;&nbsp; <a href="javascript:t_collapseAll()">全部关闭</a>
 </div>
<ul id="menutree"></ul>
<script language="javascript">
	var $ = jQuery;
	$(function(){
		$('#menutree').tree({
			data:${datas},
			dnd:false,
			lines:true,
			animate:true,
			checkbox:true,
			formatter:function(node){
				if(node.id == '0'){
					return node.text;
				}
				if(!node.attributes){
					return node.text
				}
				if(node.attributes.disabled == false){
					return node.text
				}
				return "<span style=\"color:#999;text-decoration:line-through\">" + node.text + "</span>"
			},
			onBeforeCheck:function(node, checked){
				if(!node.attributes){
					return false;
				}
				if(node.attributes && node.attributes.disabled){
					return false;
				}
			}
		});
	});
	function t_expandAll(){
		$('#menutree').tree("expandAll");
	}
	function t_collapseAll(){
		$('#menutree').tree("collapseAll");
	}
	function getMenuIds(){
		var ids = getMenuId();
		if(ids != ''){
			ids = ids.substring(0, ids.length - 1);
		}
		jQuery('#menuIds').val(ids);
		var pageObj = v${mvInfo.formId};
		document.forms[pageObj.formId].elements[pageObj.fromId].value = "frame.UserPermission-menuList";
		document.forms[pageObj.formId].elements[pageObj.midKey].value = "save";
		document.forms[pageObj.formId].submit();
	}
	function getMenuId(){
		var ids = "";
		var nodes = $('#menutree').tree("getChecked", ['checked','indeterminate']);
		for(i=0; nodes&&i<nodes.length; i++){
			if(nodes[i].id == "root"){
				continue;
			}
			if(!nodes[i].attributes || nodes[i].attributes.disabled == true){
				continue;
			}
			ids = ids + nodes[i].id + ",";
		}
		return ids;
	}
</script>
