<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <title>成本预算</title>
    </head>
    <body class="body-grey">
        <div class="container">
            <form id="queryFrom" class="layui-form form-search" action="" onsubmit="return false" method="get">
                <div class="row form-group">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">测算编号</label>
                        <input type="text" id="budget_no_query" name="measured_no" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">业务承办部门</label>
                        <input type="text" id="dept_name_query" name="dept_name" autocomplete="off" class="layui-input col-xs-7 popup">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">签订类型</label>
                        <fm:select id="sign_type_query" name="sign_type" dictType="sign_type" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">状态</label>
                        <fm:select id="status_query" name="status" dictType="common_audit_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                    <div class="col-xs-2_4 f0">
                        <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                        <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    </div>
                </div>
            </form>
            <div class="btn-group">
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable"><i class="layui-icon">&#xe605;</i>启用</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable"><i class="layui-icon">&#x1006;</i>停用</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-audit"><i class="layui-icon">&#xe605;</i>审核</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-unaudit"><i class="layui-icon">&#x1006;</i>取消审核</a>
            </div>
            <div class="layui-form">
                <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                    <thead>
                        <tr>
                            <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                            <th>测算编号</th>
                            <th>业务承办部门</th>
                            <th>签订类型</th>
                            <th>客户对象</th>
                            <th>是否开票</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/cust/'}).use('costMeasuredList');
        </script>
    </body>
</html>
