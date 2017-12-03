<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="false" buffer="none" %>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>
<table style="width:560px;" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="368">
    <div align="left" style="margin:0px 5px 5px 5px;">
 &nbsp; <a href="javascript:t_expandAll()">全部展开</a> &nbsp;&nbsp; <a href="javascript:t_collapseAll()">全部关闭</a>
 </div>
    </td>
    <td width="118" align="center"> <input name="selectview" type="checkbox"  onclick="selectall('view',this)" value="y">(全选)</td>
  </tr>
</table>

<table id="reporttree" title="" class="easyui-treegrid" style="width:560px;height:500px;">
	<thead>
    	<tr>
        <th data-options="field:'name'" width="420">数据名称</th>
        <th data-options="field:'view',formatter:printAuth" width="120" align="center">使用权限</th>
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
		if(row.tp == 'data'){
			var chked = row.checked;
			return "<input type=\"checkbox\" "+(chked?"checked":"")+" value=\"y\" name=\""+this.field+"@"+(row.id - 100000)+"\">";
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
	function getDataIds(){
		var pageObj = v${mvInfo.formId};
		document.forms[pageObj.formId].elements[pageObj.fromId].value = "frame.Role-roleDataList";
		document.forms[pageObj.formId].elements[pageObj.midKey].value = "roleDataAdd";
		document.forms[pageObj.formId].submit();
	}
</script>
