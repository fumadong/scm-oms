package com.chinaservices.oms.supplier.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRuleDetail;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsSupplierAssessmentRuleService {
	
	private CsSupplierAssessmentRule dao = new CsSupplierAssessmentRule();
	
	private CsSupplierAssessmentRuleDetailService csSupplierAssessmentRuleDetailService = new CsSupplierAssessmentRuleDetailService();
	
	/**
	 * 新增或保存
	 * @param rule
	 */
	public void saveOrUpdate(CsSupplierAssessmentRule rule) {
        if (null == rule.get("id")) {
        	rule.set("create_time", DateUtil.now());
        	rule.set("rec_ver", 1);
        	rule.save();
        } else {
        	rule.set("modify_time", DateUtil.now());
        	rule.update();
        }
    }
	
	/**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsSupplierAssessmentRule> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_supplier_assessment_rule t where 1=1");
        
        String rule_name = (String)params.get("rule_name");
        String status = (String)params.get("status");
        String today = (String)params.get("today");
        String remark = (String)params.get("remark");
        
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(rule_name)){
        	extSql.append(" and t.rule_name like ?");
        	param.add("%"+rule_name+"%");
        }
        if(StringUtils.isNotBlank(status)){
        	extSql.append(" and t.status = ?");
        	param.add(status);
        }
        if(StringUtils.isNotBlank(today)) {
        	extSql.append(" and t.effective_date <= ?");
        	param.add(today);
        	extSql.append(" and texpiration_date >= ?");
        	param.add(today);
        }
        if(StringUtils.isNotBlank(remark)){
        	extSql.append(" and t.remark like ?");
        	param.add("%" + remark + "%");
        }
        
        extSql.append(" order by t.create_time desc");
        if(param.isEmpty()){
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString());

        }else{
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString(),param.toArray());
        }
    }
    
    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsSupplierAssessmentRule findById(Integer id) {
    	return dao.findById(id);
    }
    
    /**
     * 查询当前生效的规则
     * @return
     */
    public List<CsSupplierAssessmentRule> findEffectiveRules(){
    	String sql = "select * from cs_supplier_assessment_rule r where r.status='1' and r.effective_date<=now() and r.expiration_date>=now()";
    	return dao.find(sql);
    }
    
    /**
     * 删除规则及子表
     * @param id
     */
    public void deleteRuleAndDetail(String[] ids) {
    	//先删除子表
    	csSupplierAssessmentRuleDetailService.deleteByRuleId(ids);
    	//再删除主表
    	for (String id : ids) {
    		dao.deleteById(id);
		}
    }
    
    /**
     * 更新状态
     * 
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, String modifier, String status) {
        String sql = "update cs_supplier_assessment_rule set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
    
    /**
     * 保存规则及明细
     * @param rule
     */
    public void saveRuleAndDetail(CsSupplierAssessmentRule rule,List<CsSupplierAssessmentRuleDetail> details) {
    	// 保存主表
    	this.saveOrUpdate(rule);
    	for (CsSupplierAssessmentRuleDetail detail : details) {
    		detail.set("rule_id", rule.get("id"));
		}
    	// 保存子表
    	csSupplierAssessmentRuleDetailService.saveAndUpdateAll(details);
    }
    
}
