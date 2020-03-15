package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 成本预算明细
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 5, 2017
 */
@Table(tableName = "cs_cost_measured_detail", pkName = "id")
public class CsCostMeasuredDetail extends Model<CsCostMeasuredDetail> {

	public static final CsCostMeasuredDetail dao = new CsCostMeasuredDetail();

	public void saveOrUpdate(CsCostMeasuredDetail model) {
		if (null == model.getInt("id")) {
			model.set("create_time", DateUtil.now());
			model.set("rec_ver", 1);
			model.save();
		} else {
			model.set("modify_time", DateUtil.now());
			model.update();
		}
	}

	public int deleteByMeasureNo(String measureNo) {
		String sql = "delete from cs_cost_measured_detail where measured_no=?";
		return Db.update(sql, measureNo);
	}

}
