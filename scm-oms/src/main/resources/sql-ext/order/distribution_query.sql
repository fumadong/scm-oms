/*查询订单分配单*/
select a.*, 
	   (a.plan_amount - IFNULL(a.complete_amount, 0)) as remainder_amount
  from (select t.*,
			(SELECT SUM(C.plan_amount) FROM cs_distribution_cargo c WHERE c.distribution_no = t.distribution_no  ) as plan_amount,
			(SELECT SUM(IFNULL(C.complete_amount, 0)) FROM cs_distribution_cargo c WHERE c.distribution_no = t.distribution_no  ) as complete_amount 
  		  from cs_distribution t 
 		 where 1=1
		<< and id in (:ids) >>
		<< and t.order_no = :order_no >>
		<< and t.distribution_no = :distribution_no >>
		<< and t.carrier_code = :carrier_code >>
		<< and t.status = :status >>
		order by t.create_time desc 
	   ) a
