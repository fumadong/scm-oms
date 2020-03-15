package com.chinaservices.oms.track.controller;

import java.util.HashMap;
import java.util.Map;

import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

@Controller(controllerKey = "/api/oms/rule/csOrderTrack")
public class CsOrderTrackController extends BaseController {

	/**
	 * 列表查询
	 */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        
        Page<Record> page = new SqlExecutor().page("csOrderMilestone_qeury", params, start, pageSize);
        
        dataTables.put("data", page.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", page.getTotalRow());
        dataTables.put("recordsFiltered", page.getTotalRow());
        renderJson(dataTables);
    }
	
}
