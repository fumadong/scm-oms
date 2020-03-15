package com.chinaservices.oms.supplier.controller;

import com.chinaservices.oms.supplier.model.CsTransportCommitment;
import com.chinaservices.oms.supplier.model.CsTransportCommitmentFlow;
import com.chinaservices.oms.supplier.service.CsTransportCommitmentFlowService;
import com.chinaservices.oms.supplier.service.CsTransportCommitmentService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Controller(controllerKey = "/api/oms/csTransportCommitment")
public class CsTransportCommitmentController extends BaseController {

	private CsTransportCommitmentService csTransportCommitmentService = new CsTransportCommitmentService();
	private CsTransportCommitmentFlowService csTransportCommitmentFlowService = new CsTransportCommitmentFlowService();
	
	/**
     * 分页查询
     */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsTransportCommitment> page = csTransportCommitmentService.getPageByCondition(params, pageNo, pageSize);
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
			CsTransportCommitment model = csTransportCommitmentService.findById(id);
			result.setData(model);
		} else {
			result.setData(null);
		}
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 根据id查询规则
     */
    public void getFlowById() {
    	Result result = new Result();
		Integer id = getParaToInt("flow_id");
		if (null != id) {
			CsTransportCommitmentFlow model = csTransportCommitmentFlowService.findById(id);
			result.setData(model);
		} else {
			result.setData(null);
		}
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 查询规则明细
     */
    public void findSubFlows() {
    	Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
         Page<CsTransportCommitmentFlow> page = csTransportCommitmentFlowService.getPageByCondition(params, pageNo, pageSize);
         dataTables.put("data", page.getList());
         dataTables.put("draw", draw);
         dataTables.put("recordsTotal", page.getTotalRow());
         dataTables.put("recordsFiltered", page.getTotalRow());
         renderJson(dataTables);
    }
    
    /**
     * 保存
     */
    public void save() {
    	Result result = new Result();
    	CsTransportCommitment model = getModel(CsTransportCommitment.class, "", true);
		if (null == model.get("id")) {
			// 名称和承运商不能重复
			result = csTransportCommitmentService.checkDuplicate(model.getStr("name"), model.getStr("carrier_code"));
			if(!result.isSuccess()) {
				renderJson(result);
				return;
			}
			model.set("creator", getLoginUserId());
			model.set("status", "1");
		} else {
			model.set("modifier", getLoginUserId());
		}
		csTransportCommitmentService.save(model);
		result.setData(model);
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 保存流向
     */
    public void saveFlow() {
    	Result result = new Result();
    	CsTransportCommitmentFlow model = getModel(CsTransportCommitmentFlow.class, "", true);
		if (null == model.get("id")) {
			model.set("creator", getLoginUserId());
		} else {
			model.set("modifier", getLoginUserId());
		}
		csTransportCommitmentFlowService.save(model);
		result.setData(model);
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 保存流向
     */
    public void savaFlow() {
    	Result result = new Result();
    	CsTransportCommitmentFlow model = getModel(CsTransportCommitmentFlow.class, "", true);
		if (null == model.get("id")) {
			model.set("creator", getLoginUserId());
			model.set("status", "1");
		} else {
			model.set("modifier", getLoginUserId());
		}
		csTransportCommitmentFlowService.save(model);
		result.setData(model);
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 删除
     */
    public void delete() {
    	Result result = new Result();
    	String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		// 删除子表
		csTransportCommitmentFlowService.deleteByCommitmentIds(ids);
		// 删除主表
		csTransportCommitmentService.deleteAllByIds(ids);
    	result.setSuccess(true);
		renderJson(result);
    }
	/**
	 * 删除子表
	 */
	public void deleteFlow() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		// 删除子表
		csTransportCommitmentFlowService.deleteAllByIds(ids);
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
			csTransportCommitmentService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), enableStatus);
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
			csTransportCommitmentService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), disableStatus);
		}
		result.setSuccess(true);
		renderJson(result);
    }
}
