package com.chinaservices.oms.order.controller;

import com.chinaservices.oms.order.model.CsOrderCargo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.util.EmptyUtils;
import com.chinaservices.sql.SqlExecutor;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 订单商品
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@Before(Tx.class)
@Controller(controllerKey = "/order/csOrderCargo", viewPath = "/admin")
public class CsOrderCargoController extends BaseController {
	
	/**
	 * 分页查询订单商品
	 */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = buildParams();
        
        int draw = getParaToInt("draw");
        int start = getParaToInt("start");
        int pageSize = getParaToInt("length");
        
        if (EmptyUtils.isNotEmpty(getPara("order_id"))|| EmptyUtils.isNotEmpty(getPara("order_no"))) {
        	Page<Record> list = new SqlExecutor().page("csOrderGargo_query", params, start, pageSize);
        	dataTables.put("data", list.getList());
        	dataTables.put("recordsTotal", list.getTotalRow());
        	dataTables.put("recordsFiltered", list.getTotalRow());
        } else {
        	dataTables.put("data", null);
        	dataTables.put("recordsTotal", 0);
        	dataTables.put("recordsFiltered", 0);
        }
        dataTables.put("draw", draw);
        renderJson(dataTables);
    }
    
    /**
     * 根据id获取订单商品
     */
    public void getById() {
    	Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	Map<String, Object> params = new HashMap<>();
        	params.put("id", id);
            Record csOrderCargo = new SqlExecutor().findOne("csOrderCargo_formGetById_query", params);
            result.setData(csOrderCargo);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 保存订单商品
     */
    public void save() {
        Result result = new Result();
        CsOrderCargo csOrderCargo = getModel(CsOrderCargo.class, "",true);
        if (null == csOrderCargo.get("id")) {
        	// 如果是新增的商品，设置行号
            Map<String, Object> maxLineNoParams = new HashMap<String, Object>();
            maxLineNoParams.put("order_id", csOrderCargo.get("order_id"));
            Record maxLineNoRecord = new SqlExecutor().findOne("csOrderCargo_maxLineNo_query", maxLineNoParams);
            if (null == maxLineNoRecord||null==maxLineNoRecord.getInt("max_line_no")) {
            	csOrderCargo.set("line_no", 1);
            } else {
            	csOrderCargo.set("line_no", Integer.valueOf(maxLineNoRecord.getInt("max_line_no")) + 1);
            }
        }
        
    	// 设置公共字段
    	this.preSave(csOrderCargo);
    	// 保存
    	CsOrderCargo.dao.save(csOrderCargo);
    	// 返回
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 根据订单商品id删除订单商品
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("ids");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
        	CsOrderCargo.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }
	
}
