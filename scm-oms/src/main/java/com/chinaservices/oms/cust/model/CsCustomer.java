package com.chinaservices.oms.cust.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

/**
*类用途说明：管理
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author chenqiwang
*/
@Table(tableName = "cs_customer", pkName = "id")
public class CsCustomer extends Model<CsCustomer>{
	private static final long serialVersionUID = 1L;
	public static final CsCustomer dao = new CsCustomer();
	
	/**
     * 根据客户编号查询
     * @param id
     * @param customerNo
     * @return
     */
    public CsCustomer findByCustomerCode(String customerCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select t.* from cs_customer t where t.customer_code=? ";
        params.add(customerCode);
        List<CsCustomer> csCustomers= this.dao.find(sql,params.toArray());
        if(csCustomers.size()>0){
        	return csCustomers.get(0);
        }
       return null;
    }
	 /**
     * 分页查询
     *
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsCustomer> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_customer t where 1=1");
        
        String customerCode=(String)params.get("customer_code");
        String customerName=(String)params.get("customer_name");
        String customerType=(String)params.get("customer_type");
        String taxCode=(String)params.get("tax_code");
        
        String status=(String)params.get("status");
        String tel=(String)params.get("tel");
        String office=(String)params.get("office");
        List<String> param=new ArrayList<String>();
        if(StringUtils.isNotBlank(customerCode)){
        	extSql.append(" and customer_code like ?");
        	param.add("%"+customerCode+"%");
        }
        if(StringUtils.isNotBlank(customerName)){
        	extSql.append(" and customer_name like ?");
        	param.add("%"+customerName+"%");
        }
        if(StringUtils.isNotBlank(customerType)){
        	extSql.append(" and customer_type=?");
        	param.add(customerType);
        }
        if(StringUtils.isNotBlank(taxCode)){
        	extSql.append(" and tax_code like ?");
        	param.add("%"+taxCode+"%");
        }
        if(StringUtils.isNotBlank(status)){
        	extSql.append(" and status=?");
        	param.add(status);
        }
        if(StringUtils.isNotBlank(tel)){
            extSql.append(" and tel like ?");
            param.add("%"+tel+"%");
        }
        if(StringUtils.isNotBlank(office)){
        	extSql.append(" and office like ?");
        	param.add("%"+office+"%");
        }
        extSql.append(" order by t.modify_time desc");
        if(param.isEmpty()){
        	return paginate(pageNo, pageSize, selectSql, extSql.toString());

        }else{
        	return paginate(pageNo, pageSize, selectSql, extSql.toString(),param.toArray());
        }
    }
    
    /**
     * 客户弹出框分页查询: 查询启用客户及默认联系人信息（弹出框专用）
     * @param params
     * @param pageNo
     * @param pageSize
     * @return
     */
    public Page<CsCustomer> getPopPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.id, t.customer_code, t.customer_name, t.customer_type, t.office, c.contact_code, c.contact_name, "
        		+ "c.province_code, c.province_name, c.city_code, c.city_name, c.county_code, c.county_name,c.address, c.mobile, c.tel ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_customer t left join cs_customer_contact c on c.customer_id = t.id and c.is_default = 1 where t.status = 1 ");
        String customerCode = (String) params.get("customer_code");
        String customerName = (String) params.get("customer_name");
        String customerType = (String) params.get("customer_type");
        List<String> param = new ArrayList<String>();
        if (StringUtils.isNotBlank(customerCode)) {
        	extSql.append(" and t.customer_code like ? ");
        	param.add("%" + customerCode + "%");
        }
        if (StringUtils.isNotBlank(customerName)) {
        	extSql.append(" and t.customer_name like ? ");
        	param.add("%" + customerName + "%");
        }
        if (StringUtils.isNotBlank(customerType)) {
        	extSql.append(" and t.customer_type=? ");
        	param.add(customerType);
        }
        extSql.append(" order by t.modify_time desc");
        System.out.println(selectSql + extSql.toString());
        if(param.isEmpty()){
        	return paginate(pageNo, pageSize, selectSql, extSql.toString());
        }else{
        	return paginate(pageNo, pageSize, selectSql, extSql.toString(), param.toArray());
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
            StringBuilder sql = new StringBuilder("delete from cs_customer where id in(");
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
     * 保存或者更新
     *
     * @param customer
     *//*
 /**
     * 保存或者更新
     *
     * @param customer
     */
    public void saveOrUpdate(CsCustomer csCustomer) {
        if (null == csCustomer.get("id")) {
        	csCustomer.save();
        } else {
        	csCustomer.update();
        }
    }
    /**
     * 根据id更新客户状态
     *
     * @param id
     * @param modifier
     * @param status
     * @return
     */
    public int updateStatus(Integer id, Integer modifier, String status) {
        String sql = "update cs_rule_alloc_header set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
        return Db.update(sql, modifier, status, id);
    }
    /**
     * 检查是否有重复车牌号
     * @param id
     * @param customerNo
     * @return
     */
    public boolean checkDuplicateNo(Integer id, String customerCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_customer where customer_code=? ";
        params.add(customerCode);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
}
