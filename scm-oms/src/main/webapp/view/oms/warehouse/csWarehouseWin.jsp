<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <title>仓库弹出框</title>
    </head>
    <body>
        <div class="container mb-0">
            <form class="layui-form form-search pd-0" action="" onsubmit="return false" method="get">
                <div class="row form-group">
                    <div class="col-xs-4">
                        <label class="control-label col-xs-4">仓库代码</label>
                        <input type="text" id="warehouse_code" name="warehouse_code" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-4">
                        <label class="control-label col-xs-4">仓库名称</label>
                        <input type="text" id="warehouse_name" name="warehouse_name" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-4 f0 text-r">
                        <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                        <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    </div>
                </div>
            </form>
            <div class="layui-form">
                <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                    <thead>
                        <tr>
                            <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                            <th>仓库代码</th>
                            <th>仓库名称</th>
                            <th>仓库类型</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/warehouse/'}).use('csWarehouseWin');
        </script>
    </body>
</html>
