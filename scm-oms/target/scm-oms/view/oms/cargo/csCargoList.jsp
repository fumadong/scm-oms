<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>商品管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
            	<div class="col-xs-2_4">
                    <label class="control-label col-xs-4">商品代码</label>
                    <input type="text"  id="cargo_code" name="cargo_code" autocomplete="off" class="layui-input  col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">商品名称</label>
                    <input type="text" id="cargo_name" name="customer_name" autocomplete="off" class="layui-input col-xs-7">
                </div>
            	 <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">商品类型</label>
                    <fm:select id="cargo_type" name="cargo_type" dictType="cargo_type" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">状态</label>
                    <fm:select id="status" name="status" dictType="property_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>   
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query" code="BC01080101">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset" code="BC01080102">重置</button>
                    <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more" code="BC01080103">更多</button>
                </div>
            </div>
            <div class="row form-group query-more">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">货主</label>
                    <input type="text"  id="customer_code" name="customer_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
	               	<input type="text" readonly="readonly" id="customer_name" name="customer_name" autocomplete="off" class="layui-input col-xs-7 popup">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">包装规格</label>
                    <input type="text" id="package_specification" name="package_specification" autocomplete="off" class="layui-input col-xs-7">
                </div>
            </div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add" code="BC01080104"><i class="layui-icon">&#xe654;</i>新增</a>
            <button class="layui-btn layui-btn-small" id="btn-delete" code="BC01080105"><i class="layui-icon">&#xe640;</i>删除</a>
            <button class="layui-btn layui-btn-small" id="btn-enable" code="BC01080106"><i class="layui-icon">&#xe605;</i>启用</a>
            <button class="layui-btn layui-btn-small" id="btn-disable" code="BC01080107"><i class="layui-icon">&#x1006;</i>停用</a>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line" style="table-layout:fixed;WORD-BREAK:break-all;WORD-WRAP:break-word">
                <thead>
                    <tr>
                        <th width="16"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>商品代码</th>
                        <th>商品名称</th>
                        <th>货主</th>
                        <th>包装规格</th>
                        <th>商品类型</th>
                        <th>温层</th>
                        <th>备注</th>
                        <th class="text-center">状态</th>
                        <th class="text-center">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cargo/'}).use('csCargoList');
    </script>
</body>
</html>
