<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <title>车辆管理</title>
        <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
        <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    </head>
    <body class="body-grey">
        <div class="container">
            <form id="queryFrom" class="layui-form form-search" action="" onsubmit="return false" method="get">
                <div class="row form-group">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">承运商代码</label>
                        <input type="text" id="supplier_code_query" name="supplier_code" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">承运商名称</label>
                        <input type="text" id="supplier_name_query" name="supplier_name" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">承运商类型</label>
                        <fm:select id="supplier_type" name="supplier_type" dictType="supplier_type" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">状态</label>
                        <fm:select id="status" name="status" dictType="property_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                    <div class="col-xs-2_4 f0">
                        <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                        <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                        <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button>
                    </div>
                </div>
                <div class="row form-group query-more">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">结算代码</label>
                        <input type="text" id="settlement_code_query" name="settlement_code" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">所在城市</label>
                        <div class="sns-addrselector col-xs-7" id="to-address">
                            <input type="text" name="province_code" class="hide">
                            <input type="text" name="province_name" class="hide">
                            <input type="text" name="city_code" class="hide">
                            <input type="text" name="city_name" class="hide">
                            <input type="text" name="county_code" class="hide">
                            <input type="text" name="county_name" class="hide">
                        </div>
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
                <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                    <thead>
                        <tr>
                            <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                            <th>承运商代码</th>
                            <th>承运商名称</th>
                            <th>承运商类型</th>
                            <th>结算代码</th>
                            <%--<th>办事处</th>--%>
                            <th>联系人</th>
                            <th>电话</th>
                            <th>所在城市</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/cust/'}).use('supplierList');
        </script>
    </body>
</html>
