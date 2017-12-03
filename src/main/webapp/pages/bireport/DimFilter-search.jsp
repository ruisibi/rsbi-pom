<%@ page language="java" contentType="text/html; charset=utf-8" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
