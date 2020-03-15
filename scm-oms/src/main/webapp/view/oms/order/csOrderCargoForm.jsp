<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%> 
<title>编辑商品</title>
</head>
<body>
<div class="container foot-mb">
	<form class="layui-form" action id="form-add">
		<div class="layui-form-item">
			<div class="layui-inline">
                <label class="layui-form-label">行号</label>
                <div class="layui-input-inline">
                    <input type="text" id="line_no" name="line_no" autocomplete="off" class="layui-input layui-input-disabled">
                </div>
            </div>
			<div class="layui-inline"> 
	        	<label class="layui-form-label"><span class="c-red">*</span>商品</label>
	        	<div class="layui-input-inline">
					<input type="text" id="cargo_code" name="cargo_code" autocomplete="off" class="layui-input layui-hide">
           			<input type="text" id="cargo_name" name="cargo_name" autocomplete="off" placeholder="请选择商品" class="layui-input popup col-xs-12" 
           				readonly="readonly" lay-verify="required"/>
           		</div>
			</div>
			<div class="layui-inline">
				<label class="layui-form-label">商品类型</label>
				<div class="layui-input-inline">
					<fm:select id="cargo_type" name="cargo_type" dictType="cargo_type" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
				</div>
			</div>
			<div class="layui-inline">
             	<label class="layui-form-label">包装规格</label>
             	<div class="layui-input-inline">
                 	<input type="text"  id="package_code" name="package_code" autocomplete="off" class="layui-input col-xs-7 layui-hide">
                 	<input type="text" readonly="readonly" id="package_name" name="package_name" lay-verify="required" autocomplete="off" class="layui-input layui-input-disabled popup">
             	</div>
         	</div>
         	<div class="layui-inline">
             	<label class="layui-form-label"><span style="color: red;">*</span>包装单位</label>
             	<div class="layui-input-inline">
                 	<input type="text"  id="package_uom_quantity" name="package_uom_quantity" autocomplete="off" class="layui-input col-xs-7 layui-hide">
                 	<input type="text"  id="package_uom_code" name="package_uom_code" autocomplete="off" class="layui-input col-xs-7 layui-hide">
                	<input type="text" readonly="readonly" id="package_uom_name" name="package_uom_name" lay-verify="required" autocomplete="off" class="layui-input popup">
             	</div>
         	</div>
			
			<div class="layui-inline">
				<label class="layui-form-label"><span class="c-red">*</span>件数</label>
				<div class="layui-input-inline"><!--  onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');" -->
					<input type="text" id="quantity" name="quantity" lay-verify="required|number" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-inline">
	         	<label class="layui-form-label">EA数</label>
	            <div class="layui-input-inline">
	        		 <input type="text" readonly="readonly" id="ea_quantity" name="ea_quantity" autocomplete="off" class="layui-input layui-input-disabled">
	          	</div>
			</div>
		</div>
		<!-- 按钮栏 -->
		<div class="foot">
			<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-save">保存</button>
			<button  class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
		</div>
	</form>
</div>
<script type="text/javascript">
	layui.config({
		base: '${base}/view/oms/order/' //你的模块目录
	}).use('csOrderCargoForm'); //加载入口
</script>
</body>
</html>