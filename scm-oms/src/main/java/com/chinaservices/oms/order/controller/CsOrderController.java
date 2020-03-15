package com.chinaservices.oms.order.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chinaservices.event.EventManager;
import com.chinaservices.oms.cust.model.CsServiceAreaBlock;
import com.chinaservices.oms.cust.model.CsServiceAreaMap;
import com.chinaservices.oms.edi.event.tms.TmsRevocationOrderEvent;
import com.chinaservices.oms.edi.event.wmsasn.WmsAsnRevocationOrderEvent;
import com.chinaservices.oms.order.model.*;
import com.chinaservices.oms.order.service.CsOrderService;
import com.chinaservices.oms.track.model.CsOrderMilestone;
import com.chinaservices.oms.warehouse.model.CsWarehouse;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sdk.util.DateUtil;
import com.chinaservices.sdk.util.EmptyUtils;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import org.apache.commons.lang.StringUtils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@Before(Tx.class)
@Controller(controllerKey = "/api/oms/order/csOrder")
public class CsOrderController extends BaseController {
	
	/**
	 * 订单分页查询
	 */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        String orderNosStr = getPara("order_nos");
        if(!StringUtils.isBlank(orderNosStr)) {
        	String[] order_nos = orderNosStr.split(",");
        	params.put("order_nos", order_nos);
        }
        
