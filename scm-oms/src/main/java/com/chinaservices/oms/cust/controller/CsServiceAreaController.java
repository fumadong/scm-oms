package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsServiceArea;
import com.chinaservices.oms.cust.service.CsServiceAreaBlockService;
import com.chinaservices.oms.cust.service.CsServiceAreaMapService;
import com.chinaservices.oms.cust.service.CsServiceAreaService;
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
@Controller(controllerKey = "/serviceArea", viewPath = "/admin")
public class CsServiceAreaController extends BaseController {
    private CsServiceAreaService CsServiceAreaService = new CsServiceAreaService();
    private CsServiceAreaMapService csServiceAreaMapService = new CsServiceAreaMapService();
    private CsServiceAreaBlockService csServiceAreaBlockService = new CsServiceAreaBlockService();
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
        Page<CsServiceArea> list = CsServiceAreaService.getPageByCondition(params, pageNo, pageSize);
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
        	CsServiceArea CsServiceArea = CsServiceAreaService.findById(id);
            result.setData(CsServiceArea);
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
        CsServiceArea serviceArea = getModel(CsServiceArea.class, "");
        Integer id = serviceArea.getInt("id");
        boolean isDuplicateServiceAreaCode = CsServiceAreaService.checkDuplicate(id, serviceArea.getStr("service_area_code"));
        if (isDuplicateServiceAreaCode) {
            result.setSuccess(false);
            result.addError("服务区域代码[" + serviceArea.getStr("warehouse_code") + "]不能重复");
        } else {
            if (null == serviceArea.get("id")) {
            	serviceArea.set("creator", getLoginUserId());
            	serviceArea.set("modifier", getLoginUserId());
            	serviceArea.set("status", "1");
            } else {
            	serviceArea.set("modifier", getLoginUserId());
            }
            CsServiceAreaService.saveOrUpdate(serviceArea);
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }
    
    /**
     * 删除服务范围
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        CsServiceArea csServiceArea = CsServiceAreaService.findById(Integer.valueOf(id));
        csServiceAreaBlockService.deleteAllByCode(csServiceArea.get("service_area_code").toString());
        csServiceAreaMapService.deleteAllByCode(csServiceArea.get("service_area_code").toString());
        String[] ids = StringUtils.split(id, ",");
    	CsServiceAreaService.deleteByIds(ids);
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
            count = count + CsServiceAreaService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }
}
