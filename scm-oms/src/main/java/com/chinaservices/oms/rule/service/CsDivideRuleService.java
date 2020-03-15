package com.chinaservices.oms.rule.service;

import com.chinaservices.oms.rule.model.CsDivideRule;
import com.chinaservices.sdk.util.DateUtil;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CsDivideRuleService {
	
	public static final CsDivideRuleService me = new CsDivideRuleService();
	private static final CsDivideRule dao = new CsDivideRule();

    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsDivideRule findById(Integer id) {
    	return dao.findById(id);
    }

    /**
     * 批量保存
     * @param models
     */
    public void saveAll(List<CsDivideRule> models){
        for (CsDivideRule model:models ) {
            saveOrUpdate(model);
        }
    }
    /**
     * 保存或者更新
     *
     * @param model
     */
    public void saveOrUpdate(CsDivideRule model) {
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
        List<Record> records = new SqlExecutor().find("csDivideRule_qeury",params);
        return records.size() > 0;

    }
    /**
     * 根据id删除
     * @param ids
     */
    public void deleteByIds(String[] ids) {
    	for (String id : ids) {
    		dao.deleteById(id);
            Map<String, Object> params = new HashMap<String,Object>();
            params.put("divide_rule_id",id);
    		new SqlExecutor().update("csDivideTask_deleteByPIds_delete", params);
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
        CsDivideRule csDivideRule = new CsDivideRule();
        csDivideRule.set("status", status);
        csDivideRule.set("modifier", modifier);
        csDivideRule.updateByIds(ids);
    }
    
    /**
     * 获取所有启用的规则
     * @return
     */
    public List<CsDivideRule> getEnableRule() {
    	return dao.find("select * from cs_divide_rule where status = '1' order by priority asc");
    }
    
    /**
     * 匹配分解规则 
     * order_type/customer_code/carrier_code/warehouse_code
     * @param param
     * @param rules
     * @return
     */
    public Integer matchDivideRule(Map<String, String> param, List<CsDivideRule> rules) {
    	Integer ruleId = null;
    	for(CsDivideRule rule : rules) {
    		boolean isMatch = true;
    		// 规则不为空才匹配
    		if(!StringUtils.isEmpty(rule.getStr("order_type")) && 
    				!StringUtils.equals(param.get("order_type"), rule.getStr("order_type"))) {
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
    			ruleId = rule.getInt("id");
    			break;
    		}
    	}
    	return ruleId;
    }

}
