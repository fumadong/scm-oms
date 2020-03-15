select 
	 o.* 
  from cs_order o
 where 1 = 1 
<< and o.id = :id >>
<< and o.id in (:ids) >>
<< and o.order_no = :order_no >>
<< and o.order_no in (:order_nos) >>