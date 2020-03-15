<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%> 
<!-- 照片上传 -->
<link rel="stylesheet" href="${base}/static/frame/webuploader/webuploader.css" type="text/css">
<script type="text/javascript" src="${base}/static/frame/webuploader/webuploader.min.js"></script>

<title>费用</title>
</head>
<body>
<div class="container foot-mb">
	<form class="layui-form" action id="form-add">
		<div class="layui-form-item">
			<div class="layui-inline"> 
	        	<label class="layui-form-label">系统订单号</label>
	        	<div class="layui-input-inline">
					<input type="text" id="order_no_edit" name="order_no" autocomplete="off" class="layui-input">
           		</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label">派车单号</label>
	        	<div class="layui-input-inline">
					<input type="text" id="dispatch_no_edit" name="dispatch_no" autocomplete="off" class="layui-input">
           		</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label">分配单号</label>
	        	<div class="layui-input-inline">
					<input type="text" id="distribution_no_edit" name="distribution_no" autocomplete="off" class="layui-input">
           		</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label">账期</label>
	        	<div class="layui-input-inline">
					<fm:select id="account_period_edit" name="account_period" dictType="account_period" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
           		</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label">费用时间从</label>
	        	<div class="layui-input-inline">
					<input type="text" id="occur_time_from" name="occur_time" autocomplete="off" class="layui-input laydate-icon" onclick="layui.laydate({elem: this})">
           		</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label">费用时间到</label>
	        	<div class="layui-input-inline">
					<input type="text" id="occur_time_to" name="occur_time" autocomplete="off" class="layui-input laydate-icon" onclick="layui.laydate({elem: this})">
           		</div>
			</div>
		</div>
		<div class="layui-form-item" style="padding-left: 30px;">
			<button class="layui-btn layui-btn-small" id="btn-fee-query" >查询</button>
			<button class="layui-btn layui-btn-small" type="reset" id="btn-fee-reset" >重置</button>
		</div>
		<div class="layui-form-item" style="padding-top: 5px;">
			<table id="feeTable" class="layui-table" lay-even="" width="100%" lay-skin="line" >
				<thead>
					<tr>
						<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
						<th>系统订单号</th>
						<th>分配单号</th>
						<th>派车单号</th>
						<th>费用名称</th>
						<th>费用类型</th>
						<th>金额</th>
						<th>发生时间</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-save" id="btn-fee-add" >添加</button>
			<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" >关闭</button>
		</div>
	</form>
</div>
<script type="text/javascript">
	layui.config({
		base: '${base}/view/oms/fee/' //你的模块目录
	}).use('addFeeForm'); //加载入口
</script>
</body>
</html>