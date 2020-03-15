package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsCustomer;
import com.chinaservices.oms.cust.model.CsCustomerContact;
import com.chinaservices.oms.location.model.CsElectronicFence;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.EmptyUtils;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
*类用途说明：客户联系人管理
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author loemkie chen
*/
@Controller(controllerKey = "/cust/csCustomerContact", viewPath = "/admin")
public class CsCustomerContactController extends BaseController{
	static CsCustomerContact dao = new CsCustomerContact();
	/**
	 * 列表查询
	 */
    public void query() {
        long start = System.currentTimeMillis();
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customer_id", getPara("customer_id"));
        
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomerContact> list = CsCustomerContact.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        long end = System.currentTimeMillis();
        if (log.isDebugEnabled()) {
            log.debug("客户管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
        }
        renderJson(dataTables);
    }
    
    /**
	 * 客户联系人弹出框列表查询
	 */
    public void popWinQuery() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = new HashMap<String, Object>();
        
        if (StringUtils.isNotBlank(getPara("customer_code"))) {
        	params.put("customer_code", getPara("customer_code"));
        }
        if (StringUtils.isNotBlank(getPara("contact_code"))) {
        	params.put("contact_code", getPara("contact_code"));
        }
        if (StringUtils.isNotBlank(getPara("contact_name"))) {
        	params.put("contact_name", getPara("contact_name"));
        }
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomerContact> list = CsCustomerContact.dao.getPopPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
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
            CsCustomerContact.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }

    /**
     * 更新状态
     *
     */
    public void updateStatus() {
    	Result result = new Result();
        String id = getPara("id");
        String status = getPara("status");
        String[] ids = StringUtils.split(id, ",");
        int count = 0;
        for (String idStr : ids) {
            count = count + CsCustomerContact.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId(), status);
        }
        if (count > 0) {
            result.setSuccess(true);
        } else {
            result.setSuccess(false);
        }
        renderJson(result);
    }

    /**
     * 新增或者修改
     *
     */
    public void submit() {
    	Result result = new Result();
        CsCustomerContact csCustomerContact = getModel(CsCustomerContact.class, "");
        Integer id = csCustomerContact.getInt("id");
        //设置客户代码
        CsCustomer csCustomer = CsCustomer.dao.findById(csCustomerContact.getInt("customer_id"));
        if(csCustomer != null){
        	csCustomerContact.set("customer_code", csCustomer.get("customer_code"));
        }
        boolean isDefault = CsCustomerContact.dao.checkDefault(csCustomerContact);
        boolean isContactCode = CsCustomerContact.dao.checkDuplicateNo(csCustomerContact);
        if(csCustomerContact.getInt("is_default") !=null &&
        		csCustomerContact.getInt("is_default")==1
        		&& isDefault){
        	 result.setSuccess(false);
             result.addError("1");
        }
        else if (isContactCode) {
            result.setSuccess(false);
            result.addError("联系人代码[" + csCustomerContact.getStr("contact_code") + "]不能重复");
        } else {
        	//设置公共字段
            this.preSave(csCustomerContact);
            CsCustomerContact.dao.saveOrUpdate(csCustomerContact);
            // 生成对应的电子围栏并保存
        	this.generateElectronicFenceByContact(csCustomerContact, csCustomer.getStr("customer_name"));
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }
    public void submitIgnore() {
        Result result = new Result();
        CsCustomerContact csCustomerContact = getModel(CsCustomerContact.class, "");
        Integer id = csCustomerContact.getInt("id");
        //设置客户代码
        CsCustomer csCustomer = CsCustomer.dao.findById(csCustomerContact.get("customer_id"));
        if(csCustomer != null){
        	csCustomerContact.set("customer_code", csCustomer.get("customer_code"));
        }
        boolean isContactCode = CsCustomerContact.dao.checkDuplicateNo(csCustomerContact);
        if(isContactCode) {
            result.setSuccess(false);
            result.addError("联系人代码[" + csCustomerContact.getStr("contact_code") + "]不能重复");
        } else {
        	// 设置公共字段
        	CsCustomerContact.dao.clearDefaultInd(csCustomerContact.getInt("customer_id"));
            this.preSave(csCustomerContact);
            CsCustomerContact.dao.saveOrUpdate(csCustomerContact);
            // 生成对应的电子围栏并保存
        	this.generateElectronicFenceByContact(csCustomerContact, csCustomer.getStr("customer_name"));
            result.setSuccess(true);
            result.setMsg("SUCCESS");
        }
        renderJson(result);
    }
    
    /**
     * 根据客户联系人生成电子围栏并保存：条件 1.联系人为默认联系人  2.联系人的省市区县+详细地址没有对应的电子围栏
     * @param contact
     * @return
     */
    private void generateElectronicFenceByContact(CsCustomerContact contact, String customerName) {
    	// 如果不是默认联系人，不生成
    	if (contact.getInt("is_default")==null||(contact.getInt("is_default")!=null&&1 != contact.getInt("is_default"))) {
    		return;
    	}
    	// 如果省市区县+地址不存在，不生成
    	String fullAddress = (contact.getStr("province_name") == null ? "" : contact.getStr("province_name"))
				+ (contact.getStr("city_name") == null ? "" : contact.getStr("city_name"))
				+ (contact.getStr("county_name") == null ? "" : contact.getStr("county_name")) 
				+ (contact.getStr("address") == null ? "" : contact.getStr("address"));
    	if (EmptyUtils.isEmpty(fullAddress)) {
    		return;
    	}
    	// 根据省市区县+地址查询是否存在电子围栏，若已存在，不生成
    	QueryInfo queryInfo = new QueryInfo("location.csElectronicFence.get");
    	queryInfo.addParam("full_address", fullAddress);
    	List<Record> records = queryInfo.find();
    	if (EmptyUtils.isNotEmpty(records)) {
    		return;
    	}
    	// 不存在对应地址的电子围栏，生成电子围栏
    	CsElectronicFence electronicFence = new CsElectronicFence();
    	electronicFence.set("pm_code", this.UUID());
    	electronicFence.set("name", customerName); // 名称为客户名称
    	electronicFence.set("status", "1");
		electronicFence.set("province_code", contact.get("province_code"));
		electronicFence.set("province_name", contact.get("province_name"));
		electronicFence.set("city_code", contact.get("city_code"));
		electronicFence.set("city_name", contact.get("city_name"));
		electronicFence.set("county_code", contact.get("county_code"));
		electronicFence.set("county_name", contact.get("county_name"));
		electronicFence.set("address", contact.get("address"));
		electronicFence.set("full_address", fullAddress);
		this.preSave(electronicFence);
		// 保存电子围栏
		CsElectronicFence.dao.save(electronicFence);
    }
    
    /**
     * 根据ID获取数据
     *
     */
    public void getById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsCustomerContact csCustomerContact = CsCustomerContact.dao.findById(id);
            result.setData(csCustomerContact);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }
}
