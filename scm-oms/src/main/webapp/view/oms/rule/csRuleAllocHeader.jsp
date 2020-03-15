<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>分配规则</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">仓库代码</label>
                    <input type="text"  id="warehouse_code" name="warehouse_code" autocomplete="off" class="layui-input col-xs-7">
                </div>
            	<div class="col-xs-2_4">
                    <label class="control-label col-xs-4">规则代码</label>
                    <input type="text"  id="rule_code" name="rule_code" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">规则名称</label>
                    <input type="text" id="rule_name" name="rule_name" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                </div>
            </div>
        </form>
        <div class="btn-group">
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add">新增</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete">删除</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable">启用</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable">停用</a>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>仓库代码</th>
                        <th>规则代码</th>
                        <th>规则名称</th>
                        <th>发票类型</th>
                        <th>生效时间从</th>
                       <!--  <th>办事处</th> -->
                        <th>生效时间到</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/rule/'}).use('csRuleAllocHeader');
    </script>
</body>
</html>
