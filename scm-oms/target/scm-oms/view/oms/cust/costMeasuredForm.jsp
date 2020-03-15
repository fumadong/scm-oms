<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>成本测算维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-collapse" lay-filter="collapse">
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">基本信息</h2>
                    <div class="layui-colla-content layui-show">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>业务承办部门</label>
                                <div class="layui-input-inline">
                                    <input type="hidden" id="dept_no" name="dept_no" autocomplete="off" class="layui-input">
                                    <input type="text" id="dept_name" name="dept_name" autocomplete="off" class="layui-input popup">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>测算表编号</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="measured_no" name="measured_no" autocomplete="off" class="layui-input" disabled placeholder="系统自动生成">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">签订类型</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="sign_type" type="select" field="sign_type" cfgKey="sign_type"/>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>客户签订对象</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="customer_name" name="customer_name" lay-verify="required" autocomplete="off" class="layui-input popup" readonly>
                                    <input type="hidden" id="customer_code" name="customer_code" autocomplete="off" class="layui-input">
                                </div>
                            </div><br>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>业务员</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="operator" name="operator" lay-verify="required" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>审核状态</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="status" type="select" field="status" cfgKey="common_audit_status" disable="disabled"/>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>创建时间</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="create_time" name="create_time" autocomplete="off" disabled class="layui-input laydate-icon" onclick="layui.laydate({elem: this})">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">风险提醒人</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="risk_warning_man" name="risk_warning_man" autocomplete="off" class="layui-input">
                                </div>
                            </div><br>
                            <div class="layui-inline">
                                <label class="layui-form-label">总成本</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="total_cost" name="total_cost" lay-verify="num" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">税率</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="tax_rate" name="tax_rate" lay-verify="num" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">是否开票</label>
                                <div class="layui-input-inline">
                                    <input id="is_billing" type="checkbox" name="is_billing" lay-skin="primary" value="1">
                                </div>
                            </div><br>
                            <div class="layui-inline">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab layui-tab-card" lay-filter="test" style="margin-top: 5px;">
                    <ul class="layui-tab-title">
                        <li class="layui-this" lay-id="11">成本测算明细</li>
                        <li lay-id="22">风险点</li>
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <div class="layui-colla-content layui-show">
                                <div class="btn-group">
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-addDetail"><i class="layui-icon">&#xe654;</i> 新增</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-deleteDetail"><i class="layui-icon">&#xe640;</i> 删除</a>
                                </div>
                                <div class="layui-form">
                                    <table id="detailTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                                        <thead>
                                            <tr>
                                                <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                                                <th>成本项目</th>
                                                <th>数量</th>
                                                <th>单价</th>
                                                <th>成本金额</th>
                                                <th>计算公式</th>
                                                <th>备注</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-item">
                            <div class="layui-colla-content layui-show">
                                <div class="btn-group">
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-addRiskPoint"><i class="layui-icon">&#xe654;</i> 新增</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-deleteRiskPoint"><i class="layui-icon">&#xe640;</i> 删除</a>
                                </div>
                                <div class="layui-form">
                                    <table id="riskPointTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                                        <thead>
                                            <tr>
                                                <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                                                <th>风险点</th>
                                                <th>控制手段</th>
                                                <th>风险控制人</th>
                                                <th>反馈周期</th>
                                                <th>备注</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
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
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cust/'}).use('costMeasuredForm');
    </script>
</body>
</html>
