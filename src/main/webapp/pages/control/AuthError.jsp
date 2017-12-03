<%@ page language="java" pageEncoding="UTF-8" import="com.ruisi.ext.engine.ExtConstants"%>
<%@ page session="false" buffer="none" %>
<%@ taglib prefix="ext" uri="/WEB-INF/ext-runtime.tld" %>


  
  <style>
  <!--
  .p_err {
	  width:600px;
	  margin:0 auto;
	   border: 1px solid #BBBBBB;
    border-radius: 8px 8px 8px 8px;
    box-shadow: 5px 5px 5px #DDDDDD;
	background-color:#FFF;
	line-height:20px;
	font-size:12px;
  }
  .erinfo {
	  margin-left:25px;
	  color:#900;
  }
  .tis {
	  margin-top:40px;
	  margin-left:10px;
  }
  a {
	  color:#000;
	  text-decoration:underline;
  }
  -->
  </style>
 

  <br/><br/><br/>
  <div align="center" class="p_err">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td valign="top"><img style="margin-top:20px;" src="../resource/img/error.gif"></td>
    <td align="left">
    <div class="tis" style="line-height:25px;">
    我们非常抱歉，页面访问出现问题。 <br/>
    	给您带来的不便我们深感歉意，感谢您对我们的支持！ <br/>
        可能原因为：
           <div class="erinfo"> 
           License 不存在、过期或超出最大用户数。
           </div>
        请联系我们销售人员进行购买。
        </div>
        <div align="right">
        <img src="../resource/img/error-2.gif">
        </div>
    </td>
  </tr>
</table>

  </div>
