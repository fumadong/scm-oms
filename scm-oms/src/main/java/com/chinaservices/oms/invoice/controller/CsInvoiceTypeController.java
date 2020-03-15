package com.chinaservices.oms.invoice.controller;

import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.oms.invoice.model.CsInvoiceType;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 发票
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Dylan Fu
 * @since 1.0, March 5, 2020
 */
@Controller(controllerKey = "/invoice", viewPath = "/admin")
public class CsInvoiceTypeController extends BaseController {

    /**
     * 分页查询
     */
    public void page() {
        //发票数据集合
        Map<String, Object> dataTables = new HashMap<>();
        Map<String, Object> params = changeMap(getParaMap());

        //页面分页参数
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");

        //将分页参数和发票集合添加到HashMap，返回Json
        Page<CsInvoiceType> list = CsInvoiceType.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }

    /**
     * 删除发票
     */
    public void delete() {

        Result result = new Result();
        //需要删除发票的id
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
            //执行删除的sql
            CsInvoiceType.dao.deleteById(Integer.valueOf(idStr));
        }

        result.setSuccess(true);
        renderJson(result);
    }


    /**
     * 保存或更新
     */
    public void submit() {
        //获取发票id，和验证状态
        Result result = new Result();
        CsInvoiceType csInvoiceType = getModel(CsInvoiceType.class, "");
        Integer id = csInvoiceType.getInt("id");
        boolean isDuplicateVehicleNo = CsInvoiceType.dao.checkDuplicateSupplierCode(id, csInvoiceType.getStr("invoice_type_code"));

        if (isDuplicateVehicleNo) {
            result.setSuccess(false);
            result.addError("发票代码[" + csInvoiceType.getStr("invoice_type_code") + "]不能重复");
        } else {
            if (null == csInvoiceType.get("id")) {
                csInvoiceType.set("creator", getLoginUserId());
                //csInvoiceType.set("status", "1");
            } else {
                csInvoiceType.set("modifier", getLoginUserId());
            }
            //保存或更新的方法
            CsInvoiceType.dao.saveOrUpdate(csInvoiceType);
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
            CsInvoiceType csInvoiceType = CsInvoiceType.dao.findById(id);
            result.setData(csInvoiceType);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
