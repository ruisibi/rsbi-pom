<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${dim.type == 'day'}">
	<div style="margin:20px;">
	<p/>
	开始时间： <input type="text" class="inputform2 Wdate" size="20" value="${st}" id="dft2" name="dft2" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd', minDate:'2012-01-01', maxDate:'${maxdt}'})"> <p/>
	结束时间： <input type="text" class="inputform2 Wdate"  size="20" value="${end}" id="dft1" name="dft1" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd', minDate:'2012-01-01', maxDate:'${maxdt}'})">
	</div>
</c:if>

<c:if test="${dim.type == 'month'}">
	<div style="margin:20px;">
	<p/>
		开始月份：   
		<select name="dfm2" id="dfm2" class="inputform" >
			<c:forEach var="e" items="${datas}" >
             <option value="${e.id}" <c:if test="${e.id == st}">selected</c:if> >${e.name}</option>
             </c:forEach>
            </select>
		</select>
		<p/>
		结束月份：
		<select name="dfm1" id="dfm1" class="inputform" >
			<c:forEach var="e" items="${datas}">
             <option value="${e.id}" <c:if test="${e.id == end}">selected</c:if>>${e.name}</option>
             </c:forEach>
		</select>
	</div>
</c:if>