package com.chinaservices.oms.order.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.EmptyUtils;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 订单
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_order_cargo", pkName = "id")
public class CsOrderCargo extends Model<CsOrderCargo> {
	
	public static final CsOrderCargo dao = new CsOrderCargo();
	
	/**
     * 保存订单商品
     * @param csOrderCargo
     */
    public void save(CsOrderCargo csOrderCargo) {
        if (null == csOrderCargo.get("id")) {
        	csOrderCargo.save();
        } else {
        	csOrderCargo.update();
        }
    }
	
	/**
	 * 订单商品分页查询
	 * @param params
	 * @param pageNo
	 * @param pageSize
	 * @return Page<CsOrderCargo>
	 */
	public Page<CsOrderCargo> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
		StringBuilder selectSql = new StringBuilder();
		selectSql.append("select t.* ");
		selectSql.append(", (t.plan_amount - IFNULL(t.distribution_amount, 0)) as remainder_amount "); // 剩余量
		
		StringBuilder extSql = new StringBuilder();
		// 其它
		extSql.append("from cs_order_cargo t ");
		extSql.append("where 1 = 1");
		// 系统订单号
		String orderNo = (String) params.get("order_no");
		// 账套ID
		String tenancy = (String) params.get("tenancy");

		List<String> param = new ArrayList<String>();
		if (EmptyUtils.isNotEmpty(orderNo)) {
			extSql.append(" and t.order_no = ?");
			param.add(orderNo);
		}
		if (EmptyUtils.isNotEmpty(tenancy)) {
			extSql.append(" and t.tenancy = ? ");
			param.add(tenancy);
		}

		extSql.append(" order by t.cargo_code ");
		if (param.isEmpty()) {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString());
		} else {
			return paginate(pageNo, pageSize, selectSql.toString(), extSql.toString(), param.toArray());
		}
	}
	
	/**
	 * 根据系统订单号数组删除数据
	 * @param orderNos
	 * @return int
	 */
	public int deleteAllByOrderIds(Object[] ids) {
		if (null == ids || ids.length == 0) {
			return 0;
		} else {
			StringBuilder sql = new StringBuilder("delete from cs_order_cargo where order_id in(");
			for (int i = 0; i < ids.length; i++) {
				sql.append("?");
				if (i < (ids.length - 1)) {
					sql.append(",");
				}
			}
			sql.append(")");
			return Db.update(sql.toString(), ids);
		}
	}
	
	public Double getDouble(String obj){
		if(obj != null && !"".equals(obj)){
			return Double.parseDouble(obj);
		}else{
			return 0D;
		}
	}
	
}
