<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<table class="grid3" id="T_report54" cellpadding="0" cellspacing="0">
<thead>
<tr class="scrollColThead" style="background-color:#FFF">
	<th width="10%" colspan="1"  rowspan="1">选择</th>
	<th  class="40%" colspan="1"  rowspan="1">报表名称</th>
    <th  class="20%" colspan="1"  rowspan="1">创建人</th>
	<th  class="15%" colspan="1"  rowspan="1">创建时间</th>
	<th  class="15%" colspan="1"  rowspan="1">修改时间</th>
</tr>
	<c:forEach var="e" items="${ ls }">
<tr>
	<td class='kpiData1 grid3-td'><input type="radio" id="reportId" name="reportId" value="${e.pageId}" /></td>	
 <td class='kpiData1 grid3-td' align="left">${e.pageName}</td>	
  <td class='kpiData1 grid3-td' align="left">${e.crtuser}</td>	
 <td class='kpiData1 grid3-td' align="center"><fmt:formatDate value="${e.crtDate}" pattern="yyyy-MM-dd" /></td>
 <td class='kpiData1 grid3-td' align="center"><fmt:formatDate value="${e.updateDate}" pattern="yyyy-MM-dd" /></td>
</tr>
 </c:forEach>
</thead>
</table>