package com.ruisitech.ext.service;

import java.io.InputStream;

import javax.servlet.ServletContext;

import com.ruisi.ext.engine.init.ExtXMLLoader;

/**
 * 对于报表、仪表盘、多维分析等工具生成的mv对象，直接从数据库中读取xml文件 
 * @author hq
 * @date 2015-5-14
 */
public class LoadXmlFromDB implements ExtXMLLoader {

	@Override
	public InputStream load(String mvId, String absolutePath, String xmlResource, ServletContext sctx) {
		/**
		try{
			DaoHelper dao = VDOPUtils.getDaoHelper(sctx);
			Map m = new HashMap();
			m.put("id", mvId);
			List ls = dao.getSqlMapClientTemplate().queryForList("web.report.getmv", m);
			if(ls == null || ls.size() == 0){
				throw new ExtConfigException("id = " + mvId + " 的文件不存在。");
			}
			Map data = (Map)ls.get(0);
			Object pctx = data.get("ctx");
			if(pctx instanceof String){
				String pageInfo = (String)pctx;
				return IOUtils.toInputStream(pageInfo, "utf-8");
			}else if(pctx instanceof oracle.sql.CLOB){
				oracle.sql.CLOB clob = (oracle.sql.CLOB)pctx;
				Reader is = clob.getCharacterStream();
				String pageInfo = IOUtils.toString(is);
				is.close();
				return IOUtils.toInputStream(pageInfo, "utf-8");
			}else if(pctx instanceof net.sourceforge.jtds.jdbc.ClobImpl){
				net.sourceforge.jtds.jdbc.ClobImpl clob = (net.sourceforge.jtds.jdbc.ClobImpl)pctx;
				Reader is = clob.getCharacterStream();
				String pageInfo = IOUtils.toString(is);
				is.close();
				return IOUtils.toInputStream(pageInfo, "utf-8");
			}else{
				throw new RuntimeException("类型未定义....");
			}
		}catch(Exception ex){
			throw new RuntimeException("系统错误....");
		}
		**/
		return null;
	}

}
