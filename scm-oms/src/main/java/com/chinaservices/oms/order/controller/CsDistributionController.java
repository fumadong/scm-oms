package com.chinaservices.oms.order.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.order.model.CsDistribution;
import com.chinaservices.oms.order.model.CsDistributionCargo;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.query.TableRequest;
import com.chinaservices.sdk.support.query.TableResponse;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sdk.util.EmptyUtils;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

/** 
 * 电子围栏
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@Before(Tx.class)
@Controller(controllerKey = "/order/csDistribution", viewPath = "/admin")
public class CsDistributionController extends BaseController {
	
	/**
	 * 分页查询
	 */
	public void getPage2() {
		TableRequest request = getTableRequest();
		QueryInfo queryInfo = new QueryInfo("order.csDistribution.get", request);
		queryInfo.addParam("order_no", getPara("order_no"));
		queryInfo.addParam("distribution_no", getPara("distribution_no"));
		queryInfo.addParam("carrier_code", getPara("carrier_code"));
		queryInfo.addParam("status", getPara("status"));
		TableResponse<Record> tableResponse = queryInfo.paginate();
		renderJson(tableResponse);
	}
	
	/**
	 * 列表查询
	 */
    public void getPage() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params = this.buildParams();
        int pageNo = (getParaToInt("start") / getParaToInt("length"));
        int pageSize = getParaToInt("length");
        Page<Record> list = new SqlExecutor().page("distribution_query", params, pageNo, pageSize);
        int draw = getParaToInt("draw");
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }
	
	/**
	 * 查询订单下各承运商分配情况、订单信息
	 */
	public void getDistributionInfo () {
		String orderNo = getPara("order_no");
		// 查询各承运商分配情况
		List<Record> carrierDistributions = this.getByOrderNo(orderNo);
		// 查询订单信息
		Record orderInfo = this.getOrderDistributionBaseInfo(orderNo);
		// 设置返回值
		Map<String, Object> returnObject = new HashMap<>();
		returnObject.put("order", orderInfo);
		returnObject.put("distributions", carrierDistributions);
		renderJson(returnObject);
	}
	
	/**
	 * 根据系统订单号查询订单下各承运商分配情况(分配单根据承运商代码分组统计分配量)
	 */
	private List<Record> getByOrderNo(String orderNo) {
		List<Record> records;
		if (EmptyUtils.isNotEmpty(orderNo)) {
			QueryInfo queryInfo = new QueryInfo("order.csDistribution.getCarrireDistributionInfo");
			queryInfo.addParam("order_no", getPara("order_no"));
			records = queryInfo.find();
		} else {
			records = new ArrayList<>();
		}
		return records;
	}
	
	/**
	 * 根据系统订单号查询分配订单相关数据信息查询
	 */
	private Record getOrderDistributionBaseInfo(String orderNo) {
		Record record;
		if (EmptyUtils.isNotEmpty(orderNo)) {
			QueryInfo queryInfo = new QueryInfo("order.csOrder.getOrderDistributionBaseInfo");
			queryInfo.addParam("order_no", getPara("order_no"));
			record = queryInfo.findOne();
		} else {
			record = null;
		}
		return record;
	}
	
	/**
     * 根据id获取数据
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsDistribution cargoContrast = CsDistribution.dao.getById(id);
            result.setData(cargoContrast);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 订单分配：生成分配单及其商品
     */
    public void orderDistribution() {
    	Result result = new Result();
    	result.setSuccess(true);
    	// 取得系统订单号、分配量
    	String orderNo = getPara("order_no");
    	BigDecimal planAmount = new BigDecimal(getPara("plan_amount"));
    	// 查询订单状态及商品
    	QueryInfo queryInfo = new QueryInfo("order.csOrder.getOrderStatusAndCargo");
		queryInfo.addParam("order_no", orderNo);
		Record orderStatusAndCargo = queryInfo.findOne();
		if (null == orderStatusAndCargo) {
			result.setMsg("订单已不存在");
			result.setSuccess(false);
		} else {
			if (!("20".equals(orderStatusAndCargo.getStr("order_status")) || "30".equals(orderStatusAndCargo.getStr("order_status")))) {
				// 状态校验
				result.setMsg("订单状态不为确认、执行中，无法分配");
				result.setSuccess(false);
			} else {
				BigDecimal differ = orderStatusAndCargo.getBigDecimal("remainder_amount").subtract(planAmount);
				if (differ.compareTo(BigDecimal.ZERO) == -1) {
					// 分配量校验：不能超过计划量
					result.setMsg("分配量不能大于剩余量，请重新打开分配界面");
					result.setSuccess(false);
				} else {
					// 生成分配单并保存
					CsDistribution distribution = new CsDistribution();
					distribution.set("order_no", orderNo);
					distribution.set("require_time_from", getPara("require_time_from"));
					distribution.set("require_time_to", getPara("require_time_to"));
					distribution.set("carrier_code", getPara("carrier_code"));
					distribution.set("carrier_name", getPara("carrier_name"));
					distribution.set("remark", getPara("remark"));
					distribution.set("status", "10");
					String distribution_no = CodeUtil.getInstance().getCode("DISTRIBUTION");
					distribution.set("distribution_no", distribution_no);
					this.preSave(distribution);
					CsDistribution.dao.save(distribution);
					// 生成分配单商品并保存，更新订单商品分配量
					this.generateDistributionCargo(orderStatusAndCargo, distribution_no, planAmount);
				}
			}
		}
        
        renderJson(result);
    }
    
    /**
     * 生成分配单商品
     * @param distribution
     * @param plan_amount
     * @return
     */
    private void generateDistributionCargo(Record orderStatusAndCargo, String distribution_no, BigDecimal plan_amount) {
    	// 生成并保存分配单商品
    	CsDistributionCargo distributionCargo = new CsDistributionCargo();
    	distributionCargo.set("order_no", orderStatusAndCargo.get("order_no"));
    	distributionCargo.set("distribution_no", distribution_no);
    	distributionCargo.set("cargo_code", orderStatusAndCargo.get("cargo_code"));
    	distributionCargo.set("cargo_name", orderStatusAndCargo.get("cargo_name"));
    	distributionCargo.set("cargo_type", orderStatusAndCargo.get("cargo_type"));
    	distributionCargo.set("package_specification", orderStatusAndCargo.get("package_specification"));
    	distributionCargo.set("unit", orderStatusAndCargo.get("unit"));
    	distributionCargo.set("plan_amount", plan_amount);
    	distributionCargo.set("complete_amount", 0);
    	this.preSave(distributionCargo);
    	CsDistributionCargo.dao.save(distributionCargo);
    	// 更新订单商品分配量
    	QueryInfo updateOrderCargo = new QueryInfo("order.csOrderCargo.updateOrderCargoDistributionAmount");
    	updateOrderCargo.addParam("order_no", orderStatusAndCargo.get("order_no"));
    	updateOrderCargo.addParam("modifier", this.getLoginUserId());
    	updateOrderCargo.execute();
    }
    
    /**
     * 保存
     */
    public void save() {
        Result result = new Result();
        CsDistribution electronicFence = getModel(CsDistribution.class, "");
        Integer id = electronicFence.getInt("id");
    	// 新增数据字段赋值
    	if (null == id) {
    		electronicFence.set("status", "1");
    		electronicFence.set("pm_code", this.UUID());
    	}
    	// 设置公共字段
    	this.preSave(electronicFence);
    	// 保存
    	CsDistribution.dao.save(electronicFence);
    	result.setSuccess(true);
        	
        renderJson(result);
    }
	
	/**
	 * 删除
	 */
	public void delete() {
		Result result = new Result();
        String idsString = getPara("ids");
        boolean isOk = true;
        if (!StringUtils.isNotBlank(idsString)) {
        	return;
        }
        // 查询分配单
        String[] ids = StringUtils.split(idsString, ",");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ids", ids);
        List<Record> records = new SqlExecutor().find("distribution_query", params);
        if (records.isEmpty()) {
        	isOk = false;
        	result.setMsg("数据已不存在，请重新查询后操作");
        }
        // 分配单状态校验
        List<String> distributionNos = new ArrayList<>();
        String orderNo = null;
        if (isOk) {
        	for (Record record : records) {
        		if (!"10".equals(record.get("status"))) {
        			result.setMsg(record.getStr("distribution_no") + ": 状态不是已分配状态，无法删除，请重新查询数据");
        			isOk = false;
        			break;
        		}
        		distributionNos.add(record.getStr("distribution_no"));
        		if (null == orderNo) {
        			orderNo = record.getStr("order_no");
        		}
        	}
        }
        // 删除分配单
        if (isOk) {
        	// 删除分配单
        	for (String id : ids) {
        		CsDistribution.dao.deleteById(Integer.valueOf(id));
        	}
        	// 删除分配单商品
        	for (String distributionNo : distributionNos) {
        		QueryInfo deletereInfo = new QueryInfo("order.csDistributionCargo.deleteByDistributionNo");
        		deletereInfo.addParam("distribution_no", distributionNo);
        		deletereInfo.execute();
        	}
        	// 更新订单商品分配数量
        	QueryInfo updateOrderCargo = new QueryInfo("order.csOrderCargo.updateOrderCargoDistributionAmount");
        	updateOrderCargo.addParam("order_no", orderNo);
        	updateOrderCargo.addParam("modifier", this.getLoginUserId());
        	updateOrderCargo.execute();
        }
        // 返回
        result.setSuccess(isOk);
        renderJson(result);
	}
	
	/**
     * 更新状态
     */
    public void updateStatus() {
        Result result = new Result();
        String idsString = getPara("ids");
        String status = getPara("status");
        String[] ids = StringUtils.split(idsString, ",");
        int count = 0;
        for (String id : ids) {
            count = count + CsDistribution.dao.updateStatus(Integer.valueOf(id), getLoginUserId(), status);
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
}
