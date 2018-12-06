package com.ruisitech.bi.entity.bireport;

import java.text.ParseException;

import com.ruisitech.bi.entity.common.BaseEntity;

public class QueryMonthDto extends BaseEntity {

	private String startMonth;
	private String endMonth;
	public String getStartMonth() {
		return startMonth;
	}
	public void setStartMonth(String startMonth) {
		this.startMonth = startMonth;
	}
	public String getEndMonth() {
		return endMonth;
	}
	public void setEndMonth(String endMonth) {
		this.endMonth = endMonth;
	}
	
	public int getBetweenMonth() throws ParseException{
		int year1 = Integer.parseInt(this.startMonth.substring(0,4));
		int year2 = Integer.parseInt(this.endMonth.substring(0,4));
		
		int month1 = Integer.parseInt(this.startMonth.substring(4,6));
		int month2 = Integer.parseInt(this.endMonth.substring(4,6));
		
		int betweenMonth = month2 - month1;
		int betweenYear = year2 - year1;
		
		
		return betweenYear * 12 + betweenMonth;
	}
	
	@Override
	public void validate() {
		 
	 }
}
