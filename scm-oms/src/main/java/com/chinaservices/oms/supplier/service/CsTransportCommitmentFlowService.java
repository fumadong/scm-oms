package com.chinaservices.oms.supplier.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.chinaservices.oms.supplier.model.CsTransportCommitmentFlow;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsTransportCommitmentFlowService {

	private CsTransportCommitmentFlow dao = new CsTransportCommitmentFlow();
	
	/**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsTransportCommitmentFlow> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_transport_commitment_flow t where 1=1");
        
        String commitment_id = (String) params.get("commitment_id");
        
        List<String> param=new ArrayList<String>();
    	extSql.append(" and t.commitment_id = ?");
    	param.add(commitment_id);
        extSql.append(" order by t.create_time desc");
        
        if(param.isEmpty()){
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString());
        }else{
        	return dao.paginate(pageNo, pageSize, selectSql, extSql.toString(),param.toArray());
        }
    }
    
    /**
	 * 新增或保存
	 * @param model
	 */
	public void save(CsTransportCommitmentFlow model) {
        if (null == model.get("id")) {
        	model.set("create_time", DateUtil.now());
        	model.set("rec_ver", 1);
        	model.save();
        } else {
        	model.set("modify_time", DateUtil.now());
        	model.update();
        }
    }
	
	/**
	 * 批量id删除
	 * @param ids
	 */
	public void deleteByCommitmentIds(String[] commitment_ids) {
		for (String commitment_id : commitment_ids) {
			String sql = "delete from cs_transport_commitment_flow where commitment_id = ? ";
	        Db.update(sql, commitment_id);
		}
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
     * 根据id查询
     * @param id
     * @return
     */
    public CsTransportCommitmentFlow findById(Integer id) {
    	return dao.findById(id);
    }
}
