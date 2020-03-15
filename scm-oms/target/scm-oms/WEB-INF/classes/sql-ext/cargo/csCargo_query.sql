/*查询包装*/
select * 
  from cs_cargo t
 where 1 = 1
<< and t.id = :id >>
<< and t.id != :id_not >>
<< and t.id in (:ids) >>
<< and t.cargo_code = :cargo_code >>
<< and t.cargo_code like concat('%',:cargo_code,'%') >>
<< and t.cargo_name like concat('%',:cargo_name,'%') >>
<< and t.status = :status >>