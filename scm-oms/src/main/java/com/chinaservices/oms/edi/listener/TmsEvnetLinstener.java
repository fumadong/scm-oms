package com.chinaservices.oms.edi.listener;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.chinaservices.oms.edi.event.tms.TmsRevocationOrderEvent;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chinaservices.event.EventListener;
import com.chinaservices.oms.edi.event.tms.CreateOrderEvent;
import com.chinaservices.oms.order.model.CsOrderTask;
import com.chinaservices.oms.track.model.CsTaskIssueLog;
import com.chinaservices.sql.SqlExecutor;
import com.google.common.eventbus.Subscribe;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.Record;

/**
 * TMS接口事件
 * @author Samuel
 */
public class TmsEvnetLinstener implements EventListener {

	private static String scm_tms_url = PropKit.get("scm.tms.url");
	
	/**
	 * 下发TMS
	 * @param event
	 */
	@Subscribe
    public void createTmsOrder(CreateOrderEvent event){
		Integer[] taskIds = event.getTaskIds();
		Integer operator = event.getOperator();
		Map<String, Object> taskParams = new HashMap<String, Object>();
		taskParams.put("ids", taskIds);
		List<Record> taskRecords = new SqlExecutor().find("csOrderTask_query",taskParams);
		
		// 获取下发的订单信息
		JSONArray asnOrders = getOrders(taskRecords);
		
		if(!asnOrders.isEmpty()) {
			JSONObject jsonParam = new JSONObject();
			jsonParam.put("orders", asnOrders);
//			JSONObject result = new JSONObject();//httpPostOther(scm_tms_url+"/open/api/tms/order/create", jsonParam);
			JSONObject result = httpPostOther(scm_tms_url+"/open/api/tms/order/create", jsonParam);
			result.put("success", true);
			// 更新任务
			updateTaskIssueStatus(taskRecords, operator, result);
		}
    }

	/**
	 * 撤销订单TMS
	 * @param event
	 */
	@Subscribe
	public void revocationTmsOrder(TmsRevocationOrderEvent event){
		String[] customer_order_nos = event.getCustomer_order_no();
		Integer operator = event.getOperator();
		JSONArray orderNos = new JSONArray();
		for (int i = 0; i < customer_order_nos.length; i++) {
			orderNos.add(customer_order_nos[i]);
		}
		if(!orderNos.isEmpty()) {
			JSONObject jsonParam = new JSONObject();
			jsonParam.put("customerOrderNos", orderNos);
//			JSONObject result = new JSONObject();//httpPostOther(scm_tms_url+"/open/api/tms/order/create", jsonParam);
			JSONObject result = httpPostOther(scm_tms_url+"/open/api/tms/order/revocation", jsonParam);
			result.put("success", true);
		}
	}
	
	/**
	 * 更新任务状态，记录下发日志
	 * @param taskRecords
	 * @param operator
	 * @param result
	 */
	public void updateTaskIssueStatus(List<Record> taskRecords, Integer operator, JSONObject result) {
		// 更新任务下发状态
		for (Record taskRecord : taskRecords) {
			CsOrderTask task = new CsOrderTask();
			task.copyFrom(taskRecord);
			if(result.getBooleanValue("success")) {
				task.set("issue_status", "SUCCESS");
			}else {
				task.set("issue_status", "FAILURE");
			}
			task.set("issue_time", new Date());
			Integer issue_try_times = task.getInt("issue_try_times");
			task.set("issue_try_times", issue_try_times+1);
			task.update();
			
			// 记录下发日志
			CsTaskIssueLog log = new CsTaskIssueLog();
			log.set("order_no", task.get("order_no"));
			log.set("order_task_no", task.get("order_task_no"));
			log.set("order_task_id", task.get("id"));
			log.set("operator", operator);
			log.set("issue_time", task.get("issue_time"));
			if(result.getBooleanValue("success")) {
				log.set("status", "1");
			}else {
				log.set("status", "0");
				log.set("message", result.get("message"));
			}
			log.set("create_time", task.get("issue_time"));
			log.set("creator", operator);
			log.set("modify_time", task.get("issue_time"));
			log.set("modifier", operator);
			log.save();
		}
	}
	
	/**
	 * 获取下发的订单信息
	 * @param taskRecords
	 * @return
	 */
	public JSONArray getOrders(List<Record> taskRecords) {
		List<Object> orderIds = new ArrayList<Object>();
		for (Record record : taskRecords) {
			// 待下发的任务
			if(StringUtils.equals(record.getStr("issue_status"), "WAITTING")) {
				orderIds.add(record.get("order_id"));
			}
		}
		// 下发的订单
		JSONArray orders = new JSONArray();
		if(!orderIds.isEmpty()) {
			// 查询订单
			Map<String, Object> orderParams = new HashMap<String, Object>();
			orderParams.put("ids", orderIds.toArray());
			List<Record> orderRecords = new SqlExecutor().find("csOrder_query",orderParams);
			// 查询商品
			Map<String, Object> cargoParams = new HashMap<String, Object>();
			cargoParams.put("order_ids", orderIds.toArray());
			List<Record> cargos = new SqlExecutor().find("csOrderGargo_query",cargoParams);
			// 商品分组
			Map<Integer, List<Record>> cargoMap = new HashMap<>();
			for (Record record : cargos) {
				Integer order_id = record.getInt("order_id");
	    		if(cargoMap.containsKey(order_id)) {
	    			cargoMap.get(order_id).add(record);
	    		}else {
	    			List<Record> cargoRecords = new ArrayList<Record>();
	    			cargoRecords.add(record);
	    			cargoMap.put(order_id, cargoRecords);
	    		}
			}
			// 封装订单与商品
			for (Record orderRecord : orderRecords) {
				JSONObject order = new JSONObject();
				order = createOrder(orderRecord, cargoMap.get(orderRecord.get("id")));
				orders.add(order);
			}
		}
		return orders;
	}
	
