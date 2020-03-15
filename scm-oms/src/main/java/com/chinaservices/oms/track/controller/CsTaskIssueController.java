package com.chinaservices.oms.track.controller;

import java.util.HashMap;
import java.util.Map;

import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

@Controller(controllerKey = "/api/oms/track/csTaskIssue")
public class CsTaskIssueController extends BaseController{
	
	/**
	 * 列表查询
	 */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        
        Page<Record> page = new SqlExecutor().page("csOrderTask_page_query", params, start, pageSize);
        
        dataTables.put("data", page.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", page.getTotalRow());
        dataTables.put("recordsFiltered", page.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 查询下发日志
     */
    public void queryIssueLog() {
    	Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        
        Page<Record> page = new SqlExecutor().page("csTaskIssueLog_query", params, start, pageSize);
        
        dataTables.put("data", page.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", page.getTotalRow());
        dataTables.put("recordsFiltered", page.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 任务重新下发
     */
    public void reissue() {
    	Result result = new Result();
    	result.setSuccess(true);
    	
    	// 重新查询任务
    	
    	// 重新匹配下发规则
    	
    	// 下发事件
    	
    	renderJson(result);
    }
	
}
