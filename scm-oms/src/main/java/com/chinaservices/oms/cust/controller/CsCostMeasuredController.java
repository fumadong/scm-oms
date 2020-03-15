package com.chinaservices.oms.cust.controller;

import com.chinaservices.oms.cust.model.CsCostMeasured;
import com.chinaservices.oms.cust.model.CsCostMeasuredDetail;
import com.chinaservices.oms.cust.model.CsRiskPoint;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.query.TableRequest;
import com.chinaservices.sdk.support.query.TableResponse;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import org.apache.commons.lang.StringUtils;

/**
 * 成本预算
 * <p/>
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 * @since 1.0, July 5, 2017
 */
@Controller(controllerKey = "/cust/costMeasured", viewPath = "/admin")
public class CsCostMeasuredController extends BaseController {

	/**
	 * 分页查询
	 */
	public void page() {
		TableRequest request = getTableRequest();
		QueryInfo queryInfo = new QueryInfo("cust.costMeasured.getPage", request);
		queryInfo.addParam("measuredNo", request.getSearchMap().get("measured_no"));
		queryInfo.addParam("deptName", request.getSearchMap().get("dept_name"));
		queryInfo.addParam("signType", request.getSearchMap().get("sign_type"));
		queryInfo.addParam("status", request.getSearchMap().get("status"));
		TableResponse<Record> tableResponse = queryInfo.paginate();
		renderJson(tableResponse);
	}

	/**
	 * 子表分页查询
	 */
	public void detailPage() {
		TableRequest request = getTableRequest();
		QueryInfo queryInfo = new QueryInfo("cust.costMeasuredDetail.getPage", request);
		queryInfo.addParam("measuredNo", request.getSearchMap().get("measured_no"));
		TableResponse<Record> tableResponse = queryInfo.paginate();
		renderJson(tableResponse);
	}

	/**
	 * 子表分页查询
	 */
	public void riskPointPage() {
		TableRequest request = getTableRequest();
		QueryInfo queryInfo = new QueryInfo("cust.riskPoint.getPage", request);
		queryInfo.addParam("measuredNo", request.getSearchMap().get("measured_no"));
		TableResponse<Record> tableResponse = queryInfo.paginate();
		renderJson(tableResponse);
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
			count = count + CsCostMeasured.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId().toString(), status);
		}
		if (count > 0) {
			result.setSuccess(true);
		} else {
			result.setSuccess(false);
		}
		renderJson(result);
	}

	/**
	 * 审核，取消审核
	 */
	public void audit() {
		Result result = new Result();
		String id = getPara("id");
		String status = getPara("status");
		String[] ids = StringUtils.split(id, ",");
		int count = 0;
		for (String idStr : ids) {
			count = count + CsCostMeasured.dao.audit(Integer.valueOf(idStr), getLoginUserId().toString(), status);
		}
		if (count > 0) {
			result.setSuccess(true);
		} else {
			result.setSuccess(false);
		}
		renderJson(result);
	}

	public void getById() {
		Result result = new Result();
		Integer id = getParaToInt("id");
		CsCostMeasured model = new CsCostMeasured();
		if (null != id) {
			model = CsCostMeasured.dao.findById(id);
			model.set("create_time", DateUtil.formatDate(model.getDate("create_time")));
		} else {
			model.set("status", "1");
			model.set("create_time", DateUtil.formatDate(DateUtil.now()));
		}
		result.setData(model);
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
	}

	public void getDetailById() {
		Result result = new Result();
		Integer id = getParaToInt("id");
		CsCostMeasuredDetail model = new CsCostMeasuredDetail();
		if (null != id) {
			model = CsCostMeasuredDetail.dao.findById(id);
		} else {

		}
		result.setData(model);
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
	}

	public void getRiskPointById() {
		Result result = new Result();
		Integer id = getParaToInt("id");
		CsRiskPoint model = new CsRiskPoint();
		if (null != id) {
			model = CsRiskPoint.dao.findById(id);
		}
		result.setData(model);
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
	}

	/**
	 * 提交
	 */
	public void submit() {
		Result result = new Result();
		result.setSuccess(true);
		result.setMsg("保存成功");
		CsCostMeasured model = getModel(CsCostMeasured.class, "", true);
		Integer id = model.getInt("id");
		if (StringUtils.isEmpty(model.getStr("is_billing"))) {
			model.set("is_billing", "0");
		}
		if (null == id) {
			String code = CodeUtil.getInstance().getCode("COST_MEASURED");
			model.set("measured_no", code);
			model.set("creator", getLoginUserId());
			model.set("status", "1");
		} else {
			model.set("modifier", getLoginUserId());
		}
		CsCostMeasured.dao.saveOrUpdate(model);
		result.setSuccess(true);
		result.setData(model);
		renderJson(result);
	}

	public void detailSubmit() {
		Result ret = new Result();
		ret.setSuccess(true);
		ret.setMsg("保存成功");
		CsCostMeasuredDetail model = getModel(CsCostMeasuredDetail.class, "", true);
		Integer id = model.getInt("id");
		if (null == id) {
			model.set("creator", getLoginUserId());
		} else {
			model.set("modifier", getLoginUserId());
		}
		CsCostMeasuredDetail.dao.saveOrUpdate(model);
		ret.setSuccess(true);
		renderJson(ret);
	}

	public void riskPointsubmit() {
		Result ret = new Result();
		ret.setSuccess(true);
		ret.setMsg("保存成功");
		CsRiskPoint model = getModel(CsRiskPoint.class, "", true);
		Integer id = model.getInt("id");
		if (null == id) {
			model.set("creator", getLoginUserId());
		} else {
			model.set("modifier", getLoginUserId());
		}
		CsRiskPoint.dao.saveOrUpdate(model);
		ret.setSuccess(true);
		renderJson(ret);
	}

	/**
	 * 删除测算
	 *
	 */
	@Before(Tx.class)
	public void delete() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			CsCostMeasured csCostMeasured = CsCostMeasured.dao.findById(Integer.valueOf(idStr));
			if (null != csCostMeasured) {
				CsCostMeasuredDetail.dao.deleteByMeasureNo(csCostMeasured.getSql("measured_no"));
				CsRiskPoint.dao.deleteByMeasureNo(csCostMeasured.getSql("measured_no"));
				csCostMeasured.delete();
			}
		}
		result.setSuccess(true);
		renderJson(result);
	}

	public void deleteDetail() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			CsCostMeasuredDetail.dao.deleteById(Integer.valueOf(idStr));
		}
		result.setSuccess(true);
		renderJson(result);
	}

	/**
	 * 删除风险点
	 *
	 */
	public void deleteRiskPoint() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			Integer riskPointId = Integer.valueOf(idStr);
			CsRiskPoint.dao.deleteById(riskPointId);
		}
		result.setSuccess(true);
		renderJson(result);
	}

}
