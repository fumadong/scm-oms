package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsCustomer;
import com.chinaservices.oms.cust.model.CsCustomerContact;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.PinyinUtil;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
*类用途说明：客户管理
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author loemkie chen
*/
@Controller(controllerKey = "/cust/csCustomer", viewPath = "/admin")
public class CsCustomerController extends BaseController{
	static CsCustomer dao = new CsCustomer();
	/**
	 * 列表查询
	 */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customer_code", getPara("customer_code"));
        params.put("customer_name", getPara("customer_name"));
        params.put("customer_type", getPara("customer_type"));
        params.put("tax_code", getPara("tax_code"));
        
        params.put("status", getPara("status"));
        params.put("tel", getPara("tel"));
        params.put("office", getPara("office"));
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomer> list = CsCustomer.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("客户管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
    /**
	 * 客户及默认联系人弹出框列表查询
	 */
    public void popWinQuery() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customer_code", getPara("customer_code"));
        params.put("customer_name", getPara("customer_name"));
        
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomer> list = CsCustomer.dao.getPopPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
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
            CsCustomer.dao.deleteById(Integer.valueOf(idStr));
            CsCustomerContact.dao.deleteByCustomerId(Integer.valueOf(idStr));
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
            count = count + CsCustomer.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }

    /**
     * 新增或者修改
     *
     */
    public void submit() {
        Result result = new Result();
        CsCustomer csCustomer = getModel(CsCustomer.class, "");
        Integer id = csCustomer.getInt("id");
        boolean isCustomerCode = CsCustomer.dao.checkDuplicateNo(id, csCustomer.getStr("customer_code"));
        if (isCustomerCode) {
            result.setSuccess(false);
            result.addError("客户代码[" + csCustomer.getStr("customer_code") + "]不能重复");
        } else {
            if (null == csCustomer.get("id")) {
            	csCustomer.set("status", "1");
            } 
        	//设置公共字段
        	this.preSave(csCustomer);
            CsCustomer.dao.saveOrUpdate(csCustomer);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
            result.setData(csCustomer);
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
            CsCustomer csCustomer = CsCustomer.dao.findById(id);
            result.setData(csCustomer);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    public void getPinyin(){
    	 Result result = new Result();
         String customer_name = getPara("customer_name");
         Integer id = getParaToInt("id");
         String pinyin = PinyinUtil.getPinYinHeadChar(customer_name);
         boolean isCustomerCode = CsCustomer.dao.checkDuplicateNo(id, pinyin);
         if(isCustomerCode){
        	 pinyin = PinyinUtil.genPinyinAndRandom(customer_name);
         }
         result.setData(pinyin);
         result.setSuccess(true);
         renderJson(result);
    }
}
