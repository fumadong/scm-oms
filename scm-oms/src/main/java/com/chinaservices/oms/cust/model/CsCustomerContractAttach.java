package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import java.util.List;
import java.util.Map;

/**
 * 合同附件
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, May 22, 2017
 */
@Table(tableName = "cs_customer_contract_attach", pkName = "id")
public class CsCustomerContractAttach extends Model<CsCustomerContractAttach> {

	public static final CsCustomerContractAttach dao = new CsCustomerContractAttach();

	public int deleteByContractNo(String contractNo) {
		String sql = "delete from cs_customer_contract_attach where contract_code=?";
		return Db.update(sql, contractNo);
	}

	public List<CsCustomerContractAttach> findByContractNo(String contractNo) {
		String sql = "select * from cs_customer_contract_attach where contract_code=?";
		return dao.find(sql,contractNo);
	}

	/**
	 * 根据合同编号和文件id统计
	 *
	 * @param contractCode
	 * @param fileNo
	 * @return
	 */
	public long countByContractCodeAndFileNo(String contractCode, String fileNo) {
		String sql = "select count(1) from cs_customer_contract_attach where contract_code=? and file_no=?";
		return Db.queryLong(sql, contractCode, fileNo);
	}

	/**
	 * 删除附件
	 *
	 * @param contractCode
	 * @param fileNo
	 * @return
	 */
	public int deleteByContractCodeAndFileNo(String contractCode, String fileNo) {
		String sql = "delete from cs_customer_contract_attach where contract_code=? and file_no=?";
		return Db.update(sql, contractCode, fileNo);
	}

	/**
	 * 分页查询
	 *
	 * @param params
	 * @param pageNo
	 * @param pageSize
	 * @return
	 */
	public Page<CsCustomerContractAttach> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
		String selectSql = "select t.* ";
		StringBuilder extSql = new StringBuilder();
		extSql.append("from cs_customer_contract_attach t ");
		extSql.append("where 1=1 ");
		extSql.append("and contract_code = ? ");
		extSql.append("order by create_time desc ");
		return paginate(pageNo, pageSize, selectSql, extSql.toString(), params.get("contract_code"));
	}
}
