select 
       t.* 
  from cs_order_task t 
 where 1=1 
<< and t.id in (:ids) >>
<< and t.order_id = :order_id >>
<< and t.order_no = :order_no >>
<< and t.order_id in (:order_ids) >>
<< and t.interface_event = :interface_event >>