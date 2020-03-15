package com.chinaservices.oms.edi.event.wmsso;

import com.chinaservices.event.Event;

/**
 * 订单下发TMS事件
 * @author Samuel
 */
public class WmsSoRevocationOrderEvent extends Event {

	private String[] customer_order_no;

	private Integer operator;

	public WmsSoRevocationOrderEvent(String[] customer_order_no, Integer operator) {
		this.customer_order_no = customer_order_no;
		this.operator = operator;
	}

	public String[] getCustomer_order_no() {
		return customer_order_no;
	}

	public void setCustomer_order_no(String[] customer_order_no) {
		this.customer_order_no = customer_order_no;
	}

	public Integer getOperator() {
		return operator;
	}

	public void setOperator(Integer operator) {
		this.operator = operator;
	}
}
