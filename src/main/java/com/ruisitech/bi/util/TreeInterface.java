package com.ruisitech.bi.util;

import java.util.Map;

public interface TreeInterface {
	
	public void processMap(Map<String, Object> m);
	
	public void processEnd(Map<String, Object> m, boolean hasChild);
}
