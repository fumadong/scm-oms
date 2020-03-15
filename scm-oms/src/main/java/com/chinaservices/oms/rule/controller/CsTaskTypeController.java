package com.chinaservices.oms.rule.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.admin.model.SysUser;
import com.chinaservices.oms.rule.model.CsTaskType;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

@Controller(controllerKey = "/api/oms/rule/csTaskType")
public class CsTaskTypeController extends BaseController {
	
	/**
     * 分页查询
     */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        Page<Record> page = new SqlExecutor().page("csTaskType_query", params, start, pageSize);
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
			CsTaskType model = CsTaskType.dao.findById(id);
			result.setData(model);
		} else {
			result.setData(null);
		}
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 保存
     */
    public void save() {
    	Result result = new Result();
    	CsTaskType model = getModel(CsTaskType.class, "", true);
		if (null == model.get("id")) {
			model.set("creator", getLoginUserId());
			model.set("status", "1");
		} else {
			model.set("modifier", getLoginUserId());
		}
		CsTaskType.dao.save(model);
		result.setData(model);
		result.setSuccess(true);
		renderJson(result);
    }
    
    /**
     * 删除
     */
    public void delete() {
    	Result result = new Result();
    	String idStr = getPara("id");
		String[] ids = StringUtils.split(idStr, ",");
		for (String id : ids) {
			CsTaskType.dao.deleteById(id);
		}
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
		CsTaskType.dao.updateStatus(ids, "1");
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
		CsTaskType.dao.updateStatus(ids, "0");
		result.setSuccess(true);
		renderJson(result);
    }
	
}
