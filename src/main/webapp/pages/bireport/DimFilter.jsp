<%@ page language="java" contentType="text/html; charset=utf-8" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="easyui-tabs" id="dimfiltertab">
<c:choose>
     	<c:when test="${dimType == 'month'}">
		<div title="区间筛选"  data-options="">
			<div style="margin:20px;">
            <p/>
            开始月份：   
            <select name="dfm2" id="dfm2" class="inputform2">
            <option value=""></option>
               <c:forEach var="e" items="${datas}" >
				<option value="${e.id}" <c:if test="${e.id == st}">selected</c:if> >${e.name}</option>
				</c:forEach>
            </select>
            <p/>
            结束月份：
            <select name="dfm1" id="dfm1" class="inputform2">
            <option value=""></option>
                <c:forEach var="e" items="${datas}">
				 <option value="${e.id}" <c:if test="${e.id == end}">selected</c:if>>${e.name}</option>
				 </c:forEach>
            </select>
			</div>
		</div>
        </c:when>
        <c:when test="${dimType == 'day'}">
		<div title="区间筛选" style="">
			<div style="margin:20px;">
            <p/>
            开始日期： <input type="text" size="20" value="${st}" id="dft2" name="dft2" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="inputform2 Wdate"> <p/>
            结束日期： <input type="text" size="20" value="${end}" id="dft1" name="dft1" readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="inputform2 Wdate">
            </div>
		</div>
       </c:when>
	</c:choose>
	<div title="值筛选" <c:if test="${filtertype == 2}">data-options="selected:true"</c:if>>
			<div class="dfilter">
			<c:forEach var="e" items="${datas}" varStatus="statu">
			<%
			Map m = (Map)pageContext.findAttribute("e");
			String id = m.get("id") == null ? "" : m.get("id").toString();
			String ids = (String)request.getAttribute("vals");
			if(id != null && id.length() > 0){  //忽略 id 为 null 的
			%>	
			<div class="checkbox checkbox-info"> <input type="checkbox" id="d${statu.index}" name="dimval" value="${e.id}" <%if(com.ruisitech.bi.util.RSBIUtils.exist(id, ids.split(","))){%>checked="true"<%}%> > <label for="d${statu.index}"> ${e.name} <c:if test="${dimType == 'day'}"><!-- 追加日期的节日 -->
			<%=com.ruisitech.bi.util.RSBIUtils.getFestival(id, request)%>
			</c:if></label></div>
			<%
			}
			%>
			</c:forEach>
			</div>
		</div>
	</div>
     <c:if test="${dimType == 'frd'}">
		<div id="dimsearch_div" >
		<input id="dimsearch" style="width:290px;"></input>
		</div>
     </c:if>
<script>
$(function(){
	$('#dimsearch').searchbox({
		searcher:function(value,name){
			searchDims(value, '<%=request.getAttribute("vals")%>');
		},
		prompt:'请输入查询关键字.'
	});
	var filtertype = "${filtertype}";
	$('#dimfiltertab').tabs({
		border:false,
		plain:false,
		<c:choose>
		<c:when test="${dimType == 'frd'}">
		width: 290,
		height:250,
		</c:when>
		<c:when test="${dimType == 'month' or dimType == 'day'}">
		width: 290,
		height:230,
		</c:when>
		<c:when test="${dimType == 'year' or dimType == 'quarter'}">
		width: 290,
		height:230,
		</c:when>
		</c:choose>
		tabPosition: 'top',
		tools:[{
			text:"清除",
			handler:function(){
				$("#pdailog input[name='dimval']").each(function(){
					$(this).attr("checked", false);
				});
			}
		}]
	});
});
</script>