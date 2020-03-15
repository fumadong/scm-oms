<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/common/meta.jsp" %>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
<title>下发规则维护</title>
</head>
<body>
<div class="container foot-mb">
    <div class="layui-collapse" lay-filter="collapse">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-colla-item">
                <h2 class="layui-colla-title">基本信息</h2>
                <div class="layui-colla-content layui-show">
                    <div class="layui-form-item">
                        <input type="hidden" id="id" name="id"/>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>下发规则代码</label>
                            <div class="layui-input-inline">
                                <input type="text" id="code" name="code" lay-verify="required"
                                       autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>下发规则名称</label>
                            <div class="layui-input-inline">
                                <input type="text" id="name" name="name" lay-verify="required"
                                       autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>优先级</label>
                            <div class="layui-input-inline">
                                <input type="number" id="priority" name="priority" lay-verify="required"
                                       autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">状态</label>
                            <div class="layui-input-inline">
                                <layui:dictSelect id="status" type="select" field="status" cfgKey="property_status" disable="disabled"/>
                            </div>
                        </div>
                        <%--<div class="layui-inline"  style="width: 550px;">
                            <label class="layui-form-label">接口类</label>
                            <div class="layui-input-inline">
                                <input type="text" id="interface_class" name="interface_class"
                                       autocomplete="off" style="width: 444px;" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">接口地址</label>
                            <div class="layui-input-inline">
                                <input type="text" id="interface_url" name="interface_url"
                                       autocomplete="off" class="layui-input">
                            </div>
                        </div>--%>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>接口类型</label>
                            <div class="layui-input-inline">
                            	<layui:dictSelect id="interface_event" type="select" field="interface_event" cfgKey="interface_event" layVerify="required"/>
                                <!-- <fm:select id="interface_event" name="interface_event" dictType="interface_event" lay_filter="interface_event" lay_verify="required" itemValue="value" itemLabel="label"></fm:select> -->
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-inline">
                                <textarea id="remark" name="remark" autocomplete="off" class="layui-input" lay-verify="" style="width: 444px;" maxlength="256"></textarea>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="layui-colla-item">
                <h2 class="layui-colla-title">规则条件</h2>
                <div class="layui-colla-content layui-show">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">订单类型</label>
                            <div class="layui-input-inline">
                                <layui:dictSelect id="order_type" type="select" field="order_type" cfgKey="order_type"/>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">客户</label>
                            <div class="layui-input-inline">
                                <input type="text" id="customer_code" name="customer_code" autocomplete="off" class="layui-input layui-hide">
                                <input type="text" id="customer_name" name="customer_name" autocomplete="off" placeholder="请选择客户" class="layui-input popup col-xs-12" readonly="readonly"/>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">承运商</label>
                            <div class="layui-input-inline">
                                <input type="text" id="carrier_code" name="carrier_code" autocomplete="off" class="layui-input layui-hide">
                                <input type="text" id="carrier_name" name="carrier_name" autocomplete="off" placeholder="请选择承运商" class="layui-input popup col-xs-12" readonly="readonly"/>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">仓库</label>
                            <div class="layui-input-inline">
                                <input type="text" id="warehouse_code" name="warehouse_code" autocomplete="off" class="layui-input layui-hide">
                                <input type="text" id="warehouse_name" name="warehouse_code" autocomplete="off" placeholder="请选择仓库" class="layui-input popup col-xs-12" readonly="readonly"/>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">任务类型</label>
                            <div class="layui-input-inline">
                                <input type="text"  id="task_type_code" name="task_type_code" autocomplete="off" class="layui-input col-xs-7 layui-hide">
                                <input type="text" readonly="readonly" id="task_type_name" name="task_type_name" autocomplete="off" class="layui-input popup">
                            </div>
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
</div>
<script type="text/javascript">
    layui.config({base: '${base}/view/oms/rule/'}).use('csIssueRuleEdit');
</script>
</body>
</html>
