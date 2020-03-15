package com.chinaservices.oms.cargo.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Model;

/**
 * 包装单位
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@SuppressWarnings("serial")
@Table(tableName = "cs_package_unit", pkName = "id")
public class CsPackageUnit extends Model<CsPackageUnit> {
	
	public static final CsPackageUnit dao = new CsPackageUnit();
	
	/**
     * 保存
     * @param csPackageUnit
     */
    public void save(CsPackageUnit csPackageUnit) {
        if (null == csPackageUnit.get("id")) {
        	csPackageUnit.save();
        } else {
        	csPackageUnit.update();
        }
        return;
    }
    
}
