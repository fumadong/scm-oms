package com.chinaservices.oms.rule.controller;

import com.chinaservices.oms.rule.model.CsDivideTask;
import com.chinaservices.oms.rule.service.CsDivideTaskService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
*类用途说明：周转规则
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author Noaman.Chen
*/
@Controller(controllerKey = "/rule/csDivideTask", viewPath = "/admin")
public class CsDivedeTaskController extends BaseController{
    CsDivideTaskService csDivideTaskService = new CsDivideTaskService();
	/**
	 * 列表查询
	 */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length"));
        int pageSize = getParaToInt("length");
        Page<Record> list = new SqlExecutor().page("csDivideTask_qeury", params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("预到货通知单分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }

    /**
     * 删除
     */
    public void delete() {
    	Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        if(ids.length>0){
            csDivideTaskService.deleteByIds(ids);
        }
        result.setSuccess(true);
        renderJson(result);
    }

    /**
     * 新增或者修改
     *
     */
    public void saveOrUpdate() {
        Result result = new Result();
        CsDivideTask model = getModel(CsDivideTask.class, "");
        Integer id = model.getInt("id");
        boolean isDuplicate = csDivideTaskService.checkDuplicate(id, model.getInt("divide_rule_id").toString(),model.getInt("task_sequence").toString());
        if (isDuplicate) {
            result.setSuccess(false);
            result.addError("序号[" + model.getStr("task_sequence") + "]不能重复");
        } else {
            if (null == model.get("id")) {
                model.set("creator", getLoginUserId());
            } else {
                model.set("modifier", getLoginUserId());
            }
            csDivideTaskService.saveOrUpdate(model);
            result.setSuccess(true);
            result.setData(model);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }

    /**
     * 根据ID获取数据
     *
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsDivideTask model = csDivideTaskService.findById(id);
            result.setData(model);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
