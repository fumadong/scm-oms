<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
        <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
        <title>合同费率维护</title>
    </head>
    <body>
        <div class="container foot-mb">
            <form class="layui-form" action="" id="form-add">
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>费用名称</label>
                        <div class="layui-input-inline">
                            <input type="text" id="fee_name" name="fee_name" lay-verify="required" autocomplete="off" class="layui-input popup" readonly>
                            <input type="hidden" id="fee_name_code" name="fee_name_code" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>类型</label>
                        <div class="layui-input-inline">
                            <layui:dictSelect id="contract_fee_type" type="select" field="contract_fee_type" cfgKey="contract_fee_type" layVerify="required" disable="disabled"/>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>区间从</label>
                        <div class="layui-input-inline">
                            <input type="text" id="interval_from" name="interval_from" lay-verify="num" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>区间到</label>
                        <div class="layui-input-inline">
                            <input type="text" id="interval_to" name="interval_to" lay-verify="num" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>单价</label>
                        <div class="layui-input-inline">
                            <input type="text" id="fee_unit" name="fee_unit" lay-verify="num" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>保底价</label>
                        <div class="layui-input-inline">
                            <input type="text" id="reserve_price" name="reserve_price" lay-verify="num" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>有效期从</label>
                        <div class="layui-input-inline">
                            <input type="text" id="start_time" name="start_time" lay-verify="required|date" autocomplete="off" class="layui-input laydate-icon">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>有效期到</label>
                        <div class="layui-input-inline">
                            <input type="text" id="end_time" name="end_time" lay-verify="required|date" autocomplete="off" class="layui-input laydate-icon">
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
            layui.config({base: '${base}/view/oms/cust/'}).use('CsCustomerContractFeeForm');
        </script>
    </body>
</html>
