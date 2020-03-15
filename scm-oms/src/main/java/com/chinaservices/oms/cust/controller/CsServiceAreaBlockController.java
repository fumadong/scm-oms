package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsServiceAreaBlock;
import com.chinaservices.oms.cust.service.CsServiceAreaBlockService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
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
@Controller(controllerKey = "/serviceAreaBlock", viewPath = "/admin")
public class CsServiceAreaBlockController extends BaseController {
    private CsServiceAreaBlockService CsServiceAreaBlockService = new CsServiceAreaBlockService();
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
        String service_area_code = (String)params.get("service_area_code");
        Page<CsServiceAreaBlock> list = new Page<>();
        if(service_area_code != null && service_area_code != ""){
            list = CsServiceAreaBlockService.getPageByCondition(params, pageNo, pageSize);
            dataTables.put("data", list.getList());
        }else{
            dataTables.put("data", new ArrayList<>());
        }
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
        	CsServiceAreaBlock csServiceAreaBlock = CsServiceAreaBlockService.findById(id);
            result.setData(csServiceAreaBlock);
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
        CsServiceAreaBlock serviceAreaBlock = getModel(CsServiceAreaBlock.class, "");
        Integer id = serviceAreaBlock.getInt("id");
        if (null == serviceAreaBlock.get("id")) {
        	serviceAreaBlock.set("creator", getLoginUserId());
        	serviceAreaBlock.set("modifier", getLoginUserId());
        	serviceAreaBlock.set("status", "1");
        } else {
        	serviceAreaBlock.set("modifier", getLoginUserId());
        }
        CsServiceAreaBlockService.saveOrUpdate(serviceAreaBlock);
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
    	CsServiceAreaBlockService.deleteByIds(ids);
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
            count = count + CsServiceAreaBlockService.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }
}
