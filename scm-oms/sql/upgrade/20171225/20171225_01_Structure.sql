ALTER TABLE `cs_divide_task` ADD `divide_rule_id` int(11) DEFAULT NULL COMMENT '分解规则表Id';

ALTER TABLE `cs_divide_rule` ADD `order_type` varchar(32) DEFAULT NULL COMMENT '任务类型';
ALTER TABLE `cs_divide_rule` ADD `warehouse_code` varchar(32) DEFAULT NULL COMMENT '仓库代码';
ALTER TABLE `cs_divide_rule` ADD `warehouse_name` varchar(64) DEFAULT NULL COMMENT '仓库名称';

ALTER TABLE `cs_issue_rule` ADD `warehouse_code` varchar(32) DEFAULT NULL COMMENT '仓库代码';
ALTER TABLE `cs_issue_rule` ADD `warehouse_name` varchar(64) DEFAULT NULL COMMENT '仓库名称';