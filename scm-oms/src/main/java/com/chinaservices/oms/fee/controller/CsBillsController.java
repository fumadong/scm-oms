package com.chinaservices.oms.fee.controller;

import com.chinaservices.oms.fee.model.CsBills;
import com.chinaservices.oms.fee.model.CsFeeName;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 账单管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, June 3, 2017
 */
@Controller(controllerKey = "/fee/csBills", viewPath = "/admin")
public class CsBillsController extends BaseController {
    /**
     * 分页查询
     */
    public void page() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsBills> list = CsBills.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("费用名称管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
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
        for (String idStr : ids) {
            CsFeeName.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }

    /**
     * 更新状态
     */
    public void updateStatus() {
    	Result result = new Result();
        String id = getPara("id");
        String status = getPara("status");
        String[] ids = StringUtils.split(id, ",");
        int count = 0;
        for (String idStr : ids) {
            count = count + CsBills.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }

    /**
     * 保存或更新
     */
    public void submit() {
    	Result result = new Result();
    	CsBills csBills = getModel(CsBills.class, "");
    	CsBills.dao.saveOrUpdate(csBills);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    /**
     * 根据ID获取数据
     */
    public void getById() {
    	Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsBills csBills = CsBills.dao.findById(id);
            result.setData(csBills);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
