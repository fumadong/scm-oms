package com.chinaservices.oms.dispatch.controller;

import com.chinaservices.oms.cust.model.CsCustomerContract;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 派车单管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Bill Lin
 * @since 1.0, 2017-06-02
 */
@Before(Tx.class)
@Controller(controllerKey = "/dispatch/csDispatchOrder", viewPath = "/admin")
public class CsDispatchOrderController extends BaseController {

    /**
     * 分页查询
     */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsDispatchOrder> list = CsDispatchOrder.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("派车管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
    /**
     * 保存派车单
     */
    public void save() {
        Result result = new Result();
        CsDispatchOrder csDispatchOrder = getModel(CsDispatchOrder.class, "");
        
    	this.preSave(csDispatchOrder);
    	Date requireFrom = csDispatchOrder.getDate("require_time_from");
    	Date requireTo = csDispatchOrder.getDate("require_time_to");
    	if(requireFrom != null && requireTo != null && requireFrom.getTime() > requireTo.getTime()){
    		result.setSuccess(false);
            result.setMsg("要求开始时间不能大于要求结束时间");
    	}else{
    		// 保存
        	CsDispatchOrder.dao.saveOrUpdate(csDispatchOrder);
        	
        	// 重新查询订单
        	CsDispatchOrder dispatchOrder = CsDispatchOrder.dao.findById(Integer.parseInt(csDispatchOrder.get("id").toString()));
        	
    		result.setData(dispatchOrder);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
    	}
    	renderJson(result);
    }

    /**
     * 根据ID获取派车单数据
     */
    public void getDispatchById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsDispatchOrder dispatchOrder = CsDispatchOrder.dao.getDispatchById(id);
            result.setData(dispatchOrder);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    /**
     * 删除派车单
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        result.setSuccess(true);
        for (String idStr : ids) {
        	//获取派车单信息
        	CsDispatchOrder dispatchOrder = CsDispatchOrder.dao.findById(Integer.valueOf(idStr));
        	
        	//校验派车单状态
        	String dispatchStatus =dispatchOrder.getStr("dispatch_status");
        	if(!"10".equals(dispatchStatus)){
        		result.setSuccess(false);
        		result.setMsg("存在非创建状态的派车单,不能进行删除操作");
        		break;
        	}else{
        		CsDispatchOrder.dao.deleteById(Integer.valueOf(idStr));
        	}
        }
        renderJson(result);
    }
    
    
    
    /**
     * 合同计算派车单费用
     */
    public void calculateSubFeeHanlder() {
        Result result = new Result();
        String id = getPara("ids");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
        	//获取派车单信息
        	CsDispatchOrder csDispatchOrder = CsDispatchOrder.dao.getDispatchOrdersByCalculate(idStr);
        	if(csDispatchOrder != null){
        		//删除费率计算的费用信息
        		CsDispatchFee.dao.deleteFeeByDispatchNo(getString(csDispatchOrder.getStr("dispatch_no")));
        		
        		//合同计费
    			contractCalculation(result, csDispatchOrder);
        	}else{
        		result.setSuccess(false);
        		result.setMsg("找不到对应的派车单");
        	}
        }
        
        renderJson(result);
    }
    
