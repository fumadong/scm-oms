package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 客户投诉管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Bill.Lin
 * @since 1.0, May 22, 2017
 */
@Table(tableName = "cs_customer_complaints", pkName = "id")
public class CsCustomerComplaints extends Model<CsCustomerComplaints> {

    public static final CsCustomerComplaints dao = new CsCustomerComplaints();

    /**
     * 保存或者更新
     *
     * @param csCustomerComplaint
     */
    public void saveOrUpdate(CsCustomerComplaints csCustomerComplaint) {
        if (null == csCustomerComplaint.get("id")) {
        	csCustomerComplaint.set("create_time", DateUtil.now());
        	csCustomerComplaint.set("rec_ver", 1);
        	csCustomerComplaint.save();
        } else {
        	csCustomerComplaint.set("modify_time", DateUtil.now());
        	csCustomerComplaint.update();
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
    public Page<CsCustomerComplaints> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_customer_complaints t ");
        extSql.append("where 1=1 ");
        if (null != params.get("complaints_no") && !"".equals(params.get("complaints_no"))) {
            extSql.append("and complaints_no like '%").append(params.get("complaints_no")).append("%' ");
        }
        if (null != params.get("bill_no") && !"".equals(params.get("bill_no"))) {
            extSql.append("and bill_no like '%").append(params.get("bill_no")).append("%' ");
        }
        if (null != params.get("complaints_type") && !"".equals(params.get("complaints_type"))) {
            extSql.append("and complaints_type = '").append(params.get("complaints_type")).append("' ");
        }
        if (null != params.get("complainant") && !"".equals(params.get("complainant"))) {
            extSql.append("and complainant = '%").append(params.get("complainant")).append("%' ");
        }
        if (null != params.get("drive_name") && !"".equals(params.get("drive_name"))) {
            extSql.append("and drive_name = '%").append(params.get("drive_name")).append("%' ");
        }
        if (null != params.get("vehicle_no") && !"".equals(params.get("vehicle_no"))) {
            extSql.append("and vehicle_no = '%").append(params.get("vehicle_no")).append("%' ");
        }
        if (null != params.get("complaints_status") && !"".equals(params.get("complaints_status"))) {
            extSql.append("and complaints_status = '").append(params.get("complaints_status")).append("' ");
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
    public int updateStatus(Integer id, String modifier, String status) {
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
    
}
