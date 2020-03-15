<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>成本测算维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>成本项目</label>
                    <div class="layui-input-inline">
                        <input type="text" id="cost_item" name="cost_item" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>数量</label>
                    <div class="layui-input-inline">
                        <input type="text" id="num" name="num" lay-verify="integer" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>单价</label>
                    <div class="layui-input-inline">
                        <input type="text" id="price" name="price" lay-verify="num" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>成本金额</label>
                    <div class="layui-input-inline">
                        <input type="text" id="cost_amount" name="cost_amount" lay-verify="num" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">计算公式</label>
                    <div class="layui-input-inline">
                        <input type="text" id="formula" name="formula" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-inline">
                        <input type="text" id="remark" name="remark" autocomplete="off" class="layui-input">
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
        layui.config({base: '${base}/view/oms/cust/'}).use('costMeasuredDetailForm');
    </script>
</body>
</html>
