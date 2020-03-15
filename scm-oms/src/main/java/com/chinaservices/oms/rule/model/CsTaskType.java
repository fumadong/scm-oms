package com.chinaservices.oms.rule.model;

import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.util.DateUtil;
import com.jfinal.plugin.activerecord.Model;

@Table(tableName = "cs_task_type", pkName = "id")
public class CsTaskType extends Model<CsTaskType> {

	public static final CsTaskType dao = new CsTaskType();

	public CsTaskType save(CsTaskType model) {
		if (null == model.get("id")) {
        	model.set("create_time", DateUtil.now());
        	model.set("rec_ver", 1);
        	model.save();
        } else {
        	model.set("modify_time", DateUtil.now());
        	model.update();
        }
		return model;
	}

	public void deleteByIds(Integer[] ids) {
		dao.deleteById(ids);
	}

	public void updateStatus(String[] ids, String status) {
		for (String id : ids) {
			CsTaskType taskType = CsTaskType.dao.findById(id);
			taskType.set("status", status);
			taskType.update();
		}
	}

}
