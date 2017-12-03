package com.ruisitech.bi.service.frame;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.util.RSBIUtils;

public class ShiroDbRealm extends AuthorizingRealm {

	@Autowired
	private UserService userService;
	
	public static final String SESSION_USER_KEY = "session.user.key";

	/**
	 * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用,负责在应用程序中决定用户的访问控制的方法
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
		//User user = (User) SecurityUtils.getSubject().getSession().getAttribute(ShiroDbRealm.SESSION_USER_KEY);
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		//info.addRole(user.getRole().trim());
		return info;
	}

	/**
	 * 认证回调函数，登录信息和用户验证信息验证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws AuthenticationException {
		// 把token转换成User对象
		User userLogin = tokenToUser((UsernamePasswordToken) authcToken);
		// 验证用户是否可以登录
		User ui = userService.getUserByStaffId(userLogin.getStaffId());
		if (ui == null){
			return null; // 异常处理，找不到数据
		}
		if(!ui.getPassword().equals(RSBIUtils.getMD5(userLogin.getPassword().getBytes()))){
			return null; //密码错误
		}
		// 设置session
		Session session = SecurityUtils.getSubject().getSession();
		session.setAttribute(ShiroDbRealm.SESSION_USER_KEY, ui);
		// 当前 Realm 的 name
		String realmName = this.getName();
		// 登陆的主要信息: 可以是一个实体类的对象, 但该实体类的对象一定是根据 token 的 username 查询得到的.
		Object principal = authcToken.getPrincipal();
		return new SimpleAuthenticationInfo(principal, userLogin.getPassword(),
				realmName);
	}

	private User tokenToUser(UsernamePasswordToken authcToken) {
		User user = new User();
		user.setStaffId(authcToken.getUsername());
		user.setPassword(String.valueOf(authcToken.getPassword()));
		return user;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
