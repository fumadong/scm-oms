<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>科目管理</title>
</head>
<body>
    <div class="container mb-0">
        <form class="layui-form form-search pd-0" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-4">
                    <label class="control-label col-xs-4">代码</label>
                    <input type="text" id="subject_code" name="subject_code" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-4">
                    <label class="control-label col-xs-4">名称</label>
                    <input type="text" id="subject_name" name="subject_name" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-4 f0 text-r">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                </div>
            </div>
        </form>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>科目代码</th>
                        <th>科目名称</th>
                        <th class="text-c">是否传个人</th>
                        <th class="text-c">是否传车辆</th>
                        <th class="text-c">是否传客户</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/fee/'}).use('csSubjectWin');
    </script>
</body>
</html>
