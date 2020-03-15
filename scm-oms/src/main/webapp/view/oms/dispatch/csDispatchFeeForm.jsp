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
	        	<label class="layui-form-label"><span class="c-red">*</span>费用名称</label>
	        	<div class="layui-input-inline">
					<input type="text" id="fee_code_edit" name="fee_code" autocomplete="off" class="layui-input layui-hide">
           			<input type="text" id="fee_name_edit" name="fee_name" autocomplete="off" class="layui-input popup col-xs-12" 
           				readonly="readonly" lay-verify="required"/>
           		</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">费用类型</label>
				<div class="layui-input-inline">
					<fm:select id="fee_type_edit" name="fee_type" dictType="fee_type" itemValue="value" itemLabel="label" cssClass="col-xs-7" disabled="true"/>
				</div>
			</div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label"><span class="c-red">*</span>结算对象</label>
	        	<div class="layui-input-inline">
					<input type="text" id="balance_code_edit" name="balance_code" autocomplete="off" class="layui-input layui-hide">
           			<input type="text" id="balance_name_edit" name="balance_name" autocomplete="off" class="layui-input popup col-xs-12" 
           				readonly="readonly" lay-verify="required"/>
           		</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">币别</label>
				<div class="layui-input-inline" >
					<fm:select id="currency_edit" name="currency" lay_filter="currency" dictType="currency" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">舍入方式</label>
				<div class="layui-input-inline" >
					<fm:select id="rounding_way_edit" name="rounding_way" dictType="currency" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
				</div>
			</div>
			<div class="layui-inline" >
				<label class="layui-form-label">税率</label>
				<div class="layui-input-inline">
					<input type="text" id="tax_rate_edit" onkeyup="if(isNaN(value))execCommand('undo')" maxLength="15" name="tax_rate" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">单价</label>
				<div class="layui-input-inline">
					<input type="text" id="unit_price_edit" onkeyup="if(isNaN(value))execCommand('undo')" maxLength="15" name="unit_price" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">数量</label>
				<div class="layui-input-inline">
					<input type="text" id="count_edit" onkeyup="this.value=this.value.replace(/\D/g, '')" maxLength="15" name="count" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>总费用</label>
				<div class="layui-input-inline">
					<input type="text" id="total_amount_edit" onkeyup="if(!this.value.match(/^[\+\-]?\d*?\.?\d*?$/))this.value=this.t_value;else this.t_value=this.value;if(this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/))this.o_value=this.value" 
							name="total_amount" maxLength="9" lay-verify="required" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline"> 
        		<label class="layui-form-label">备注</label>
       			<input type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width:444px;" maxLength="256">
       			<input type="text" id="unique_no_edit" name="unique_no" style="display: none;" class="layui-input">
			</div>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-save" id="btn-fee-save" >保存</button>
			<button class="layui-btn layui-btn-small" type="reset" id="btn-fee-reset" >重置</button>
			<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" >关闭</button>
		</div>
	</form>
</div>
<script type="text/javascript">
	layui.config({
		base: '${base}/view/oms/dispatch/' //你的模块目录
	}).use('csDispatchFeeForm'); //加载入口
</script>
</body>
</html>