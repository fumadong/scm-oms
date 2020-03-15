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
@Table(tableName = "cs_fee_name", pkName = "id")
public class CsFeeName extends Model<CsFeeName> {

    public static final CsFeeName dao = new CsFeeName();

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
            StringBuilder sql = new StringBuilder("delete from cs_fee_name where id in(");
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
    public void saveOrUpdate(CsFeeName feeName) {
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
    public Page<CsFeeName> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_fee_name t ");
        extSql.append("where 1=1 ");
        if (null != params.get("fee_name") && !"".equals(params.get("fee_name"))) {
            extSql.append("and fee_name like '%").append(params.get("fee_name")).append("%' ");
        }

        if (null != params.get("fee_name_code") && !"".equals(params.get("fee_name_code"))) {
            extSql.append("and fee_name_code like '%").append(params.get("fee_name_code")).append("%' ");
        }

        if (null != params.get("fee_type") && !"".equals(params.get("fee_type"))) {
            extSql.append("and fee_type = '").append(params.get("fee_type")).append("' ");
        }

        if (null != params.get("status") && !"".equals(params.get("status"))) {
            extSql.append("and status = '").append(params.get("status")).append("' ");
        }

        if (null != params.get("pay_or_receive") && !"".equals(params.get("pay_or_receive"))) {
            extSql.append("and pay_or_receive = '").append(params.get("pay_or_receive")).append("' ");
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
        String sql = "update cs_fee_name set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }

    /**
     * 检查是否有重复费用代码
     * @param id
     * @param vehicleNo
     * @return
     */
    public boolean checkDuplicateFeeNameCode(Integer id, String vehicleNo) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_fee_name where fee_name_code=? ";
        params.add(vehicleNo);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
    
    /**
	 * 根据费用名称编码查询费用名称信息
	 * @param feeNameCode 派车单ID
	 * @return CsFeeName
	 */
	public CsFeeName getFeeNameByCode(String feeNameCode) {
		List<CsFeeName> csFeeNames;
		
		// 非空判断
		if (StringUtils.isNotBlank(feeNameCode)) {
			// 通过派车单ID查询出派车单信息
			StringBuffer sql = new StringBuffer("select * from cs_fee_name t where 1=1 and t.fee_name_code = ?");
			csFeeNames = this.dao.find(sql.toString(), feeNameCode);
			if(csFeeNames.isEmpty()){
				return null;
			}
		}else{
			return null;
		}
		
		return csFeeNames.get(0);
	}
	
    /**
	 * 根据费用类型编码查询费用名称信息,只取第一条信息
	 * @param fee_type 费用类型
	 * @return CsFeeName
	 */
	public CsFeeName getFeeNameByType(String feeType) {
		List<CsFeeName> csFeeNames;		
		// 非空判断
		if (StringUtils.isNotBlank(feeType)) {
			// 通过派车单ID查询出派车单信息
			StringBuffer sql = new StringBuffer("select * from cs_fee_name t where 1=1 and t.fee_type = ?");
			csFeeNames = this.dao.find(sql.toString(),feeType);
			if(csFeeNames.isEmpty()){
				return null;
			}
		}else{
			return null;
		}		
		return csFeeNames.get(0);
	}
}
