package com.ruisitech.ext.service;

import com.ruisitech.bi.entity.frame.User;


/**
 * 数据权限控制接口
 * @author hq
 * @date 2017-1-18
 */
public interface DataControlInterface {
	
	/**
	 * 处理类,返回sql字符串, 字符串以 and 开始， 比如： and c='y' 
	 * master 表示主表名称
	 * @return
	 */
	public String process(User u, String tname);

}
