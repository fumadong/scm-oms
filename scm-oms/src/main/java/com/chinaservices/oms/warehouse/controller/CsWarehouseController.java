package com.chinaservices.oms.warehouse.controller;

import com.chinaservices.oms.warehouse.model.CsWarehouse;
import com.chinaservices.oms.warehouse.service.CsWarehouseService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 费用名称管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Noaman Chen
 * @since 1.0, June 3, 2017
 */
@Controller(controllerKey = "/warehouse", viewPath = "/admin")
public class CsWarehouseController extends BaseController {
    private CsWarehouseService csWarehouseService = new CsWarehouseService();
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
        Page<CsWarehouse> list = csWarehouseService.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("仓库管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    /**
     * 根据ID获取数据
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
        	CsWarehouse cswarehouse = csWarehouseService.findById(id);
            result.setData(cswarehouse);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
    /**
     * 保存或更新
     */
    public void saveOrUpdate() {
        Result result = new Result();
        CsWarehouse warehouse = getModel(CsWarehouse.class, "");
        Integer id = warehouse.getInt("id");
        boolean isDuplicateVehicleNo = csWarehouseService.checkDuplicateWarehouseCode(id, warehouse.getStr("warehouse_code"));
        if (isDuplicateVehicleNo) {
            result.setSuccess(false);
            result.addError("仓库代码代码[" + warehouse.getStr("warehouse_code") + "]不能重复");
        } else {
            if (null == warehouse.get("id")) {
            	warehouse.set("creator", getLoginUserId());
            	warehouse.set("status", "1");
            } else {
            	warehouse.set("modifier", getLoginUserId());
            }
            csWarehouseService.saveOrUpdate(warehouse);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }
    
    /**
     * 删除供应商
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
    	csWarehouseService.deleteByIds(ids);
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
            count = count + csWarehouseService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }
}
