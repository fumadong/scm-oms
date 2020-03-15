/*查询包装单位*/
select * 
  from cs_package_unit t
 where 1 = 1
<< and t.id = :id >>
<< and t.id != :id_not >>
<< and t.code = :code >>
<< and t.package_code = :package_code >>
<< and t.is_default = :is_default >>
order by t.sequences_no
