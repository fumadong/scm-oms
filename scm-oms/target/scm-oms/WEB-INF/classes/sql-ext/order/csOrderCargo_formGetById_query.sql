/**订单商品编辑查询**/
SELECT
	c.*, 
	u.quantity AS package_uom_quantity
FROM
	cs_order_cargo c
 LEFT JOIN cs_package_unit u ON c.package_code = u.package_code
  AND u.code = c.package_uom_code
WHERE 1 = 1
<<AND c.id = :id>>