        Page<Record> list = new SqlExecutor().page("csOrder_page_query", params, start, pageSize);
        
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 查询订单任务
     */
    public void queryOrderTask() {
    	Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        Page<Record> list = new SqlExecutor().page("csOrderTask_query", params, start, pageSize);
        
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 根据id查订单信息
     */
    public void getById() {
    	Result result = new Result();
        String id = getPara("id");
        if (EmptyUtils.isNotEmpty(id)) {
        	CsOrder orders = CsOrder.dao.findById(id);
        	if (orders == null) {
        		result.fail("数据已不存在");
        	} else {
        		result.setData(orders);
        	}
        }
        renderJson(result);
    }
    
    /**
     * 根据系统订单号获取订单
     */
    public void getOrderByOrderNo() {
        Result result = new Result();
        String orderNo = getPara("order_no");
        String message = new String();
        boolean isOk = true;
        
        if (EmptyUtils.isNotEmpty(orderNo)) {
        	List<CsOrder> orders = CsOrder.dao.getOrdersByOrderNos(new String[]{orderNo});
        	if (orders.size() < 1) {
        		isOk = false;
        		message = "数据已不存在";
        	} else {
        		result.setData(orders.get(0));
        	}
        } else {
        	isOk = false;
        	message = "系统订单号不能为空";
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 保存订单
     */
    public void save() {
        Result result = new Result();
        CsOrder csOrder = getModel(CsOrder.class, "");
        if (null == csOrder.get("id")) {
        	// 若为新增订单，设置状态/系统订单号，订单类型默认普通订单
        	csOrder.set("status", "10");
        	csOrder.set("order_no", CodeUtil.getInstance().getCode("ORDER"));
        }
        if (null == csOrder.get("order_time")) {
        	csOrder.set("order_time", DateUtil.now());
        }
    	// 保存
        this.preSave(csOrder);
    	CsOrder.dao.save(csOrder);
    	// 重新查询订单
    	CsOrder order = CsOrder.dao.findById(csOrder.getInt("id"));
    	
		result.setData(order);
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 根据系统订单号删除订单及其子表
     */
    public void deleteOrdersAndSubDatas() {
        Result result = new Result();
        String idsStr = getPara("ids");
        String message = new String();
        boolean isOk = true;
        if (null != idsStr) {
        	String[] ids = StringUtils.split(idsStr, ",");
        	// 校验订单状态为创建才可删除
        	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
        	for (CsOrder order : orders) {
				if (!"10".equals(order.get("status"))) {
					message = order.get("order_no") + " : 状态不为创建，无法删除";
					isOk = false;
					break;
				}
			}
        	// 删除订单及其子表
        	if (isOk) {
        		// 删除订单
                CsOrder.dao.deleteAllByOrderIds(ids);
                // 删除订单商品
            	CsOrderCargo.dao.deleteAllByOrderIds(ids);
        	}
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 完成订单
     */
    public void completeOrders() {
        Result result = new Result();
        String idsStr = getPara("ids");
        String message = new String();
        boolean isOk = true;
        if (null != idsStr) {
        	String[] ids = StringUtils.split(idsStr, ",");
        	// 校验订单状态：订单状态需为执行中才可完成
        	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
        	for (CsOrder order : orders) {
				if ("10".equals(order.get("status"))
						|| "40".equals(order.get("status"))) {
					message = order.get("order_no") + " : 状态不为确认、执行中，无法完成";
					isOk = false;
					break;
				}
			}
        	// 订单校验通过后更新订单状态为完成状态
        	if (isOk) {
        		for (String id : ids) {
        			CsOrder.dao.updateStatus(id, getLoginUserId(), "40");
				}
        	}
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 客户货量执行比
     */
    public void loadContractExecuteRateHandler() {
        Result result = new Result();
        
        List<CsOrder> datas = CsOrder.dao.loadContractExecuteRateHandler();
        if(datas.isEmpty()){
        	result.setSuccess(true);
        	result.setMsg("无数据");
        }else{
        	result.setSuccess(true);
            result.setData(datas);
        }
        renderJson(result);
    }
    
    /**
     * 分配仓库并保存
     */
    public void arrangeWarehouse() {
    	Result result = new Result();
    	result.setSuccess(true);
    	// 查出id
    	Integer	id = getParaToInt("id");
    	CsOrder order = CsOrder.dao.findById(id);
    	
    	// 查询仓库
    	List<CsWarehouse> wareHouses = CsWarehouse.dao.find("select * from cs_warehouse where status = '1'");
    	if(wareHouses.isEmpty()) {
    		result.setSuccess(false);
    		result.setMsg("没有启用的仓库，仓库分配失败");
    		renderJson(result);
    		return;
    	}
    	
    	//匹配成功的仓库，取第一个
    	CsWarehouse matchWarehouse = null;
    	for(CsWarehouse wareHouse : wareHouses) {
    		// 有维护覆盖范围再进行匹配
    		if(StringUtils.isNotBlank(wareHouse.getStr("service_area_code"))) {
    			// 先匹配服务范围省市区
        		QueryInfo queryInfo = new QueryInfo("cs_service_area.matchWarehouseServiceArea");
        		// 省市区条件
        		String dest_province_code = StringUtils.isBlank(order.getStr("consignee_province_code"))?"":order.getStr("consignee_province_code");
        		String dest_city_code = StringUtils.isBlank(order.getStr("consignee_city_code"))?"":order.getStr("consignee_city_code");
        		String dest_county_code = StringUtils.isBlank(order.getStr("consignee_county_code"))?"":order.getStr("consignee_county_code");
        		queryInfo.addParam("destination", dest_province_code+dest_city_code+dest_county_code);
        		queryInfo.addParam("warehouse_code", wareHouse.getStr("warehouse_code"));
        		// 返回查询结果
        		List<CsServiceAreaBlock> matchBlocks = queryInfo.find(new CsServiceAreaBlock());
        		// 若由省市区匹配到仓库，则结束跳出
        		if(matchBlocks.size()>0) {
        			matchWarehouse = wareHouse;
        			break;
        		}
        		
        		// 省市区没匹配到，再匹配地图服务范围
        		// 获取地点经纬度
        		order = getLocation(order);
        		// 查询服务范围
        		List<CsServiceAreaMap> maps = CsServiceAreaMap.dao.find("select * from cs_service_area_map where service_area_code = ? and map_type = '01'",wareHouse.getStr("service_area_code"));
        		if(maps.size() > 0 && (StringUtils.isNotBlank(order.getStr("lat")) && StringUtils.isNotBlank(order.getStr("lng")))) {
        			for (CsServiceAreaMap map : maps) {
        				// 判断点是否在范围内
                		if(isInsidePolygon(order.getStr("lat"), order.getStr("lng"),map.getStr("map_area"))) {
                			matchWarehouse = wareHouse;
                			break;
                		}
					}
        		}
    		}
    		
    	}
    	if(matchWarehouse!=null) {
    		order.set("warehouse_code", matchWarehouse.getStr("warehouse_code"));
    		order.set("warehouse_name", matchWarehouse.getStr("warehouse_name"));
    		order.update();
    	}else {
    		result.setSuccess(false);
    		result.setMsg("没有匹配到仓库，请手工选择");
    	}
    	
    	renderJson(result);
    }
    
    /**
     * 审核
     */
    public void audit() {
    	 Result result = new Result();
    	 result.setSuccess(true);
         String idsStr = getPara("ids");
         if (null != idsStr) {
         	String[] ids = StringUtils.split(idsStr, ",");
         	// 校验订单状态：订单状态需为执行中才可完成
         	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
         	for (CsOrder order : orders) {
 				if (!"10".equals(order.get("status"))) {
 					result.fail(order.get("order_no") + " : 不是创建状态，无法审核");
 					renderJson(result);
 					return;
 				}
 			}
         	// 匹配分解规则，生成订单任务
         	result = CsOrderService.me.divideOrders(ids, getLoginUserId());
         	if(!result.isSuccess()) {
         		renderJson(result);
         		return;
         	}
         	// 更新订单状态为审核，记录里程碑
     		CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "20");
     		
         } else {
        	 result.fail("请选择订单进行操作");
         }
         renderJson(result);
    }
    
    /**
     * 取消审核
     */
    public void auditCancel() {
    	Result result = new Result();
    	result.setSuccess(true);
        String idsStr = getPara("ids");
        if (null != idsStr) {
        	String[] ids = StringUtils.split(idsStr, ",");
        	// 校验订单状态：订单状态需为执行中才可完成
        	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
        	for (CsOrder order : orders) {
				if (!"20".equals(order.get("status"))) {
					result.fail(order.get("order_no") + " : 不是审核状态，无法取消审核");
					renderJson(result);
					return;
				}
			}
        	// 匹配分解规则，生成订单任务
        	CsOrderService.me.cancelDivide(ids, getLoginUserId());
        	// 更新订单状态为审核，记录里程碑
    		CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "10");
    		
        } else {
       	 result.fail("请选择订单进行操作");
        }
        renderJson(result);
    }
    
    /**
     * 下发
     */
    public void issue() {
    	Result result = new Result();
    	result.setSuccess(true);
        String idsStr = getPara("ids");
        if (null != idsStr) {
        	String[] ids = StringUtils.split(idsStr, ",");
        	// 校验订单状态：订单状态需为执行中才可完成
        	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
        	for (CsOrder order : orders) {
				if (!"20".equals(order.get("status"))) {
					result.fail(order.get("order_no") + " : 不是审核状态，无法下发");
					renderJson(result);
					return;
				}
			}
        	// 匹配分解规则，生成订单任务
        	result = CsOrderService.me.issueOrders(ids, getLoginUserId());
        	if(!result.isSuccess()) {
        		renderJson(result);
        		return;
        	}
        	// 更新订单状态为下发，记录里程碑
    		CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "30");
    		
        } else {
       	 result.fail("请选择订单进行操作");
        }
        renderJson(result);
    }
    
    /**
     * 取消下发
     */
    public void issueCancel() {
    	Result result = new Result();
    	result.setSuccess(true);
        String idsStr = getPara("ids");
        if (null != idsStr) {
        	String[] ids = StringUtils.split(idsStr, ",");
        	// 校验订单状态：订单状态需为执行中才可完成
        	List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
        	for (CsOrder order : orders) {
				if (!"30".equals(order.get("status"))) {
					result.fail(order.get("order_no") + " : 不是下发状态，无法取消下发");
					renderJson(result);
					return;
				}
			}
        	// 匹配分解规则，生成订单任务
        	result = CsOrderService.me.cancelIssue(ids, getLoginUserId());
        	if(!result.isSuccess()) {
        		renderJson(result);
        		return;
        	}
        	// 更新订单状态为审核，记录里程碑
    		CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "20");
    		
        } else {
       	 result.fail("请选择订单进行操作");
        }
        renderJson(result);
    }
    
    /**
     * 完成
     */
    public void complete() {
		Result result = new Result();
		result.setSuccess(true);
		String idsStr = getPara("ids");
		if (null != idsStr) {
			String[] ids = StringUtils.split(idsStr, ",");
			// 校验订单状态：订单状态需为执行中才可完成
			List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
			Map<Integer, List<CsOrderTask>> taskMap = CsOrderTask.dao.getTaskMap(ids);
			for (CsOrder order : orders) {
				if (!"30".equals(order.get("status"))) {
					result.fail(order.get("order_no") + " : 不是下发状态，无法完成");
					renderJson(result);
					return;
				}
				List<CsOrderTask> csOrderTasks = taskMap.get(order.getInt("id"));
				if(csOrderTasks != null && csOrderTasks.size() > 0 ){
					for (CsOrderTask csOrderTask:csOrderTasks ) {
						if (!"SUCCESS".equals(csOrderTask.get("issue_status"))) {
							result.fail(order.get("order_no") + " : 的任务没有下发成功，无法完成");
							renderJson(result);
							return;
						}
					}
				}

			}
			// 更新订单状态为下发，记录里程碑
			CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "99");

		} else {
			result.fail("请选择订单进行操作");
		}
		renderJson(result);
    }
    
    /**
     * 废除
     */
    public void abolish() {
		Result result = new Result();
		result.setSuccess(true);
		String idsStr = getPara("ids");
		if (null != idsStr) {
			String[] ids = StringUtils.split(idsStr, ",");
			// 校验订单状态：订单状态需为执行中才可完成
			List<CsOrder> orders = CsOrder.dao.getOrdersByIds(ids);
			Map<String, List<CsOrderMilestone>> milestoneMap = getMilestoneMap(ids);
			String[] customer_order_no = new String[orders.size()];
			int i = 0;
			for (CsOrder order : orders) {
				if ("90".equals(order.get("status")) || "99".equals(order.get("status"))) {
					result.fail(order.get("order_no") + " : 是完成或取消状态，无法取消订单");
					renderJson(result);
					return;
				}else if(milestoneMap.get(order.getInt("id").toString()) != null && milestoneMap.get(order.getInt("id").toString()).size() > 0){
					result.fail(order.get("order_no") + " : 下游系统已做操作，无法取消订单");
					renderJson(result);
					return;
				}
				customer_order_no[i++] = order.get("order_no");
			}
			// 更新订单状态为审核，记录里程碑
			CsOrder.dao.updateOrderStatus(ids, getLoginUserId(), "90");
			//下游系统订单撤销
			TmsRevocationOrderEvent tmsRevocationOrderEvent = new TmsRevocationOrderEvent(customer_order_no, getLoginUserId());
			WmsAsnRevocationOrderEvent wmsAsnRevocationOrderEvent = new WmsAsnRevocationOrderEvent(customer_order_no, getLoginUserId());
			TmsRevocationOrderEvent wmsSoRevocationOrderEvent = new TmsRevocationOrderEvent(customer_order_no, getLoginUserId());
			EventManager.fireEvent(tmsRevocationOrderEvent);
			EventManager.fireEvent(wmsAsnRevocationOrderEvent);
			EventManager.fireEvent(wmsSoRevocationOrderEvent);
		} else {
			result.fail("请选择订单进行操作");
		}
		renderJson(result);
    }

	/**
	 * 根据id获取订单里程碑信息
	 * @return
	 */
	private Map<String, List<CsOrderMilestone>> getMilestoneMap(String[] ids){
		Map<String, List<CsOrderMilestone>> milestoneMap = new HashMap<>();
		Map<String, Object> params = new HashMap<>();
		params.put("order_ids", ids);
		List<Record> milestoneList = new SqlExecutor().find("csOrderMilestone_qeury", params);
		for (Record milestone: milestoneList) {
			String order_id = milestone.getInt("order_id").toString();
			CsOrderMilestone csOrderMilestone = new CsOrderMilestone();
			csOrderMilestone.copyFrom(milestone);
			if(milestoneMap.containsKey(order_id)){
				milestoneMap.get(order_id).add(csOrderMilestone);
			}else{
				List<CsOrderMilestone> csOrderMilestoneList = new ArrayList<>();
				csOrderMilestoneList.add(csOrderMilestone);
				milestoneMap.put(order_id, csOrderMilestoneList);
			}
		}
		return milestoneMap;
	}
    
    /**
     * 获取经纬度，放入订单
     * @param order
     * @return
     */
    public CsOrder getLocation(CsOrder order) {
		BufferedReader rd = null;
		HttpURLConnection con = null;
		String requestUrl = "";
		try {
			String province = order.getStr("consignee_province_name");
			String city = order.getStr("consignee_city_name");
			String county = order.getStr("consignee_county_name");
			String address = order.getStr("consignee_address");
			String location = province +city+county+address;
			String addrEncode = urlEncoder(location);
			requestUrl = "http://api.map.baidu.com/geocoder/v2/?ak=D7de4bf811b0f69ab74d37862e1bcb8a&output=json&address="+addrEncode+"&city=%E5%85%A8%E5%9B%BD";
			
			String resultString = proxyBaidu(requestUrl);
			JSONObject bmap = JSON.parseObject(resultString);
			if(bmap.get("result")!=null) {
				JSONObject result = bmap.getJSONObject("result");
				JSONObject resultLocation = result.getJSONObject("location");
				order.put("lat", resultLocation.getString("lat"));
				order.put("lng", resultLocation.getString("lng"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(rd != null){
					rd.close();
				}
				if(con != null){
					con.disconnect();
				}
			} catch (IOException e) {
			}
		}
		return order;
	}
    
    /**
	 * 代理发出请求，访问百度地图获取经纬度
	 */
	public String proxyBaidu(String realUrl) throws Exception {
		String charset = "UTF-8";
		String result = "";
		URL url = null;
		HttpURLConnection con = null;
		BufferedReader rd = null;
		OutputStream outputStream = null;

		url = new URL(realUrl);// 构造一个URL
		con = (HttpURLConnection) url.openConnection();// 打开URL的连接
		con.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)");
		con.setRequestMethod("GET");
		con.setDoOutput(true);
		con.setDoInput(true);
		con.setConnectTimeout(15000);
		con.setReadTimeout(30000);

		rd = new BufferedReader(new InputStreamReader(con.getInputStream(), charset));
		String line;
		while ((line = rd.readLine()) != null) {
			result += line;
		}

		if (outputStream != null) {
			outputStream.close();
		}
		if (rd != null) {
			rd.close();
		}
		return result;
	}
    
    /**
	 * Description : 汉字转换为浏览器识别编码
	 * @param:str url地址
	 */
	private String urlEncoder(String str) {
		String result = "";
		try {
			result = URLEncoder.encode(str, "utf-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}
    
	/**
	 * 判断点是否再多边形内
	 * @param latSrt
	 * @param lngStr
	 * @param polygonStr
	 * @return
	 */
	public Boolean isInsidePolygon(String latSrt, String lngStr, String polygonStr) {
		// 判断的点
		Location loc = new Location(latSrt, lngStr);
		// 区域
		String[] latlngArr = polygonStr.split("\\|");
		Location[] polygon = new Location[latlngArr.length];
		for (int m = 0; m < latlngArr.length; m++) {
			String[] latlng = latlngArr[m].toString().split(",");
			Location location = new Location(latlng[0], latlng[1]);
			polygon[m] = location;
		}

		int j = 0;
		Boolean bol = false;
		// 点的坐标X,Y
		Double lat = Double.valueOf(loc.getLat());
		Double lng = Double.valueOf(loc.getLng());

		for (int i = 0; i < polygon.length; i++) {
			j++;
			if (j == polygon.length) {
				j = 0;
			}

			if (Double.valueOf(polygon[i].getLng()) < lng
					&& Double.valueOf(polygon[j].getLng()) >= lng
					|| Double.valueOf(polygon[j].getLng()) < lng
					&& Double.valueOf(polygon[i].getLng()) >= lng) {
				if ((Double.valueOf(polygon[i].getLat()) + (lng - Double
						.valueOf(polygon[i].getLng()))
						/ (Double.valueOf(polygon[j].getLng()) - Double
								.valueOf(polygon[i].getLng()))
						* (Double.valueOf(polygon[j].getLat()) - Double
								.valueOf(polygon[i].getLat()))) < lat) {
					bol = !bol;
				}
			}
		}
		return bol;
	}
	
	/**
	 * 地点内部类，用于服务范围匹配
	 */
	private static class Location {
		private String lat;
		private String lng;

		public Location(String lat, String lng) {
			super();
			this.lat = lat;
			this.lng = lng;
		}

		public String getLat() {
			return lat;
		}

		public void setLat(String lat) {
			this.lat = lat;
		}

		public String getLng() {
			return lng;
		}

		public void setLng(String lng) {
			this.lng = lng;
		}
	}
    
}
