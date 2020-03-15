select t.* from cs_task_type t
where 1 = 1
<< and t.status = :status >>
<< and t.code like concat('%',:code,'%') >>
<< and t.name like concat('%',:name,'%') >>