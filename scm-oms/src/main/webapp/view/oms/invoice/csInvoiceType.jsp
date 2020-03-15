<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <title>发票</title>
        <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
        <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    </head>
    <body class="body-grey">
        <div class="container">
            <form id="queryFrom" class="layui-form form-search" action="" onsubmit="return false" method="get">
                <div class="row form-group">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">发票类型代码</label>
                        <input type="text" id="invoice_type_code_query" name="invoice_type_code" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">发票类型名称</label>
                        <input type="text" id="invoice_type_name_query" name="invoice_type_name" autocomplete="off" class="layui-input col-xs-7">
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
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable" style="display: none"><i class="layui-icon">&#xe605;</i>启用</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable" style="display: none"><i class="layui-icon">&#x1006;</i>停用</a>
            </div>
            <div class="layui-form">
                <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                    <thead>
                        <tr>
                            <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                            <th>发票类型代码</th>
                            <th>发票类型名称</th>
                            <th>收付标识</th>
                            <th>代收代付</th>
                            <%--<th>办事处</th>--%>
                            <th>科目名称</th>
                            <th>子目名称</th>
                            <th>税率</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/invoice/'}).use('csInvoiceType');
        </script>
    </body>
</html>
