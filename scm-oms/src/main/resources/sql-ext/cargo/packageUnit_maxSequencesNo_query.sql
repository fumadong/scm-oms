/*查询包装下的最大包装单位序号*/
select max(t.sequences_no) as max_sequences_no
  from cs_package_unit t
 where t.package_code = :package_code
