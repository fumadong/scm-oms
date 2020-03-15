package com.chinaservices.oms.supplier.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentResult;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentResultDetail;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.supplier.service.CsSupplierAssessmentResultDetailService;
import com.chinaservices.oms.supplier.service.CsSupplierAssessmentResultService;
import com.chinaservices.oms.supplier.service.CsSupplierAssessmentRuleService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;

import org.apache.commons.lang.StringUtils;

@Controller(controllerKey = "/api/oms/csSupplierAssessmentAnalyze")
public class CsSupplierAssessmentAnalyzeController extends BaseController {
	
	private CsSupplierAssessmentRuleService csSupplierAssessmentRuleService = new CsSupplierAssessmentRuleService();
	private CsSupplierAssessmentResultService csSupplierAssessmentResultService = new CsSupplierAssessmentResultService();
	private CsSupplierAssessmentResultDetailService csSupplierAssessmentResultDetailService = new CsSupplierAssessmentResultDetailService();
	
	/**
	 * 查询生效的规则
	 */
	public void findEffectiveRules() {
		Result result = new Result();
		List<CsSupplierAssessmentRule> rules = csSupplierAssessmentRuleService.findEffectiveRules();
		if(rules.isEmpty()) {
			result.setSuccess(false);
			renderJson(result);
			return;
		}
		result.setData(rules.get(0).get("id"));
		result.setSuccess(true);
		renderJson(result);
	}
	
	/**
     * 分页查询
     */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        String query_type = getPara("query_type");

        List<CsSupplierAssessmentResult> results = new ArrayList<CsSupplierAssessmentResult>();
        if(StringUtils.equals(query_type,"query")){
            String create_time_from = getPara("create_time_from");
            String create_time_to = getPara("create_time_to");
            results = csSupplierAssessmentResultService.findByDateRange(create_time_from+"-"+create_time_to);
        } else {
            results = csSupplierAssessmentResultService.getSupplierAssessmentAnalyzeResult(params);
        }
        
        dataTables.put("data", results);
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", results.size());
        dataTables.put("recordsFiltered", results.size());
        
        renderJson(dataTables);
    }

    /**
     * 根据考核结果查询考核明细
     */
    public void findResultDetailByRuleId() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        String result_id = getPara("result_id");
        int draw = getParaToInt("draw");

        List<CsSupplierAssessmentResultDetail> resultDetails = csSupplierAssessmentResultDetailService.findByResultId(result_id);

        dataTables.put("data", resultDetails);
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", resultDetails.size());
        dataTables.put("recordsFiltered", resultDetails.size());
        renderJson(dataTables);
    }

    public void findResultDetailForChart(){
        Map<String, Object> dataTables = new HashMap<String, Object>();
        String result_id = getPara("result_id");
        String carrier_name = getPara("carrier_name");
        String[] result_ids = StringUtils.split(result_id, ",");
        String[] carriers = StringUtils.split(carrier_name, ",");
        String[] detailNames = null;
        Object[] detailScores = null;

        for (int n = 0;n<result_ids.length; n++){
            // 查询结果详情
            List<CsSupplierAssessmentResultDetail> resultDetails = csSupplierAssessmentResultDetailService.findByResultId(result_ids[n]);

            if(detailScores == null){
                detailNames = new String[resultDetails.size()];
                detailScores = new Object[resultDetails.size()];
            }

            for (int i = 0; i<resultDetails.size();i++){
                detailNames[i] = resultDetails.get(i).getStr("detail_name");
                if(detailScores[i]==null){
                    String[] ecahScores = new String[result_ids.length];
                    ecahScores[n] = resultDetails.get(i).getBigDecimal("score").toString();
                    detailScores[i] = ecahScores;
                }else{
                    String[] ecahScores = (String[])detailScores[i];
                    ecahScores[n] = resultDetails.get(i).getBigDecimal("score").toString();
                }
            }

        }

        JSONObject detailInfo = new JSONObject();
        detailInfo.put("carriers",carriers);
        detailInfo.put("detailNames",detailNames);
        detailInfo.put("detailScores",detailScores);

        Result result = new Result();
        result.setData(detailInfo);
        result.setSuccess(true);
        renderJson(result);
    }
}
