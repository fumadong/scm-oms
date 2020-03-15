package com.chinaservices.oms.dispatch.controller;

import com.chinaservices.oms.dispatch.model.CsDispatchFee;
import com.chinaservices.oms.dispatch.model.CsDispatchOrder;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.jfinal.aop.Before;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import org.apache.commons.lang.StringUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 派车单费用管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Bill Lin
 * @since 1.0, 2017-06-02
 */
@Before(Tx.class)
@Controller(controllerKey = "/dispatch/csDispatchOrderFee", viewPath = "/admin")
public class CsDispatchOrderFeeController extends BaseController {

	/**
     * 费用分页查询
     */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsDispatchFee> list = CsDispatchFee.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("派车管理费用分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
    /**
     * 保存派车单费用
     */
    public void save() {
        Result result = new Result();
        CsDispatchFee csDispatchFee = getModel(CsDispatchFee.class, "");
    	this.preSave(csDispatchFee);
    	String unique_no = "";
    	if(csDispatchFee.getInt("id") == null){
    		//生成费用编号
    		unique_no = CodeUtil.getInstance().getCode("FEE");
    		csDispatchFee.set("unique_no", unique_no);
    	}else{
    		unique_no = csDispatchFee.getStr("unique_no");
    	}
    	// 保存
    	CsDispatchFee.dao.saveOrUpdate(csDispatchFee);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        result.setData(unique_no);
    	renderJson(result);
    }
    
    /**
     * 根据ID获取派车单费用数据
     */
    public void getDispatchFeeById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsDispatchFee csDispatchFee = CsDispatchFee.dao.findById(id);
            result.setData(csDispatchFee);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    /**
     * 删除派车单费用
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("ids");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
        	//获取派车单费用信息
        	CsDispatchFee csDispatchFee = CsDispatchFee.dao.findById(Integer.valueOf(idStr));
        	String feeStatus = csDispatchFee.getStr("fee_status");
        	if(StringUtils.isNotBlank(feeStatus) && feeStatus.equals("01")) {
        		result.setSuccess(false);
        		result.setMsg("已确认的费用不可删除");
        	}else{
        		result.setSuccess(true);
            	CsDispatchFee.dao.deleteById(Integer.valueOf(idStr));
        	}
        }
        
        renderJson(result);
    }
    
    /**
     * 派车单费用确认
     */
    public void feeConfirm() {
        Result result = new Result();
        String id = getPara("id");
        String dispatchNo = getPara("dispatch_no");
        String confirm_amount = getPara("confirm_amount");
        String confirm_remark = getPara("confirm_remark");
        String[] ids = StringUtils.split(id, ",");
        String isBatch = getPara("isBatch");
        
        //获取发运单信息
        CsDispatchOrder csDispatchOrder = null;
        if(StringUtils.isNotBlank(dispatchNo)){        	
        	csDispatchOrder = CsDispatchOrder.dao.getDispatchOrdersByFeeConfirm(dispatchNo);
        }
        
        //是否存在已确定的费用
        boolean isExistConfirmFee = false;
        
        for (String idStr : ids) {
        	//获取派车单费用信息
        	CsDispatchFee csDispatchFee = CsDispatchFee.dao.findById(Integer.parseInt(idStr));
        	String feeStatus = csDispatchFee.getStr("fee_status");
        	if(StringUtils.isNotBlank(feeStatus) && feeStatus.equals("01")) {
        		isExistConfirmFee = true;
        	}else{
        		//设置费用信息为已确认状态,并设置确认金额和确认备注
        		csDispatchFee.set("fee_status", "01");
//        		csDispatchFee.set("confirm_time", new Date());
//        		if(confirm_amount != null && !"".equals(confirm_amount)){        			
//        			csDispatchFee.set("confirm_amount", new BigDecimal(confirm_amount));
//        		}
//        		csDispatchFee.set("confirm_remark", confirm_remark);
//        		//如果是批量审核，审核金额=费用金额
//        		if("true".equals(isBatch)){
//        			csDispatchFee.set("confirm_amount",csDispatchFee.getBigDecimal("total_amount"));
//        		}
        		CsDispatchFee.dao.saveOrUpdate(csDispatchFee);
//        		
//        		//生成业务费用表信息
//        		csFeeBz csFeeBz = new CsFeeBz();
//        		csFeeBz.set("id",null);
//        		csFeeBz.set("dispatch_fee_id",csDispatchFee.getInt("id"));//派车费用ID
//        		csFeeBz.set("fee_code",csDispatchFee.getStr("fee_code"));//费用名称编码
//        		csFeeBz.set("fee_name",csDispatchFee.getStr("fee_name"));//费用名称
//        		csFeeBz.set("fee_type",csDispatchFee.getStr("fee_type"));//费用类型
//        		csFeeBz.set("pay_or_receive",csDispatchFee.getStr("pay_or_receive"));//收付标识
//        		csFeeBz.set("amount",csDispatchFee.getBigDecimal("total_amount"));//费用金额
//        		csFeeBz.set("weight",csDispatchFee.getBigDecimal("count"));//重量
//        		csFeeBz.set("balance_code",csDispatchFee.getStr("balance_code"));//结算对象编码
//        		csFeeBz.set("balance_name",csDispatchFee.getStr("balance_name"));//结算对象名称
//        		csFeeBz.set("occur_time",csDispatchFee.getDate("occur_time"));//发生时间
//        		csFeeBz.set("confirm_time",csDispatchFee.getDate("confirm_time"));//确认时间
//        		csFeeBz.set("status",csDispatchFee.getStr("fee_status"));//状态
//        		csFeeBz.set("desc",csDispatchFee.getStr("remark"));//备注
//        		csFeeBz.set("currency", csDispatchFee.getStr("currency"));//币别
//        		csFeeBz.set("unit_price", csDispatchFee.getBigDecimal("unit_price"));//单价
//        		if("01".equals(csDispatchFee.getStr("pay_or_receive"))){
//        			//应收    			
//        			csFeeBz.set("actual_rp_cost", csDispatchFee.getBigDecimal("receivable_cost"));//实收付金额
//        			//应收费用设置结算方式update at 20170803 by Joan start
//            		String is_charge = csDispatchFee.getStr("is_charge");
//        			if(!StringUtils.isNotEmpty(is_charge)){
//            			//派车单收费方式为开票，则结算方式为未开票30
//            			if(csDispatchOrder != null && StringUtils.isNotEmpty(csDispatchOrder.getStr("charge_mode"))
//            					&&"billing".equals(csDispatchOrder.getStr("charge_mode"))){
//            				is_charge  = "30";
//            			}else{
//            				BigDecimal receivable_cost = csDispatchFee.getBigDecimal("receivable_cost");//收款金额
//            				BigDecimal total_amount = csDispatchFee.getBigDecimal("total_amount");//总费用
//            				if(receivable_cost==null||(receivable_cost!=null&&receivable_cost.compareTo(BigDecimal.ZERO)==0)){
//            					//派车费用收款金额空，或=0则为现金未支
//            					is_charge  = "20";
//            				}else if(receivable_cost!=null&&receivable_cost.compareTo(total_amount)>=0){
//            					//收款金额大于等于总费用，现金已支
//            					is_charge  = "10";
//            				}//收款金额小于总费用是现金已支（抹零）还是现金预支需要在派车跟踪收款时登记
//            			}     			
//            		}
//            		csFeeBz.set("is_charge",is_charge);//是否收费
//            		//应收费用设置结算方式update at 20170803 by Joan end
//        		}else{
//        			//应付
//        			csFeeBz.set("actual_rp_cost", csDispatchFee.getBigDecimal("confirm_amount"));//实收付金额
//        		}
//        		if(csDispatchOrder != null){
//        			csFeeBz.set("order_no",csDispatchOrder.getStr("customer_order_no"));//订单号
//        			csFeeBz.set("csorder_no",csDispatchOrder.getStr("order_no"));//系统订单号
//            		csFeeBz.set("ship_no",csDispatchOrder.getStr("dispatch_no"));//系统派车单号
//            		csFeeBz.set("cargo_code",csDispatchOrder.getStr("cargo_code"));//商品编码
//            		csFeeBz.set("cargo_name",csDispatchOrder.getStr("cargo_name"));//商品名称
//            		csFeeBz.set("vehicle_number",csDispatchOrder.getStr("vehicle_no"));//车辆号码
//            		csFeeBz.set("require_time_from",csDispatchOrder.getDate("require_time_from"));//要求开始时间
//            		csFeeBz.set("require_time_to",csDispatchOrder.getDate("require_time_to"));//要求结束时间
//            		//生成费用成本运费、里程数 update by Joan.Zhang 20170804 start
//            		csFeeBz.set("cost_freight_rate", csDispatchOrder.getBigDecimal("cost_freight_rate"));//成本运费
//            		//通过系统派车单号获取油耗信息的里程记录
//            		CsOilConsumption consumption = CsOilConsumption.dao.findByDispatchNo(csDispatchOrder.getStr("dispatch_no"));
//            		BigDecimal kilometers = BigDecimal.ZERO;
//            		if(consumption!=null){
//            			//油耗总里程
//            			kilometers = consumption.getBigDecimal("total_mileage")==null?BigDecimal.ZERO:consumption.getBigDecimal("total_mileage");
//            		}
//            		csFeeBz.set("kilometers",kilometers);//里程
//            		//生成费用成本运费、里程数 update by Joan.Zhang 20170804 end           		
//            		//组合流向信息
//            		String flowTo = "";
//            		if(!getString(csDispatchOrder.getStr("shipper_county")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("shipper_county");
//            		}else if(!getString(csDispatchOrder.getStr("shipper_city")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("shipper_city");
//            		}else if(!getString(csDispatchOrder.getStr("shipper_province")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("shipper_province");
//            		}
//            		
//            		if(!flowTo.equals("")){            			
//            			flowTo+=" - ";
//            		}
//            		
//            		if(!getString(csDispatchOrder.getStr("consignee_county")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("consignee_county");
//            		}else if(!getString(csDispatchOrder.getStr("consignee_city")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("consignee_city");
//            		}else if(!getString(csDispatchOrder.getStr("consignee_province")).equals("")){
//            			flowTo+=csDispatchOrder.getStr("consignee_province");
//            		}
//            		csFeeBz.set("flow_direction",flowTo);//流向
//        		}
//        		this.preSave(csFeeBz);
//        		CsFeeBz.dao.saveOrUpdate(csFeeBz);
        	}
        }
        
        if(isExistConfirmFee){
        	result.setMsg("未确认的费用处理成功,已确认的费用不进行处理");
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 计费前的校验
     */
    public void calculateCheck() {
    	Result result = new Result();
    	String dispatchNo = getPara("dispatch_no");
    	List<CsDispatchFee> dispatchFees = CsDispatchFee.dao.getDispatchFeeByDispatchNos(dispatchNo);
    	if(dispatchFees.size() > 0){
    		//是否存在费率计算的费用
    		boolean isCalculateCost = false;
    		//是否存在已确认的费用
    		boolean isConfirmCost = false;
    		
    		for (CsDispatchFee csDispatchFee : dispatchFees) {
    			//状态
				String feeStatus = csDispatchFee.getStr("fee_status");
				//来源
				String feeSource = csDispatchFee.getStr("fee_source");
				
				//校验是否存在已确认的费用
				if(!isConfirmCost && StringUtils.isNotBlank(feeStatus) && feeStatus.equals("01")){
					//费率计算
					isConfirmCost = true;
				}
				
				//校验是否存在费率计算的费用
				if(!isCalculateCost && StringUtils.isNotBlank(feeSource) && feeSource.equals("20")){
					//费率计算
					isCalculateCost = true;
				}
			}
    		
    		//若存在已确认的费用,则返回不带提示信息的返回结果
    		if(isConfirmCost){
    			result.setSuccess(false);
    		}else if(isCalculateCost){
    			//若存在已费率计算的费用,则返回带提示信息的返回结果
    			result.setSuccess(false);
    			result.setMsg("已经费率计算了");
    		}else{
    			result.setSuccess(true);
    		}
    	}else{
    		result.setSuccess(true);
    	}
    	renderJson(result);
    }
    
    /**
     * 获取字符串类型,为空时设置默认值
     * @param value
     * @return
     */
    public String getString(Object value){
    	if(value != null){
    		return value.toString();
    	}else{
    		return "";
    	}
    }
    
    /**
     * 获取字符串类型,为空时设置默认值
     * @param value
     * @return
     */
    public BigDecimal getBigDecimal(BigDecimal value){
    	if(value != null){
    		return value;
    	}else{
    		return new BigDecimal(0);
    	}
    }
    
    /**
     * 根据ID获取派车单费用数据
     */
    public void getFeeById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsDispatchFee csDispatchFee = CsDispatchFee.dao.findPayFeeById(id);
            result.setData(csDispatchFee);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    /**
     * 费用分页查询
     */
    public void queryDispatchFee() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsDispatchFee> list = CsDispatchFee.dao.queryDispatchFee(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("派车管理费用分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
}
