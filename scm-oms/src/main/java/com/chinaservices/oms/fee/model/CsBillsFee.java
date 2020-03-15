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
@Table(tableName = "cs_bills_fee", pkName = "id")
public class CsBillsFee extends Model<CsBillsFee> {

    public static final CsBillsFee dao = new CsBillsFee();

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
            StringBuilder sql = new StringBuilder("delete from cs_bills_fee where id in(");
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
    public void saveOrUpdate(CsBillsFee feeName) {
        if (null == feeName.get("id")) {
            feeName.set("create_time", DateUtil.now());
            feeName.set("rec_ver", 1);
            feeName.save();
        } else {
            feeName.set("modify_time", DateUtil.now());
            feeName.update();
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
    public Page<CsBillsFee> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_bills_fee t ");
        extSql.append("where 1=1 ");
        if (null != params.get("bill_no") && !"".equals(params.get("bill_no"))) {
            extSql.append("and bill_no = ").append(params.get("bill_no")).append(" ");
        }

        if (null != params.get("fee_status") && !"".equals(params.get("fee_status"))) {
            extSql.append("and fee_status = '").append(params.get("fee_status")).append("' ");
        }
        extSql.append("order by create_time desc ");
        return paginate(pageNo, pageSize, selectSql, extSql.toString());
    }

}
