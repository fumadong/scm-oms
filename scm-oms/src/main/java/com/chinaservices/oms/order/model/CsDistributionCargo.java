package com.chinaservices.oms.order.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

/**
 * 订单分配商品表
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_distribution_cargo", pkName = "id")
public class CsDistributionCargo extends Model<CsDistributionCargo> {
	
	public static final CsDistributionCargo dao = new CsDistributionCargo();
	
	/**
     * 保存
     * @param csDistributionCargo
     */
    public void save(CsDistributionCargo csDistributionCargo) {
        if (null == csDistributionCargo.get("id")) {
        	csDistributionCargo.save();
        } else {
        	csDistributionCargo.update();
        }
        return;
    }
    
    /**
     * 通过id查询数据
     * @param id
     */
    public CsDistributionCargo getById(Integer id) {
    	if (null == id) {
    		return null;
    	}
    	String sql = "select t.* from cs_distribution_cargo t where t.id = ?";
    	return findFirst(sql, id);
    }
    
}
