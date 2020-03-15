package com.chinaservices.oms.supplier.service;

import java.util.List;

import com.chinaservices.oms.supplier.model.CsSupplierAssessmentResultDetail;
import com.chinaservices.sdk.util.DateUtil;

public class CsSupplierAssessmentResultDetailService {
	
	private static final CsSupplierAssessmentResultDetail dao = new CsSupplierAssessmentResultDetail();

	/**
	 * 新增或保存
	 * @param rule
	 */
	public void save(CsSupplierAssessmentResultDetail model) {
        if (null == model.get("id")) {
        	model.set("create_time", DateUtil.now());
        	model.set("rec_ver", 1);
        	model.save();
        } else {
        	model.set("modify_time", DateUtil.now());
        	model.update();
        }
    }
	
	/**
	 * 保存所有
	 * @param models
	 */
	public void saveAll(List<CsSupplierAssessmentResultDetail> models) {
		for (CsSupplierAssessmentResultDetail model : models) {
			save(model);
		}
	}
	
	/**
	 * 根据考核id查询考核结果明细
	 * @param result_id
	 * @return
	 */
	public List<CsSupplierAssessmentResultDetail> findByResultId(String result_id) {
		return dao.find("select * from cs_supplier_assessment_result_detail where result_id = ? order by detail_no", result_id);
	}
	
}
