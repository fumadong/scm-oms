package com.chinaservices.oms.supplier.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRuleDetail;
import com.chinaservices.oms.supplier.service.CsSupplierAssessmentRuleDetailService;
import com.chinaservices.oms.supplier.service.CsSupplierAssessmentRuleService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller(controllerKey = "/api/oms/csSupplierAssessmentRule")
public class CsSupplierAssessmentRuleController extends BaseController {
	
	private CsSupplierAssessmentRuleService csSupplierAssessmentRuleService = new CsSupplierAssessmentRuleService();
	private CsSupplierAssessmentRuleDetailService csSupplierAssessmentRuleDetailService = new CsSupplierAssessmentRuleDetailService();
	
	/**
     * 分页查询
     */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsSupplierAssessmentRule> page = csSupplierAssessmentRuleService.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", page.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", page.getTotalRow());
        dataTables.put("recordsFiltered", page.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 根据id查询规则
     */
    public void getById() {
    	Result result = new Result();
		Integer id = getParaToInt("id");
		if (null != id) {
			CsSupplierAssessmentRule model = csSupplierAssessmentRuleService.findById(id);
			result.setData(model);
		} else {
			result.setData(null);
		}
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
    }
    
    /**
     * 查询规则明细
     */
    public void findRuleDetails() {
         Map<String, Object> dataTables = new HashMap<String, Object>();
         Map<String, Object> params = changeMap(getParaMap());
         int draw = getParaToInt("draw");
         String rule_id = (String)params.get("rule_id");
         List<CsSupplierAssessmentRuleDetail> ruleDetails = csSupplierAssessmentRuleDetailService.findRuleDetailForPage(rule_id);
         dataTables.put("data", ruleDetails);
         dataTables.put("draw", draw);
         dataTables.put("recordsTotal", ruleDetails.size());
         dataTables.put("recordsFiltered", ruleDetails.size());
         renderJson(dataTables);
    }
    
    /**
     * 保存
     */
    public void save() {
    	Result result = new Result();
    	CsSupplierAssessmentRule rule = getModel(CsSupplierAssessmentRule.class, "", true);
    	String detailString = getPara("details");
    	JSONArray detailArray = JSON.parseArray(detailString);
    	List<CsSupplierAssessmentRuleDetail> details = new ArrayList<CsSupplierAssessmentRuleDetail>();
		if (null == rule.get("id")) {
			rule.set("creator", getLoginUserId());
			rule.set("status", "1");
		} else {
			rule.set("modifier", getLoginUserId());
		}
		for (int i = 0; i < detailArray.size(); i++) {
			JSONObject detail = (JSONObject) detailArray.get(i);
			CsSupplierAssessmentRuleDetail ruleDetail = new CsSupplierAssessmentRuleDetail();
			ruleDetail.set("id", detail.get("id"));
			ruleDetail.set("detail_no", detail.get("detail_no"));
			ruleDetail.set("detail_code", detail.get("detail_code"));
			ruleDetail.set("detail_name", detail.get("detail_name"));
			ruleDetail.set("detail_remark", detail.get("detail_remark"));
			ruleDetail.set("is_assess", detail.get("is_assess"));
			ruleDetail.set("weighing", detail.get("weighing"));
			if (null == ruleDetail.get("id")) {
				ruleDetail.set("creator", getLoginUserId());
			} else {
				ruleDetail.set("modifier", getLoginUserId());
			}
			details.add(ruleDetail);
		}
		csSupplierAssessmentRuleService.saveRuleAndDetail(rule,details);
		result.setData(rule);
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
    }
    
    /**
     * 删除
     */
    public void delete() {
    	Result result = new Result();
    	String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
    	csSupplierAssessmentRuleService.deleteRuleAndDetail(ids);
    	result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 启用
     */
    public void enable() {
    	Result result = new Result();
		String id = getPara("id");
		String enableStatus = "1";
		String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			csSupplierAssessmentRuleService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), enableStatus);
		}
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 停用
     */
    public void disable() {
    	Result result = new Result();
		String id = getPara("id");
		String disableStatus = "0";
		String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			csSupplierAssessmentRuleService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), disableStatus);
		}
		result.setSuccess(true);
		renderJson(result);
    }
    
}
