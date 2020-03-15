package com.chinaservices.oms.order.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.chinaservices.oms.rule.model.CsDivideTask;
import com.chinaservices.sdk.binding.annotation.Table;
import com.chinaservices.sdk.support.model.BaseModel;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;

@Table(tableName = "cs_order_task", pkName = "id")
public class CsOrderTask extends BaseModel<CsOrderTask> {
	
	public static final CsOrderTask dao = new CsOrderTask();
	
	/**
	 * 根据订单id获取任务Map
	 * @param order_ids
	 * @return
	 */
	public Map<Integer, List<CsOrderTask>> getTaskMap(String[] order_ids) {
		Map<Integer, List<CsOrderTask>> taskMap = new HashMap<>();
		
		Map<String, Object> params = new HashMap<>();
		params.put("order_ids", order_ids);
		List<Record> taskRecords = new SqlExecutor().find("csOrderTask_query",params);
		
		for (Record taskRecord : taskRecords) {
			CsOrderTask task = new CsOrderTask();
			task.copyFrom(taskRecord);
    		Integer order_id = task.getInt("order_id");
    		if(taskMap.containsKey(order_id)) {
    			taskMap.get(order_id).add(task);
    		}else {
    			List<CsOrderTask> tasks = new ArrayList<CsOrderTask>();
    			tasks.add(task);
    			taskMap.put(order_id, tasks);
    		}
		}
		
		return taskMap;
	}
	
}
