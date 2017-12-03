package com.ruisitech.bi.mapper.frame;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.frame.User;

public interface UserMapper {

	User getUserByStaffId(String staffId);
	
	User getUserById(@Param("userId") Integer userId);
	
	void updateuser(User user);
	
	void insertuser(User user);
	
	List<Map<String, Object>> listUserMenus(@Param("userId") Integer userId);
	
	void updateLogDateAndCnt(@Param("userId") Integer userId);
	
	String checkPsd(@Param("userId") Integer userId);
	
	void modPsd(User user);
	
	Map<String, Object> appUserinfo(@Param("userId") Integer userId);
}
