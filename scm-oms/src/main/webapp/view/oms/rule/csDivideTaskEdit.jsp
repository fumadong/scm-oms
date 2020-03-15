<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    <title>分解规则明细维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <input type="hidden" id="id" name="id">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>序号</label>
                    <div class="layui-input-inline">
                        <input type="text" id="task_sequence" name="task_sequence" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>任务类型</label>
                    <div class="layui-input-inline">
                        <input type="text"  id="task_type_code" name="task_type_code" autocomplete="off" class="layui-input col-xs-7 layui-hide">
                        <input type="text" readonly="readonly" id="task_type_name" name="task_type_name" lay-verify="required" autocomplete="off" class="layui-input popup">
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
        layui.config({base: '${base}/view/oms/rule/'}).use('csDivideTaskEdit');
    </script>
</body>
</html>
