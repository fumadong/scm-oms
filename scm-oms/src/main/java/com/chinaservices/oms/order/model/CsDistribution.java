package com.chinaservices.oms.order.model;

import java.util.ArrayList;
import java.util.List;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 订单分配表
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_distribution", pkName = "id")
public class CsDistribution extends Model<CsDistribution> {
	
	public static final CsDistribution dao = new CsDistribution();
	
	/**
     * 保存
     * @param csDistribution
     */
    public void save(CsDistribution csDistribution) {
        if (null == csDistribution.get("id")) {
        	csDistribution.save();
        } else {
        	csDistribution.update();
        }
        return;
    }
    
    /**
     * 通过id查询数据
     * @param id
     */
    public CsDistribution getById(Integer id) {
    	if (null == id) {
    		return null;
    	}
    	String sql = "select t.* from cs_distribution t where t.id = ?";
    	return findFirst(sql, id);
    }
    
	/**
     * 根据id更新状态
     * @param id 
     * @param modifier 修改人id
     * @param status 修改的状态代码
     * @return int
     */
    public int updateStatus(Integer id, Integer modifier, String status) {
        String sql = "update cs_distribution set modifier=?, modify_time=now(), rec_ver=rec_ver+1, status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
    
    /**
	 * 根据系统订单号数组查询订单
	 * @param orderNos 系统订单号数组
	 * @return List<CsOrder>
	 */
	public List<CsDistribution> getByOrderNos(String[] orderNos) {
		List<CsDistribution> distributions;
		// 非空判断
		if (null==orderNos || orderNos.length<1) {
			distributions = new ArrayList<>();
			return distributions;
		}
		// 通过系统订单号查询订单
		StringBuffer sql = new StringBuffer("select t.* from cs_distribution t where t.order_no in ( ");
		for (int i = 0, j = orderNos.length; i < j; i++) {
			sql.append("?");
			if (i < (j - 1)) {
				sql.append(",");
			}
		}
		sql.append(")");
		distributions = this.dao.find(sql.toString(), orderNos);
		return distributions;
	}
	
}
