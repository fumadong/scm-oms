package com.chinaservices.oms.supplier.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.oms.dispatch.model.CsDispatchOrder;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentResult;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentResultDetail;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRuleDetail;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import org.apache.commons.lang.StringUtils;

public class CsSupplierAssessmentResultService {
	
	private static final CsSupplierAssessmentResult dao = new CsSupplierAssessmentResult();

	private CsSupplierAssessmentRuleDetailService csSupplierAssessmentRuleDetailService = new CsSupplierAssessmentRuleDetailService();
	private CsSupplierAssessmentResultDetailService csSupplierAssessmentResultDetailService = new CsSupplierAssessmentResultDetailService();
	
	/**
	 * 新增或保存
	 * @param model
	 */
	public void save(CsSupplierAssessmentResult model) {
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
	public void saveAll(List<CsSupplierAssessmentResult> models) {
		for (CsSupplierAssessmentResult model : models) {
			save(model);
		}
	}

	/**
	 * 根据时间范围查询考核结果
	 * @param date_range
	 * @return
	 */
	public List<CsSupplierAssessmentResult> findByDateRange(String date_range) {
		return dao.find("select * from cs_supplier_assessment_result where date_range = ?", date_range);
	}
	
	/**
	 * 承运商考核结果
	 * 
	 * @param params
	 */
	public List<CsSupplierAssessmentResult> getSupplierAssessmentAnalyzeResult(Map<String, Object> params) {
		// 返回的考核结果
		List<CsSupplierAssessmentResult> results = new ArrayList<CsSupplierAssessmentResult>();
		List<CsSupplierAssessmentResultDetail> resultDetails = new ArrayList<CsSupplierAssessmentResultDetail>();
		// 开始或结束时间都返回空
		if(StringUtils.isBlank((String)params.get("create_time_from"))||StringUtils.isBlank((String)params.get("create_time_to"))){
			return results;
		}

		//时间范围
		String date_range = (String)params.get("create_time_from") + "-" + (String)params.get("create_time_to");
		//删除相同时间范围的旧数据
		Db.update("delete from cs_supplier_assessment_result where date_range = ?", date_range);
		Db.update("delete from cs_supplier_assessment_result_detail where result_id in (select id from cs_supplier_assessment_result where date_range = ?)",date_range);

		// 查询启用考核明细
		List<CsSupplierAssessmentRuleDetail> ruleDetails = csSupplierAssessmentRuleDetailService.findRuleDetailByCondition(params);
		
		// 查询所有承运商
		List<CsSupplier> suppliers = CsSupplier.dao.find("select * from cs_supplier");
		String[] supplier_codes = new String[suppliers.size()];
		for (int i = 0; i < suppliers.size(); i++) {
			supplier_codes[i] = suppliers.get(i).getStr("supplier_code");
		}
		params.put("supplier_codes", supplier_codes);
		
		// 承运商总票数
		Map<String, Integer> supplier_count = getSupplierOrderNum(params);
		// 承运商配送准时票数
		Map<String, Integer> send_count = getArriveUnloadOnTimeNum(params);
		// 磅差符合
		Map<String, Integer> poundsDiff_count = getPoundsDiffAccordanceNum(params);
		// 客户投诉率
		Map<String, Integer> custComplaints_count = getCustomerComplaints(params);
		
		// 循环承运商计算考核成绩
		for (CsSupplier supplier : suppliers) {
			// 考核明细
			List<CsSupplierAssessmentResultDetail> details = new ArrayList<CsSupplierAssessmentResultDetail>();
			// 承运商代码
			String supplier_code = supplier.getStr("supplier_code");
			CsSupplierAssessmentResult result =  new CsSupplierAssessmentResult();
			double total_score = 0;//总成绩
			for(int i = 0;i<ruleDetails.size();i++) {
				CsSupplierAssessmentRuleDetail ruleDetail = ruleDetails.get(i);
				// 考核明细代码
				String rule = ruleDetail.getStr("detail_code");
				// 权重
				double weighing = ruleDetail.getBigDecimal("weighing").doubleValue();
				// 承运商总票数
				int total = supplier_count.get(supplier_code)==null?0:supplier_count.get(supplier_code);
				CsSupplierAssessmentResultDetail detail =  new CsSupplierAssessmentResultDetail();
				detail.set("detail_no", i);//序号
				detail.set("detail_name", ruleDetail.getStr("detail_name"));//考核名称
				detail.set("total_num", total);//总票数
				int pass_num = 0;//统计正常票数
				if("send_on_time_rate".equals(rule)) {	//配送准时率
					pass_num = send_count.get(supplier_code)==null?0:send_count.get(supplier_code);//准时的票数
				}else if("customer_complaints_rate".equals(rule)) {
					pass_num =total - (custComplaints_count.get(supplier_code)==null?0:custComplaints_count.get(supplier_code));//总票数-被投诉票数
				}else if("pound_diff_accordance_rate".equals(rule)) {
					pass_num = poundsDiff_count.get(supplier_code)==null?0:poundsDiff_count.get(supplier_code);//磅差符合的票数
				}else {
					continue;
				}
				detail.set("abnormal_num",total-pass_num);//异常数
				double percentage = 0;//合格百分比
				if(total>0) {
					percentage = pass_num/total;
				}
				detail.set("percentage",percentage);//合格百分比
				detail.set("weighing",weighing);//权重
				double score = percentage*weighing;
				detail.set("score",score);//得分
				total_score += score ;
				details.add(detail);
			}
			result.set("ranking", 1);
			result.set("date_range", date_range);
			result.set("supplier_name", supplier.getStr("supplier_name"));
			result.set("supplier_code", supplier_code);
			result.set("score", total_score);
			// 保存考核分析
	        save(result);
	        results.add(result);
	        for (CsSupplierAssessmentResultDetail detail : details) {
				detail.set("result_id", result.getInt("id"));
			}
	        resultDetails.addAll(details);
		}
		
		// 保存考核明细
		csSupplierAssessmentResultDetailService.saveAll(resultDetails);
		
		return results;
	}
	
	/**
	 * 查询承运商时间范围内订单数
	 * @param params
	 * @return
	 */
	public Map<String, Integer> getSupplierOrderNum(Map<String, Object> params) {
		StringBuilder sql = new StringBuilder();
		sql.append("select d.carrier_code,d.carrier_name, count(d.id) as count from cs_dispatch_order d where 1=1");
		String create_time_from = (String)params.get("create_time_from");
		sql.append(" and d.create_time>='" + create_time_from+"'");
		String create_time_to = (String)params.get("create_time_to");
		sql.append(" and d.create_time<='" + create_time_to+"'");
		sql.append(" and d.status = '60'");
		String[] supplier_codes=(String[])params.get("supplier_codes");
		sql.append(" and d.carrier_code in (");
        for (int i = 0 ,length = supplier_codes.length; i < length; i++) {
            sql.append("'"+supplier_codes[i]+"'");
            if (i < (length - 1)) {
                sql.append(",");
            }
        }
        sql.append(") GROUP BY d.carrier_code");
        List<CsDispatchOrder> supplierOrders = CsDispatchOrder.dao.find(sql.toString());
		Map<String, Integer> result = new HashMap<String, Integer>();
		for(CsDispatchOrder supplierOrder : supplierOrders) {
			result.put(supplierOrder.getStr("carrier_code"), Integer.getInteger(supplierOrder.getStr("count")));
		}
		return result;
	}
	
	/**
	 * 获取配送准时单数
	 */
	public Map<String, Integer> getArriveUnloadOnTimeNum(Map<String, Object> params) {
		StringBuilder sql = new StringBuilder();
		sql.append("select d.carrier_code,d.carrier_name, count(d.id) as count from cs_dispatch_order d where 1=1");
		String create_time_from = (String)params.get("create_time_from");
		sql.append(" and d.create_time>='" + create_time_from+"'");
		String create_time_to = (String)params.get("create_time_to");
		sql.append(" and d.create_time<='" + create_time_to+"'");
		sql.append(" and d.status = '60'");
		sql.append(" and d.arrive_unload_time < d.require_time_to");//卸货时间小于要求送达时间
		String[] supplier_codes=(String[])params.get("supplier_codes");
		sql.append(" and d.carrier_code in (");
        for (int i = 0 ,length = supplier_codes.length; i < length; i++) {
            sql.append("'"+supplier_codes[i]+"'");
            if (i < (length - 1)) {
                sql.append(",");
            }
        }
		sql.append(") GROUP BY d.carrier_code");
		List<CsDispatchOrder> supplierOrders = CsDispatchOrder.dao.find(sql.toString());
		Map<String, Integer> result = new HashMap<String, Integer>();
		for(CsDispatchOrder supplierOrder : supplierOrders) {
			result.put(supplierOrder.getStr("carrier_code"), Integer.getInteger(supplierOrder.getStr("count")));
		}
		return result;
	}
	
	/**
	 * 获取磅差符合单量
	 * @param params
	 * @return
	 */
	public Map<String, Integer> getPoundsDiffAccordanceNum(Map<String, Object> params){
		StringBuilder sql = new StringBuilder();
		sql.append("select d.carrier_code,d.carrier_name, count(d.id) as count from cs_dispatch_order d where 1=1");
		String create_time_from = (String)params.get("create_time_from");
		sql.append(" and d.create_time>='" + create_time_from+"'");
		String create_time_to = (String)params.get("create_time_to");
		sql.append(" and d.create_time<='" + create_time_to+"'");
		sql.append(" and d.status = '60'");
		sql.append(" and (d.difference_amount/d.plan_amount)<=0.001");//磅差小于1/1000
		String[] supplier_codes=(String[])params.get("supplier_codes");
		sql.append(" and d.carrier_code in (");
        for (int i = 0 ,length = supplier_codes.length; i < length; i++) {
            sql.append("'"+supplier_codes[i]+"'");
            if (i < (length - 1)) {
                sql.append(",");
            }
        }
		sql.append(") GROUP BY d.carrier_code");
		List<CsDispatchOrder> supplierOrders = CsDispatchOrder.dao.find(sql.toString());
		Map<String, Integer> result = new HashMap<String, Integer>();
		for(CsDispatchOrder supplierOrder : supplierOrders) {
			result.put(supplierOrder.getStr("carrier_code"), Integer.getInteger(supplierOrder.getStr("count")));
		}
		return result;
	}
	
	/**
	 * 客户投诉率
	 * @param params
	 * @return
	 */
	public Map<String, Integer> getCustomerComplaints(Map<String, Object> params){
		StringBuilder sql = new StringBuilder();
		sql.append("select d.carrier_code,d.carrier_name, count(d.id) as count from cs_customer_complaints d where 1=1");
		String create_time_from = (String)params.get("create_time_from");
		sql.append(" and d.create_time>='" + create_time_from+"'");
		String create_time_to = (String)params.get("create_time_to");
		sql.append(" and d.create_time<='" + create_time_to+"'");
		sql.append("and d.bill_type = 'DO'");
		String[] supplier_codes=(String[])params.get("supplier_codes");
		sql.append(" and d.carrier_code in (");
        for (int i = 0 ,length = supplier_codes.length; i < length; i++) {
            sql.append("'"+supplier_codes[i]+"'");
            if (i < (length - 1)) {
                sql.append(",");
            }
        }
		sql.append(") GROUP BY d.carrier_code");
		List<CsDispatchOrder> supplierOrders = CsDispatchOrder.dao.find(sql.toString());
		Map<String, Integer> result = new HashMap<String, Integer>();
		for(CsDispatchOrder supplierOrder : supplierOrders) {
			result.put(supplierOrder.getStr("carrier_code"), Integer.getInteger(supplierOrder.getStr("count")));
		}
		return result;
	}
	
}
