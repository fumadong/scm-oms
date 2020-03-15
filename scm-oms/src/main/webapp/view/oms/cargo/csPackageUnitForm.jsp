<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>包装-包装单位弹窗-维护弹窗</title>
</head>
<body>
<div class="container foot-mb">
	<form class="layui-form" action="" id="form-edit">
		<!-- 表单明细区域 -->
		<div class="layui-form-item">
			<!-- 第一行 -->
			<div class="layui-inline">
				<label class="layui-form-label">序号</label>
				<div class="layui-input-inline">
					<input type="text" id="sequences_no" name="sequences_no" disabled="disabled" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>是否默认</label>
				<div class="layui-input-inline">
					<fm:select id="is_default" name="is_default" lay_filter="yes_no" dictType="yes_no" lay_verify="required" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
				</div>
			</div>
			<!-- 第二行 -->
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>单位代码</label>
				<div class="layui-input-inline">
					<input type="text" id="code" name="code" lay-verify="required" autocomplete="off" maxLength="32" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>单位名称</label>
				<div class="layui-input-inline">
					<input type="text" id="name" name="name" lay-verify="required" maxLength="32" autocomplete="off" class="layui-input">
				</div>
			</div>
			<!-- 第三行 -->
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>数量</label>
				<div class="layui-input-inline">
					<input type="text" id="quantity" name="quantity" onkeyup="this.value=this.value.replace(/[^0-9]+/,'');" maxLength="8" lay-verify="required|number" autocomplete="off" class="layui-input">
				</div>
			</div>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-save" id="save">保存</button>
			<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
		</div>
	</form>
</div>
<script type="text/javascript">
	layui.config({base: '${base}/view/oms/cargo/'}).use(['csPackageUnitForm']);
</script>
</body>
</html>