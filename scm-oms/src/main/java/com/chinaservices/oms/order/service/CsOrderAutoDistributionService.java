package com.chinaservices.oms.order.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.oms.order.model.CsOrder;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.util.EmptyUtils;
import com.jfinal.plugin.activerecord.Record;

public class CsOrderAutoDistributionService {
	
	private static final CsOrder csOrder = new CsOrder();
	
	/**
	 * 根据系统订单号查询分配订单相关数据信息查询
	 */
	public Record getOrderDistributionBaseInfo(String orderNo) {
		Record record;
		if (EmptyUtils.isNotEmpty(orderNo)) {
			QueryInfo queryInfo = new QueryInfo("order.csOrder.getOrderDistributionBaseInfo");
			queryInfo.addParam("order_no", orderNo);
			record = queryInfo.findOne();
		} else {
			record = null;
		}
		return record;
	}
	
	/**
	 * 根据运力承诺查询承运商
	 * @param order
	 * @return
	 */
	public List<CsSupplier> getCarrierByCommitment(CsOrder order) {
		// 查询SQL模板
		QueryInfo queryInfo = new QueryInfo("csTransportCommitment.matchFlow");
		// 省市区条件
		String origin_province_code = StringUtils.isBlank(order.getStr("shipper_province_code"))?"":order.getStr("shipper_province_code");
		String origin_city_code = StringUtils.isBlank(order.getStr("shipper_city_code"))?"":order.getStr("shipper_city_code");
		String origin_county_code = StringUtils.isBlank(order.getStr("shipper_county_code"))?"":order.getStr("shipper_county_code");
		String dest_province_code = StringUtils.isBlank(order.getStr("consignee_province_code"))?"":order.getStr("consignee_province_code");
		String dest_city_code = StringUtils.isBlank(order.getStr("consignee_city_code"))?"":order.getStr("consignee_city_code");
		String dest_county_code = StringUtils.isBlank(order.getStr("consignee_county_code"))?"":order.getStr("consignee_county_code");
		queryInfo.addParam("origin", origin_province_code+origin_city_code+origin_county_code);
		queryInfo.addParam("destination", dest_province_code+dest_city_code+dest_county_code);
		// 返回查询结果
		List<CsSupplier> suppliers= new ArrayList<>();
		List<CsSupplier> result = queryInfo.find(new CsSupplier());
		Set<String> supplierSet = new HashSet<String>();
		for(CsSupplier csSupplier : result) {
			if(!supplierSet.contains(csSupplier.getStr("carrier_code"))) {
				supplierSet.add(csSupplier.getStr("carrier_code"));
				int row_id = suppliers.size()+1;
				csSupplier.put("row_id", row_id);
				suppliers.add(csSupplier);
			}
		}
		return suppliers;
	}
	
}
