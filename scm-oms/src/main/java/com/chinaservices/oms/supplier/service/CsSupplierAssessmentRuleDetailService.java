package com.chinaservices.oms.supplier.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.dispatch.model.CsDispatchOrder;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRuleDetail;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsSupplierAssessmentRuleDetailService {
	
	private static final CsSupplierAssessmentRuleDetail dao = new CsSupplierAssessmentRuleDetail();
	
	/**
	 * 根据规则id查找规则明细，用于基础数据页面
	 */
	public List<CsSupplierAssessmentRuleDetail> findRuleDetailForPage(String rule_id){
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ds.ds_order, ds.ds_code, ds.ds_value, ds.desc, rd.* ");
        sql.append("FROM sys_dict_spec ds LEFT JOIN cs_supplier_assessment_rule_detail rd ON ds.ds_code = rd.detail_code and rd.rule_id = ?");
        sql.append("WHERE ds.ds_type = 'supplier_assessment_type' ");
         
        return dao.find(sql.toString(), rule_id);
	}
	
	/**
	 * 根据条件查找规则明细
	 * @param params
	 * @return
	 */
	public List<CsSupplierAssessmentRuleDetail> findRuleDetailByCondition(Map<String, Object> params){
		StringBuilder sql = new StringBuilder();
        sql.append("SELECT rd.* FROM cs_supplier_assessment_rule_detail rd WHERE 1 = 1 and rd.rule_id = ?");
        
        String rule_id=(String)params.get("rule_id");//规则
        String is_assess=(String)params.get("is_assess");//是否考核
        if(StringUtils.isNotBlank(is_assess)){
        	sql.append(" and rd.is_assess = ?");
        	return dao.find(sql.toString(), rule_id, is_assess);
        }        
		return dao.find(sql.toString(), rule_id);
	}
	
	/**
	 * 根据规则代码删除明细
	 * 
	 * @param ruleIds
	 */
	public void deleteByRuleId(String[] ruleIds) {
		for (int i = 0; i < ruleIds.length; i++) {
			String sql = "delete from cs_supplier_assessment_rule_detail where rule_id = ? ";
	        Db.update(sql, ruleIds[i]);
		}
	}
	
	/**
	 * 
	 * @param details
	 */
	public void saveAndUpdateAll(List<CsSupplierAssessmentRuleDetail> details) {
		for (CsSupplierAssessmentRuleDetail detail : details) {
			if (null == detail.get("id")) {
				detail.set("create_time", DateUtil.now());
				detail.set("rec_ver", 1);
				detail.save();
	        } else {
	        	detail.set("modify_time", DateUtil.now());
	        	detail.update();
	        }
		}
	}
	
	
}
