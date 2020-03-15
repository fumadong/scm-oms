package com.chinaservices.oms.order.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.chinaservices.event.EventManager;
import com.chinaservices.oms.edi.event.sys.SystemSendOrderEvent;
import com.chinaservices.oms.order.model.CsOrder;
import com.chinaservices.oms.order.model.CsOrderTask;
import com.chinaservices.oms.rule.model.CsDivideRule;
import com.chinaservices.oms.rule.model.CsDivideTask;
import com.chinaservices.oms.rule.model.CsIssueRule;
import com.chinaservices.oms.rule.service.CsDivideRuleService;
import com.chinaservices.oms.rule.service.CsDivideTaskService;
import com.chinaservices.oms.rule.service.CsIssueRuleService;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.CodeUtil;
import com.chinaservices.sql.SqlExecutor;
import com.jfinal.plugin.activerecord.Record;

public class CsOrderService {
	
	public static final CsOrderService me = new CsOrderService();
	private static final CsOrder csOrder = new CsOrder();
	
	/**
	 * 订单分解
	 * @param ids
	 */
	public Result divideOrders(String[] ids, Integer modifier) {
		Result result = new Result();
		result.setSuccess(true);
		
		// 查询分解规则，按优先级排序
		List<CsDivideRule> divideRules = CsDivideRuleService.me.getEnableRule();
		// 查询分解规则任务
		Map<Integer, List<CsDivideTask>> divideTaskMap = CsDivideTaskService.me.getRuleTaskMap();
		if(!divideRules.isEmpty()) {
			// 查询订单
			List<CsOrder> orders = csOrder.getOrdersByIds(ids);
			// 开始分解
			for (CsOrder order : orders) {
				Map<String, String> param = new HashMap<String, String>();
				param.put("order_type", order.getStr("order_type"));
				param.put("customer_code", order.getStr("customer_code"));
				param.put("carrier_code", order.getStr("carrier_code"));
				param.put("warehouse_code", order.getStr("warehouse_code"));
				Integer ruleId= CsDivideRuleService.me.matchDivideRule(param, divideRules);
				// 匹配到则分解为任务，否则提示失败
				if(ruleId == null) {
					result.fail(order.getStr("order_no")+": 没有匹配到分解规则，审核失败");
					break;
				}
				int taskNum = createOrderTask(order, divideTaskMap.get(ruleId), modifier);
				order.set("order_task_num", taskNum);
				order.update();
			}
		} else {
			result.fail("没有启用的分解规则，订单无法分解");
		}
		return result;
	}
	
	/**
	 * 根据订单和分解结果生成任务
	 * @param order
	 * @param divideTasks
	 * @param modifier
	 * @return
	 */
	private int createOrderTask(CsOrder order, List<CsDivideTask> divideTasks, Integer modifier) {
		int taskNum = 0;
		if(divideTasks!=null && !divideTasks.isEmpty()) {
			for(CsDivideTask divideTask : divideTasks) {
				CsOrderTask task = new CsOrderTask();
				task.set("order_id", order.getInt("id"));
				task.set("order_no", order.getStr("order_no"));
				task.set("order_task_no", CodeUtil.getInstance().getCode("ORDER_TASK"));
				task.set("task_type_code", divideTask.getStr("task_type_code"));
				task.set("task_type_name", divideTask.getStr("task_type_name"));
				task.set("issue_status", "NEW");// NEW.WAITTING.SUCCESS.FAILURE
				task.set("issue_try_times", 0);
				task.set("creator", modifier);
				task.set("create_time", new Date());
				task.set("modifier", modifier);
				task.set("modify_time", new Date());
				task.set("rec_ver", 1);
				task.save();
				taskNum++;
			}
		}
		return taskNum;
	}
	
	/**
	 * 取消分解
	 * @param ids
	 * @param modifier
	 */
	public void cancelDivide(String[] ids, Integer modifier) {
		// 查询订单
		List<CsOrder> orders = csOrder.getOrdersByIds(ids);
		// 订单任务数置为空
		for (CsOrder order : orders) {
			order.set("order_task_num", null);
			order.set("modifier", modifier);
			order.update();
		}
		// 删除订单任务
		Map<String, Object> params = new HashMap<String,Object>();
        params.put("order_ids",ids);
		new SqlExecutor().update("csTask_byOrderId_delete", params);
	}
	
