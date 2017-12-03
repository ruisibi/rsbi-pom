package com.ruisitech.bi.web.frame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.service.frame.UserService;
import com.ruisitech.bi.util.BaseController;
import com.ruisitech.bi.util.RSBIUtils;

@Controller
@RequestMapping(value = "/frame")
public class UserController extends BaseController {
	
	@Autowired
	private UserService userService;

	@RequestMapping(value="/User.action")
	public @ResponseBody Object getUserInfo(){
		Integer userId = RSBIUtils.getLoginUserInfo().getUserId();
		User u = userService.getUserByUserId(userId);
		return u;
	};
	
	@RequestMapping(value="/chgPsd.action", method = RequestMethod.POST)
	public @ResponseBody Object chgPsd(String password1, String password2, String password3){
		Integer userId = RSBIUtils.getLoginUserInfo().getUserId();
		String userPassword = userService.checkPsd(userId);
		if(!userPassword.equals(RSBIUtils.getEncodedStr(password1)))
		{
			return this.buildError("原始密码错误");
		}
		else
		{
			User u = new User();
			u.setUserId(userId);
			u.setPassword(RSBIUtils.getEncodedStr(password2));
			userService.modPsd(u);
			return this.buildSucces();
		}
	}
}
