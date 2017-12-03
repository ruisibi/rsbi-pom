<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
   
<s:iterator var="e" value="#request.datas" status="statu">
<%
String id = pageContext.findAttribute("id").toString();
String ids = (String)request.getAttribute("vals");
%>	
<span class="radioSpan" style="<s:if test="#request.talign=='horizontal'">display:inline;</s:if>"><input type="${selType}" id="d${id}" name="dimval" desc="${name}" value="${id}"> <label for="d${id}">${name}</label></span>
</s:iterator>
