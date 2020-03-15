<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>费用名称管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">费用代码</label>
                    <input type="text" id="fee_name_code_query" name="fee_name_code" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">费用名称</label>
                    <input type="text" id="fee_name_query" name="fee_name" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">费用类型</label>
                    <fm:select id="fee_type_query" name="fee_type" dictType="fee_type" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">状态</label>
                    <fm:select id="status_query" name="status" dictType="property_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    <button class="layui-btn layui-btn-small" id="btn-more">更多</button>
                </div>
            </div>
            <div class="row form-group query-more">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">收/付</label>
                    <fm:select id="pay_or_receive_query" name="pay_or_receive" dictType="biz_fee_type" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                </div>
            </div>
        </form>
        <div class="btn-group">
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable"><i class="layui-icon">&#xe605;</i>启用</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable"><i class="layui-icon">&#x1006;</i>停用</a>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>费用代码</th>
                        <th>费用名称</th>
                        <th>费用类型</th>
                        <th>收/付</th>
                        <th>科目代码</th>
                        <th>科目</th>
                        <th>对应科目代码</th>
                        <th class="text-c">核算成本</th>
                        <th class="text-c">传财务系统</th>
                        <th class="text-c">是否加油</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/fee/'}).use('csFeeNameList');
    </script>
</body>
</html>