    /**
     * 合同计费
     * @param result			返回结果
     * @param csDispatchOrder	派车单信息
     */
    public void contractCalculation(Result result, CsDispatchOrder csDispatchOrder) {
    	//获取派车单的装货量、卸货量、计费节点
    	Double loadAmount = csDispatchOrder.getBigDecimal("load_amount").doubleValue();
		Double unLoadAmount = csDispatchOrder.getBigDecimal("unload_amount").doubleValue();
		String charge_node = csDispatchOrder.getStr("charge_node");
		
		//查询对应的合同费用信息
		List<CsCustomerContract> allContractfees = CsCustomerContract.dao.queryPositionFeeByContract(csDispatchOrder);
		
		//根据计费节点,获取派车单的计费重量
		Double calculateCount = 0D;
		if("20".equals(charge_node)){
			//卸货磅重
			calculateCount = unLoadAmount;
		}else{
			//装货磅重
			calculateCount = loadAmount;
		}
		
		//根据合同的计费节点,费用的区间过滤费用
		List<CsCustomerContract> contractfees = new ArrayList<CsCustomerContract>();
		for (CsCustomerContract contractfee : allContractfees) {
			//获取费用区间从,区间到
			Double intervalFrom = contractfee.getBigDecimal("interval_from").doubleValue(); 
			Double intervalTo = contractfee.getBigDecimal("interval_to").doubleValue(); 
			
			//若重量在区间范围内,则此费用校验通过
			if(intervalFrom.doubleValue() <= calculateCount.doubleValue()  && calculateCount.doubleValue()  <= intervalTo.doubleValue()){        				
				contractfees.add(contractfee);
			}
		}
		
		if(contractfees.isEmpty()){
			result.setSuccess(false);
			result.setMsg("匹配不到符合条件的合同");
		}else{
			//获取发运单的起运地和目的信息
			//起运地
			String shipperProvinceCode = csDispatchOrder.getStr("shipper_province_code");
			String shipperCityCode = csDispatchOrder.getStr("shipper_city_code");
			String shipperCountyCode = csDispatchOrder.getStr("shipper_county_code");
			String shipperAddress = csDispatchOrder.getStr("shipper_address");
			//目的地
			String consigneeProvinceCode = csDispatchOrder.getStr("consignee_province_code");
			String consigneeCityCode = csDispatchOrder.getStr("consignee_city_code");
			String consigneeCountyCode = csDispatchOrder.getStr("consignee_county_code");
			String consigneeAddress = csDispatchOrder.getStr("consignee_address");
			//商品
			String dispatchCargoCode = csDispatchOrder.getStr("cargo_code");
			
			//分组匹配成功的合同路线费用信息
			Map<String,Map<String,List<CsCustomerContract>>> passRateFeesGroupMap = new HashMap<String,Map<String,List<CsCustomerContract>>>();
			
			//合同对应的具体信息集合
			Map<String,CsCustomerContract> rateMap = new HashMap<String,CsCustomerContract>();
			
			//合同路线对应得具体信息集合
			Map<String,CsCustomerContract> ratePositionMap = new HashMap<String,CsCustomerContract>();
			
			//合同路线费用过滤---路线过滤
			for (CsCustomerContract contractfee : contractfees) {
				//校验是否合同框架
				if("1".equals(contractfee.getStr("is_frame_contract"))){
					result.setSuccess(false);
		    		result.setMsg("所签合同为框架合同，请手工维护费用");
		    		renderJson(result);
		    		return;
				}
				
				//起运地
				String fromProvinceCode = contractfee.getStr("from_province_code");
				String fromCityCode = contractfee.getStr("from_city_code");
				String fromCountyCode = contractfee.getStr("from_county_code");
				String fromAddress = contractfee.getStr("from_address");
				//目的地
				String toProvinceCode = contractfee.getStr("to_province_code");
				String toCityCode = contractfee.getStr("to_city_code");
				String toCountyCode = contractfee.getStr("to_county_code");
				String toAddress = contractfee.getStr("to_address");
				//商品
				String cargoCode = contractfee.getStr("cargo_code");
				
				//起运地是否匹配
				boolean isFromMatching = false;
				
				//起运地匹配级别
				int fromLevel = 0;
				
				//目的地是否匹配
				boolean isToMatching = false;
				
				//目的地匹配级别
				int toLevel = 0;
				
				//商品是否匹配--默认为是
				boolean isCargoMatching = true;
				
				//匹配起运地
				//匹配详细地址
				if(StringUtils.isNotBlank(shipperAddress) && StringUtils.isNotBlank(fromAddress)
						&& shipperAddress.trim().equals(fromAddress.trim()) 
						&& (shipperCountyCode.equals(fromCountyCode)
								|| shipperCityCode.equals(fromCityCode))){
					isFromMatching = true;
					fromLevel = 5;
				}
				
				//匹配县级
				if(StringUtils.isBlank(fromAddress) && StringUtils.isNotBlank(shipperCountyCode) && StringUtils.isNotBlank(fromCountyCode)
						&& shipperCountyCode.trim().equals(fromCountyCode.trim())){
					isFromMatching = true;
					fromLevel = 3;
				}
					
				//匹配市级
				if(StringUtils.isBlank(fromCountyCode)  && StringUtils.isNotBlank(shipperCityCode) && StringUtils.isNotBlank(fromCityCode)
						&& shipperCityCode.trim().equals(fromCityCode.trim())){
					isFromMatching = true;
					fromLevel = 2;
				}
				
				//匹配省级
				if(StringUtils.isBlank(fromCityCode)  && StringUtils.isNotBlank(shipperProvinceCode) && StringUtils.isNotBlank(fromProvinceCode)
					&& shipperProvinceCode.trim().equals(fromProvinceCode.trim())){
					isFromMatching = true;
					fromLevel = 1;
				}
				
				//匹配目的地
				//匹配详细地址
				if(StringUtils.isNotBlank(consigneeAddress) && StringUtils.isNotBlank(toAddress)
						&& consigneeAddress.trim().equals(toAddress.trim())
						&& (consigneeCountyCode.equals(toCountyCode)
								|| consigneeCityCode.equals(toCityCode))){
					isToMatching = true;
					toLevel = 5;
				}
				
				//匹配县级
				if(StringUtils.isBlank(toAddress) && StringUtils.isNotBlank(consigneeCountyCode) && StringUtils.isNotBlank(toCountyCode)
						&& consigneeCountyCode.trim().equals(toCountyCode.trim())){
					isToMatching = true;
					toLevel = 3;
				}
				
				//匹配市级
				if(StringUtils.isBlank(toCountyCode) && StringUtils.isNotBlank(consigneeCityCode) && StringUtils.isNotBlank(toCityCode)
							&& consigneeCityCode.trim().equals(toCityCode.trim())){
					isToMatching = true;
					toLevel = 2;
				}
				
				//匹配省级
				if(StringUtils.isBlank(toCityCode) && StringUtils.isNotBlank(consigneeProvinceCode) && StringUtils.isNotBlank(toProvinceCode)
						&& consigneeProvinceCode.trim().equals(toProvinceCode.trim())){
					isToMatching = true;
					toLevel = 1;
				}
				
				//匹配流向上的商品是否与派车单上的商品一致
				if(StringUtils.isNotBlank(dispatchCargoCode) && StringUtils.isNotBlank(cargoCode)
						&& !dispatchCargoCode.trim().equals(cargoCode.trim())){
					isCargoMatching = false;
				}
				
				//匹配成功
				if(isFromMatching && isToMatching && isCargoMatching){
					//获取合同代码,合同路线ID
					String rateNo = contractfee.getStr("contract_code");
					String ratePositionId = getString(contractfee.getInt("customer_contract_position_id"));
					
					//路线分组
					Map<String,List<CsCustomerContract>> ratePositionGroupMap = new HashMap<String,List<CsCustomerContract>>();
					
					//费用信息集合
					List<CsCustomerContract> rateFeesGroup = new ArrayList<CsCustomerContract>();
					
					//获取或者设置合同分组
					if(passRateFeesGroupMap.containsKey(rateNo)){
						ratePositionGroupMap = passRateFeesGroupMap.get(rateNo);
					}else{
						passRateFeesGroupMap.put(rateNo, ratePositionGroupMap);
						rateMap.put(rateNo, contractfee);
					}
					
					//获取或者设置合同路线分组
					if(ratePositionGroupMap.containsKey(ratePositionId)){
						rateFeesGroup = ratePositionGroupMap.get(ratePositionId);
					}else{
						ratePositionGroupMap.put(ratePositionId, rateFeesGroup);
						ratePositionMap.put(ratePositionId, contractfee);
					}
					
					//设置当前流向的匹配级别
					if(fromLevel > 0 && toLevel > 0){
						if((fromLevel > 4 && toLevel <= 3) || (fromLevel <= 3 && toLevel > 4)){
							contractfee.put("matchingLevel", 4);
						} else if(fromLevel > toLevel){
							contractfee.put("matchingLevel", fromLevel);
						} else{
							contractfee.put("matchingLevel", toLevel);
						}
					}
					
					//收集符合条件的费用信息
					rateFeesGroup.add(contractfee);
				}
			}
			
			//错误信息
			StringBuilder errorMsg = new StringBuilder("");
			
			//进行派车单计费
			if(passRateFeesGroupMap.size() == 1){
				for (Entry<String, Map<String,List<CsCustomerContract>>> rateEntry : passRateFeesGroupMap.entrySet()) {
					//路线分组
					Map<String,List<CsCustomerContract>> ratePositionGroupMapAll = rateEntry.getValue();
					
					//若有多个符合条件的路线时,校验路线的匹配等级
					Map<String,List<CsCustomerContract>> ratePositionGroupMap = new HashMap<String,List<CsCustomerContract>>();
					int matchingLevelTemp = -1; 
					
					//确认匹配等级最低的层级
					for (Entry<String, List<CsCustomerContract>> positionEntry : ratePositionGroupMapAll.entrySet()) {
						//根据匹配成功的合同费用生成派车单费用信息
	        			List<CsCustomerContract> positionRateFees = positionEntry.getValue();
	        			if(positionRateFees.size() > 0){
	        				int matchingLevel = positionRateFees.get(0).getInt("matchingLevel");
	        				if(matchingLevelTemp == -1){
	        					matchingLevelTemp = matchingLevel;
	        				}else if(matchingLevel > matchingLevelTemp){
	        					matchingLevelTemp = matchingLevel;
	        				}
	        			}
					}
					
					//收集匹配到的最低层级的路线
					for (Entry<String, List<CsCustomerContract>> positionEntry : ratePositionGroupMapAll.entrySet()) {
						//根据匹配成功的合同费用生成派车单费用信息
	        			List<CsCustomerContract> positionRateFees = positionEntry.getValue();
	        			if(positionRateFees.size() > 0){
	        				int matchingLevel = positionRateFees.get(0).getInt("matchingLevel");
	        				if(matchingLevel == matchingLevelTemp){
	        					ratePositionGroupMap.put(positionEntry.getKey(), positionRateFees);
	        				}
	        			}
					}
					
					if(ratePositionGroupMap.size() == 1){
						for (Entry<String, List<CsCustomerContract>> positionEntry : ratePositionGroupMap.entrySet()) {
							//根据匹配成功的合同费用生成派车单费用信息
		        			List<CsCustomerContract> positionRateFees = positionEntry.getValue();
		        			
		        			//根据费用代码分组流向费用
		        			Map<String,List<CsCustomerContract>> groupPositionRateFeesMap = new HashMap<String,List<CsCustomerContract>>();
		        			for (CsCustomerContract positionRateFee : positionRateFees) {
		        				//获取费用代码
		    					String fee_name_code = positionRateFee.getStr("fee_name_code");
		    					
		    					//分组
		        				if(ratePositionGroupMap.containsKey(fee_name_code)){
		        					ratePositionGroupMap.get(fee_name_code).add(positionRateFee);
		    					}else{
		    						List<CsCustomerContract> tempGroup = new ArrayList<CsCustomerContract>();
		    						tempGroup.add(positionRateFee);
		    						groupPositionRateFeesMap.put(fee_name_code, tempGroup);
		    					}
		        			}
		        			
		        			//根据流向的费用信息,生成派车单费用信息
		        			for (Entry<String,List<CsCustomerContract>> entry : groupPositionRateFeesMap.entrySet()) {
		        				List<CsCustomerContract> contractFees = entry.getValue();
		        				
		        				//若费用不重复,则直接生成
								if(contractFees.size() == 1){
									CsDispatchFee csDispatchFee = new CsDispatchFee();
		            		    	this.preSave(csDispatchFee);   
		            		    	csDispatchFee.set("unique_no", CodeUtil.getInstance().getCode("FEE"));
		            		    	String error = CsDispatchFee.dao.generateDispatchFee(csDispatchFee,contractFees.get(0), csDispatchOrder,calculateCount);
		            		    	if(error.length() > 0){
		            		    		System.out.println(error);
		            		    	}
								}else if(contractFees.size() == 2){
									//若费用重复,则匹配创建时间最新的临时费用类型的费用
									CsCustomerContract newestContractFee = null;
									
									//固定费用
									List<CsCustomerContract> fixedContractFees = new ArrayList<CsCustomerContract>();
									
									for (CsCustomerContract contractFee : contractFees) {
										//校验是否临时类型
										if("2".equals(contractFee.getStr("contract_fee_type"))){
											if(newestContractFee == null){
												newestContractFee = contractFee;
											}else{
												//校验创建时间是否最新
												if(contractFee.getDate("create_time").getTime() > newestContractFee.getDate("create_time").getTime()){
													newestContractFee = contractFee;
												}
											}
										}else{
											fixedContractFees.add(contractFee);
										}
									}
									
									//若临时的费用只有有一个,则生成对应派车单费用信息
									if(newestContractFee != null){
										CsDispatchFee csDispatchFee = new CsDispatchFee();
			            		    	this.preSave(csDispatchFee);     
			            		    	csDispatchFee.set("unique_no", CodeUtil.getInstance().getCode("FEE"));
			            		    	String error = CsDispatchFee.dao.generateDispatchFee(csDispatchFee,newestContractFee, csDispatchOrder,calculateCount);
			            		    	if(error.length() > 0){
			            		    		System.out.println(error);
			            		    	}
									}
								}
							}
						}
						
						//设置计费成功表示
						result.setSuccess(true);
					}else{
						//获取合同名称
						CsCustomerContract rate = rateMap.get(rateEntry.getKey());
						if(rate != null){
							//合同名称
							String rateName = getString(rate.getStr("contract_name"));
							
							//组合路线名称
							StringBuilder positionName = new StringBuilder(); 
							for (Entry<String, List<CsCustomerContract>> positionEntry : ratePositionGroupMap.entrySet()) {
								//获取路线名称
								CsCustomerContract position = ratePositionMap.get(positionEntry.getKey());
								if(position != null){
									//起运地
			            			String fromProvince = position.getStr("from_province");
			            			String fromCity = position.getStr("from_city");
			            			String fromCounty = position.getStr("from_county");
			            			//目的地
			            			String toProvince = position.getStr("to_province");
			            			String toCity = position.getStr("to_city");
			            			String toCounty = position.getStr("to_county");
			            			positionName.append(","+getString(fromProvince)+getString(fromCity)+getString(fromCounty));
			            			positionName.append("--"+getString(toProvince)+getString(toCity)+getString(toCounty));
								}
							}
							
							errorMsg.append("合同计费失败,原因:合同("+rateName+"),存在多个符合条件的计费路线("+positionName.toString().replaceFirst(",", "")+")");
						}
					}
				}
			}else if(passRateFeesGroupMap.size() > 2){
				//组合合同名称
				StringBuilder rateName = new StringBuilder(); 
				for (Entry<String, Map<String,List<CsCustomerContract>>> rateEntry : passRateFeesGroupMap.entrySet()) {
					//获取合同名称
					CsCustomerContract rate = rateMap.get(rateEntry.getKey());
					if(rate != null){
						rateName.append(","+getString(rate.getStr("contract_name")));
					}
				}
				
				errorMsg.append("合同计费失败,原因:存在多个符合条件的合同("+rateName.toString().replaceFirst(",", "")+")");
			}else{
				errorMsg.append("能找到符合条件的合同,但未匹配到该流向的费率,合同计费失败");
			}
			
			if(errorMsg.length() > 0){
				result.setSuccess(false);
				result.setMsg(errorMsg.toString());
			}
		}
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
    
}
