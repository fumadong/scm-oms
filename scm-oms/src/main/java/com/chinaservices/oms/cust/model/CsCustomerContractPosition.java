package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Model;

import java.util.List;

/**
 * 合同流向
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 10, 2017
 */
@Table(tableName = "cs_customer_contract_position", pkName = "id")
public class CsCustomerContractPosition extends Model<CsCustomerContractPosition> {

	public static final CsCustomerContractPosition dao = new CsCustomerContractPosition();

	public void saveOrUpdate(CsCustomerContractPosition model) {
		if (null == model.get("id")) {
			model.set("create_time", DateUtil.now());
			model.set("rec_ver", 1);
			model.save();
		} else {
			model.set("modify_time", DateUtil.now());
			model.update();
		}
	}

	public List<CsCustomerContractPosition> findByContractNo(String contractNo) {
		String sql = "select * from cs_customer_contract_position where contract_code=?";
		return dao.find(sql, contractNo);
	}
}
