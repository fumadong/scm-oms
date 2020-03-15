<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>客户管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
            	<div class="col-xs-2_4">
                    <label class="control-label col-xs-4">客户代码</label>
                    <input type="text"  id="customer_code" name="customer_code" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">客户简称</label>
                    <input type="text" id="customer_name" name="customer_name" autocomplete="off" class="layui-input col-xs-7">
                </div>
            	<div class="col-xs-2_4">
                    <label class="control-label col-xs-4">客户类型</label>
                    <fm:select id="customer_type" name="customer_type" dictType="customer_type" itemValue="value" itemLabel="label" cssClass="col-xs-7" lay_filter="customer_type"/>
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">税务代码</label>
                    <input type="text" id="tax_code" name="tax_code" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button>
                </div>
            </div>
            <div class="row form-group query-more">
            	 <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">状态</label>
                    <fm:select id="status" name="status" dictType="property_status" itemValue="value" itemLabel="label" cssClass="col-xs-7" lay_filter="status"/>
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">公司电话</label>
                    <input type="text" id="tel" name="tel" autocomplete="off" class="layui-input col-xs-7"  onkeyup="this.value=this.value.replace(/\D/g, '')">
                </div>
                 <!-- <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">办事处</label>
                    <input type="text" id="office" name="office" autocomplete="off" class="layui-input col-xs-7">
                </div> -->
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
                        <th>代码</th>
                        <th>客户简称</th>
                        <th>客户全称</th>
                        <th>客户类型</th>
                       <!--  <th>办事处</th> -->
                        <th>公司电话</th>
                        <th style="width: 200px">地址</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cust/'}).use('csCustomerList');
    </script>
</body>
</html>
