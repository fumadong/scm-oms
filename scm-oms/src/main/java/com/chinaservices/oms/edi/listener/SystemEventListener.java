package com.chinaservices.oms.edi.listener;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.chinaservices.event.Event;
import com.chinaservices.event.EventListener;
import com.chinaservices.event.EventManager;
import com.chinaservices.oms.edi.event.sys.SystemSendOrderEvent;
import com.chinaservices.sql.SqlExecutor;
import com.google.common.eventbus.Subscribe;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统事件监听
 * @author Samuel
 */
public class SystemEventListener implements EventListener {

	@Subscribe
	public void issueTasks(SystemSendOrderEvent event) throws InterruptedException {
		
		Thread.sleep(1000);
		
		Integer[] taskIds = event.getTaskIds();
		Integer operator = event.getOperator();
		Map<String, Object> params = new HashMap<>();
		params.put("ids", taskIds);
		List<Record> taskRecords = new SqlExecutor().find("csOrderTask_query",params);
		
		// 按接口事件类型分组
		Map<String, List<Integer>> taskMap = new HashMap<>();
		for (Record taskRecord : taskRecords) {
    		String interface_event = taskRecord.getStr("interface_event");
    		if(taskMap.containsKey(interface_event)) {
    			taskMap.get(interface_event).add(taskRecord.getInt("id"));
    		}else {
    			List<Integer> ids = new ArrayList<Integer>();
    			ids.add(taskRecord.getInt("id"));
    			taskMap.put(interface_event, ids);
    		}
		}
		
		for (Entry<String, List<Integer>> entry : taskMap.entrySet()) {
			try {
				// 任务下发事件
				String className = "com.chinaservices.oms.edi.event."+entry.getKey()+".CreateOrderEvent";
				Integer[] ids = entry.getValue().toArray(new Integer[entry.getValue().size()]);
				Event taskEvent = (Event) Class.forName(className).getConstructor(Integer[].class, Integer.class).newInstance(ids,operator);
				EventManager.fireEvent(taskEvent);
			} catch (InstantiationException | IllegalAccessException | ClassNotFoundException |IllegalArgumentException | InvocationTargetException | NoSuchMethodException
					| SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
//		for (Record record : taskRecords) {
//			try {
//				// 任务下发事件
//				String className = record.getStr("interface_class");
//				Integer id = record.getInt("id");
//				Integer[] ids = new Integer[1];
//				ids[0] = id;
//				Event taskEvent = (Event) Class.forName(className).getConstructor(Integer[].class, Integer.class).newInstance(ids,operator);
//				EventManager.fireEvent(taskEvent);
//			} catch (InstantiationException | IllegalAccessException | ClassNotFoundException |IllegalArgumentException | InvocationTargetException | NoSuchMethodException
//					| SecurityException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
		
	}
	
}
