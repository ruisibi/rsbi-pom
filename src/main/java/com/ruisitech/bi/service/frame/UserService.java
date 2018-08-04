package com.ruisitech.bi.service.frame;

import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.frame.User;
import com.ruisitech.bi.mapper.frame.UserMapper;

@Service
public class UserService {
	
	@Autowired
	private UserMapper mapper;
	
	public User getUserByStaffId(String staffId){
		return mapper.getUserByStaffId(staffId);
	}

	public User getUserByUserId(Integer userId){
		return mapper.getUserById(userId);
	}
	
	public void updateLogDateAndCnt(Integer userId){
		mapper.updateLogDateAndCnt(userId);
	}
	
	public void modPsd(User u){
		mapper.modPsd(u);
	}
	
	public String checkPsd(Integer userId){
		return mapper.checkPsd(userId);
	}
	
	public Map<String, Object> appUserinfo(Integer userId){
		return mapper.appUserinfo(userId);
	}
	
	public String shiroLogin(String userName, String password){
		UsernamePasswordToken token = new UsernamePasswordToken(userName, password, null);   
	    token.setRememberMe(false);
	    // shiro登陆验证  
	    try {  
	        SecurityUtils.getSubject().login(token);  
	    } catch (UnknownAccountException ex) {  
	        return "账号不存在或者密码错误！";  
	    } catch (IncorrectCredentialsException ex) {  
	        return "账号不存在或者密码错误！";  
	    } catch (AuthenticationException ex) {  
	        return ex.getMessage(); // 自定义报错信息  
	    } catch (Exception ex) {  
	        ex.printStackTrace();  
	        return "内部错误，请重试！";  
	    }
	    return "SUC";
	}
}
