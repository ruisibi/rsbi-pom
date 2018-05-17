package com.ruisitech.bi.service.frame;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruisitech.bi.entity.frame.Menu;
import com.ruisitech.bi.mapper.frame.MenuMapper;
import com.ruisitech.bi.util.RSBIUtils;

@Service
public class MenuService {
	
	@Autowired
	private MenuMapper mapper;
	
	public List<Menu> listUserMenus(){
		Integer userId = RSBIUtils.getLoginUserInfo().getUserId();
		List<Menu> menuList = mapper.listUserMenus(userId);
		List<Menu> roots = this.findMenuChildren(0, menuList);
		for(int i=0; i<roots.size(); i++){
			Menu root = (Menu)roots.get(i);
			Integer id = root.getMenuId();
			List<Menu> subList = findMenuChildren(id, menuList);
			root.setChildren(subList);  //菜单只支持3级
			//查询第三级
			for(int j=0; j<subList.size(); j++){
				Menu sub = (Menu)subList.get(j);
				Integer subId = sub.getMenuId();
				sub.setChildren(findMenuChildren(subId, menuList));
			}
			
		}
		return roots;
	}
	
	private List<Menu> findMenuChildren(Integer pid, List<Menu> menuList){
		List<Menu> ret = new ArrayList<Menu>();
		for(int i=0; i<menuList.size(); i++){
			Menu m = (Menu)menuList.get(i);
			Integer value = m.getMenuPid();
			if(value != null && value.equals(pid) ){
				ret.add(m);
			}
		}
		return ret;
	}

}