	/**
	 * 创建TMS运输单
	 * @param order
	 * @param cargos
	 * @return
	 */
	public JSONObject createOrder(Record order, List<Record> cargos) {
		JSONObject transport = new JSONObject();
		transport.put("customer_order_no", order.get("order_no"));
		transport.put("order_type", order.get("order_type"));
		transport.put("customer_type", order.get("customer_type"));
		transport.put("customer_code", order.get("customer_code"));
		transport.put("customer_name", order.get("customer_name"));
		transport.put("order_personnel_code", order.get("order_personnel_code"));
		transport.put("order_personnel_name", order.get("order_personnel_name"));
		transport.put("order_time", order.get("order_time"));
		transport.put("require_time_from", order.get("require_time_from"));
		transport.put("require_time_to", order.get("require_time_to"));
		transport.put("charge_node", order.get("charge_node"));
		transport.put("charge_mode", order.get("charge_mode"));
		transport.put("shipper_code", order.get("shipper_code"));
		transport.put("shipper_name", order.get("shipper_name"));
		transport.put("shipper_contact_code", order.get("shipper_contact_code"));
		transport.put("shipper_contact_name", order.get("shipper_contact_name"));
		transport.put("shipper_contact_tel", order.get("shipper_contact_tel"));
		transport.put("shipper_contact_mobile", order.get("shipper_contact_mobile"));
		transport.put("shipper_province_code", order.get("shipper_province_code"));
		transport.put("shipper_province_name", order.get("shipper_province_name"));
		transport.put("shipper_city_code", order.get("shipper_city_code"));
		transport.put("shipper_city_name", order.get("shipper_city_name"));
		transport.put("shipper_county_code", order.get("shipper_county_code"));
		transport.put("shipper_county_name", order.get("shipper_county_name"));
		transport.put("shipper_address", order.get("shipper_address"));
		transport.put("consignee_code", order.get("consignee_code"));
		transport.put("consignee_name", order.get("consignee_name"));
		transport.put("consignee_contact_code", order.get("consignee_contact_code"));
		transport.put("consignee_contact_name", order.get("consignee_contact_name"));
		transport.put("consignee_contact_tel", order.get("consignee_contact_tel"));
		transport.put("consignee_contact_mobile", order.get("consignee_contact_mobile"));
		transport.put("consignee_province_name", order.get("consignee_province_name"));
		transport.put("consignee_city_code", order.get("consignee_city_code"));
		transport.put("consignee_city_name", order.get("consignee_city_name"));
		transport.put("consignee_county_code", order.get("consignee_county_code"));
		transport.put("consignee_county_name", order.get("consignee_county_name"));
		transport.put("consignee_address", order.get("consignee_address"));
		transport.put("remark", order.get("remark"));
		transport.put("creator", order.get("creator"));


		if(cargos!=null&&!cargos.isEmpty()) {
			JSONArray details = new JSONArray();
			for (Record cargo : cargos) {
				JSONObject detail = new JSONObject();

				detail.put("cargo_code", cargo.get("cargo_code"));
				detail.put("cargo_name", cargo.get("cargo_name"));
				detail.put("cargo_type", cargo.get("cargo_type"));
				detail.put("package_specification", cargo.get("package_specification"));
				detail.put("unit", cargo.get("unit"));
				detail.put("plan_amount", cargo.get("plan_amount"));
				details.add(detail);
			}
			transport.put("details", details);
		}
		return transport;
	}
	
	/**
     * httpPost
     * @param url 地址
     * @param jsonParam 请求参数
     * @return
     */
    private JSONObject httpPostOther(String url, JSONObject jsonParam){
        //post请求返回结果
        DefaultHttpClient httpClient = new DefaultHttpClient();
        JSONObject jsonResult = new JSONObject();
        jsonResult.put("success", false);
        HttpPost method = new HttpPost(url);
        try {
            if (null != jsonParam) {
                //解决中文乱码问题
                StringEntity entity = new StringEntity(jsonParam.toString(), "utf-8");
                entity.setContentEncoding("UTF-8");
                entity.setContentType("application/json");
                method.setEntity(entity);
            }
            HttpResponse result = httpClient.execute(method);
            url = URLDecoder.decode(url, "UTF-8");
            /**请求发送成功，并得到响应**/
            if (result.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String str = "";
                try {
                    /**读取服务器返回过来的json字符串数据**/
                    str = EntityUtils.toString(result.getEntity());
                    
                    /**把json字符串转换成json对象**/
                    jsonResult = JSONObject.parseObject(str);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
        	e.printStackTrace();
        }
        httpClient.getConnectionManager().shutdown();
        return jsonResult;
    }
}
