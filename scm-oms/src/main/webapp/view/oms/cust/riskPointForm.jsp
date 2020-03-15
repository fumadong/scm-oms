<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>风险点维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>风险点</label>
                    <div class="layui-input-inline">
                        <input type="text" id="risk_point" name="risk_point" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>风险控制</label>
                    <div class="layui-input-inline">
                        <input type="text" id="risk_control_man" name="risk_control_man" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>反馈周期</label>
                    <div class="layui-input-inline">
                        <input type="text" id="feedback_cycle" name="feedback_cycle" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">控制手段</label>
                    <div class="layui-input-inline">
                        <input type="text" id="control_means" name="control_means" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-inline">
                        <input type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px;">
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
        layui.config({base: '${base}/view/oms/cust/'}).use('riskPointForm');
    </script>
</body>
</html>
