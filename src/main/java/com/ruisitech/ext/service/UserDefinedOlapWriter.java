package com.ruisitech.ext.service;

import java.util.List;

import com.ruisi.bi.engine.cross.OlapWriterInterface;
import com.ruisi.ext.engine.view.context.cross.CrossReportContext;
import com.ruisi.ext.engine.wrapper.ExtRequest;
import com.ruisi.ext.engine.wrapper.ExtWriter;
import com.ruisitech.bi.entity.bireport.DimDto;
import com.ruisitech.bi.entity.bireport.TableQueryDto;

public class UserDefinedOlapWriter implements OlapWriterInterface {
	
	private TableQueryDto table;
	
	@Override
	public void wirteRowDims(ExtRequest request, ExtWriter out, CrossReportContext report) {
		table = (TableQueryDto)request.getAttribute("table");
		
		out.print("<div class='rowDimsList'>");
		List<DimDto> rows = table.getRows();
		for(int i=0; i<rows.size(); i++){
			DimDto row  = rows.get(i);
			Integer id = row.getId();
			String name = row.getDimdesc();
			out.print("<span>"+name+" <a href=javascript:; onclick='setRdimInfo(this, \""+id+"\", \""+ name +"\")' class='dimoptbtn set'> &nbsp; </a></span>");
		}
		out.println("</div>");
	}

	@Override
	public void writeColDims(ExtRequest request, ExtWriter out, CrossReportContext report) {
		table = (TableQueryDto)request.getAttribute("table");

		out.print("<div class='colDimsList'>");
		List<DimDto> cols = table.getCols();
		if(cols.size() <= 0){
			out.print(" <div style=\"margin:3px;color:#999999;font-size:13px;\">列标签区域</div> ");
		}else{
			for(int i=0; i<cols.size(); i++){
				DimDto col  = cols.get(i);
				Integer id = col.getId();
				String name = col.getDimdesc();
				out.print("<span>"+name+" <a href=javascript:; onclick='setCdimInfo(this, \""+id+"\", \""+name+"\")' class='dimoptbtn set'> &nbsp; </a></span>");
			}
		}
		
		out.println("</div>");
	}

}
