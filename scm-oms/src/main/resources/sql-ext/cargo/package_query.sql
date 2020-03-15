/*查询包装*/
select * 
  from cs_package t
 where 1 = 1
<< and t.id = :id >>
<< and t.id != :id_not >>
<< and t.code = :code >>
<< and t.code like concat('%',:code_like,'%') >>
<< and t.name like concat('%',:name,'%') >>
<< and t.type = :type >>