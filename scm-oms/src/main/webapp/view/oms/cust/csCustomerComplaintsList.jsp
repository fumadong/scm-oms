<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
	<title>客户投诉管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
            	<div class="col-xs-2_4">
                    <label class="control-label col-xs-4">投诉编号</label>
                    <input type="text" id="complaints_no_query" name="complaints_no" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">投诉类型</label>
                    <div class="layui-input-inline col-xs-7">
                        <layui:dictSelect id="complaints_type_query" type="select" field="complaints_type" cfgKey="complaints_type"/>
                    </div>
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">投诉人</label>
                    <input type="text" id="complainant_query" name="complainant" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">处理状态</label>
                    <div class="layui-input-inline col-xs-7">
                        <layui:dictSelect id="complaints_status_query" type="select" field="complaints_status" cfgKey="complaints_status"/>
                    </div>
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                    <button class="layui-btn layui-btn-small" id="btn-more">更多</button>
                </div>
            </div>
            <div class="row form-group query-more">
               <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">单据号</label>
                    <input type="text"  id="bill_no_query" name="bill_no" autocomplete="off" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">司机</label>
                    <input type="text" id="drive_name_query" name="drive_name" autocomplete="off" class="layui-input col-xs-7"  onkeyup="this.value=this.value.replace(/\D/g, '')">
                </div>
                <div class="col-xs-2_4">
                   <label class="control-label col-xs-4">车牌号</label>
                   <input type="text" id="vehicle_no_query" name="vehicle_no" autocomplete="off" class="layui-input col-xs-7">
               </div>
            </div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</button>
            <button class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</button>
            <button class="layui-btn layui-btn-small" id="btn-handle">处理</button>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line" style="table-layout:fixed;WORD-BREAK:break-all;WORD-WRAP:break-word">
                <thead>
                    <tr>
	                    <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
	                    <th>投诉编号</th>
	                    <th>单据类型</th>
	                    <th>单据号</th>
	                    <th>投诉类型</th>
	                    <th>投诉人</th>
	                    <th>投诉时间</th>
	                    <th>承运商</th>
	                    <th>司机</th>
	                    <th>车牌号</th>
	                    <th>发生时间</th>
	                    <th>状态</th>
	                    <th>投诉内容</th>
	                    <th>备注</th>
	                    <th>操作</th>
	                </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cust/'}).use('csCustomerComplaintsList');
    </script>
</body>
</html>    
