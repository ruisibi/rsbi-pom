package com.ruisitech.bi.util;

import java.security.NoSuchAlgorithmException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import net.sf.json.JSONObject;

import com.ruisi.ext.engine.view.context.ExtContext;
import com.ruisi.ext.runtime.tag.CalendarTag;
import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.service.frame.ShiroDbRealm;

public final class RSBIUtils {
	
	
	/**
	 * 给str加密md5。
	 * @return
	 */
	public static String getEncodedStr(String str){
		if(str==null)return null;
		return getMD5(str.getBytes());
	}

	/**
	 * 获取字符串MD5
	 * @param source
	 * @return
	 */
	public static String getMD5(byte[] source) {  
	    String s = null;  
	    char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',  
	            'a', 'b', 'c', 'd', 'e', 'f' };// 用来将字节转换成16进制表示的字符  
	    try {  
	        java.security.MessageDigest md = java.security.MessageDigest  
	                .getInstance("MD5");  
	        md.update(source);  
	        byte tmp[] = md.digest();// MD5 的计算结果是一个 128 位的长整数，  
	        // 用字节表示就是 16 个字节  
	        char str[] = new char[16 * 2];// 每个字节用 16 进制表示的话，使用两个字符， 所以表示成 16  
	        // 进制需要 32 个字符  
	        int k = 0;// 表示转换结果中对应的字符位置  
	        for (int i = 0; i < 16; i++) {// 从第一个字节开始，对 MD5 的每一个字节// 转换成 16  
	            // 进制字符的转换  
	            byte byte0 = tmp[i];// 取第 i 个字节  
	            str[k++] = hexDigits[byte0 >>> 4 & 0xf];// 取字节中高 4 位的数字转换,// >>>  
	            // 为逻辑右移，将符号位一起右移  
	            str[k++] = hexDigits[byte0 & 0xf];// 取字节中低 4 位的数字转换  

	        }  
	        s = new String(str);// 换后的结果转换为字符串  

	    } catch (NoSuchAlgorithmException e) {  
	        // TODO Auto-generated catch block  
	        e.printStackTrace();  
	    }  
	    return s;  
	}
	
	/**
	 * 获取ext-config中配置的变量。
	 * @return
	 */
	public static String getConstant(String name){
		return ExtContext.getInstance().getConstant(name);
	}
	public static String getUUIDStr(){
		return UUID.randomUUID().toString().replace("-","");
	}
	
	public static String dealStringParam(String vals){
		String[] vls = vals.split(",");
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<vls.length; i++){
			String v = vls[i];
			sb.append("'" + v + "'");
			if(i != vls.length - 1){
				sb.append(",");
			}
		}
		return sb.toString();
	}
	
	public static Map<String, String> getAllParams(HttpServletRequest req){
		Map<String, String> dt = new HashMap<String, String>();
		Enumeration<String> enu = req.getParameterNames();
		while(enu.hasMoreElements()){
			String key = (String)enu.nextElement();
			dt.put(key, req.getParameter(key));
		}
		return dt;
	}
	
	public static boolean isShowMenu(String name, HttpServletRequest req){
		JSONObject obj = (JSONObject)req.getAttribute("menuDisp");
		if(obj == null){
			return true;
		}
		Object r = obj.get(name);
		if(r == null){
			return true;
		}
		if(r instanceof Integer && (Integer)r == 0){
			return false;
		}else{
			return true;
		}
	}
	
	public static String getAppUserId(){
		String uid = "";
		return uid;
	}
	
	public static SqlSession getSqlSession(ServletContext sctx){
		SqlSession sqlSession=null;
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(sctx);
		SqlSessionFactory sqlSessionFactory = (SqlSessionFactory)ctx.getBean("sqlSessionFactory");
		sqlSession = sqlSessionFactory.openSession();
		return sqlSession;
	}
	
	public static void closeSqlSession(SqlSession sqlSession){
		 if(sqlSession!=null){
             sqlSession.close();
         }
	}
	
	public static User getLoginUserInfo(){
		Subject us = SecurityUtils.getSubject();
		User u = (User)us.getSession().getAttribute(ShiroDbRealm.SESSION_USER_KEY);
		return u;
	}
	
	/**
	 * 生成导出html
	 * @param body
	 * @param host
	 * @param type 表示使用的类型，是 olap表示多维分析的导出， report 表示报表的导出
	 * @return
	 */
	public static String htmlPage(String body, String host, String type){
		StringBuffer sb = new StringBuffer();
		
		sb.append("<!DOCTYPE html>");
		sb.append("<html lang=\"en\">");
		sb.append("<head>");
		sb.append("<title>睿思BI</title>");
		sb.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0\">");
		sb.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
		sb.append("<script type=\"text/javascript\" src=\""+host+"/ext-res/js/jquery.min.js\"></script>");
		sb.append("<script type=\"text/javascript\" src=\""+host+"/ext-res/js/ext-base.js\"></script>");
		sb.append("<script type=\"text/javascript\" src=\""+host+"/ext-res/js/echarts.min.js\"></script>");
		sb.append("<script type=\"text/javascript\" src=\""+host+"/ext-res/js/sortabletable.js\"></script>");
		sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+host+"/ext-res/css/bootstrap.min.css\" />");
		sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+host+"/resource/css/animate.css\" />");
		sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+host+"/resource/css/style.css\" />");
		sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+host+"/resource/css/font-awesome.css?v=4.4.0\" />");
		sb.append("</head>");
		sb.append("<body class=\"gray-bg\">");
	
		sb.append(body);
		
		sb.append("</body>");
		sb.append("</html>");
		
		return sb.toString();
	}
	
	public static boolean exist(String id, String[] ids){
		boolean exist = false;
		for(String tid : ids){
			if(tid.equals(id)){
				exist = true;
				break;
			}
		}
		return exist;
	}
	
	public static String getFestival(Object key, HttpServletRequest req){
		String df = (String)req.getAttribute("dateformat");
		String ret = CalendarTag.getFestival((String)key, df);
		return ret;
	}
}
