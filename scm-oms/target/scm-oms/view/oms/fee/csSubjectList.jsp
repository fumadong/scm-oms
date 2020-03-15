<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>科目管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">科目代码</label>
                    <input type="text" id="subject_code" name="subject_code" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">科目名称</label>
                    <input type="text" id="subject_name" name="subject_name" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    <!-- <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button> -->
                </div>
            </div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</button>
            <button class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</button>
        </div>
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
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/fee/'}).use('csSubjectList');
    </script>
</body>
</html>
