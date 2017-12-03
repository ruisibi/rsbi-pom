package com.ruisitech.bi.entity.common;


public class PageParam {
	/**
	 * 分页参数
	 */
	private Integer total;
	private Integer page;
	private Integer rows;
	public Integer getTotal() {
		if(total==null){
			total = 0;
		}
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
	
	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public Integer getRows() {
		return rows;
	}
	public void setRows(Integer rows) {
		this.rows = rows;
	}
	@Override
	public String toString() {
		return "PageParam [total=" + total + ", pageIndex=" + page
				+ ", pageSize=" + rows + "]";
	}
}
