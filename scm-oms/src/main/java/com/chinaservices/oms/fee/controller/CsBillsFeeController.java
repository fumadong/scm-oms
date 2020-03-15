package com.chinaservices.oms.fee.controller;

import com.chinaservices.oms.dispatch.model.CsDispatchFee;
import com.chinaservices.oms.fee.model.CsBillsFee;
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
@Controller(controllerKey = "/fee/csBillsFee", viewPath = "/admin")
public class CsBillsFeeController extends BaseController {
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
        Page<CsBillsFee> list = CsBillsFee.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("账单费用分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }

    /**
     * 删除
     */
    public void delete() {
    	Result result = new Result();
        String id = getPara("ids");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
        	//获取账单费用信息
        	CsBillsFee fee = CsBillsFee.dao.findById(Integer.valueOf(idStr));
        	
        	//删除账单费用信息
        	CsBillsFee.dao.deleteById(Integer.valueOf(idStr));
        	
        	//删除派车单费用信息中对应的账单号
        	CsDispatchFee.dao.deleteDispatchFeeByUniqueNo(fee.getStr("unique_no"));
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 根据ID获取数据
     */
    public void getById() {
    	Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsBillsFee csBillsFee = CsBillsFee.dao.findById(id);
            result.setData(csBillsFee);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    
    /**
     * 添加费用到账单费用明细中
     */
    public void addFeeToBillsFee() {
    	Result result = new Result();
        String idsStr = getPara("ids");
        String bill_no = getPara("bill_no");
        if (null != idsStr) {
        	String[] ids = idsStr.split(",");
        	for (String id : ids) {
				//查询获取派车单费用信息
        		CsDispatchFee dispatchFee = CsDispatchFee.dao.findPayFeeById(Integer.parseInt(id));
        		
        		//生成账单费用
        		CsBillsFee csBillsFee = new CsBillsFee();
        		csBillsFee.set("bill_no", bill_no);
        		csBillsFee.set("order_no", dispatchFee.get("order_no"));
        		csBillsFee.set("distribution_no", dispatchFee.get("distribution_no"));
        		csBillsFee.set("dispatch_no", dispatchFee.get("dispatch_no"));
        		csBillsFee.set("carrier_code", dispatchFee.get("carrier_code"));
        		csBillsFee.set("carrier_name", dispatchFee.get("carrier_name"));
        		csBillsFee.set("unique_no", dispatchFee.get("unique_no"));
        		csBillsFee.set("fee_code", dispatchFee.get("fee_code"));
        		csBillsFee.set("fee_name", dispatchFee.get("fee_name"));
        		csBillsFee.set("fee_type", dispatchFee.get("fee_type"));
        		csBillsFee.set("total_amount", dispatchFee.get("total_amount"));
        		csBillsFee.set("account_period", dispatchFee.get("account_period"));
        		csBillsFee.set("remark", dispatchFee.get("remark"));
        		csBillsFee.set("fee_status", dispatchFee.get("fee_status"));
        		csBillsFee.set("occur_time", dispatchFee.get("occur_time"));
        		csBillsFee.set("tax_rate", dispatchFee.get("tax_rate"));
        		csBillsFee.set("rounding_way", dispatchFee.get("rounding_way"));
        		preSave(csBillsFee);
        		CsBillsFee.dao.saveOrUpdate(csBillsFee);
        		
        		//更新派车单费用对应的账单号
        		dispatchFee.set("bill_no", bill_no);
        		CsDispatchFee.dao.saveOrUpdate(dispatchFee);
			}
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
