select 
	 o.* ,
	 (select IFNULL(SUM(c.ea_quantity),0) from cs_order_cargo c where c.order_no = o.order_no ) as ea_quantity
  from cs_order o
 where 1 = 1  
<< and o.id = :id >>
<< and o.id in (:ids) >>
<< and o.order_no in (:order_nos) >>
<< and o.order_no like concat('%',:order_no,'%') >>
<< and o.customer_order_no like concat('%',:customer_order_no,'%') >>
<< and o.order_type = :order_type >>
<< and o.status = :status >>
<< and o.customer_type = :customer_type >>
<< and o.customer_code = :customer_code >>
<< and o.customer_name like concat('%',:customer_name,'%') >>
<< and o.shipper_code = :shipper_code >>
<< and o.shipper_name like concat('%',:shipper_name,'%') >>
<< and o.consignee_code = :consignee_code >>
<< and o.consignee_name like concat('%',:consignee_name,'%') >>
<< and o.order_source = :order_source >>
<< and o.create_time >= :create_time_from >>
<< and o.create_time >= :create_time_to >>
 order by o.modify_time desc