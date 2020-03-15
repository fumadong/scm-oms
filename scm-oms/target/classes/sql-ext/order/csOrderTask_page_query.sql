SELECT
	t.*, 
    o.customer_order_no,
	o.customer_name,
	o.shipper_name,
	o.consignee_name,
	o.carrier_name,
	o.warehouse_name,
	o.order_time
FROM
	cs_order_task t
LEFT JOIN cs_order o ON t.order_id = o.id
WHERE
	1 = 1
<< and t.order_id = :order_id >>
<< and t.order_id in (order_ids) >>
<< and t.order_no like concat('%',:order_no,'%') >>
<< and t.order_task_no like concat('%',:order_task_no,'%') >>
<< and t.issue_status = :issue_status >>
<< and t.issue_status != :exclude_issue_status >>
<< and o.customer_order_no like concat('%',:customer_order_no,'%') >>
<< and o.customer_name like concat('%',:customer_name,'%') >>
<< and o.shipper_code = :shipper_code >>
<< and o.shipper_name like concat('%',:shipper_name,'%') >>
<< and o.consignee_code = :consignee_code >>
<< and o.consignee_name like concat('%',:consignee_name,'%') >>