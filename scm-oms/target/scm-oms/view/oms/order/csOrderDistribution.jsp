<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%> 
<title>订单管理-订单分配弹窗</title>
</head>
<body>
<div class="container">
	<form class="layui-form" style="float: left;" id="distribution">
		<!-- 左侧：承运商分配情况饼状图 -->
		<div style="width:49%; float: left;320px">
			<fieldset class="layui-elem-field layui-field-title" style="width: 100%; height: 100%; border-bottom: 1px solid #D9D9D9; border-left: 1px solid #D9D9D9; border-right: 1px solid #D9D9D9;">
				<legend style="font-size: 15px;">已分配供货商比例</legend>
				<div class="layui-colla-item" style="width: 100%;background-color:#ffffff; margin-top: 10px;float: left;">
					<div class="layui-show">
						<div id="carrier-distribution-monitor" style="height: 250px; width: 100%;"></div>
						<div id="carrier-distribution-monitor-no-datas" style="height: 250px; width: 100%;display: none;">
							<div style='text-align:center;padding-top: 80px;'>无数据</div>
						</div>
					</div>
				</div>
			</fieldset>
		</div>
		
		<!-- 右侧：分配信息表单 -->
		<div class="layui-form-item" style="width:49%; height:284px; float: right; clear: right; ">
			<fieldset class="layui-elem-field layui-field-title" style="width: 100%; height: 100%; border: 1px solid #D9D9D9;">
				<legend style="font-size: 15px;"><label id="dispatch_form_title"></label></legend>
				<div style="width: 100%;float: left; padding-top: 10px; padding-bottom: 10px">
					<div class="layui-inline">
						<label class="layui-form-label"><span class="c-red">*</span>供货商</label>
						<div class="layui-input-inline">
							<input type="text" id="carrier_code" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
							<input type="text" id="carrier_name" name="carrier_name" autocomplete="off" lay-verify="required" class="layui-input popup" readonly="readonly">
						</div>
					</div>
					<div class="layui-inline">
						<label class="layui-form-label"><span class="c-red">*</span>分配量</label>
						<div class="layui-input-inline">
							<input type="text" id="plan_amount" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');" name="plan_amount" lay-verify="required|number" autocomplete="off" class="layui-input">
						</div>
					</div>
					<div class="layui-inline"> 
			        	<label class="layui-form-label"><span class="c-red">*</span>要求开始日期</label>
			        	<div class="layui-input-inline">
		           			<input type="text" id="require_time_from" name="require_time_from" lay-verify="required" autocomplete="off" 
		           				class="layui-input laydate-icon" onclick="layui.laydate({elem: this})"/>
		           		</div>
					</div>
					<div class="layui-inline"> 
			        	<label class="layui-form-label"><span class="c-red">*</span>要求结束日期</label>
			        	<div class="layui-input-inline">
		           			<input type="text" id="require_time_to" name="require_time_to" lay-verify="required" autocomplete="off" 
		           				class="layui-input laydate-icon" onclick="layui.laydate({elem: this})"/>
		           		</div>
					</div>
					<div class="layui-inline"> 
			        	<label class="layui-form-label">备注</label>
	           			<textarea type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px; height: 60px;" maxLength="1024"></textarea>
					</div>
				</div>
			</fieldset>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-confirm" id="confirm">确认</button>
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-confirm" id="confirm-and-continue">确认并继续分配</button>
			<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
		</div>
	</form>
</div>
<script src="${base}/static/frame/echarts/echarts.min.js"></script>
<script type="text/javascript">
	layui.config({base: '${base}/view/oms/order/'}).use('csOrderDistribution');
</script>
</body>
</html>