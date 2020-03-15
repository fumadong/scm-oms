package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 供应商管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, May 17, 2017
 */
@Controller(controllerKey = "/supplier", viewPath = "/admin")
public class CsSupplierController extends BaseController {

    /**
     * 分页查询
     */
    public void page() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsSupplier> list = CsSupplier.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }

    /**
     * 删除供应商
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
            CsSupplier.dao.deleteById(Integer.valueOf(idStr));
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
            count = count + CsSupplier.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
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
        CsSupplier supplier = getModel(CsSupplier.class, "");
        Integer id = supplier.getInt("id");
        boolean isDuplicateVehicleNo = CsSupplier.dao.checkDuplicateSupplierCode(id, supplier.getStr("supplier_code"));
        if (isDuplicateVehicleNo) {
            result.setSuccess(false);
            result.addError("供应商代码[" + supplier.getStr("supplier_code") + "]不能重复");
        } else {
            if (null == supplier.get("id")) {
                supplier.set("creator", getLoginUserId());
                supplier.set("status", "1");
            } else {
                supplier.set("modifier", getLoginUserId());
            }
            CsSupplier.dao.saveOrUpdate(supplier);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }

    /**
     * 根据ID获取数据
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsSupplier supplier = CsSupplier.dao.findById(id);
            result.setData(supplier);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