	/**
	 * 订单下发
	 * @param ids
	 * @param modifier
	 * @return
	 */
	public Result issueOrders(String[] ids, Integer modifier) {
		Result result = new Result();
		result.setSuccess(true);
		// 下发策略
		List<CsIssueRule> issueRules = CsIssueRuleService.me.getEnableRule();
		
		if(!issueRules.isEmpty()) {
			// 查询订单
			List<CsOrder> orders = csOrder.getOrdersByIds(ids);
			// 查询订单任务
			Map<Integer, List<CsOrderTask>> orderTaskMap = CsOrderTask.dao.getTaskMap(ids);
			// 下发任务列表
			List<CsOrderTask> issueTasks = new ArrayList<>();
			// 修改时间
			Date modify_time = new Date();
			// 为任务匹配下发规则
			for (CsOrder order : orders) {
				List<CsOrderTask> tasks = orderTaskMap.get(order.getInt("id"));
				// 匹配规则
				Map<String, String> param = new HashMap<String, String>();
				param.put("order_type", order.getStr("order_type"));
				param.put("customer_code", order.getStr("customer_code"));
				param.put("carrier_code", order.getStr("carrier_code"));
				param.put("warehouse_code", order.getStr("warehouse_code"));
				for (CsOrderTask csOrderTask : tasks) {
					param.put("task_type_code", csOrderTask.getStr("task_type_code"));
					CsIssueRule rule= CsIssueRuleService.me.matchIssueRule(param, issueRules);
					// 匹配到则分解为任务，否则提示失败
					if(rule == null) {
						result.fail(order.getStr("order_no")+": 没有匹配到下发规则，下发失败");
						break;
					}
					csOrderTask.set("interface_event", rule.getStr("interface_event"));
					csOrderTask.set("interface_class", rule.getStr("interface_class"));
					csOrderTask.set("issue_status", "WAITTING");
					csOrderTask.set("modify_time", modify_time);
					csOrderTask.set("modifier", modifier);
					issueTasks.add(csOrderTask);
				}
			}
			List<Integer> taskIds = new ArrayList<>();
			if(!issueTasks.isEmpty()) {
				for (CsOrderTask csOrderTask : issueTasks) {
					csOrderTask.update();
					taskIds.add(csOrderTask.getInt("id"));
				}
			}
			
			// 任务下发事件
			SystemSendOrderEvent event = new SystemSendOrderEvent(taskIds.toArray(new Integer[taskIds.size()]), modifier);
			EventManager.fireEvent(event);
			
		} else {
			result.fail("没有启用的下发规则，订单无法下发");
		}
		return result;
	}
	
	/**
	 * 取消下发
	 * @param ids
	 * @param modifier
	 * @return
	 */
	public Result cancelIssue(String[] ids, Integer modifier) {
		Result result = new Result();
		result.setSuccess(true);
		
		// 检验是否存在下发成功的任务，存在则不允许取消
		Map<String, Object> params = new HashMap<>();
		params.put("order_ids", ids);
		List<Record> taskRecords = new SqlExecutor().find("csOrderTask_query",params);
		// 任务id集合
		List<Integer> task_ids = new ArrayList<>();
		for (Record record : taskRecords) {
			if(StringUtils.equals("SUCCESS", record.getStr("issue_status"))) {
				result.fail(record.getStr("order_no")+": 任务已下发至下游系统，无法取消下发");
			    return result;
			}
			CsOrderTask task = new CsOrderTask();
			task.copyFrom(record);
			task.set("issue_status", "NEW");
			task.set("issue_try_times", 0);
			task.set("issue_time", null);
			task.set("interface_class", null);
			task.set("interface_event", null);
			task.update();
			task_ids.add(task.getInt("id"));
		}
		
		// 删除下发记录
		Map<String, Object> deleteLogparams = new HashMap<String,Object>();
		deleteLogparams.put("task_ids",task_ids.toArray(new Integer[task_ids.size()]));
		new SqlExecutor().update("csTaskIssueLog_byTaskId_delete", deleteLogparams);
		
		return result;
	}
	
}
