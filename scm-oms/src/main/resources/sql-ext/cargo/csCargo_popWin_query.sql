select t.*,
	   u.code as unit_code,
	   u.name as unit_name ,
	   u.quantity as unit_quantity
  from cs_cargo t
  left join cs_package_unit u on u.package_code = t.package_code and u.is_default = '1'
 where 1=1 
<< and t.cargo_code like concat('%',:cargo_code,'%') >>
<< and t.cargo_name like concat('%',:cargo_name,'%') >>
<< and ( t.customer_code= :customer_code or t.customer_code is null ) >>