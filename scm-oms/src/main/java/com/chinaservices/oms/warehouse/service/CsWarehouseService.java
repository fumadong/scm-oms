package com.chinaservices.oms.warehouse.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.oms.cust.model.CsSupplier;
import com.chinaservices.oms.supplier.model.CsSupplierAssessmentRule;
import com.chinaservices.oms.warehouse.model.CsWarehouse;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;

public class CsWarehouseService {
	
	private static final CsWarehouse dao = new CsWarehouse();
	/**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsWarehouse> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_warehouse t where 1=1");
        
        String warehouse_code = (String)params.get("warehouse_code");
        String warehouse_name = (String)params.get("warehouse_name");
        String superior_warehouse_name = (String)params.get("superior_warehouse_name");
        String service_area_code = (String)params.get("service_area_code");
        String service_area_name = (String)params.get("service_area_name");
        String status = (String)params.get("status");
        
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(warehouse_code)){
        	extSql.append(" and t.warehouse_code like ?");
        	param.add("%"+warehouse_code+"%");
        }
        
        if(StringUtils.isNotBlank(warehouse_name)){
        	extSql.append(" and t.warehouse_name like ?");
        	param.add("%"+warehouse_name+"%");
        }
        if(StringUtils.isNotBlank(superior_warehouse_name)){
        	extSql.append(" and t.superior_warehouse_name like ?");
        	param.add("%"+superior_warehouse_name+"%");
        }
        if(StringUtils.isNotBlank(service_area_code)){
        	extSql.append(" and t.service_area_code like ?");
        	param.add("%"+service_area_code+"%");
        }
        if(StringUtils.isNotBlank(service_area_name)){
        	extSql.append(" and t.service_area_name like ?");
        	param.add("%"+service_area_name+"%");
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
    public CsWarehouse findById(Integer id) {
    	return dao.findById(id);
    }
    /**
     * 检查是否有重复仓库代码
     *
     * @param id
     * @param vehicleNo
     * @return
     */
    public boolean checkDuplicateWarehouseCode(Integer id, String warehouseCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_warehouse where warehouse_code=? ";
        params.add(warehouseCode);
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
    public void saveOrUpdate(CsWarehouse warehouse) {
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
        String sql = "update cs_warehouse set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
}
