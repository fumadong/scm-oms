package com.chinaservices.oms.cust.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.cust.model.CsServiceAreaBlock;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsServiceAreaBlockService {
	
	private static final CsServiceAreaBlock dao = new CsServiceAreaBlock();
	/**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsServiceAreaBlock> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_service_area_block t where 1=1");
        
        String service_area_code = (String)params.get("service_area_code");
        String status = (String)params.get("status");
        
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(service_area_code)){
        	extSql.append(" and t.service_area_code like ?");
        	param.add("%"+service_area_code+"%");
        }
        
        if(StringUtils.isNotBlank(status)){
        	extSql.append(" and t.status like ?");
        	param.add("%"+status+"%");
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
    public CsServiceAreaBlock findById(Integer id) {
    	return dao.findById(id);
    }
    /**
     * 检查是否有重复仓库代码
     *
     * @param id
     * @param vehicleNo
     * @return
     */
    public boolean checkDuplicate(Integer id, String serviceCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_service_area_block where service_area_code=? ";
        params.add(serviceCode);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
    /**
     * 保存或者更新
     *
     * @param supplier
     */
    public void saveOrUpdate(CsServiceAreaBlock warehouse) {
        if (null == warehouse.get("id")) {
        	warehouse.set("create_time", DateUtil.now());
        	warehouse.set("rec_ver", 1);
        	warehouse.save();
        } else {
        	warehouse.set("modify_time", DateUtil.now());
        	warehouse.update();
        }
    }
    /**
     * 根据系统订单号数组删除数据
     * @param service_area_code
     * @return int
     */
    public int deleteAllByCode(String service_area_code) {
        if (null == service_area_code) {
            return 0;
        } else {
            StringBuilder sql = new StringBuilder("delete from cs_service_area_map where service_area_code =");
            sql.append("?");
            return Db.update(sql.toString(), service_area_code);
        }
    }
    /**
     * 删除规则及子表
     * @param id
     */
    public void deleteByIds(String[] ids) {
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
        String sql = "update cs_service_area_block set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
}
