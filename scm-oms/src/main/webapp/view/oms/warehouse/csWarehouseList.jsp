<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>费用名称管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
			 <div class="row form-group">
			     <div class="col-xs-2_4">
			         <label class="control-label col-xs-4">仓库代码</label>
			         <input type="text" id="warehouse_code" name="warehouse_code" autocomplete="off" class="layui-input col-xs-7">
			     </div>
			     <div class="col-xs-2_4">
			         <label class="control-label col-xs-4">仓库名称</label>
			         <input type="text" id="warehouse_name" name="warehouse_name" autocomplete="off" class="layui-input col-xs-7">
			     </div>
			     <div class="col-xs-2_4">
			         <label class="control-label col-xs-4">上级仓库</label>
			         <input type="text" id="superior_warehouse_name" name="superior_warehouse_name" autocomplete="off" class="layui-input col-xs-7">
			     </div>
			     <div class="col-xs-2_4">
			     	<label class="control-label col-xs-4">覆盖范围</label>
			     	<input type="text" id="service_area_code" name="service_area_code" autocomplete="off" class="layui-input col-xs-7" style="display:none">
			     	<input type="text" id="service_area_name" name="service_area_name" autocomplete="off" placeholder="请选择覆盖范围" readonly="readonly" class="layui-input col-xs-7 popup">
			     </div>
			     <div class="col-xs-2_4 f0">
			     	<button class="layui-btn layui-btn-small" id="btn-query">查询</button>
			     	<button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
			     	<button class="layui-btn layui-btn-small" id="btn-more">更多</button>
			     </div>
			 </div>
			 <div class="row form-group query-more">
			 	 <div class="col-xs-2_4">
			         <label class="control-label col-xs-4">状态</label>
                    <fm:select id="status_query" name="status" dictType="property_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
			     </div>
			 </div>
		</form>
        <div class="btn-group">
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable"><i class="layui-icon">&#xe605;</i>启用</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable"><i class="layui-icon">&#x1006;</i>停用</a>
        </div>
        <div class="layui-form">
        	<table id="dataTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
        		<thead>
        			<tr>
        				<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
        				<th>仓库名称</th>
        				<th>上级仓库</th>
        				<th>覆盖范围</th>
        				<th>仓库类型</th>
        				<th>仓库电话</th>
        				<th>仓库面积(㎡)</th>
        				<th>仓库库容(m³)</th>
        				<th>地址</th>
        				<th>状态</th>
        				<th>操作</th>
        			</tr>
        		</thead>
        	</table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/warehouse/'}).use('csWarehouseList');
    </script>
</body>
</html>
