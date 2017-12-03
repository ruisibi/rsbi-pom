<%@ page language="java" contentType="text/html; charset=utf-8" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:choose>
     	<c:when test="${dimType == 'month'}">
			<div style="margin:20px;">
            <p/>
            开始月份：   
            <select name="dfm2" id="dfm2" class="inputform2">
			<c:forEach var="e" items="${datas}" >
             <option value="${e.id}" <c:if test="${e.id == st}">selected</c:if> >${e.name}</option>
             </c:forEach>
            </select>
            <p/>
            结束月份：
            <select name="dfm1" id="dfm1" class="inputform2">
             <c:forEach var="e" items="${datas}">
             <option value="${e.id}" <c:if test="${e.id == end}">selected</c:if>>${e.name}</option>
             </c:forEach>
            </select>
			</div>
        </c:when>
        <c:when test="${dimType == 'day'}">
	
			<div style="margin:20px;">
            <p/>
            开始日期： <input type="text" size="20" value="${st}" id="dft2" name="dft2" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="inputform2 Wdate"> <p/>
            结束日期： <input type="text" size="20" value="${end}" id="dft1" name="dft1" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="inputform2 Wdate">
            </div>
        </c:when>

<c:otherwise>
<div >
<input id="dimsearch" style="width:280px;"></input>
</div>
<div class="dfilter">
<c:forEach var="e" items="${datas}" varStatus="status">
<%
Map m = (Map)pageContext.findAttribute("e");
String id = m.get("id") == null ? "" : m.get("id").toString();
String ids = (String)request.getAttribute("vals");
if(id != null && id.length() > 0){  //忽略 id 为 null 的
%>	
<div class="checkbox checkbox-info"><input type="checkbox" id="d${status.index}" name="dimval" desc="${e.name}" value="${e.id}" <%if(com.ruisitech.bi.util.RSBIUtils.exist(id, ids.split(","))){%>checked="true"<%}%> ><label for="d${status.index}">${e.name}</label></div>
<%
}
%>
</c:forEach>
</div>
</c:otherwise>
</c:choose>
<script>
$(function(){
	$('#dimsearch').searchbox({
		searcher:function(value,name){
			searchDims2(value, ${dimId});
		},
		prompt:'请输入查询关键字.'
	});
	
});
</script>