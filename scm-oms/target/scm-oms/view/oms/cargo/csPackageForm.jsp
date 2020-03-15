<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>包装详情</title>
</head>
<body>
<div class="container foot-mb">
	<div class="layui-collapse" lay-filter="collapse">
		<!-- 包装信息 -->
		<form class="layui-form" action="" id="form-add">
			<!-- 基本信息 -->
			<div class="layui-colla-item">
		        <h2 class="layui-colla-title">基本信息</h2>
		        <div class="layui-colla-content layui-show"> 
					<div class="layui-form-item">
						<!-- 第一行 -->
						<div class="layui-inline">
							<label class="layui-form-label"><span class="c-red">*</span>包装代码</label>
							<div class="layui-input-inline">
								<input type="text" id="code" name="code" lay-verify="required" autocomplete="off" class="layui-input"  maxLength="32"/>
							</div>
						</div>
						<div class="layui-inline">
				        	<label class="layui-form-label"><span class="c-red">*</span>包装名称</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="name" name="name" lay-verify="required" autocomplete="off" class="layui-input"  maxLength="64"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">包装类型</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="type" name="type" dictType="package_type" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
			           		</div>
						</div>
						<!-- 第二行 -->
						<div class="layui-inline"> 
				        	<label class="layui-form-label">备注</label>
		           			<textarea type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px; height:60px" maxLength="255"></textarea>
						</div>
					</div>
				</div>
				
				<!-- 底部按钮 -->
				<div class="foot"> 
					<button class="layui-btn layui-btn-small" id="btn-save" lay-submit="" lay-filter="form-save">保存</button>
					<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
				</div>
			</div>
		</form>
		
		<!-- 子表信息 Start -->
		<div class="layui-colla-item">
			<!-- 包装单位 -->
			<h2 class="layui-colla-title">包装单位</h2>
			<div class="layui-colla-content layui-show">
				<div class="btn-group" id="unit-toolbar" style="display: none;">
					<a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-unit-add"><i class="layui-icon">&#xe654;</i>新增</a>
					<a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-unit-delete"><i class="layui-icon">&#xe640;</i>删除</a>
				</div>
				<div class="layui-form">
					<table id="unitTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
						<thead>
							<tr>
								<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
								<th>序号</th>
								<th>单位代码</th>
								<th>单位名称</th>
								<th>数量</th>
								<th>是否默认</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- 子表信息 End -->
	</div>
</div>
<script type="text/javascript">
	layui.config({base: '${base}/view/oms/cargo/'}).use('csPackageForm');
</script> 
</body>
</html>