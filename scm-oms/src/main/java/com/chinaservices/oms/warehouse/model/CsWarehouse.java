package com.chinaservices.oms.warehouse.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
@Table(tableName = "cs_warehouse", pkName = "id")
public class CsWarehouse extends Model<CsWarehouse>  {
	public static final CsWarehouse dao = new CsWarehouse();
}
