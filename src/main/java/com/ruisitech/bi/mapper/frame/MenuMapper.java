package com.ruisitech.bi.mapper.frame;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.ruisitech.bi.entity.frame.Menu;

public interface MenuMapper {
	
	List<Menu> listUserMenus(Integer userId);
	
	List<Map<String, Object>> listMenuByPid(@Param("pid") Integer pid);

}
