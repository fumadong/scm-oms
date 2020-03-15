package com.chinaservices.oms.cust.model;

import com.chinaservices.oms.dispatch.model.CsDispatchOrder;
import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 合同管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, May 22, 2017
 */
@Table(tableName = "cs_customer_contract", pkName = "id")
public class CsCustomerContract extends Model<CsCustomerContract> {

    public static final CsCustomerContract dao = new CsCustomerContract();

    public CsCustomerContract findByCode(String code) {
    	return dao.findFirst("select * from cs_customer_contract where contract_code=?", code);
	}

    /**
     * 保存或者更新
     *
     * @param customerContract
     */
    public void saveOrUpdate(CsCustomerContract customerContract) {
        if (null == customerContract.get("id")) {
            customerContract.set("create_time", DateUtil.now());
            customerContract.set("rec_ver", 1);
            customerContract.save();
        } else {
            customerContract.set("modify_time", DateUtil.now());
            customerContract.update();
        }
    }

    /**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsCustomerContract> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_customer_contract t ");
        extSql.append("where 1=1 ");
        if (null != params.get("contract_code") && !"".equals(params.get("contract_code"))) {
            extSql.append("and contract_code like '%").append(params.get("contract_code")).append("%' ");
        }
        if (null != params.get("contract_name") && !"".equals(params.get("contract_name"))) {
            extSql.append("and contract_name like '%").append(params.get("contract_name")).append("%' ");
        }
        if (null != params.get("sign_personnel") && !"".equals(params.get("sign_personnel"))) {
            extSql.append("and sign_personnel like '%").append(params.get("sign_personnel")).append("%' ");
        }
        if (null != params.get("customer_code") && !"".equals(params.get("customer_code"))) {
            extSql.append("and customer_code = '").append(params.get("customer_code")).append("' ");
        }
        if (null != params.get("sign_time_start") && !"".equals(params.get("sign_time_start"))) {
            extSql.append("and sign_time >= '").append(params.get("sign_time_start")).append(" 00:00:00").append("' ");
        }

        if (null != params.get("sign_time_end") && !"".equals(params.get("sign_time_end"))) {
            extSql.append("and sign_time <= '").append(params.get("sign_time_end")).append(" 23:59:59").append("' ");
        }
        if (null != params.get("status") && !"".equals(params.get("status"))) {
            extSql.append("and status = '").append(params.get("status")).append("' ");
        }
		if (null != params.get("is_frame_contract") && !"".equals(params.get("is_frame_contract"))) {
			extSql.append("and is_frame_contract = ").append(params.get("is_frame_contract")).append(" ");
		}
        extSql.append("order by create_time desc ");
        return paginate(pageNo, pageSize, selectSql, extSql.toString());
    }

    /**
     * 根据id更新状态
     *
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, Integer modifier, String status) {
        String sql = "update cs_customer_contract set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }

	/**
     * 审核，取消审核
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int audit(Integer id, String modifier, String status) {
        String sql = "update cs_customer_contract set modifier=?,auditor=?,audit_time=now(),modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, modifier, status, id);
    }

    /**
     * 检查是否有重复车牌号
     * @param id
     * @param contractCode
     * @return
     */
    public boolean checkDuplicateContractCode(Integer id, String contractCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_customer_contract where contract_code=? ";
        params.add(contractCode);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
    
    /**
     * 根据合同获取对应的流向费用信息
     * @param csDispatchOrder
     * @return
     */
    public List<CsCustomerContract> queryPositionFeeByContract(CsDispatchOrder csDispatchOrder){
    	List<CsCustomerContract> contractfees;
    	if(csDispatchOrder == null){
    		contractfees = new ArrayList<CsCustomerContract>();
    		return contractfees;
    	}
    	
    	//获取合同
		String contractCode = csDispatchOrder.getStr("contract_code");
		
		//获取下单日期
		Date orderTime = csDispatchOrder.getDate("order_time");
		
		// 非空判断
		if (StringUtils.isNotBlank(contractCode)) {
			// 通过派车单ID查询出派车单信息
			StringBuffer sql = new StringBuffer("SELECT "
					+ "csr.contract_code,"
					+ "csr.contract_name,"
					+ "csr.payment_method,"
					+ "csrp.from_province_code,"
					+ "csrp.from_province,"
					+ "csrp.from_city_code,"
					+ "csrp.from_city,"
					+ "csrp.from_county_code,"
					+ "csrp.from_county,"
					+ "csrp.from_address,"
					+ "csrp.to_province_code,"
					+ "csrp.to_province,"
					+ "csrp.to_city_code,"
					+ "csrp.to_city,"
					+ "csrp.to_county_code,"
					+ "csrp.to_county,"
					+ "csrp.to_address,"
					+ "csrp.cargo_code,"
					+ "csrf.customer_contract_position_id,"
					+ "csrf.fee_name_code,"
					+ "csrf.fee_name,"
					+ "csrf.interval_from,"
					+ "csrf.interval_to,"
					+ "csrf.start_time,"
					+ "csrf.end_time,"
					+ "csrf.contract_fee_type,"
					+ "csrf.reserve_price,"
					+ "csrf.fee_unit"
					+ " FROM cs_customer_contract_fee csrf "+
					" LEFT JOIN cs_customer_contract_position csrp ON csrp.id = csrf.customer_contract_position_id"+
					" LEFT JOIN cs_customer_contract csr ON csrp.contract_code = csr.contract_code"+
					" WHERE 1=1 "+
					" AND csr.contract_date_from <= ?"+
					" AND csr.contract_date_to >= ?"+
					" AND csrf.start_time <= ?"+
					" AND csrf.end_time >= ?"+
					" AND csr.status = 3 "+
					" AND csr.contract_code = ?"
					);
			contractfees = this.dao.find(sql.toString(),orderTime,orderTime,orderTime,orderTime, contractCode);
		}else{
			contractfees = new ArrayList<CsCustomerContract>();
		}
		
		return contractfees;
    }
//    
//    /**
//     * 根据合同获取对应的流向信息
//     * @param CsOrder
//     * @return
//     */
//    public List<CsCustomerContract> queryPositionByContract(CsOrder csOrder){
//    	List<CsCustomerContract> contractPositions;
//    	if(csOrder == null){
//    		contractPositions = new ArrayList<CsCustomerContract>();
//    		return contractPositions;
//    	}
//    	
//    	//获取合同
//		String contractCode = csOrder.getStr("customer_contract_id");
//		
//		//获取下单日期
//		Date orderTime = csOrder.getDate("order_time");
//		
//		// 非空判断
//		if (StringUtils.isNotBlank(contractCode)) {
//			// 通过派车单ID查询出派车单信息
//			StringBuffer sql = new StringBuffer("SELECT "
//					+ "csr.contract_code,"
//					+ "csr.contract_name,"
//					+ "csr.payment_method,"
//					+ "csrp.from_province_code,"
//					+ "csrp.from_province,"
//					+ "csrp.from_city_code,"
//					+ "csrp.from_city,"
//					+ "csrp.from_county_code,"
//					+ "csrp.from_county,"
//					+ "csrp.from_address,"
//					+ "csrp.to_province_code,"
//					+ "csrp.to_province,"
//					+ "csrp.to_city_code,"
//					+ "csrp.to_city,"
//					+ "csrp.to_county_code,"
//					+ "csrp.to_county,"
//					+ "csrp.to_address,"
//					+ "csrp.remark,"
//					+ "csrp.cargo_code"+
//					" FROM cs_customer_contract_position csrp"+
//					" LEFT JOIN cs_customer_contract csr ON csrp.contract_code = csr.contract_code"+
//					" WHERE 1=1 "+
//					" AND csr.contract_date_from <= ?"+
//					" AND csr.contract_date_to >= ?"+
//					" AND csr.status = 3 "+
//					" AND csr.contract_code = ?"
//					);
//			contractPositions = this.dao.find(sql.toString(),orderTime,orderTime,contractCode);
//		}else{
//			contractPositions = new ArrayList<CsCustomerContract>();
//		}
//		
//		return contractPositions;
//    }
}
