
package com.chinaservices.oms.cargo.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("serial")
@Table(tableName = "cs_cargo")
public class CsCargo extends Model<CsCargo>
{
    public static final CsCargo dao = new CsCargo();

    /**
     * 所有 sql 与业务逻辑写在 Model 或 Service 中，不要写在 Controller 中，养成好习惯，有利于大型项目的开发与维护
     */
    /**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsCargo> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_cargo t ");
        extSql.append("where 1=1");
        String cargoCode=(String)params.get("cargo_code");
        String cargoName=(String)params.get("cargo_name");
        String cargoType=(String)params.get("cargo_type");
        String status=(String)params.get("status");
        String customerCode=(String)params.get("customer_code");
        String customerCodeOrNull=(String)params.get("customer_code_or_null");
        String packageSpecification=(String)params.get("package_specification");
        String tenancy=(String)params.get("tenancy");
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(cargoCode)){
        	extSql.append(" and t.cargo_code like ?");
        	param.add("%"+cargoCode+"%");
        }
        if(StringUtils.isNotBlank(cargoName)){
        	extSql.append(" and t.cargo_name like ?");
        	param.add("%"+cargoName+"%");
        }
        if(StringUtils.isNotBlank(cargoType)){
        	extSql.append(" and t.cargo_type=?");
        	param.add(cargoType);
        }
        if(StringUtils.isNotBlank(status)){
        	extSql.append(" and t.status=?");
        	param.add(status);
        }
        if(StringUtils.isNotBlank(customerCode)){
        	extSql.append(" and t.customer_code=?");
        	param.add(customerCode);
        }
        if(StringUtils.isNotBlank(customerCodeOrNull)){
        	extSql.append(" and ( t.customer_code=? or t.customer_code is null )");
        	param.add(customerCode);
        }
        if(StringUtils.isNotBlank(packageSpecification)){
        	extSql.append(" and t.package_specification like ?");
        	param.add("%"+packageSpecification+"%");
        }
        if(StringUtils.isNotBlank(tenancy)){
        	extSql.append(" and t.tenancy=?");
        	param.add(tenancy);
        }
        extSql.append(" order by t.create_time desc");
        if(param.isEmpty()){
        	return paginate(pageNo, pageSize, selectSql, extSql.toString());

        }else{
        	return paginate(pageNo, pageSize, selectSql, extSql.toString(),param.toArray());
        }
    }
    
    /**
     * 检查商品代码是否虫重复
     * @param id
     * @param cargoCode
     * @return
     */
    public boolean checkDuplicateNo(Integer id, String cargoCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_cargo where cargo_code=? ";
        params.add(cargoCode);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
    
    /**
     * 保存或者更新
     *
     * @param csCargo
     */
    public void saveOrUpdate(CsCargo csCargo) {
        if (null == csCargo.get("id")) {
        	csCargo.set("rec_ver", 1);
        	csCargo.save();
        } else {
        	csCargo.set("modify_time", DateUtil.now());
        	csCargo.update();
        }
    }
    
    /**
     * 根据id集合删除数据
     *
     * @param ids
     * @return
     */
    public int deleteAllById(Object[] ids) {
        if (null == ids || ids.length == 0) {
            return 0;
        } else {
            StringBuilder sql = new StringBuilder("delete from cs_cargo where id in(");
            for (int i = 0; i < ids.length; i++) {
                sql.append("?");
                if (i < (ids.length - 1)) {
                    sql.append(",");
                }
            }
            sql.append(")");
            return Db.update(sql.toString(), ids);
        }
    }
    
    /**
     * 根据id更新商品状态
     *
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, Integer modifier, String status) {
        String sql = "update cs_cargo set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
    
    /**
     * 根据商品代码获取启用状态的商品
     * @param cargoCode
     * @return CsCargo
     */
    public CsCargo getByEnableCargoCode(String cargoCode) {
    	if (!StringUtils.isNotBlank(cargoCode)) {
    		return null;
    	}
    	
    	StringBuilder sql = new StringBuilder();
    	sql.append("select t.* ");
    	sql.append("from cs_cargo t ");
    	sql.append("where t.status = '1' ");
        sql.append("and t.cargo_code = ? ");
    	return findFirst(sql.toString(), cargoCode);
    }
    
}
