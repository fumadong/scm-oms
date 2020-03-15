<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>派车单</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
        	<div class="row form-group">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">系统订单号</label>
					<input type="text" id="order_no_query" name="order_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4" style="width: 85px">派车单号</label>
	           		<input type="text" id="dispatch_no_query" name="dispatch_no" autocomplete="off" class="layui-input col-xs-7">
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4">承运商</label>
		            <input type="text" id="carrier_code_query" name="carrier_code" autocomplete="off" class="layui-input layui-hide">
		            <input type="text" id="carrier_name_query" name="carrier_name" autocomplete="off" class="layui-input popup col-xs-7" readonly="readonly">
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4">已生成费用</label>
		        	<fm:select id="is_generate_cost_query" name="is_generate_cost" dictType="yes_no" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
		        	<button class="layui-btn layui-btn-small" id="btn-query" code="">查询</button>
		        	<button class="layui-btn layui-btn-small" type="reset" id="btn-reset" code="">重置</button>
		        	<button class="layui-btn layui-btn-small" id="btn-more" code="">更多</button>
				</div>
			</div>
			<div class="row form-group query-more">
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4" >派车时间从</label>
	        		<input type="text" id="create_time_from_edit" name="create_time" autocomplete="off" class="layui-input laydate-icon col-xs-7"
							onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})" />
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4" style="margin-left: 5px;">派车时间到</label>
	        		<input type="text" id="create_time_to_edit" name="create_time" autocomplete="off" class="layui-input laydate-icon col-xs-7"
							onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
				</div>
			</div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add" code="">手工添加费用</button>
            <button class="layui-btn layui-btn-small" id="btn-fee-cost" code="">费率计算</button>
            <button class="layui-btn layui-btn-small" id="btn-dateTable-refresh" style="display: none;">刷新</button>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>系统订单号</th>
                        <th>分配单号</th>
                        <th>派车单号</th>
                        <th>承运商</th>
                        <th>计划量</th>
                        <th>装货量</th>
                        <th>卸货量</th>
                        <th>磅差</th>
                        <th>派车时间</th>
                        <th>已生成费用</th>
                        <th>备注</th>
                        <th>状态</th>
                        <th style="text-align: center;">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/dispatch/'}).use('csDispatchOrder');
    </script>
</body>
</html>
