<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/common/meta.jsp" %>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
<title>分解规则维护</title>
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
                            <label class="layui-form-label"><span style="color: red;">*</span>分解规则代码</label>
                            <div class="layui-input-inline">
                                <input type="text" id="code" name="code" lay-verify="required"
                                       autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>分解规则名称</label>
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

                    </div>
                    <div class="foot">
                        <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                        <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
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
                    </div>
                </div>
            </div>
        </form>
        <div class="layui-colla-item">
            <h2 class="layui-colla-title">任务类型</h2>
            <div class="layui-colla-content layui-show">
                <div class="btn-group">
                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add">新增</a>
                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete">删除</a>
                </div>
                <button id="btn-sub-refresh" type="button" hidden="true">刷新列表</button>
                <div class="layui-form">
                    <table id="dataTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                        <thead>
                        <tr>
                            <th width="10"><input type="checkbox" name="" lay-skin="primary"
                                                  lay-filter="allChoose"></th>
                            <th>序号</th>
                            <th>任务代码</th>
                            <th>任务名称</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
<script type="text/javascript">
    layui.config({base: '${base}/view/oms/rule/'}).use('csDivideRuleEdit');
</script>
</body>
</html>
