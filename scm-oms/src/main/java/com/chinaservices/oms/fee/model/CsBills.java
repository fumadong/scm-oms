package com.chinaservices.oms.fee.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 费用名称管理
 *
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, june 3, 2017
 */
@Table(tableName = "cs_bills", pkName = "id")
public class CsBills extends Model<CsBills> {

    public static final CsBills dao = new CsBills();

    /**
     * 根据id集合删除数据
     *
     * @param ids
     * @return
     */
    public int deleteAllById(Object[] ids) {
        if (null == ids || ids.length == 0) {
            return 0;
        } else {
            StringBuilder sql = new StringBuilder("delete from cs_bills where id in(");
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

    /**
     * 保存或者更新
     *
     * @param feeName
     */
    public void saveOrUpdate(CsBills csBills) {
        if (null == csBills.get("id")) {
        	csBills.set("create_time", DateUtil.now());
        	csBills.set("rec_ver", 1);
        	csBills.save();
        } else {
        	csBills.set("modify_time", DateUtil.now());
        	csBills.update();
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
    public Page<CsBills> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_bills t ");
        extSql.append("where 1=1 ");
        if (null != params.get("bill_no") && !"".equals(params.get("bill_no"))) {
            extSql.append("and bill_no like '%").append(params.get("bill_no")).append("%' ");
        }

        if (null != params.get("carrier_code") && !"".equals(params.get("carrier_code"))) {
            extSql.append("and carrier_code like '%").append(params.get("carrier_code")).append("%' ");
        }

        if (null != params.get("carrier_name") && !"".equals(params.get("carrier_name"))) {
            extSql.append("and carrier_name = '").append(params.get("carrier_name")).append("' ");
        }

        if (null != params.get("bill_status") && !"".equals(params.get("bill_status"))) {
            extSql.append("and bill_status = '").append(params.get("bill_status")).append("' ");
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
        String sql = "update cs_bills set modifier=?,modify_time=now(),rec_ver=rec_ver+1,bill_status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }

}
