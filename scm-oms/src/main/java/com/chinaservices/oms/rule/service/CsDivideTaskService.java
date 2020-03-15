package com.chinaservices.oms.rule.service;

import com.chinaservices.oms.rule.model.CsDivideTask;
import com.chinaservices.sdk.util.DateUtil;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CsDivideTaskService {
	
	public static final CsDivideTaskService me = new CsDivideTaskService();
    private static final CsDivideTask dao = new CsDivideTask();

    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsDivideTask findById(Integer id) {
    	return dao.findById(id);
    }

    /**
     * 批量保存
     * @param models
     */
    public void saveAll(List<CsDivideTask> models){
        for (CsDivideTask model:models ) {
            saveOrUpdate(model);
        }
    }
    /**
     * 保存或者更新
     *
     * @param model
     */
    public void saveOrUpdate(CsDivideTask model) {
        if (null == model.get("id")) {
            model.set("create_time", DateUtil.now());
            model.set("rec_ver", 1);
            model.set("modify_time", DateUtil.now());
            model.save();
        } else {
            model.set("modify_time", DateUtil.now());
            model.update();
        }
    }
    /**
     * 检查是否有重复代码
     *
     * @param id
     * @param divide_rule_id
     * @return
     */
    public boolean checkDuplicate(Integer id, String divide_rule_id,String task_sequence) {
        Map<String,Object> params = new HashMap<String, Object>();
        if(StringUtils.isNotBlank(divide_rule_id)) {
            params.put("divide_rule_id",divide_rule_id);
        }
        if(StringUtils.isNotBlank(task_sequence)) {
            params.put("task_sequence",task_sequence);
        }
        if(id != null) {
            params.put("noid",id);
        }
        List<Record> records = new SqlExecutor().find("csDivideTask_qeury",params);
        return records.size() > 0;

    }
    /**
     * 根据id删除
     * @param ids
     */
    public void deleteByIds(String[] ids) {
    	for (String id : ids) {
    		dao.deleteById(id);
		}
    }
    
    /**
     * 获取分解任务，按规则id分组
     * @return
     */
    public Map<Integer, List<CsDivideTask>> getRuleTaskMap() {
    	Map<Integer, List<CsDivideTask>> taskMap = new HashMap<>();
    	List<CsDivideTask> divideTasks = dao.find("select * from cs_divide_task");
    	for (CsDivideTask csDivideTask : divideTasks) {
    		Integer divide_rule_id = csDivideTask.getInt("divide_rule_id");
    		if(taskMap.containsKey(divide_rule_id)) {
    			taskMap.get(divide_rule_id).add(csDivideTask);
    		}else {
    			List<CsDivideTask> tasks = new ArrayList<CsDivideTask>();
    			tasks.add(csDivideTask);
    			taskMap.put(divide_rule_id, tasks);
    		}
		}
    	return taskMap;
    }
}
