select t.* from cs_divide_task t
where 1 = 1
<if is_not_empty(divide_rule_id) >
  and t.divide_rule_id = :divide_rule_id
<else>
  and t.divide_rule_id is null
</if>
<< and t.id = :id >>
<< and t.task_type_code = :task_type_code >>
<< and t.task_sequence = :task_sequence >>
<< and t.id != (:noid) >>
order by t.task_sequence