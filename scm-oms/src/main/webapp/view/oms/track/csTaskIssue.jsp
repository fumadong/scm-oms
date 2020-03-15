<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>任务下发记录</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">客户订单号</label>
					<input type="text" id="customer_order_no_query" name="customer_order_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">系统订单号</label>
					<input type="text" id="order_no_query" name="order_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">系统任务号</label>
					<input type="text" id="order_task_no_query" name="order_task_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">委托客户</label>
					<input type="text" id="customer_code_query" name="customer_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
					<input type="text" id="customer_name_query" name="customer_name" autocomplete="off" placeholder="请选择委托客户" readonly="readonly" class="layui-input col-xs-7 popup">
				</div>
				<div class="col-xs-2_4"> 
		        	<button class="layui-btn layui-btn-small" id="btn-query">查询</button>
		        	<button class="layui-btn layui-btn-small" type="reset" id="btn-reset">重置</button>
		        	<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button>
				</div>
			</div>
				
			<div class="row form-group query-more">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">发货客户</label>
					<input type="text" id="shipper_code_query" name="shipper_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
           			<input type="text" id="shipper_name_query" name="shipper_name" autocomplete="off" placeholder="请选择或输入客户" class="layui-input col-xs-7 popup"/>
           			<span class="search-icon" id="shipper_name_query_icon"></span>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">收货客户</label>
					<input type="text" id="consignee_code_query" name="consignee_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
           			<input type="text" id="consignee_name_query" name="consignee_name" autocomplete="off" placeholder="请选择或输入客户" class="layui-input col-xs-7 popup"/>
					<span class="search-icon" id="consignee_name_query_icon"></span>
				</div>
			</div>
        </form>
        <div class="btn-group">
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-reissue"><i class="layui-icon">&#xe609;</i>重新下发</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-log"><i class="layui-icon">&#xe605;</i>查看下发日志</a>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th style="width: 130px">任务号/订单号</th>
                        <th style="width: 100px">任务类型</th>
                        <th style="width: 50px">状态</th>
                        <th style="width: 50px">尝试下发次数</th>
                        <th style="width: 100px">下发时间</th>
                        <th style="width: 100px">委托客户</th>
                        <th style="width: 180px">收发客户</th>
                        <th style="width: 100px">仓库</th>
                        <th style="width: 100px">承运商</th>
                        <th style="width: 100px">下单时间</th>
                        <th style="width: 30px">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <!-- layui规范化用法 -->
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/track/'}).use('csTaskIssue');
    </script>
</body>
</html>
