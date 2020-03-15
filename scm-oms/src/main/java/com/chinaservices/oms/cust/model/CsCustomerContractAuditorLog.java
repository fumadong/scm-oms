package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 合同操作历史
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 10, 2017
 */
@Table(tableName = "cs_customer_contract_auditor_log", pkName = "id")
public class CsCustomerContractAuditorLog extends Model<CsCustomerContractAuditorLog> {

	public static final CsCustomerContractAuditorLog dao = new CsCustomerContractAuditorLog();

	public int deleteByContractNo(String contractNo) {
		String sql = "delete from cs_customer_contract_auditor_log where contract_code=?";
		return Db.update(sql, contractNo);
	}
}
