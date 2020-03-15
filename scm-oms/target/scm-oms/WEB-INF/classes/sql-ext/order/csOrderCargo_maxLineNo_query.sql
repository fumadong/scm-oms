/*查询商品明细的最大行号*/
select max(t.line_no) as max_line_no
  from cs_order_cargo t
 where t.order_id = :order_id