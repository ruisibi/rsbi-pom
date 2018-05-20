package com.ruisitech.bi.entity.bireport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ruisitech.bi.entity.portal.LinkAcceptDto;

public class ChartJSONDto {
	
	private String type;
	private Integer typeIndex;
	private List<DimDto> params;
	private String label;
	private DimDto xcol;
	private DimDto scol;
	private DimDto ycol; //"ycol":{"type":"kpi"}
	private Map<String, Object> link;
	private LinkAcceptDto linkAccept;
	
	private String maparea;
	private String mapAreaName;
	private String height;
	private String width;
	private String showLegend;
	private String legendLayout;
	private String legendpos;
	private String legendPosition;
	private String dataLabel;
	private String marginLeft;
	private String marginRight;
	private String markerEnabled;
	
	public List<DimDto> getDims(){
		List<DimDto> ret = new ArrayList<DimDto>();
		if(this.getXcol() != null && this.getXcol().getId() != null){
			ret.add(this.getXcol());
		}
		if(this.getScol() != null && this.getScol().getId() != null){
			ret.add(this.getScol());
		}
		if(this.getParams() != null && this.getParams().size() > 0){
			ret.addAll(this.getParams());
		}
		return ret;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public List<DimDto> getParams() {
		return params;
	}
	public void setParams(List<DimDto> params) {
		this.params = params;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public DimDto getXcol() {
		return xcol;
	}
	public void setXcol(DimDto xcol) {
		this.xcol = xcol;
	}
	public DimDto getScol() {
		return scol;
	}
	public void setScol(DimDto scol) {
		this.scol = scol;
	}
	public DimDto getYcol() {
		return ycol;
	}
	public void setYcol(DimDto ycol) {
		this.ycol = ycol;
	}
	public Map<String, Object> getLink() {
		return link;
	}
	public void setLink(Map<String, Object> link) {
		this.link = link;
	}
	
	public LinkAcceptDto getLinkAccept() {
		return linkAccept;
	}

	public void setLinkAccept(LinkAcceptDto linkAccept) {
		this.linkAccept = linkAccept;
	}

	public String getMaparea() {
		return maparea;
	}
	public void setMaparea(String maparea) {
		this.maparea = maparea;
	}
	public String getMapAreaName() {
		return mapAreaName;
	}
	public void setMapAreaName(String mapAreaName) {
		this.mapAreaName = mapAreaName;
	}
	public Integer getTypeIndex() {
		return typeIndex;
	}
	public void setTypeIndex(Integer typeIndex) {
		this.typeIndex = typeIndex;
	}
	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getShowLegend() {
		return showLegend;
	}

	public void setShowLegend(String showLegend) {
		this.showLegend = showLegend;
	}

	public String getLegendLayout() {
		return legendLayout;
	}

	public void setLegendLayout(String legendLayout) {
		this.legendLayout = legendLayout;
	}

	public String getLegendpos() {
		return legendpos;
	}

	public void setLegendpos(String legendpos) {
		this.legendpos = legendpos;
	}

	public String getLegendPosition() {
		return legendPosition;
	}

	public void setLegendPosition(String legendPosition) {
		this.legendPosition = legendPosition;
	}

	public String getDataLabel() {
		return dataLabel;
	}

	public void setDataLabel(String dataLabel) {
		this.dataLabel = dataLabel;
	}

	public String getMarginLeft() {
		return marginLeft;
	}

	public void setMarginLeft(String marginLeft) {
		this.marginLeft = marginLeft;
	}

	public String getMarginRight() {
		return marginRight;
	}

	public void setMarginRight(String marginRight) {
		this.marginRight = marginRight;
	}

	public String getMarkerEnabled() {
		return markerEnabled;
	}

	public void setMarkerEnabled(String markerEnabled) {
		this.markerEnabled = markerEnabled;
	}
	
}
