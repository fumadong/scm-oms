<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<title>包装管理</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">包装代码</label>
					<input type="text" id="code_like" name="code_like" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
					<label class="control-label col-xs-4">包装名称</label>
					<input type="text" id="name" name="name" autocomplete="off" class="layui-input col-xs-7"/>
				</div>
				<div class="col-xs-2_4"> 
		        	<label class="control-label col-xs-4">包装类型</label>
	           		<fm:select id="type" name="type" dictType="package_type" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
				</div>
				<div class="col-xs-2_4"> 
		        	<button class="layui-btn layui-btn-small" id="btn-query">查询</button>
		        	<button class="layui-btn layui-btn-small" type="reset" id="btn-reset">重置</button>
				</div>
			</div>
        </form>
        <div class="btn-group">
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</a>
            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</a>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>包装代码</th>
                        <th>包装名称</th>
                        <th>包装类型</th>
                        <th>备注</th>
                        <th style="width: 30px">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <!-- layui规范化用法 -->
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cargo/'}).use('csPackage');
    </script>
</body>
</html>
