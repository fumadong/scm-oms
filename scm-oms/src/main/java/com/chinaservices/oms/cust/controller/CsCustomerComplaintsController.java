package com.chinaservices.oms.cust.controller;

import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.oms.cust.model.CsCustomerComplaints;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;

import java.util.HashMap;
import java.util.Map;

/**
 * 类用途说明：客户投诉管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author loemkie chen
 */
@Controller(controllerKey = "/cust/csCustomerComplaints", viewPath = "/admin")
public class CsCustomerComplaintsController extends BaseController {

	/**
	 * 列表查询
	 */
	public void query() {
		long start = System.currentTimeMillis();
		Map<String, Object> dataTables = new HashMap<String, Object>();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("complaints_no", getPara("complaints_no"));
		params.put("bill_no", getPara("bill_no"));
		params.put("complaints_type", getPara("complaints_type"));
		params.put("complainant", getPara("complainant"));

		params.put("drive_name", getPara("drive_name"));
		params.put("vehicle_no", getPara("vehicle_no"));
		params.put("complaints_status", getPara("complaints_status"));
		int draw = getParaToInt("draw");
		int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
		int pageSize = getParaToInt("length");
		Page<CsCustomerComplaints> list = CsCustomerComplaints.dao.getPageByCondition(params, pageNo, pageSize);
		dataTables.put("data", list.getList());
		dataTables.put("draw", draw);
		dataTables.put("recordsTotal", list.getTotalRow());
		dataTables.put("recordsFiltered", list.getTotalRow());
		long end = System.currentTimeMillis();
		if (log.isDebugEnabled()) {
			log.debug("客户投诉管理分页查询耗时：" + (end - start) + "ms" + "，参数：" + JsonKit.toJson(params));
		}
		renderJson(dataTables);
	}

	/**
	 * 删除
	 */
	public void delete() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = id.split(",");
		for (String idStr : ids) {
			CsCustomerComplaints.dao.deleteById(Integer.valueOf(idStr));
		}
		result.setSuccess(true);
		renderJson(result);
	}

	/**
	 * 新增或者修改
	 */
	public void submit() {
		Result result = new Result();
		CsCustomerComplaints csCustomerComplaints = getModel(CsCustomerComplaints.class, "");
		Integer id = csCustomerComplaints.getInt("id");
		if(id == null){
			//生成投诉编号
			csCustomerComplaints.set("complaints_no", CodeUtil.getInstance().getCode("complaints_no"));
		}
		
		//设置公共字段
		this.preSave(csCustomerComplaints);
		CsCustomerComplaints.dao.saveOrUpdate(csCustomerComplaints);
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		result.setData(csCustomerComplaints);
		renderJson(result);
	}

	/**
	 * 根据ID获取数据
	 */
	public void getById() {
		Result result = new Result();
		Integer id = getParaToInt("id");
		if (null != id) {
			CsCustomerComplaints csCustomerComplaints = CsCustomerComplaints.dao.findById(id);
			result.setData(csCustomerComplaints);
		} else {
			result.setData(null);
		}
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
	}

}
