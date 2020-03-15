<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>订单管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
				<%--<div class="col-xs-2_4">
					<label class="control-label col-xs-4">客户订单号</label>
					<input type="text" id="customer_order_no" name="customer_order_no" autocomplete="off" class="layui-input col-xs-7"/>
				</div>--%>
				<div class="col-xs-4">
					<label class="control-label col-xs-2">订单号</label>
					<textarea type="text" id="order_no" name="order_no" autocomplete="off" placeholder="最多可输入十个订单号，请以逗号，空格或回车隔开" style="resize: none;" class="layui-input col-xs-9" maxLength="1024"></textarea>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">委托客户</label>
					<input type="text" id="customer_code_query" name="customer_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
					<input type="text" id="customer_name_query" name="customer_name" autocomplete="off" placeholder="请选择委托客户" readonly="readonly" class="layui-input col-xs-7 popup">
				</div>
				<div class="col-xs-2_4">
		        	<label class="control-label col-xs-4">订单类型</label>
	           		<fm:select id="order_type" name="order_type" dictType="order_type" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
				</div>
				<div class="col-xs-2_4"> 
		        	<button class="layui-btn layui-btn-small" id="btn-query">查询</button>
		        	<button class="layui-btn layui-btn-small" type="reset" id="btn-reset">重置</button>
		        	<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button>
				</div>
			</div>
				
			<div class="row form-group query-more">
				<div class="col-xs-2_4">
					<label class="control-label col-xs-4" >创建时间从</label>
					<input type="text" id="create_time_from" name="create_time_from" autocomplete="off" class="layui-input laydate-icon col-xs-7"
						   onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})" />
				</div>
				<div class="col-xs-2_4">
					<label class="control-label col-xs-4" style="margin-left: 5px;">创建时间从</label>
					<input type="text" id="create_time_to" name="create_time_to" autocomplete="off" class="layui-input laydate-icon col-xs-7"
						   onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
				</div>
			</div>
        </form>
        <div class="btn-group">
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th style="width: 130px">订单号</th>
                        <th style="width: 50px">状态</th>
                        <th style="width: 100px">委托客户</th>
                        <th style="width: 80px">下单时间</th>
						<th style="width: 80px">订单类型</th>
                        <th style="width: 30px">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <!-- layui规范化用法 -->
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/track/'}).use('csOrderTrack');
    </script>
</body>
</html>
