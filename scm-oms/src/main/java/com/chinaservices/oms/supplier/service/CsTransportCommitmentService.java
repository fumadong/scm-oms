package com.chinaservices.oms.supplier.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.supplier.model.CsTransportCommitment;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsTransportCommitmentService {

	private CsTransportCommitment dao = new CsTransportCommitment();
	
	/**
	 * 新增或保存
	 * @param model
	 */
	public void save(CsTransportCommitment model) {
        if (null == model.get("id")) {
        	model.set("code", UUID.randomUUID().toString().replaceAll("-", ""));//随机生成代码
        	model.set("create_time", DateUtil.now());
        	model.set("rec_ver", 1);
        	model.save();
        } else {
        	model.set("modify_time", DateUtil.now());
        	model.update();
        }
    }
	
	/**
	 * 批量保存
	 * @param models
	 * @return
	 */
	public List<CsTransportCommitment> saveAll(List<CsTransportCommitment> models){
		for(CsTransportCommitment model : models) {
			save(model);
		}
		return models;
	}
	
	/**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsTransportCommitment> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_transport_commitment t where 1=1");
        
        String status = (String)params.get("status");
        String name = (String)params.get("name");
        String supplier_code = (String) params.get("supplier_code");
        
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(status)){
        	extSql.append(" and t.status = ?");
        	param.add(status);
        }
        if(StringUtils.isNotBlank(name)){
        	extSql.append(" and t.name = ?");
        	param.add(name);
        }
        if(StringUtils.isNotBlank(supplier_code)){
        	extSql.append(" and t.supplier_code = ?");
        	param.add(supplier_code);
        }
        extSql.append(" order by t.create_time desc");
        
        if(param.isEmpty()){
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString());
        }else{
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString(),param.toArray());
        }
    }
    
    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsTransportCommitment findById(Integer id) {
    	return dao.findById(id);
    }
    
    /**
	 * 批量id删除
	 * @param ids
	 */
	public void deleteAllByIds(String[] ids) {
		for (String id : ids) {
			dao.deleteById(id);
		}
	}
	
	/**
     * 更新状态
     * 
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, String modifier, String status) {
        String sql = "update cs_transport_commitment set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
    
    public Result checkDuplicate(String name , String carrier_code) {
    	Result result = new Result();
    	result.setSuccess(true);
    	CsTransportCommitment model = dao.findFirst("select t.carrier_name, t.carrier_code,t.name from cs_transport_commitment t where t.carrier_code=? or t.name=?",carrier_code,name);
    	if(model!=null) {
    		result.setSuccess(false);
    		if(StringUtils.equals(name, model.getStr("name"))) {
    			result.setMsg("“运力承诺名称不能重复");
    		} else {
    			result.setMsg("承运商"+model.getStr("carrier_name")+"运力承诺不能重复");
    		}
    	}
    	
    	return result;
    }
}
