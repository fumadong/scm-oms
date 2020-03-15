package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
@Table(tableName = "cs_service_area", pkName = "id")
public class CsServiceArea extends Model<CsServiceArea>  {
	public static final CsServiceArea dao = new CsServiceArea();
}
