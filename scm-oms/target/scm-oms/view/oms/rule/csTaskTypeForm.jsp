<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    <title>任我类型维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>任务代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="code" name="code" lay-verify="required" autocomplete="off" class="layui-input" disabled>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>任务名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="name" name="name" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
	             <div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">备注</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width: 444px;height: 50px;" maxLength="256"></textarea>
						</div>
					</div>
				</div>
            </div>
            <div class="foot">
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
            </div>
        </form>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/rule/'}).use('csTaskTypeForm');
    </script>
</body>
</html>
