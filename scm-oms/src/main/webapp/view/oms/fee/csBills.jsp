<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>账单管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
        	<div class="row form-group">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">账单号</label>
					<input type="text" id="bill_no_query" name="bill_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4">承运商</label>
		            <input type="text" id="carrier_code_query" name="carrier_code" autocomplete="off" class="layui-input layui-hide">
		            <input type="text" id="carrier_name_query" name="carrier_name" autocomplete="off" class="layui-input popup col-xs-7" readonly="readonly">
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4" >生成时间从</label>
	           		<input type="text" id="create_time_from_query" name="create_time" autocomplete="off" class="layui-input col-xs-7 laydate-icon" onclick="layui.laydate({elem: this})">
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4">生成时间到</label>
		        	<input type="text" id="create_time_to_query" name="create_time" autocomplete="off" class="layui-input col-xs-7 laydate-icon" onclick="layui.laydate({elem: this})">
				</div>
				<div class="col-xs-2_4"> 
		        	<button class="layui-btn layui-btn-small" id="btn-query" code="">查询</button>
		        	<button class="layui-btn layui-btn-small" type="reset" id="btn-reset" code="">重置</button>
		        	<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more" code="">更多</button>
				</div>
			</div>
			<div class="row form-group query-more">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">账期</label>
					<fm:select id="account_period_query" name="account_period" dictType="account_period" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">状态</label>
					<fm:select id="bill_status_query" name="bill_status" dictType="bill_status" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
				</div>
			</div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add" code="">新增</button>
            <button class="layui-btn layui-btn-small" id="btn-delete" code="">删除</button>
            <button class="layui-btn layui-btn-small" id="btn-bill-confirm" code="">账单确认</button>
            <button class="layui-btn layui-btn-small" id="btn-dateTable-refresh" style="display: none;">刷新</button>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>账单号</th>
                        <th>承运商</th>
                        <th>账单总金额</th>
                        <th>账期</th>
                        <th>备注</th>
                        <th>状态</th>
                        <th style="text-align: center;">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/fee/'}).use('csBills');
    </script>
</body>
</html>
