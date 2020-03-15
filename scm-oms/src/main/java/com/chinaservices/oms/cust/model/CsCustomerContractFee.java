package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

import java.util.List;

/**
 * 合同费率
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 10, 2017
 */
@Table(tableName = "cs_customer_contract_fee", pkName = "id")
public class CsCustomerContractFee extends Model<CsCustomerContractFee> {

	public static final CsCustomerContractFee dao = new CsCustomerContractFee();

	public void saveOrUpdate(CsCustomerContractFee model) {
		if (null == model.get("id")) {
			model.set("create_time", DateUtil.now());
			model.set("rec_ver", 1);
			model.save();
		} else {
			model.set("modify_time", DateUtil.now());
			model.update();
		}
	}

	public List<CsCustomerContractFee> findByPositionId(Integer positionId) {
		String sql = "select * from cs_customer_contract_fee where customer_contract_position_id=?";
		return dao.find(sql, positionId);
	}

	public int deleteByPositionId(Integer positionId) {
		String sql = "delete from cs_customer_contract_fee where customer_contract_position_id=?";
		return Db.update(sql, positionId);
	}
}
