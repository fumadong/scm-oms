package com.chinaservices.oms.fee.model;

import java.util.ArrayList;
import java.util.List;

import com.chinaservices.sdk.binding.annotation.Table;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 科目管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 * @author Joan.Zhang
 * 2017-07-18
 */
@Table(tableName = "cs_subject", pkName = "id")
public class CsSubject extends Model<CsSubject> {

	public static final CsSubject dao = new CsSubject();

	public void saveOrUpdate(CsSubject model) {
		if (null == model.getInt("id")) {
			model.save();
		} else {
			model.update();
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
            StringBuilder sql = new StringBuilder("delete from cs_subject where id in(");
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
     * 检查是否有重复科目代码
     * @param id
     * @param subjectCode
     * @return
     */
    public boolean checkDuplicateSubjectCode(Integer id, String subjectCode) {
        List<Object> params = new ArrayList<>();
        String sql = "select count(1) from cs_subject where subject_code=? ";
        params.add(subjectCode);
        if (null != id) {
            sql = sql + "and id!=?";
            params.add(id);
        }
        return Db.queryLong(sql, params.toArray(new Object[params.size()])) > 0;
    }
}
