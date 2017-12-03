package com.ruisitech.bi.mapper.frame;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface RoleMapper {
	
	List<Map<String, Object>> listRoleMenus(@Param("roleId") Integer roleId);
}
