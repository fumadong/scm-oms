<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>科目维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
            	<input type=text id="id" name="id" class="layui-hide"/>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>科目代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="subject_code" name="subject_code" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>科目名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="subject_name" name="subject_name" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">是否传个人</label>
                    <div class="layui-input-inline">
                        <fm:select id="is_personal" name="is_personal" dictType="yes_no" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">是否传车辆</label>
                    <div class="layui-input-inline">
                        <fm:select id="is_project" name="is_project" dictType="yes_no" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">是否传客户</label>
                    <div class="layui-input-inline">
                        <fm:select id="is_customer" name="is_customer" dictType="yes_no" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                </div>
            </div>
            <div class="foot">
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="save">保存</button>
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="saveAndNew">保存并新增</button>
                <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
            </div>
        </form>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/fee/'}).use('csSubjectForm');
    </script>
</body>
</html>
