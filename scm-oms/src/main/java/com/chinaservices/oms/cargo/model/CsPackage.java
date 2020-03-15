package com.chinaservices.oms.cargo.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

/**
 * 包装
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_package", pkName = "id")
public class CsPackage extends Model<CsPackage> {
	
	public static final CsPackage dao = new CsPackage();
	
	/**
     * 保存
     * @param csPackage
     */
    public void save(CsPackage csPackage) {
        if (null == csPackage.get("id")) {
        	csPackage.save();
        } else {
        	csPackage.update();
        }
        return;
    }
    
}
