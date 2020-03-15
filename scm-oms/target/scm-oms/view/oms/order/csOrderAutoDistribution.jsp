<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%> 
<title>订单管理-订单分配弹窗</title>
</head>
<body>
<div class="container">
	<form class="layui-form" id="distribution">
		<!-- 订单信息 -->
		<fieldset class="layui-elem-field site-demo-button">
        	<legend style="font-size: 15px;">订单信息</legend>
        	<div class="layui-form-item">
        		<label class="layui-form-label" id="total-info" style="width: 100%;text-align: left;">订单信息加载中</label>
         	</div>
        	<!-- <div class="layui-form-item">
        		<label class="layui-form-label" id="total-info" style="color:red;width: 100%;text-align: left;">本次分配数量0</label>
         	</div> -->
         	
        </fieldset>
		<!-- 承运商分配列表 -->
		<div class="layui-form-item">
			<table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>承运商</th>
                        <th>流向</th>
                        <th>时效</th>
                        <!-- <th>保底费用/里程单价</th> -->
                        <th>分配量*</th>
                        <th>要求开始日期</th>
                        <th>要求结束日期</th>
                    </tr>
                </thead>
            </table>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-confirm" id="confirm">确认</button>
			<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
		</div>
	</form>
</div>
<script type="text/javascript">
	layui.config({base: '${base}/view/oms/order/'}).use('csOrderAutoDistribution');
</script>
</body>
</html>