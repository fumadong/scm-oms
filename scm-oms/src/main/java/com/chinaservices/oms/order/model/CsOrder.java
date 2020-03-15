package com.chinaservices.oms.order.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.chinaservices.sdk.support.model.BaseModel;
import org.apache.commons.lang.StringUtils;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

/**
 * 订单
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_order", pkName = "id")
public class CsOrder extends BaseModel<CsOrder> {
	
	public static final CsOrder dao = new CsOrder();
	
	/**
	 * 根据系统订单号数组查询订单
	 * @param orderNos 系统订单号数组
	 * @return List<CsOrder>
	 */
	public List<CsOrder> getOrdersByIds(String[] ids) {
		List<CsOrder> orders;
		// 非空判断
		if (null==ids || ids.length<1) {
			orders = new ArrayList<>();
			return orders;
		}
		// 通过系统订单号查询订单
		StringBuffer sql = new StringBuffer("select t.* from cs_order t where t.id in ( ");
		for (int i = 0, j = ids.length; i < j; i++) {
			sql.append("?");
			if (i < (j - 1)) {
				sql.append(",");
			}
		}
		sql.append(")");
		orders = this.dao.find(sql.toString(), ids);
		return orders;
	}
	
	/**
	 * 根据系统订单号数组查询订单
	 * @param orderNos 系统订单号数组
	 * @return List<CsOrder>
	 */
	public List<CsOrder> getOrdersByOrderNos(String[] orderNos) {
		List<CsOrder> orders;
		// 非空判断
		if (null==orderNos || orderNos.length<1) {
			orders = new ArrayList<>();
			return orders;
		}
		// 通过系统订单号查询订单
		StringBuffer sql = new StringBuffer("select t.* from cs_order t where t.order_no in ( ");
		for (int i = 0, j = orderNos.length; i < j; i++) {
			sql.append("?");
			if (i < (j - 1)) {
				sql.append(",");
			}
		}
		sql.append(")");
		orders = this.dao.find(sql.toString(), orderNos);
		return orders;
	}
	
	/**
	 * 订单分页查询
	 * @param params
	 * @param pageNo
	 * @param pageSize
	 * @return Page<CsOrder>
	 */
	public Page<CsOrder> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
		StringBuilder selectSql = new StringBuilder();
		selectSql.append("select t.* ");
		// 计划量
		selectSql.append(",(SELECT IFNULL(SUM(C.plan_amount),0) FROM cs_order_cargo C WHERE C.order_no = T.order_no "
				+ ") AS plan_amount, ");
		// 已分配量
		selectSql.append("(SELECT IFNULL(SUM(C.distribution_amount),0) FROM cs_order_cargo C WHERE C.order_no = T.order_no "
						+ ") AS distribution_amount, ");
		// 剩余量：订单商品计划量-已分配量
		selectSql.append("(SELECT IFNULL(SUM(IFNULL(C.plan_amount, 0)) - SUM(IFNULL(C.distribution_amount,0)), 0) FROM cs_order_cargo C WHERE C.order_no = T.order_no "
				+ ") AS remainder_amount ");
		StringBuilder extSql = new StringBuilder();
		// 其它
		extSql.append("from cs_order t ");
		extSql.append("where 1 = 1");
		// 系统订单号
		String orderNo = (String) params.get("order_no");
		String orderNos = (String) params.get("order_nos");
		// 客户订单号
		String customerOrderNo = (String) params.get("customer_order_no");
		// 订单类型
		String orderType = (String) params.get("order_type");
		// 客户代码
		String customerCode = (String) params.get("customer_code");
		// 状态
		String status = (String) params.get("status");
		// 客户类型
		String customerType = (String) params.get("customer_type");
		// 发货客户代码
		String shipperCode = (String) params.get("shipper_code");
		// 发货客户名称
		String shipperName = (String) params.get("shipper_name");
		// 收货客户代码
		String consigneeCode = (String) params.get("consignee_code");
		// 收货客户名称
		String consigneeName = (String) params.get("consignee_name");
		// 订单来源
		String orderSource = (String) params.get("order_source");
		// 结算方式
		String chargeMode = (String) params.get("charge_mode");
		// 创建时间从
		String createTimeFrom = (String) params.get("create_time_from");
		// 创建时间到
		String createTimeTo = (String) params.get("create_time_to");
		// 账套ID
		String tenancy = (String) params.get("tenancy");

		List<String> param = new ArrayList<String>();
		if (StringUtils.isNotBlank(orderNo)) {
			extSql.append(" and t.order_no like ?");
			param.add("%" + orderNo + "%");
		}
		//费用状态
		if(StringUtils.isNotBlank(orderNos)){
			extSql.append(" and order_no in (");
			String[] orderNoList = StringUtils.split(orderNos,",");
			for (int i = 0; i < orderNoList.length; i++) {
				extSql.append("?");
				param.add(orderNoList[i]);
				if (i < (orderNoList.length - 1)) {
					extSql.append(",");
				}
			}
			extSql.append(")");
		}
		if (StringUtils.isNotBlank(customerOrderNo)) {
			extSql.append(" and t.customer_order_no like ?");
			param.add("%" + customerOrderNo + "%");
		}
		
		if (StringUtils.isNotEmpty(orderType)) {
			extSql.append(" and t.order_type = ?");
			param.add(orderType);
		}
		if (StringUtils.isNotBlank(customerCode)) {
			extSql.append(" and t.customer_code = ? ");
			param.add(customerCode);
		}
		if (StringUtils.isNotBlank(status)) {
			extSql.append(" and t.status = ? ");
			param.add(status);
		}
		if (StringUtils.isNotBlank(customerType)) {
			extSql.append(" and t.customer_type = ? ");
			param.add(customerType);
		}
		if (StringUtils.isNotBlank(shipperCode)) {
			extSql.append(" and t.shipper_code = ? ");
			param.add(shipperCode);
		}
		if (StringUtils.isNotBlank(shipperName)) {
			extSql.append(" and t.shipper_name like ? ");
			param.add("%" + shipperName + "%");
		}
		if (StringUtils.isNotBlank(consigneeCode)) {
			extSql.append(" and t.consignee_code = ? ");
			param.add(consigneeCode);
		}
		if (StringUtils.isNotBlank(consigneeName)) {
			extSql.append(" and t.consignee_name like ? ");
			param.add("%" + consigneeName + "%");
		}
		if (StringUtils.isNotBlank(orderSource)) {
			extSql.append(" and t.order_source = ? ");
			param.add(orderSource);
		}
		if (StringUtils.isNotBlank(chargeMode)) {
			extSql.append(" and t.charge_mode = ? ");
			param.add(chargeMode);
		}
		if (StringUtils.isNotBlank(createTimeFrom)) {
			extSql.append(" and t.create_time >= ? ");
			param.add(createTimeFrom);
		}
		if (StringUtils.isNotBlank(createTimeTo)) {
			extSql.append(" and t.create_time <= ? ");
			param.add(createTimeTo);
		}
		if (StringUtils.isNotBlank(tenancy)) {
			extSql.append(" and t.tenancy = ? ");
			param.add(tenancy);
		}

		extSql.append(" order by t.modify_time desc");
		if (param.isEmpty()) {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString());
		} else {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString(), param.toArray());
		}
	}
	
	/**
	 * 根据系统订单号数组查询订单
	 * @param orderNos 系统订单号数组
	 * @return List<CsOrder>
	 */
	public List<CsOrder> getSchedulingOrdersByOrderNos(String[] orderNos) {
		List<CsOrder> orders;
		// 非空判断
		if (null==orderNos || orderNos.length<1) {
			orders = new ArrayList<>();
			return orders;
		}
		// 通过系统订单号查询订单
		StringBuffer sql = new StringBuffer("select t.*,c.cargo_code,c.cargo_name,c.cargo_type,c.unit,c.plan_amount,c.dispatch_amount,"
				+ " IFNULL(IFNULL(SUM(C.plan_amount), 0) - IFNULL(SUM(C.dispatch_amount), 0),0) as remainder_amount"
				+ " from cs_order t"
				+ " left join cs_order_cargo c on c.order_no = t.order_no"
				+ " where t.order_no in ( ");
				
		for (int i = 0, j = orderNos.length; i < j; i++) {
			sql.append("?");
			if (i < (j - 1)) {
				sql.append(",");
			}
		}
		sql.append(")");
		orders = this.dao.find(sql.toString(), orderNos);
		return orders;
	}
	
	/**
	 * 订单调度分页查询
	 *
	 * @param params
	 * @param pageNo
	 * @param pageSize
	 * @return
	 */
	public Page<CsOrder> getSchedulingPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
		StringBuilder selectSql = new StringBuilder();
		selectSql.append("select t.* ");
		//商品名称
		selectSql.append(",(SELECT cargo_name FROM cs_order_cargo C WHERE C.order_no = T.order_no "
				+ "limit 1) AS cargo_name, ");
		// 计划量
		selectSql.append("(SELECT IFNULL(SUM(C.plan_amount),0) FROM cs_order_cargo C WHERE C.order_no = T.order_no "
				+ ") AS plan_amount, ");
		// 剩余量：订单商品计划量-调度量
		selectSql.append("(SELECT IFNULL(IFNULL(SUM(C.plan_amount), 0) - IFNULL(SUM(C.dispatch_amount), 0),0) FROM cs_order_cargo C WHERE C.order_no = T.order_no "
				+ ") AS remainder_amount ");
		
		StringBuilder extSql = new StringBuilder();
		// 其它
		extSql.append("from cs_order t ");
		extSql.append("where 1 = 1");
		extSql.append(" and t.status in ('20','30')");
		
		// 系统订单号
		String orderNo = (String) params.get("order_no");
		// 客户订单号
		String customerOrderNo = (String) params.get("customer_order_no");
		// 订单类型
		String orderType = (String) params.get("order_type");
		// 客户代码
		String customerCode = (String) params.get("customer_code");
		// 状态
		String status = (String) params.get("status");
		// 客户类型
		String customerType = (String) params.get("customer_type");
		// 发货客户代码
		String shipperCode = (String) params.get("shipper_code");
		// 收货客户代码
		String consigneeCode = (String) params.get("consignee_code");
		// 订单来源
		String orderSource = (String) params.get("order_source");
		// 结算方式
		String chargeMode = (String) params.get("charge_mode");
		// 付款方式
		String payType = (String) params.get("pay_type");
		// 创建时间从
		String createTimeFrom = (String) params.get("create_time_from");
		// 创建时间到
		String createTimeTo = (String) params.get("create_time_to");
		// 账套ID
		String tenancy = (String) params.get("tenancy");

		List<String> param = new ArrayList<String>();
		if (StringUtils.isNotBlank(orderNo)) {
			extSql.append(" and t.order_no like ?");
			param.add(orderNo);
		}
		if (StringUtils.isNotBlank(customerOrderNo)) {
			extSql.append(" and t.customer_order_no like ?");
			param.add("%" + customerOrderNo + "%");
		}
		if (StringUtils.isNotBlank(orderType)) {
			extSql.append(" and t.order_type = ?");
			param.add(orderType);
		}
		if (StringUtils.isNotBlank(customerCode)) {
			extSql.append(" and t.customer_code = ? ");
			param.add(customerCode);
		}
		if (StringUtils.isNotBlank(status)) {
			extSql.append(" and t.status = ? ");
			param.add(status);
		}
		if (StringUtils.isNotBlank(customerType)) {
			extSql.append(" and t.customer_type = ? ");
			param.add(customerType);
		}
		if (StringUtils.isNotBlank(shipperCode)) {
			extSql.append(" and t.shipper_code = ? ");
			param.add(shipperCode);
		}
		if (StringUtils.isNotBlank(consigneeCode)) {
			extSql.append(" and t.consignee_code = ? ");
			param.add(consigneeCode);
		}
		if (StringUtils.isNotBlank(orderSource)) {
			extSql.append(" and t.order_source = ? ");
			param.add(orderSource);
		}
		if (StringUtils.isNotBlank(chargeMode)) {
			extSql.append(" and t.charge_mode = ? ");
			param.add(chargeMode);
		}
		if (StringUtils.isNotBlank(payType)) {
			extSql.append(" and t.pay_type = ? ");
			param.add(payType);
		}
		if (StringUtils.isNotBlank(createTimeFrom)) {
			extSql.append(" and t.create_time >= ? ");
			param.add(createTimeFrom);
		}
		if (StringUtils.isNotBlank(createTimeTo)) {
			extSql.append(" and t.create_time <= ? ");
			param.add(createTimeTo);
		}
		if (StringUtils.isNotBlank(status)) {
			extSql.append(" and t.status = ? ");
			param.add(status);
		}
		if (StringUtils.isNotBlank(tenancy)) {
			extSql.append(" and t.tenancy = ? ");
			param.add(tenancy);
		}
		extSql.append(" and (SELECT IFNULL(IFNULL(SUM(C.plan_amount), 0) - IFNULL(SUM(C.dispatch_amount), 0),0) FROM cs_order_cargo C WHERE C.order_no = T.order_no ) > 0");

		extSql.append(" order by t.modify_time desc");
		if (param.isEmpty()) {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString());
		} else {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString(), param.toArray());
		}
	}
	
	/**
     * 保存订单
     * @param csOrder
     */
    public void save(CsOrder csOrder) {
        if (null == csOrder.get("id")) {
        	csOrder.save();
        } else {
        	csOrder.update();
        }
    }
	
	/**
	 * 根据系统订单号数组删除订单
	 * @param orderNos
	 * @return int
	 */
	public int deleteAllByOrderIds(String[] ids) {
		if (null==ids || ids.length==0) {
			return 0;
		}
		
		StringBuilder sql = new StringBuilder("delete from cs_order where id in(");
		for (int i = 0; i < ids.length; i++) {
			sql.append("?");
			if (i < (ids.length - 1)) {
				sql.append(",");
			}
		}
		sql.append(")");
		return Db.update(sql.toString(), ids);
	}
	
	/**
     * 根据系统订单号更新订单状态
     * @param id
     * @param modifier 修改人id
     * @param status 修改的状态代码
     * @return int
     */
    public int updateStatus(String id, Integer modifier, String status) {
    	String sql = null;
    	if ("10".equals(status)) {
    		// 如果是创建状态(取消确认)，则同时清空发货地、收货地的电子围栏
    		sql = "update cs_order set modifier=?, modify_time=now(), rec_ver=rec_ver+1, status=? "
    				+ "where id=?";
    	} else {
    		sql = "update cs_order set modifier=?, modify_time=now(), rec_ver=rec_ver+1, status=? where id=?";
    	}
        return Db.update(sql, modifier, status, id);
    }
    
    /**
     * 更新订单状态
     * @param ids
     * @param modifier
     * @param status
     */
    public void updateOrderStatus(String[] ids, Integer modifier, String status) {
    	// 更新订单状态
    	Map<String, Object> params = new HashMap<String,Object>();
        params.put("ids",ids);
        params.put("modifier",modifier);
        params.put("status",status);
    	new SqlExecutor().update("csOrder_status_update", params);
    	// 记录更新里程碑
    	
    }
    
    /**
	 * 加载客户货量执行比信息
	 * @return CsOrder
	 */
	public List<CsOrder> loadContractExecuteRateHandler() {
		// 加载客户货量执行比信息
		StringBuffer sql = new StringBuffer("SELECT cscc.contract_name,"
							+ " ifnull(cscc.contract_number,0) as contract_number,"
							+ " ifnull(t.unload_amount,0) as unload_amount"
							+ " FROM cs_customer_contract cscc LEFT JOIN ("
							+ " 	SELECT 	customer_contract_id,sum(csoc.plan_amount) AS plan_amount, "
							+ " 			sum(csoc.dispatch_amount) AS dispatch_amount, "
							+ " 			sum(csoc.load_amount) AS load_amount, "
							+ " 			sum(csoc.unload_amount) AS unload_amount "
							+ " 	FROM cs_order csor LEFT JOIN cs_order_cargo csoc ON csoc.order_no = csor.order_no"
							+ " 		GROUP BY csor.customer_contract_id"
							+ " ) t ON t.customer_contract_id = cscc.contract_code"
							+ " WHERE 1=1 "
							+ " and cscc.status='3' "
							);
		List<CsOrder>  orders = this.dao.find(sql.toString());
		return orders;
	}
	
}
