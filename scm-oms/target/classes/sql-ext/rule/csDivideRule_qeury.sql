select t.* from cs_divide_rule t
where 1 = 1
<< and t.status = :status >>
<< and t.id = :id >>
<< and t.code like concat('%',:code,'%') >>
<< and t.name like concat('%',:name,'%') >>
<< and t.id != (:noid) >>