package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsServiceAreaMap;
import com.chinaservices.oms.cust.service.CsServiceAreaMapService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 费用名称管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Noaman Chen
 * @since 1.0, June 3, 2017
 */
@Controller(controllerKey = "/serviceAreaMap", viewPath = "/admin")
public class CsServiceAreaMapController extends BaseController {
    private CsServiceAreaMapService csServiceAreaMapService = new CsServiceAreaMapService();

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
        Page<CsServiceAreaMap> list = csServiceAreaMapService.getPageByCondition(params, pageNo, pageSize);
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
            CsServiceAreaMap csServiceAreaMap = csServiceAreaMapService.findById(id);
            result.setData(csServiceAreaMap);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
         renderJson(result);
    }

    /**
     * 根据code获取数据
     */
    public void getByCode() {
        Result result = new Result();
        String service_area_code = getPara("service_area_code");
        if (null != service_area_code) {
            List<CsServiceAreaMap> csServiceAreaMaps = csServiceAreaMapService.getCsServiceAreaMapsByCode(service_area_code);
            result.setData(csServiceAreaMaps);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    /**
     * 根据服务范围code删除所有范围
     */
    public void deleteAllByCode(){
        Result result = new Result();
        String service_area_code = getPara("service_area_code");
        if(null != service_area_code){
            int updateCount = csServiceAreaMapService.deleteAllByCode(service_area_code);
            result.setData(updateCount);
        }else{
            result.setData(0);
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
        CsServiceAreaMap serviceAreaMap = getModel(CsServiceAreaMap.class, "");
        Integer id = serviceAreaMap.getInt("id");
        if (null == serviceAreaMap.get("id")) {
            serviceAreaMap.set("creator", getLoginUserId());
            serviceAreaMap.set("modifier", getLoginUserId());
            serviceAreaMap.set("status", "1");
        } else {
            serviceAreaMap.set("modifier", getLoginUserId());
        }
        csServiceAreaMapService.saveOrUpdate(serviceAreaMap);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    /**
     * 删除供应商
     */
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        csServiceAreaMapService.deleteByIds(ids);
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
            count = count + csServiceAreaMapService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }
}
