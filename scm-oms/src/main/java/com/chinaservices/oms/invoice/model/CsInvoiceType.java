package com.chinaservices.oms.invoice.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 发票
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Dylan Fu
 * @since 1.0, March 5, 2020
 */
@Table(tableName = "cs_invoice_type", pkName = "id")
public class CsInvoiceType extends Model<CsInvoiceType> {

    public static final CsInvoiceType dao = new CsInvoiceType();

    /**
     * 保存或者更新
     *
     * @param csInvoiceType
     */
    public void saveOrUpdate(CsInvoiceType csInvoiceType) {
        if (null == csInvoiceType.get("id")) {
            csInvoiceType.set("create_time", DateUtil.now());
            csInvoiceType.set("rec_ver", 1);
            csInvoiceType.set("tenancy",1);
            csInvoiceType.set("modifier", DateUtil.now());
            csInvoiceType.save();
        } else {
            csInvoiceType.set("modify_time", DateUtil.now());
            csInvoiceType.update();
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
    public Page<CsInvoiceType> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_invoice_type t ");
        extSql.append("where 1=1 ");
        if (null != params.get("invoice_type_code") && !"".equals(params.get("invoice_type_code"))) {
            extSql.append("and invoice_type_code like '%").append(params.get("invoice_type_code")).append("%' ");
        }
        
        if (null != params.get("invoice_type_name") && !"".equals(params.get("invoice_type_name"))) {
            extSql.append("and invoice_type_name like '%").append(params.get("invoice_type_name")).append("%' ");
        }
        extSql.append("order by create_time desc ");
        return paginate(pageNo, pageSize, selectSql, extSql.toString());
    }


    /**
     * 检查是否有重复发票
     *
     * @param id
     * @param vehicleNo
     * @return
     */
    public boolean checkDuplicateSupplierCode(Integer id, String vehicleNo) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_invoice_type where invoice_type_code=? ";
        params.add(vehicleNo);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
}
