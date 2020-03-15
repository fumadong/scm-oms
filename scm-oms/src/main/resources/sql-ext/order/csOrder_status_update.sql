update cs_order 
   set status = :status, 
       modifier = :modifier 
 where id in (:ids)