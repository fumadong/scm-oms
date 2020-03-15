package com.chinaservices.oms.rule.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
*类用途说明：分配规则
*By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
*@author Dylan Fu
*/
@Table(tableName = "cs_rule_alloc_header", pkName = "id")
public class csRuleAllocHeader extends Model<csRuleAllocHeader>{
	private static final long serialVersionUID = 1L;
	public static final csRuleAllocHeader dao = new csRuleAllocHeader();
	
	/**
     * 根据客户编号查询
     * @param
     * @param
     * @return
     */
    public csRuleAllocHeader findByCustomerCode(String customerCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select t.* from cs_customer t where t.customer_code=? ";
        params.add(customerCode);
        List<csRuleAllocHeader> csCustomers= this.dao.find(sql,params.toArray());
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
    public Page<csRuleAllocHeader> getPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
        String selectSql = "select t.* ";
        StringBuilder extSql = new StringBuilder();
        extSql.append("from cs_rule_alloc_header t where 1=1");
        
        String warehouseCode=(String)params.get("warehouse_code");
        String ruleCode=(String)params.get("rule_code");
        String ruleName=(String)params.get("rule_name");
        String customerType=(String)params.get("invoice_type_name");
        String taxCode=(String)params.get("effect_time_fm");
        String tel=(String)params.get("effect_time_to");
        String status=(String)params.get("status");

        List<String> param=new ArrayList<>();
        if(StringUtils.isNotBlank(warehouseCode)){
        	extSql.append(" and warehouse_code like ?");
        	param.add("%"+warehouseCode+"%");
        }
        if(StringUtils.isNotBlank(ruleCode)){
        	extSql.append(" and rule_code like ?");
        	param.add("%"+ruleCode+"%");
        }
        if(StringUtils.isNotBlank(ruleName)){
        	extSql.append(" and rule_name like ?");
        	param.add("%"+ruleName+"%");
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
    public Page<csRuleAllocHeader> getPopPageByCondition(Map<String, Object> params, int pageNo, int pageSize) {
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
    public void saveOrUpdate(csRuleAllocHeader csCustomer) {
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
        String sql = "update cs_customer set modifier=?,modify_time=now(),rec_ver=rec_ver+1,status=? where id=?";
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
