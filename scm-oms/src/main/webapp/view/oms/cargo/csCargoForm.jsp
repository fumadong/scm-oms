<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>商品管理</title>
</head>
<body>
    <div class="container foot-mb">
		<div class="layui-collapse" lay-filter="collapse">
			<form class="layui-form" action="" onkeydown="if(event.keyCode==13){return false;}" id="form-add">
				<!-- 基本信息 -->
				<div class="layui-colla-item">
					<h2 class="layui-colla-title">基本信息</h2>
					<div class="layui-colla-content layui-show">
						<div class="layui-form-item ">
							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>商品代码</label>
								<div class="layui-input-inline">
									<input type="text" id="cargo_code_edit" name="cargo_code" autocomplete="off" lay-verify="required" class="layui-input" maxLength="32"/>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>商品名称</label>
								<div class="layui-input-inline">
									<input type="text" id="cargo_name_edit" name="cargo_name" autocomplete="off" lay-verify="required" class="layui-input" maxLength="64">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">货主</label>
								<div class="layui-input-inline">
									<input type="text" id="customer_code_edit" name="customer_code" autocomplete="off" class="layui-input " style="display:none">
									<input type="text" id="customer_name_edit" name="customer_name" autocomplete="off" readonly="readonly" class="layui-input popup">
								</div>
							</div>

							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>包装</label>
								<div class="layui-input-inline">
									<input type="text" id="package_code_edit" name="package_code" autocomplete="off" class="layui-input layui-hide">
									<input type="text" id="package_name_edit" name="package_name" lay-verify="required" autocomplete="off" placeholder="请选择包装" class="layui-input popup col-xs-12" readonly="readonly"/>
								</div>
							</div>
						</div>
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">商品类型</label>
								<div class="layui-input-inline">
									<layui:dictSelect id="cargo_type_edit" type="select" field="cargo_type" cfgKey="cargo_type"/>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">温层</label>
								<div class="layui-input-inline">
									<layui:dictSelect id="warm_layer_edit" type="select" field="warm_layer" cfgKey="warm_layer"/>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">单价</label>
								<div class="layui-input-inline">
									<input type="text" id="price_edit" name="price" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">币别</label>
								<div class="layui-input-inline">
									<layui:dictSelect id="currency_edit" type="select" field="currency" cfgKey="currency"/>
								</div>
							</div>
						</div>
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">包装规格</label>
								<div class="layui-input-inline">
									<input type="text" id="package_specification_edit" name="package_specification" autocomplete="off" class="layui-input" maxLength="64">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">备注</label>
								<div class="layui-input-inline">
									<input type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" maxLength="1024" style="width: 444px;">
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 计量丈量 -->
				<div class="layui-colla-item">
					<h2 class="layui-colla-title">计量丈量</h2>
					<div class="layui-colla-content layui-show">
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">长</label>
								<div class="layui-input-inline">
									<input type="text" id="length_edit" name="length" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">宽</label>
								<div class="layui-input-inline">
									<input type="text" id="width_edit" name="width" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">高</label>
								<div class="layui-input-inline">
									<input type="text" id="height_edit" name="height" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>
						</div>
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">重量</label>
								<div class="layui-input-inline">
									<input type="text" id="weight_edit" name="weight" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">体积</label>
								<div class="layui-input-inline">
									<input type="text" id="volume_edit" name="volume" autocomplete="off" class="layui-input" onkeyup="clearNoNum(this)" maxLength="9">
								</div>
							</div>

						</div>
					</div>
				</div>
				<div class="foot">
					<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="save" code="BC01080201">保存</button>
					<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="saveAndNew" code="BC01080202">保存并新增</button>
					<button  class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" code="BC01080203">关闭</button>
				</div>
			</form>
		</div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cargo/'}).use('csCargoForm');
    </script>
</body>
</html>
