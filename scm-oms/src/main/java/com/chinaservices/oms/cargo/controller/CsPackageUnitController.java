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
import com.chinaservices.oms.cargo.model.CsPackageUnit;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

/**
 * 包装单位
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Devin
 */
@Before(Tx.class)
@Controller(controllerKey = "/cargo/csPackageUnit", viewPath = "/admin")
public class CsPackageUnitController extends BaseController {
	
	/**
	 * 分页查询包装单位
	 */
    public void query() {
        //查询条件参数处理
        Map<String, Object> params = this.buildParams();
        Page<Record> list;
        //客户ID不能为空
        if(params.get("package_code") != null &&  EmptyUtils.isNotEmpty(params.get("package_code").toString())){
            //分页查询
            list = new SqlExecutor().page("packageUnit_query", params, getParaToInt("start"), getParaToInt("length"));
        }else{
            list = new Page<Record>(new ArrayList<Record>(), 0, 0, 0, 0);
        }
        //返回结果
        renderDataTables(list);
    }
    
    /**
     * 根据id获取包装单位
     */
    public void getById() {
        Result result = new Result();
        String id = getPara("id");
        String message = new String();
        boolean isOk = true;
        if (EmptyUtils.isNotEmpty(id)) {
        	Map<String, Object> params = new HashMap<String, Object>();
        	params.put("id", id);
        	Record record = new SqlExecutor().findOne("packageUnit_query", params);
        	if (null == record) {
        		isOk = false;
        		message = "数据已不存在";
        	} else {
        		result.setData(record);
        	}
        } else {
        	isOk = false;
        	message = "id不能为空";
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 根据包装代码获取默认的包装单位
     */
    public void getDefaultPackageUnitByPackageCode() {
        Result result = new Result();
        String package_code = getPara("package_code");
        String message = new String();
        boolean isOk = true;
        if (EmptyUtils.isNotEmpty(package_code)) {
        	Map<String, Object> params = new HashMap<String, Object>();
        	params.put("package_code", package_code);
        	params.put("is_default", "1");
        	Record record = new SqlExecutor().findOne("packageUnit_query", params);
        	if (null == record) {
        		isOk = false;
        		message = "数据已不存在";
        	} else {
        		result.setData(record);
        	}
        } else {
        	isOk = false;
        	message = "包装单位不能为空";
        }
        result.setSuccess(isOk);
        result.setMsg(message);
        renderJson(result);
    }
    
    /**
     * 保存包装单位
     */
    public void save() {
        Result result = new Result();
        CsPackageUnit csPackageUnit = getModel(CsPackageUnit.class, "");
        String code = csPackageUnit.getStr("code");
        String package_code = csPackageUnit.getStr("package_code");
        
        // 包装单位代码重复性校验
        Map<String, Object> repeatParams = new HashMap<String, Object>();
        repeatParams.put("code", code);
        repeatParams.put("package_code", package_code);
    	if (null != csPackageUnit.getInt("id")) {
    		repeatParams.put("id_not", csPackageUnit.getInt("id"));
    	}
    	List<Record> repeatRecords = new SqlExecutor().find("packageUnit_query", repeatParams);
    	if (EmptyUtils.isNotEmpty(repeatRecords)) {
    		result.setSuccess(false);
    		result.setMsg("单位代码不能重复");
    		renderJson(result);
    		return;
    	}
    	// 如果是新增的包装单位，设置序号
    	if (null == csPackageUnit.getInt("id")) {
	    	Map<String, Object> sequencesNoParams = new HashMap<String, Object>();
	    	sequencesNoParams.put("package_code", csPackageUnit.get("package_code"));
	        Record maxSequencesNoRecord = new SqlExecutor().findOne("packageUnit_maxSequencesNo_query", sequencesNoParams);
	        if (null == maxSequencesNoRecord) {
	        	csPackageUnit.set("sequences_no", 6);
	        } else {
	        	csPackageUnit.set("sequences_no", maxSequencesNoRecord.getInt("max_sequences_no") + 1);
	        }
    	}
    	// 保存
        this.preSave(csPackageUnit);
        CsPackageUnit.dao.save(csPackageUnit);
        // 判断是否是默认包装单位，若是，则更新其他包装单位的是否默认为否
        if ("1".equals(csPackageUnit.getStr("is_default"))) {
        	Map<String, Object> packageUnitParams = new HashMap<String, Object>();
        	packageUnitParams.put("package_code", csPackageUnit.get("package_code"));
        	packageUnitParams.put("code", code);
        	new SqlExecutor().update("packageUnit_updateOtherNotDefalut_update", packageUnitParams);
        }
    	// 重新查询
    	Map<String, Object> params = new HashMap<String, Object>();
    	params.put("code", code);
    	Record record = new SqlExecutor().findOne("packageUnit_query", params);
		result.setData(record);
        result.setSuccess(true);
        renderJson(result);
    }
    
    /**
     * 根据包装id数组删除包装单位
     */
    public void deleteByIds() {
        Result result = new Result();
        String idsString = getPara("ids");
        if (EmptyUtils.isNotEmpty(idsString)) {
        	String[] ids = StringUtils.split(idsString, ",");
            // 删除包装单位
        	Map<String, Object> packageUnitParams = new HashMap<String, Object>();
        	packageUnitParams.put("ids", ids);
        	new SqlExecutor().update("packageUnit_deleteByIds_delete", packageUnitParams);
        }
        result.setSuccess(true);
        renderJson(result);
    }

    /**
     * 根据包装规格、单位编码获取包装单位信息
     */
    public void getPackUnitByCondition() {
        Result result = new Result();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", getPara("code"));
        params.put("package_code", getPara("package_code"));
        Record packUnit = new SqlExecutor().findOne("packageUnit_query",params);
        result.setData(packUnit);
        result.setSuccess(true);
        renderJson(result);
    }
}
