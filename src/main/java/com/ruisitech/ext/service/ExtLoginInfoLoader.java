package com.ruisitech.ext.service;

import java.util.HashMap;
import java.util.Map;

import com.ruisi.ext.engine.dao.DaoHelper;
import com.ruisi.ext.engine.service.loginuser.LoginUserInfoLoader;
import com.ruisi.ext.engine.wrapper.ExtRequest;

/**
 * ext 获取登录信息的方法
 * @author hq
 * @date Mar 25, 2010
 */
public class ExtLoginInfoLoader  implements LoginUserInfoLoader {

	public String getUserId() {
		return null;
	}

	public Map<String, Object> loadUserInfo(ExtRequest request, DaoHelper dao) {
		/**
		User user = (User)request.getSession().getAttribute(VdopConstant.USER_KEY_IN_SESSION);
		Map<String, Object> m = new HashMap();
		if(user == null){
			return m;
		}
		m.put("userId", user.getUserId());
		m.put("staffId", user.getStaffId());
		m.put("state", user.getState());
		
		return m;
		**/
		return new HashMap<String, Object>();
	}

}
