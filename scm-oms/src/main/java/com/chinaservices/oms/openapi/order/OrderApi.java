package com.chinaservices.oms.openapi.order;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chinaservices.oms.order.model.CsOrder;
import com.chinaservices.oms.order.service.CsOrderMilestonelService;
import com.chinaservices.oms.track.model.CsOrderMilestone;
import com.chinaservices.sdk.BaseAPI;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller(controllerKey = "/open/api/oms/order", viewPath = "/")
public class OrderApi extends BaseAPI {

	private static CsOrderMilestonelService csOrderMilestonelService = new CsOrderMilestonelService();
	/**
	 * {type:'wms','order_nos':['111','222']}
	 */
	
	/**
	 * 取消确认
	 */
	public void cancelConfirm() {
		JSONObject json = getJson();
		// 取出参数
		JSONArray order_nos = json.getJSONArray("order_nos");
		String interface_event = json.getString("type");
		
		// 
		
	}
	
	/**
	 * 状态反馈
	 */
	public void statusFeedback() {
		Result result = new Result();
		JSONObject requestData = getJson();
		String orderJson = requestData.get("orders").toString();
		JSONArray orderList = JSONArray.parseArray(orderJson);
		if(orderList != null && orderList.size() > 0) {
			for (int index = 0; index < orderList.size(); index++) {
				//获取业务订单信息
				JSONObject order = (JSONObject) orderList.get(index);
				//校验必填字段
				Result indexResult = checkField(order);
				if(!indexResult.isSuccess()){
					result = indexResult;
					break;
				}
				Map<String, Object> params = new HashMap<String, Object>();
				params.put("order_no", order.get("order_no"));
				Record csOrderRecord = new SqlExecutor().findOne("csOrder_query", params);
				CsOrder csOrder = new CsOrder();
				csOrder.copyFrom(csOrderRecord);
				CsOrderMilestone csOrderMilestone = jsonToOrderMilestone(order);
				csOrderMilestone.set("order_id", csOrder.getInt("id"));
				//判断订单状态是否为执行中
				if(!"40".equals(csOrder.getStr("status"))){
					csOrder.set("status", "40");
					CsOrder.dao.save(csOrder);
				}
				csOrderMilestonelService.saveOrUpdate(csOrderMilestone);
			}
		}
		result.setSuccess(true);
		renderJson(result);
		
	}

	/**
	 * 必填字段校验
	 * @param order
	 * @return
	 */
	private Result checkField(JSONObject order){
		Result result = new Result();
		result.setSuccess(true);
		StringBuilder msg = new StringBuilder();
		boolean isCheck = false;
		if(order.get("status") == null || StringUtils.isBlank(order.get("status").toString())){
			isCheck = true;
			msg.append("状态不能为空\n");
		}
		if(order.get("order_no") == null || StringUtils.isBlank(order.get("order_no").toString())){
			isCheck = true;
			msg.append("系统订单号不能为空\n");
		}
		if(isCheck){
			result.setMsg("系统订单号:" + order.get("order_no") + "\n" + msg);
			result.setSuccess(false);
		}
		return result;
	}

	private CsOrderMilestone jsonToOrderMilestone(JSONObject order){
		CsOrderMilestone csOrderMilestone = new CsOrderMilestone();
		this.preSave(csOrderMilestone);
		csOrderMilestone.set("order_no", order.get("order_no"));
		csOrderMilestone.set("order_status", order.get("status"));
		csOrderMilestone.set("operator", order.get("operator"));
		csOrderMilestone.set("operate_time", new Date((Long)order.get("time")));
		csOrderMilestone.set("location", order.get("location"));
		csOrderMilestone.set("remark", order.get("remark"));
		return csOrderMilestone;
	}
	
}
