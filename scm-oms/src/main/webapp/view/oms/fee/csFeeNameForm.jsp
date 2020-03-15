<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>费用名称维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>费用代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="fee_name_code" name="fee_name_code" lay-verify="required" autocomplete="off" class="layui-input" disabled>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>费用名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="fee_name" name="fee_name" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>费用类型</label>
                    <div class="layui-input-inline">
                        <layui:dictSelect id="fee_type" type="select" field="fee_type" cfgKey="fee_type" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>收/付</label>
                    <div class="layui-input-inline">
                        <layui:dictSelect id="pay_or_receive" type="select" field="pay_or_receive" cfgKey="biz_fee_type" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>借/贷</label>
                    <div class="layui-input-inline">
                   		<fm:select id="borrow_loan" name="borrow_loan" lay_filter="onchange" dictType="borrow_loan" lay_verify="required" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">税率</label>
                    <div class="layui-input-inline">
                        <input type="text" id="tax_rate" name="tax_rate" lay-verify="num" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">科目代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="subject_code" name="subject_code" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">科目</label>
                    <div class="layui-input-inline">
                        <input type="text" id="subject_name" name="subject_name" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>核算成本</label>
                    <div class="layui-input-inline">
                    	<layui:dictSelect id="is_cost_accounting" type="select" field="is_cost_accounting" cfgKey="yes_no" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>传财务系统</label>
                    <div class="layui-input-inline">
                    	<layui:dictSelect id="is_submit_financial_system" type="select" field="is_submit_financial_system" cfgKey="yes_no" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">是否加油</label>
                    <div class="layui-input-inline">
                    	<layui:dictSelect id="is_fueling_up" type="select" field="is_fueling_up" cfgKey="yes_no"/>
                    </div>
                </div>
                <div class="layui-inline" id="outerSubjectDiv" style="display:none">
                    <label class="layui-form-label">对应科目</label>
                    <div class="layui-input-inline">
                    	<input type="text"  id="outer_subject_code" name="outer_subject_code" autocomplete="off" class="layui-input layui-hide">
	                	<input type="text"  id="outer_subject_name" name="outer_subject_name" autocomplete="off" class="layui-input popup">
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
        layui.config({base: '${base}/view/oms/fee/'}).use('csFeeNameForm');
    </script>
</body>
</html>
