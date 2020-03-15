package com.chinaservices.oms.fee.controller;

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
 * 费用名称管理
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, June 3, 2017
 */
@Controller(controllerKey = "/feeName", viewPath = "/admin")
public class CsFeeNameController extends BaseController {
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
        Page<CsFeeName> list = CsFeeName.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("费用名称管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
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
            CsFeeName.dao.deleteById(Integer.valueOf(idStr));
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
            count = count + CsFeeName.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
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
        CsFeeName feeName = getModel(CsFeeName.class, "");
        Integer id = feeName.getInt("id");
        boolean isDuplicateFeeNameCode = CsFeeName.dao.checkDuplicateFeeNameCode(id, feeName.getStr("fee_name_code"));
        if (isDuplicateFeeNameCode) {
            result.setSuccess(false);
            result.addError("费用代码[" + feeName.getStr("fee_name_code") + "]不能重复");
        } else {
            if (null == feeName.get("id")) {
                feeName.set("creator", getLoginUserId());
                feeName.set("status", "1");
            } else {
                feeName.set("modifier", getLoginUserId());
            }
            CsFeeName.dao.saveOrUpdate(feeName);
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
            CsFeeName feeName = CsFeeName.dao.findById(id);
            result.setData(feeName);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
