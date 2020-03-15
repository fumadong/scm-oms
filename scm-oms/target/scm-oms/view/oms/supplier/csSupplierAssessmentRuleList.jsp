<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核规则</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">规则名称</label>
                    <input type="text" id="rule_name_query" name="rule_name" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">状态</label>
                    <fm:select id="status_query" name="status" dictType="property_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query" code="">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset" code="">重置</button>
                    <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more" code="">更多</button>
                </div>
            </div>
            <div class="row form-group query-more">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">备注</label>
                    <input type="text" id="remark_query" name="remark" autocomplete="off" class="layui-input col-xs-7">
                </div>
            </div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add" code=""><i class="layui-icon">&#xe654;</i> 新增</button>
            <button class="layui-btn layui-btn-small" id="btn-delete" code=""><i class="layui-icon">&#xe640;</i> 删除</button>
            <button class="layui-btn layui-btn-small" id="btn-enable" code=""><i class="layui-icon">&#xe605;</i> 启用</button>
            <button class="layui-btn layui-btn-small" id="btn-disable" code=""><i class="layui-icon">&#x1006;</i> 停用</button>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>规则名称</th>
                        <th>有效期从</th>
                        <th>有效期到</th>
                        <th>备注</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/supplier/'}).use('csSupplierAssessmentRuleList');
    </script>
</body>
</html>
