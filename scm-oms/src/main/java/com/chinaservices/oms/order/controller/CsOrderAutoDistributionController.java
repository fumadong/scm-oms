package com.chinaservices.oms.order.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.oms.order.model.CsDistribution;
import com.chinaservices.oms.order.model.CsDistributionCargo;
import com.chinaservices.oms.order.model.CsOrder;
import com.chinaservices.oms.order.service.CsOrderAutoDistributionService;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRuleDetail;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.jfinal.plugin.activerecord.Record;

@Controller(controllerKey = "/api/oms/order/csOrderAutoDistribution")
public class CsOrderAutoDistributionController extends BaseController{
	
	private static final CsOrderAutoDistributionService csOrderAutoDistributionService = new CsOrderAutoDistributionService();

	public void getDistributionInfo() {
		Result result = new Result();
		String orderNo = getPara("order_no");
		// 查询订单信息
		Record order = csOrderAutoDistributionService.getOrderDistributionBaseInfo(orderNo);
		result.setData(order);
		result.setSuccess(true);
		renderJson(result);
	}
	
	public void getCarrierByCommitment() {
		Map<String, Object> dataTables = new HashMap<String, Object>();
        int draw = getParaToInt("draw");
        CsOrder order = getModel(CsOrder.class, "", true);
        List<CsSupplier> suppliers = csOrderAutoDistributionService.getCarrierByCommitment(order);
        dataTables.put("data", suppliers);
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", suppliers.size());
        dataTables.put("recordsFiltered", suppliers.size());
        renderJson(dataTables);
	}
	
	public void orderAutoDistribution() {
		Result result = new Result();
		
		String orderNo = getPara("order_no");
		String distributionString = getPara("distributions");
    	JSONArray distributionArray = JSON.parseArray(distributionString);
    	
    	
    	for (int i = 0; i < distributionArray.size(); i++) {
			JSONObject jsonObject = (JSONObject) distributionArray.get(i);
					
			BigDecimal planAmount = new BigDecimal(jsonObject.get("plan_amount").toString());
	    	// 查询订单状态及商品
	    	QueryInfo queryInfo = new QueryInfo("order.csOrder.getOrderStatusAndCargo");
			queryInfo.addParam("order_no", orderNo);
			Record orderStatusAndCargo = queryInfo.findOne();
			if (null == orderStatusAndCargo) {
				result.setMsg("订单已不存在");
				result.setSuccess(false);
			} else {
				if (!("20".equals(orderStatusAndCargo.getStr("order_status")) || "30".equals(orderStatusAndCargo.getStr("order_status")))) {
					// 状态校验
					result.setMsg("订单状态不为确认、执行中，无法分配");
					result.setSuccess(false);
				} else {
					BigDecimal differ = orderStatusAndCargo.getBigDecimal("remainder_amount").subtract(planAmount);
					if (differ.compareTo(BigDecimal.ZERO) == -1) {
						// 分配量校验：不能超过计划量
						result.setMsg("分配量不能大于剩余量，请重新打开分配界面");
						result.setSuccess(false);
					} else {
						// 生成分配单并保存
						CsDistribution distribution = new CsDistribution();
						distribution.set("order_no", orderNo);
						distribution.set("require_time_from", jsonObject.get("require_time_from"));
						distribution.set("require_time_to", jsonObject.get("require_time_to"));
						distribution.set("carrier_code", jsonObject.get("carrier_code"));
						distribution.set("carrier_name", jsonObject.get("carrier_name"));
						distribution.set("status", "10");
						String distribution_no = CodeUtil.getInstance().getCode("DISTRIBUTION");
						distribution.set("distribution_no", distribution_no);
						this.preSave(distribution);
						CsDistribution.dao.save(distribution);
						// 生成分配单商品并保存，更新订单商品分配量
						this.generateDistributionCargo(orderStatusAndCargo, distribution_no, planAmount);
					}
				}
			}		
		}
    	
    	result.setSuccess(true);
		renderJson(result);
	}
	
	/**
     * 生成分配单商品
     * @param distribution
     * @param plan_amount
     * @return
     */
    private void generateDistributionCargo(Record orderStatusAndCargo, String distribution_no, BigDecimal plan_amount) {
    	// 生成并保存分配单商品
    	CsDistributionCargo distributionCargo = new CsDistributionCargo();
    	distributionCargo.set("order_no", orderStatusAndCargo.get("order_no"));
    	distributionCargo.set("distribution_no", distribution_no);
    	distributionCargo.set("cargo_code", orderStatusAndCargo.get("cargo_code"));
    	distributionCargo.set("cargo_name", orderStatusAndCargo.get("cargo_name"));
    	distributionCargo.set("cargo_type", orderStatusAndCargo.get("cargo_type"));
    	distributionCargo.set("package_specification", orderStatusAndCargo.get("package_specification"));
    	distributionCargo.set("unit", orderStatusAndCargo.get("unit"));
    	distributionCargo.set("plan_amount", plan_amount);
    	distributionCargo.set("complete_amount", 0);
    	this.preSave(distributionCargo);
    	CsDistributionCargo.dao.save(distributionCargo);
    	// 更新订单商品分配量
    	QueryInfo updateOrderCargo = new QueryInfo("order.csOrderCargo.updateOrderCargoDistributionAmount");
    	updateOrderCargo.addParam("order_no", orderStatusAndCargo.get("order_no"));
    	updateOrderCargo.addParam("modifier", this.getLoginUserId());
    	updateOrderCargo.execute();
    }
}
