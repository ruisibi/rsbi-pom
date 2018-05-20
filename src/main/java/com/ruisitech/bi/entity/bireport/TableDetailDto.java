package com.ruisitech.bi.entity.bireport;

import java.util.Map;

import com.ruisitech.bi.entity.common.PageParam;

/**
 * 明细提取dto
 * @author hq
 *
 */
public class TableDetailDto extends PageParam {
	
	private Map<String, String> pms;
	
	private String dsetId;
	private String dsid;

	public Map<String, String> getPms() {
		return pms;
	}

	public void setPms(Map<String, String> pms) {
		this.pms = pms;
	}

	public String getDsetId() {
		return dsetId;
	}

	public void setDsetId(String dsetId) {
		this.dsetId = dsetId;
	}

	public String getDsid() {
		return dsid;
	}

	public void setDsid(String dsid) {
		this.dsid = dsid;
	}


}
