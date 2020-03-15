package com.chinaservices.oms.edi.event.sys;

import com.chinaservices.event.Event;

public class SystemSendOrderEvent extends Event {
	
	private Integer[] taskIds;
	
	private Integer operator;

	public Integer[] getTaskIds() {
		return taskIds;
	}

	public Integer getOperator() {
		return operator;
	}
	
	public SystemSendOrderEvent(Integer[] taskIds, Integer operator) {
		this.taskIds = taskIds;
		this.operator = operator;
	}
}
