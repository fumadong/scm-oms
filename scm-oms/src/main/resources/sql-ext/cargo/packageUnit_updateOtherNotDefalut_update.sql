/*设置包装下的包装单位除指定单位代码外的包装单位是否默认为否*/
update cs_package_unit 
   set is_default = '0' 
 where package_code = :package_code 
   and code != :code