package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
@Table(tableName = "cs_service_area_map", pkName = "id")
public class CsServiceAreaMap extends Model<CsServiceAreaMap>  {
	public static final CsServiceAreaMap dao = new CsServiceAreaMap();
}
