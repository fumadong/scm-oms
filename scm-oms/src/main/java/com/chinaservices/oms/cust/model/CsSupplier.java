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
 * 供应商管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, May 17, 2017
 */
@Table(tableName = "cs_supplier", pkName = "id")
public class CsSupplier extends Model<CsSupplier> {

    public static final CsSupplier dao = new CsSupplier();

    /**
     * 保存或者更新
     *
     * @param supplier
     */
    public void saveOrUpdate(CsSupplier supplier) {
        if (null == supplier.get("id")) {
            supplier.set("create_time", DateUtil.now());
            supplier.set("rec_ver", 1);
            supplier.save();
        } else {
            supplier.set("modify_time", DateUtil.now());
            supplier.update();
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
    public Page<CsSupplier> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_supplier t ");
        extSql.append("where 1=1 ");
        if (null != params.get("supplier_code") && !"".equals(params.get("supplier_code"))) {
            extSql.append("and supplier_code like '%").append(params.get("supplier_code")).append("%' ");
        }
        
        if (null != params.get("supplier_name") && !"".equals(params.get("supplier_name"))) {
            extSql.append("and supplier_name like '%").append(params.get("supplier_name")).append("%' ");
        }

        if (null != params.get("supplier_type") && !"".equals(String.valueOf(params.get("supplier_type")).trim())) {
            extSql.append("and supplier_type = '").append(params.get("supplier_type")).append("' ");
        }

        if (null != params.get("settlement_code") && !"".equals(params.get("settlement_code"))) {
            extSql.append("and settlement_code like '%").append(params.get("settlement_code")).append("%' ");
        }

        if (null != params.get("province_code") && !"".equals(params.get("province_code"))) {
            extSql.append("and province_code = '").append(params.get("province_code")).append("' ");
        }

        if (null != params.get("city_code") && !"".equals(params.get("city_code"))) {
            extSql.append("and city_code = '").append(params.get("city_code")).append("' ");
        }

        if (null != params.get("county_code") && !"".equals(params.get("county_code"))) {
            extSql.append("and county_code = '").append(params.get("county_code")).append("' ");
        }

        if (null != params.get("status") && !"".equals(String.valueOf(params.get("status")).trim())) {
            extSql.append("and status = '").append(params.get("status")).append("' ");
        }
        extSql.append("order by create_time desc ");
        return paginate(pageNo, pageSize, selectSql, extSql.toString());
    }

    /**
     * 根据id供应商状态
     *
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, String modifier, String status) {
        String sql = "update cs_supplier set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }

    /**
     * 检查是否有重复供应商代码
     *
     * @param id
     * @param vehicleNo
     * @return
     */
    public boolean checkDuplicateSupplierCode(Integer id, String vehicleNo) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_supplier where supplier_code=? ";
        params.add(vehicleNo);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
}
