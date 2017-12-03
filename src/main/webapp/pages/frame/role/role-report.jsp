<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="false" buffer="none" %>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>
<table width="736" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="368">
    <div align="left" style="margin:0px 5px 5px 5px;">
 &nbsp; <a href="javascript:t_expandAll()">全部展开</a> &nbsp;&nbsp; <a href="javascript:t_collapseAll()">全部关闭</a>
 </div>
    </td>
    <td width="118" align="center"> <input name="selectview" type="checkbox"  onclick="selectall('view',this)" value="y">(全选)</td>
    <td width="127" align="center">  <input name="selectexport" type="checkbox"  onclick="selectall('export',this)" value="y">(全选)</td>
    <td width="123" align="center"> <input name="selectprint" type="checkbox"  onclick="selectall('print',this)" value="y">(全选)</td>
  </tr>
</table>

<table id="reporttree" title="" class="easyui-treegrid" style="width:736px;height:500px;">
	<thead>
    	<tr>
        <th data-options="field:'name'" width="370">报表名称</th>
        <th data-options="field:'view',formatter:printAuth" width="120" align="center">查看权限</th>
        <th data-options="field:'export',formatter:printAuth" width="120" align="center">导出权限</th>
        <th data-options="field:'print',formatter:printAuth" width="120" align="center">打印权限</th>
        </tr>
    </thead>
</table>
<script language="javascript">
	var $ = jQuery;
	$(function(){
		$('#reporttree').treegrid({
			data: ${datas},
			idField: 'id',
			treeField: 'name',
			border:true
		});
		t_expandAll();
	});
	function t_expandAll(){
		$('#reporttree').treegrid("expandAll");
	}
	function t_collapseAll(){
		$('#reporttree').treegrid("collapseAll");
	}
	function printAuth(value,row,index){
		if(row.tp == 'report'){
			var chked = row[this.field];
			return "<input type=\"checkbox\" "+(chked==1?"checked":"")+" value=\"y\" name=\""+this.field+"@"+(row.id - 100000)+"\">";
		}
	}
	function selectall(itp, ts){
		var pageObj = v${mvInfo.formId};
		var ff = document.forms[pageObj.formId];
		for(i=0; i<ff.elements.length; i++){
			if(ff.elements[i].type == "checkbox"){
				var name = ff.elements[i].name;
				var ns = name.split("@");
				if(ns.length >=2 && ns[0] == itp){
					if(ts.checked){
						ff.elements[i].checked = true;
					}else{
						ff.elements[i].checked = false;
					}
				}
			}
		}
		
	}
	function getReportIds(){
		var pageObj = v${mvInfo.formId};
		document.forms[pageObj.formId].elements[pageObj.fromId].value = "frame.Role-roleReportList";
		document.forms[pageObj.formId].elements[pageObj.midKey].value = "roleReportAdd";
		document.forms[pageObj.formId].submit();
	}
</script>
