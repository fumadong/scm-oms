package com.chinaservices.oms.cargo.controller;

import com.chinaservices.oms.cargo.model.CsCargo;
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
*类用途说明：商品管理
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author Joan.Zhang
*/
@Controller(controllerKey = "/cargo/csCargo", viewPath = "/admin")
public class CsCargoController extends BaseController {
	
	/**
	 * 列表查询
	 */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("cargo_code", getPara("cargo_code"));
        params.put("cargo_name", getPara("cargo_name"));
        params.put("cargo_type", getPara("cargo_type"));
        params.put("status", getPara("status"));
        params.put("customer_code", getPara("customer_code"));
        params.put("customer_code_or_null", getPara("customer_code_or_null")); // 弹出框条件：货主代码
        params.put("package_specification", getPara("package_specification"));
        params.put("tenancy", getPara("tenancy"));
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCargo> list = CsCargo.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("商品管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
    /**
     * 弹出查询
     */
    public void popWinQuery() {
    	Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        String orderNosStr = getPara("order_nos");
        if(!StringUtils.isBlank(orderNosStr)) {
        	String[] order_nos = orderNosStr.split(",");
        	params.put("order_nos", order_nos);
        }
        
        Page<Record> list = new SqlExecutor().page("csCargo_popWin_query", params, start, pageSize);
        
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 根据ID获取数据
     *
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsCargo csCargo = CsCargo.dao.findById(id);
            result.setData(csCargo);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    /**
     * 新增或者修改
     *
     */
    public void submit() {
        Result result = new Result();
        CsCargo csCargo = getModel(CsCargo.class, "",true);
        Integer id = csCargo.getInt("id");
        boolean isCargoCode = CsCargo.dao.checkDuplicateNo(id, csCargo.getStr("cargo_code"));
        if (isCargoCode) {
            result.setSuccess(false);
            result.addError("商品代码[" + csCargo.getStr("cargo_code") + "]不能重复");
        } else {
        	//modify by loemkie
            if (null == csCargo.get("id")) {
            	csCargo.set("status", "1");
            }
        	//设置公共值
        	this.preSave(csCargo);
            CsCargo.dao.saveOrUpdate(csCargo);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }
    
    /**
     * 删除
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");

        for (String idStr : ids) {
        	CsCargo.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }

    /**
     * 更新状态
     *
     */
    public void updateStatus() {
        Result result = new Result();
        String id = getPara("id");
        String status = getPara("status");
        String[] ids = StringUtils.split(id, ",");
        int count = 0;
        for (String idStr : ids) {
            count = count + CsCargo.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }
}
