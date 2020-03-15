package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 成本预算
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 5, 2017
 */
@Table(tableName = "cs_cost_measured", pkName = "id")
public class CsCostMeasured extends Model<CsCostMeasured> {

	public static final CsCostMeasured dao = new CsCostMeasured();

	public void saveOrUpdate(CsCostMeasured model) {
		if (null == model.getInt("id")) {
			model.set("create_time", DateUtil.now());
			model.set("rec_ver", 1);
			model.save();
		} else {
			model.set("modify_time", DateUtil.now());
			model.update();
		}
	}

	/**
	 * 更新状态
	 *
	 * @param id
	 * @param modifier
	 * @param status
	 * @return
	 */
	public int updateStatus(Integer id, String modifier, String status) {
		String sql = "update cs_cost_measured set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
		return Db.update(sql, modifier, status, id);
	}

	/**
	 * 审核
	 *
	 * @param id
	 * @param modifier
	 * @param status
	 * @return
	 */
	public int audit(Integer id, String modifier, String status) {
		String sql = "update cs_cost_measured set modifier=?,auditor=?,audit_time=now(),modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
		return Db.update(sql, modifier, modifier, status, id);
	}
}
