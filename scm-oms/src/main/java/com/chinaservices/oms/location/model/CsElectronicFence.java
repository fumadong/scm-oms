package com.chinaservices.oms.location.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 电子围栏
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_electronic_fence", pkName = "id")
public class CsElectronicFence extends Model<CsElectronicFence> {
	
	public static final CsElectronicFence dao = new CsElectronicFence();
	
	/**
     * 保存
     * @param csElectronicFence
     */
    public void save(CsElectronicFence csElectronicFence) {
        if (null == csElectronicFence.get("id")) {
        	csElectronicFence.save();
        } else {
        	csElectronicFence.update();
        }
        return;
    }
    
    /**
     * 通过id查询数据
     * @param id
     */
    public CsElectronicFence getById(Integer id) {
    	if (null == id) {
    		return null;
    	}
    	String sql = "select t.* from cs_electronic_fence t where t.id = ?";
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
        String sql = "update cs_electronic_fence set modifier=?, modify_time=now(), rec_ver=rec_ver+1, status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
	
}
