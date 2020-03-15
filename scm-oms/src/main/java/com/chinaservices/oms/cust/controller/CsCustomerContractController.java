package com.chinaservices.oms.cust.controller;

import com.chinaservices.admin.model.SysFileUpload;
import com.chinaservices.oms.cust.model.*;
import com.chinaservices.oms.cust.service.CustomerContractService;
import com.chinaservices.sdk.BaseController;
import com.chinaservices.sdk.binding.annotation.Controller;
import com.chinaservices.sdk.session.LoginUser;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.upload.UploadFile;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 类用途说明：合同管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Adolph Zheng
 */
@Controller(controllerKey = "/cust/contract", viewPath = "/admin")
public class CsCustomerContractController extends BaseController {

    /**
     * 分页查询
     */
    public void page() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomerContract> list = CsCustomerContract.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }

    /**
     * 附件分页查询
     */
    public void attachPage() {
        Map<String, Object> dataTables = new HashMap<String, Object>();
        Map<String, Object> params = changeMap(getParaMap());
        int draw = getParaToInt("draw");
        int pageNo = (getParaToInt("start") / getParaToInt("length")) + 1;
        int pageSize = getParaToInt("length");
        Page<CsCustomerContractAttach> list = CsCustomerContractAttach.dao.getPageByCondition(params, pageNo, pageSize);
        dataTables.put("data", list.getList());
        dataTables.put("draw", draw);
        dataTables.put("recordsTotal", list.getTotalRow());
        dataTables.put("recordsFiltered", list.getTotalRow());
        renderJson(dataTables);
    }

    /**
     * 删除
     */
    @Before(Tx.class)
    public void delete() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
            CsCustomerContract model = CsCustomerContract.dao.findById(Integer.valueOf(idStr));
            if (null != model) {
                List<CsCustomerContractPosition> positions = CsCustomerContractPosition.dao.findByContractNo(model.getStr("contract_code"));
                if (null != positions && positions.size() > 0) {
                    for (CsCustomerContractPosition position : positions) {
                        CsCustomerContractFee.dao.deleteByPositionId(position.getInt("id"));
                        position.delete();
                    }
                }
                CsCustomerContractAuditorLog.dao.deleteByContractNo(model.getStr("contract_code"));
                // 附件
                List<CsCustomerContractAttach> attaches = CsCustomerContractAttach.dao.findByContractNo(model.getStr("contract_code"));
                if (null != attaches && attaches.size() > 0) {
                    for (CsCustomerContractAttach attach : attaches) {
                        SysFileUpload.dao.deleteByUUID(attach.getStr("file_no"));
                        attach.delete();
                    }
                }
                model.delete();
            }
        }
        result.setSuccess(true);
        renderJson(result);
    }

	/**
     * 删除附件
     *
     */
    public void deleteAttch() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
		for (String idStr : ids) {
			CsCustomerContractAttach attach = CsCustomerContractAttach.dao.findById(Integer.valueOf(idStr));
	        if (attach != null) {
	            attach.delete();
	            SysFileUpload.dao.deleteByUUID(attach.getStr("file_no"));
	            result.setSuccess(true);
	            result.setMsg("删除成功");
	        } else {
	            result.setSuccess(false);
	            result.setMsg("删除失败");
	        }
		}
        
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
            count = count + CsCustomerContract.dao.updateStatus(Integer.valueOf(idStr), getLoginUserId(), status);
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
    @Before(Tx.class)
    public void audit() {
        Result result = new Result();
        String id = getPara("id");
        String status = getPara("status");
        String[] ids = StringUtils.split(id, ",");
        int count = 0;
        for (String idStr : ids) {
            CsCustomerContract contract = CsCustomerContract.dao.findById(Integer.valueOf(idStr));
            List<CsCustomerContractPosition> positions = CsCustomerContractPosition.dao.findByContractNo(contract.getStr("contract_code"));
            if (null != positions) {
                for (CsCustomerContractPosition position : positions) {
                    List<CsCustomerContractFee> fees = CsCustomerContractFee.dao.findByPositionId(position.getInt("id"));
                    if (null != fees) {
                        for (CsCustomerContractFee fee : fees) {
                            // 固定
                            if ("1".equals(fee.getStr("contract_fee_type"))) {
                                if ("2".equals(status)) {
                                    // 取消审核
                                    fee.set("status", "4"); // 待审核
                                    fee.set("auditor", "");
                                    fee.set("audit_time", null);
                                    fee.set("modifier", getLoginUserId());
                                    fee.set("modify_time", DateUtil.now());
                                } else if ("3".equals(status)) {
                                    // 审核
                                    fee.set("status", status);
                                    fee.set("auditor", getLoginUserId());
                                    fee.set("audit_time", DateUtil.now());
                                    fee.set("modifier", getLoginUserId());
                                    fee.set("modify_time", DateUtil.now());
                                }
                                fee.update();
                            }
                        }
                    }
                }
            }
            //日志       
            CsCustomerContractAuditorLog log = new CsCustomerContractAuditorLog();
            if ("2".equals(status)) {
                log.set("operate_teype", "unaudit");
            } else if ("3".equals(status)) {
                log.set("operate_teype", "audit");
            }
            //取消审核合同状态改为启用1而非新增2 为了不影响原合同费用状态判断所以由此处进行控制update at 20170810
            if ("2".equals(status)) {
            	status="1";
            }
            count = count + CsCustomerContract.dao.audit(Integer.valueOf(idStr), getLoginUserId()+"", status);
            // 插入日志           
            log.set("contract_code", contract.getStr("contract_code"));
            log.set("operator", getLoginUserId());
            log.set("operator_time", DateUtil.now());
            log.set("creator", getLoginUserId());
            log.set("create_time", DateUtil.now());
            log.set("rec_ver", "1");
            log.save();
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
        CsCustomerContract contract = getModel(CsCustomerContract.class, "", true);
        Integer id = contract.getInt("id");
        if (null == contract.getInt("is_tax")) {
            contract.set("is_tax", "0");
        }
        if (null == contract.getInt("is_frame_contract")) {
            contract.set("is_frame_contract", "0");
        }
        if (null == id) {
            String code = CodeUtil.getInstance().getCode("CONTRACT");
            contract.set("contract_code", code);
            contract.set("creator", getLoginUserId());
            contract.set("status", "1");
        } else {
            contract.set("modifier", getLoginUserId());
        }
        CsCustomerContract.dao.saveOrUpdate(contract);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        result.setData(contract);
        renderJson(result);
    }

	/**
     * 附件上传
     *
     *
     */
    public void upload() {
        Result result = new Result();
        String fileId = getPara("fileName");
        String contractCode = getPara("contract_code");
        if (StringUtils.isEmpty(fileId)) {
            result.setSuccess(false);
            result.setMsg("请选择附件");
        } else {
            SysFileUpload sysFileUpload = SysFileUpload.dao.getByUuid(fileId);
            if (null == sysFileUpload) {
                result.setSuccess(false);
                result.setMsg("请选择附件");
            } else {
                long count = CsCustomerContractAttach.dao.countByContractCodeAndFileNo(contractCode, fileId);
                if (count > 0l) {
                    result.setSuccess(false);
                    result.setMsg("附件已存在");
                } else {
                    result.setSuccess(true);
                    result.setMsg("上传成功");
                    CsCustomerContractAttach attach = new CsCustomerContractAttach();
                    attach.set("contract_code", contractCode);
                    attach.set("file_no", fileId);
                    attach.set("attach_name", sysFileUpload.getStr("file_name"));
                    attach.set("creator", getLoginUserId());
                    attach.set("create_time", DateUtil.now());
                    attach.set("rec_ver", 1);
                    attach.set("modifier", getLoginUserId());
                    attach.set("modify_time", DateUtil.now());
                    attach.save();
                }
            }
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
            CsCustomerContract customerContract = CsCustomerContract.dao.findById(id);
            customerContract.set("sign_time", DateUtil.format(customerContract.getDate("sign_time")));
            customerContract.set("contract_date_from", DateUtil.format(customerContract.getDate("contract_date_from")));
            customerContract.set("contract_date_to", DateUtil.format(customerContract.getDate("contract_date_to")));
            result.setData(customerContract);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

	/**
     * 根据ID获取流向
     *
     */
    public void getPositionById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsCustomerContractPosition model = CsCustomerContractPosition.dao.findById(id);
            result.setData(model);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    @Before(Tx.class)
    public void positionSubmit() {
        Result result = new Result();
        CsCustomerContractPosition model = getModel(CsCustomerContractPosition.class, "", true);
        Integer id = model.getInt("id");
        if (null == id) {
            model.set("creator", getLoginUserId());
            model.set("status", "1");
        } else {
            model.set("modifier", getLoginUserId());
        }
        CsCustomerContractPosition.dao.saveOrUpdate(model);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        result.setData(model);
        renderJson(result);
    }

    @Before(Tx.class)
    public void deletePosition() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
            CsCustomerContractFee.dao.deleteByPositionId(Integer.valueOf(idStr));
            CsCustomerContractPosition.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }

    public void getFeeById() {
        Result result = new Result();
        Integer id = getParaToInt("id");
        if (null != id) {
            CsCustomerContractFee model = CsCustomerContractFee.dao.findById(id);
            model.set("start_time", DateUtil.formatDate(model.getDate("start_time")));
            model.set("end_time", DateUtil.formatDate(model.getDate("end_time")));
            result.setData(model);
        } else {
            result.setData(null);
        }
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    @Before(Tx.class)
    public void feeSubmit() {
        Result result = new Result();
        CsCustomerContractFee model = getModel(CsCustomerContractFee.class, "", true);
        Integer id = model.getInt("id");
        if (null == id) {
            model.set("creator", getLoginUserId());
        } else {
            model.set("modifier", getLoginUserId());
        }
        CsCustomerContractFee.dao.saveOrUpdate(model);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        result.setData(model);
        renderJson(result);
    }

    @Before(Tx.class)
    public void deleteFee() {
        Result result = new Result();
        String id = getPara("id");
        String[] ids = StringUtils.split(id, ",");
        for (String idStr : ids) {
            CsCustomerContractFee.dao.deleteById(Integer.valueOf(idStr));
        }
        result.setSuccess(true);
        renderJson(result);
    }

    public void getBargainingById() {
        Result result = new Result();
        Record record = new Record();
        LoginUser user = getLoginUser();
        record.set("auditor", user.getUserName());
        record.set("audit_time", DateUtil.formatDate(DateUtil.now()));
        result.setData(record);
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    @Before(Tx.class)
    public void bargaining() {
        Result result = new Result();
        String idStr = getPara("ids");
        String auditor = getPara("auditor");
        String audit_time = getPara("audit_time");
        String remark = getPara("remark");
        String[] ids = StringUtils.split(idStr, ",");
        if (null != ids) {
            for (String id : ids) {
                CsCustomerContractFee model = CsCustomerContractFee.dao.findById(Integer.valueOf(id));
                if (null != model) {
                    model.set("status", "3");
                    model.set("auditor", auditor);
                    model.set("audit_time", audit_time);
                    model.set("remark", remark);
                    model.set("modifier", getLoginUserId());
                    model.set("modify_time", DateUtil.now());
                    model.update();
                }
            }
        }
        result.setMsg("审核确认成功");
        result.setSuccess(true);
        result.setMsg("SUCCESS");
        renderJson(result);
    }

    @Before(Tx.class)
    public void uploadFile() {
    	Result ret = new Result();
        String contractNo = getPara("contractNo");
        if (StringUtils.isEmpty(contractNo)) {
            ret.addError("合同编号不能为空");
        } else {
            UploadFile uploadFile = getFile();
            if (null != uploadFile && null != uploadFile.getFile()) {
                ret = CustomerContractService.me.importXls(uploadFile.getFile(), contractNo, getLoginUserId()+"");
            }
        }
        renderJson(ret);
    }

}
