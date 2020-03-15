package com.chinaservices.oms.rule.service;

import com.chinaservices.oms.rule.model.CsDivideRule;
import com.chinaservices.oms.rule.model.CsIssueRule;
import com.chinaservices.sdk.util.DateUtil;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CsIssueRuleService {
	
	public static final CsIssueRuleService me = new CsIssueRuleService();
	private static final CsIssueRule dao = new CsIssueRule();

    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsIssueRule findById(Integer id) {
    	return dao.findById(id);
    }

    /**
     * 批量保存
     * @param models
     */
    public void saveAll(List<CsIssueRule> models){
        for (CsIssueRule model:models ) {
            saveOrUpdate(model);
        }
    }
    /**
     * 保存或者更新
     *
     * @param model
     */
    public void saveOrUpdate(CsIssueRule model) {
        if (null == model.get("id")) {
            model.set("status", 1);
            model.set("create_time", DateUtil.now());
            model.set("rec_ver", 1);
            model.set("modify_time", DateUtil.now());
            model.save();
        } else {
            model.set("modify_time", DateUtil.now());
            model.update();
        }
    }
    /**
     * 检查是否有重复代码
     *
     * @param id
     * @param code
     * @return
     */
    public boolean checkDuplicateRuleCode(Integer id, String code) {
        Map<String,Object> params = new HashMap<String, Object>();
        if(StringUtils.isNotBlank(code)) {
            params.put("code",code);
        }
        if(id != null) {
            params.put("noid",id);
        }
        List<Record> records = new SqlExecutor().find("csIssueRule_qeury",params);
        return records.size() > 0;

    }
    /**
     * 根据id删除
     * @param ids
     */
    public void deleteByIds(String[] ids) {
    	for (String id : ids) {
    		dao.deleteById(id);
		}
    }

    /**
     * 更新状态
     *
     * @param ids
     * @param modifier
     * @param status
     * @return
     */
    public void updateStatus(String[] ids, Integer modifier, String status) {
        CsIssueRule csDivideRule = new CsIssueRule();
        csDivideRule.set("status", status);
        csDivideRule.set("modifier", modifier);
        csDivideRule.updateByIds(ids);
    }
    
    /**
     * 获取启用的规则
     * @return
     */
    public List<CsIssueRule> getEnableRule() {
    	return dao.find("select * from cs_issue_rule where  status = '1' order by priority asc");
    }
    
    /**
     * 匹配分解规则 
     * order_type/customer_code/carrier_code/warehouse_code
     * @param param
     * @param rules
     * @return
     */
    public CsIssueRule matchIssueRule(Map<String, String> param, List<CsIssueRule> rules) {
    	CsIssueRule csIssueRule = null;
    	for(CsIssueRule rule : rules) {
    		boolean isMatch = true;
    		// 规则不为空才匹配
    		if(!StringUtils.isEmpty(rule.getStr("order_type")) && 
    				!StringUtils.equals(param.get("order_type"), rule.getStr("order_type"))) {
    			isMatch = false;
    		}
    		if(!StringUtils.isEmpty(rule.getStr("task_type_code")) && 
    				!StringUtils.equals(param.get("task_type_code"), rule.getStr("task_type_code"))) {
    			isMatch = false;
    		}
    		if(!StringUtils.isEmpty(rule.getStr("customer_code")) && 
    				!StringUtils.equals(param.get("customer_code"), rule.getStr("customer_code"))) {
    			isMatch = false;
    		}
    		if(!StringUtils.isEmpty(rule.getStr("carrier_code")) && 
    				!StringUtils.equals(param.get("carrier_code"), rule.getStr("carrier_code"))) {
    			isMatch = false;
    		}
    		if(!StringUtils.isEmpty(rule.getStr("warehouse_code")) && 
    				!StringUtils.equals(param.get("warehouse_code"), rule.getStr("warehouse_code"))) {
    			isMatch = false;
    		}
    		if(isMatch) {
    			csIssueRule = rule;
    			break;
    		}
    	}
    	return csIssueRule;
    }

}
