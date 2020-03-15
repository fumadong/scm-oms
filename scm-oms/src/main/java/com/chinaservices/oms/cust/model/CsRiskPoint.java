package com.chinaservices.oms.cust.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 风险点
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 5, 2017
 */
@Table(tableName = "cs_risk_point", pkName = "id")
public class CsRiskPoint extends Model<CsRiskPoint> {

	public static final CsRiskPoint dao = new CsRiskPoint();

	public void saveOrUpdate(CsRiskPoint model) {
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
		String sql = "delete from cs_risk_point where measured_no=?";
		return Db.update(sql, measureNo);
	}
}
