package com.chinaservices.oms.fee.controller;

import com.chinaservices.oms.fee.model.CsSubject;
import com.chinaservices.plugins.sqlinxml.QueryInfo;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.support.query.TableRequest;
import com.chinaservices.sdk.support.query.TableResponse;
import com.chinaservices.sdk.support.result.Result;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;


/**
 * 科目管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Joan.Zhang
 * 2017-07-18
 */
@Controller(controllerKey = "/fee/csSubject", viewPath = "/admin")
public class CsSubjectController extends BaseController {

	/**
	 * 分页查询
	 */
	public void page() {
		TableRequest request = getTableRequest();
		QueryInfo queryInfo = new QueryInfo("fee.csSubject.getPage", request);
		queryInfo.addParam("subjectCode", request.getSearchMap().get("subject_code"));
		queryInfo.addParam("subjectName", request.getSearchMap().get("subject_name"));
		TableResponse<Record> tableResponse = queryInfo.paginate();
		renderJson(tableResponse);
	}


	public void getById() {
		Result result = new Result();
		Integer id = getParaToInt("id");
		if (null != id) {
			CsSubject model = CsSubject.dao.findById(id);
			result.setData(model);
		} else {
			result.setData(null);
		}		
		result.setSuccess(true);
		result.setMsg("SUCCESS");
		renderJson(result);
	}

	/**
	 * 提交
	 */
	public void submit() {
		Result result = new Result();
		CsSubject model = getModel(CsSubject.class, "", true);
		Integer id = model.getInt("id");
		 boolean isDuplicateSubjectCode = CsSubject.dao.checkDuplicateSubjectCode(id, model.getStr("subject_code"));
	     if (isDuplicateSubjectCode) {
	    	 result.setSuccess(false);
	         result.addError("科目代码[" + model.getStr("subject_code") + "]不能重复");
	     } else {
	        this.preSave(model);
	        CsSubject.dao.saveOrUpdate(model);
	        result.setSuccess(true);
	        result.setMsg("SUCCESS");
	     }
		renderJson(result);
	}

	/**
	 * 删除
	 *
	 */
	public void delete() {
		Result result = new Result();
		String id = getPara("id");
		String[] ids = StringUtils.split(id, ",");
		CsSubject.dao.deleteAllById(ids);
		result.setSuccess(true);
		renderJson(result);
	}	

}
