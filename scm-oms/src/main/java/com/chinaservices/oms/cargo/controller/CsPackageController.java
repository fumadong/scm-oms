package com.chinaservices.oms.cargo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.EmptyUtils;
import com.chinaservices.sql.SqlExecutor;
import com.chinaservices.oms.cargo.model.CsPackage;
import com.chinaservices.oms.cargo.model.CsPackageUnit;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

/**
 * 包装
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@Before(Tx.class)
@Controller(controllerKey = "/cargo/csPackage", viewPath = "/admin")
public class CsPackageController extends BaseController {
	
	/**
	 * 分页查询包装
	 */
    public void query() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code_like", getPara("code_like"));
        params.put("name", getPara("name"));
        params.put("status", getPara("status"));
        String type = getPara("type");
        if (StringUtils.isNotBlank(type)) {
        	params.put("type", type);
        }
        String status = getPara("status");
        if (StringUtils.isNotBlank(status)) {
        	params.put("status", status);
        }
        int pageNo = (getParaToInt("start") / getParaToInt("length"));
        int pageSize = getParaToInt("length");
        Page<Record> list = new SqlExecutor().page("package_query", params, pageNo, pageSize);
        
        int draw = getParaToInt("draw");
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }
    
    /**
     * 根据代码获取包装
     */
    public void getByCode() {
        Result result = new Result();
        String code = getPara("code");
        String message = new String();
        boolean isOk = true;
        if (EmptyUtils.isNotEmpty(code)) {
        	Map<String, Object> params = new HashMap<String, Object>();
        	params.put("code", code);
        	Record record = new SqlExecutor().findOne("package_query", params);
        	if (null == record) {
        		isOk = false;
        		message = "数据已不存在";
        	} else {
        		result.setData(record);
        	}
        } else {
        	isOk = false;
        	message = "包装代码不能为空";
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 保存包装
     */
    public void save() {
        Result result = new Result();
        CsPackage csPackage = getModel(CsPackage.class, "");
        String code = csPackage.getStr("code");
        // 包装代码重复性校验
        Map<String, Object> repeatParams = new HashMap<String, Object>();
        repeatParams.put("code", code);
    	if (null != csPackage.getInt("id")) {
    		repeatParams.put("id_not", csPackage.getInt("id"));
    	}
    	List<Record> repeatRecords = new SqlExecutor().find("package_query", repeatParams);
    	if (EmptyUtils.isNotEmpty(repeatRecords)) {
    		result.setSuccess(false);
    		result.setMsg("包装代码不能重复");
    		renderJson(result);
    		return;
    	}
    	// 如果是新增的包装，生成默认的包装单位
    	if (null == csPackage.getInt("id")) {
    		this.generateDefaultPackageUnits(code);
    	}
    	// 保存
        this.preSave(csPackage);
        CsPackage.dao.save(csPackage);
    	// 重新查询
    	Map<String, Object> params = new HashMap<String, Object>();
    	params.put("code", code);
    	Record record = new SqlExecutor().findOne("package_query", params);
		result.setData(record);
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 生成包装的默认包装单位
     * @param packageCode 包装代码
     */
    private void generateDefaultPackageUnits(String packageCode) {
    	List<CsPackageUnit> packageUnits = new ArrayList<>();
    	// 件
    	CsPackageUnit eaUnit = new CsPackageUnit();
    	eaUnit.set("sequences_no", 1);
    	eaUnit.set("code", "EA");
    	eaUnit.set("name", "件");
    	eaUnit.set("quantity", 1);
    	eaUnit.set("is_default", "1");
    	eaUnit.set("package_code", packageCode);
    	this.preSave(eaUnit);
    	packageUnits.add(eaUnit);
    	// 内包装
    	CsPackageUnit ipUnit = new CsPackageUnit();
    	ipUnit.set("sequences_no", 2);
    	ipUnit.set("code", "IP");
    	ipUnit.set("name", "内包装");
    	ipUnit.set("quantity", 1);
    	ipUnit.set("is_default", "0");
    	ipUnit.set("package_code", packageCode);
    	this.preSave(ipUnit);
    	packageUnits.add(ipUnit);
    	// 箱
    	CsPackageUnit csUnit = new CsPackageUnit();
    	csUnit.set("sequences_no", 3);
    	csUnit.set("code", "CS");
    	csUnit.set("name", "箱");
    	csUnit.set("quantity", 1);
    	csUnit.set("is_default", "0");
    	csUnit.set("package_code", packageCode);
    	this.preSave(csUnit);
    	packageUnits.add(csUnit);
    	// 托盘
    	CsPackageUnit plUnit = new CsPackageUnit();
    	plUnit.set("sequences_no", 4);
    	plUnit.set("code", "PL");
    	plUnit.set("name", "托盘");
    	plUnit.set("quantity", 1);
    	plUnit.set("is_default", "0");
    	plUnit.set("package_code", packageCode);
    	this.preSave(plUnit);
    	packageUnits.add(plUnit);
    	// 大包装
    	CsPackageUnit otUnit = new CsPackageUnit();
    	otUnit.set("sequences_no", 5);
    	otUnit.set("code", "OT");
    	otUnit.set("name", "大包装");
    	otUnit.set("quantity", 1);
    	otUnit.set("is_default", "0");
    	otUnit.set("package_code", packageCode);
    	this.preSave(otUnit);
    	packageUnits.add(otUnit);
    	// 保存数据
    	for (CsPackageUnit packageUnit : packageUnits) {
    		CsPackageUnit.dao.save(packageUnit);
		}
    }
    
    
    /**
     * 根据包装代码删除包装及其子表
     */
    public void deletePackagesAndSubDatasByCodes() {
        Result result = new Result();
        String codesString = getPara("codes");
        if (EmptyUtils.isNotEmpty(codesString)) {
        	String[] codes = StringUtils.split(codesString, ",");
        	// 删除包装
        	Map<String, Object> packageParams = new HashMap<String, Object>();
        	packageParams.put("codes", codes);
        	new SqlExecutor().update("package_deleteByCode_delete", packageParams);
            // 删除包装单位
        	Map<String, Object> packageUnitParams = new HashMap<String, Object>();
        	packageUnitParams.put("package_codes", codes);
        	new SqlExecutor().update("packageUnit_deleteByPackageCode_delete", packageUnitParams);
        }
        result.setSuccess(true);
        renderJson(result);
    }
    
}
