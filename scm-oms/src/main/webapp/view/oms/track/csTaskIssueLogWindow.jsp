<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>客户联系人弹出框</title>
</head>
<body>
	<div class="container mb-0">
		<!-- 订单信息
		<fieldset class="layui-elem-field site-demo-button">
	       	<legend style="font-size: 15px;">订单信息</legend>
	       	<div class="layui-form-item">
	       		<label class="layui-form-label" id="total-info" style="width: 100%;text-align: left;">订单信息加载中</label>
	        </div>
	    </fieldset> -->
		<div class="layui-form">
			<table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
				<thead>
					<tr>
						<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
						<th>状态</th>
						<th>下发时间</th>
						<th>操作人</th>
						<th>接口消息</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
	<script type="text/javascript">
        layui.config({base: '${base}/view/oms/track/'}).use('csTaskIssueLogWindow');
    </script>
</body>
</html>