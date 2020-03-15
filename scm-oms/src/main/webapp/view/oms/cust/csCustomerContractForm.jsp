<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>合同维护</title>
    <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
    <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    <style type="text/css">
        .mt4 .layui-form-checkbox[lay-skin=primary] {
            margin-top: -4px;
        }

        .mt6 .layui-form-checkbox[lay-skin=primary] {
            margin-top: 6px;
        }
    </style>
</head>
<body>
    <div class="container foot-mb">
        <div class="layui-form" action="" id="form-add">
            <div class="layui-collapse" lay-filter="collapse">
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">基本信息</h2>
                    <div class="layui-colla-content layui-show">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>合同编号</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_code" name="contract_code" autocomplete="off" class="layui-input" placeholder="系统自动生成" disabled>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">合同版本</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_version" name="contract_version" lay-verify="num" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>合同名称</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_name" name="contract_name" lay-verify="required" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="status" type="select" field="status" cfgKey="contract_status" disable="disabled"/>
                                </div>
                            </div>
                            <%--<div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>合同类型</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="contract_type" type="select" field="contract_type" cfgKey="contract_type" layVerify="required"/>
                                </div>
                            </div>--%><br/>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>承运商</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="customer_name" name="customer_name" lay-verify="required" autocomplete="off" class="layui-input popup" readonly>
                                    <input type="hidden" id="customer_code" name="customer_code" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>签订时间</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="sign_time" name="sign_time" lay-verify="required" autocomplete="off" class="layui-input laydate-icon" onclick="layui.laydate({elem: this})">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>签订人</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="sign_personnel" name="sign_personnel" lay-verify="required" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>联系电话</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="tel" name="tel" lay-verify="required|tel" autocomplete="off" class="layui-input" onkeyup="value=value.replace(/[^\-?\d]/g, '')">
                                </div>
                            </div><br/>
                            <div class="layui-inline">
                                <label class="layui-form-label">合同业务量</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_number" name="contract_number" autocomplete="off" class="layui-input" onkeyup="value=value.replace(/[^\d]/g, '')">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>有效期起始日</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_date_from" name="contract_date_from" lay-verify="required|date" autocomplete="off" class="layui-input laydate-icon">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>有效期终止日</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="contract_date_to" name="contract_date_to" lay-verify="required|date" autocomplete="off" class="layui-input laydate-icon">
                                </div>
                            </div>
                            <%--<div class="layui-inline">
                                <label class="layui-form-label">付款方式</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="payment_method" type="select" field="payment_method" cfgKey="pay_type" defaultVal=""/>
                                </div>
                            </div>--%>
                            <div class="layui-inline">
                                <label class="layui-form-label">结算方式</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="account_type" type="select" field="account_type" cfgKey="charge_mode" defaultVal=""/>
                                </div>
                            </div>
                            <%--<div class="layui-inline">
                                <label class="layui-form-label"><span style="color: red;">*</span>重量取值方式</label>
                                <div class="layui-input-inline">
                                    <layui:dictSelect id="weight_type" type="select" field="weight_type" cfgKey="weight_type" layVerify="required"/>
                                </div>
                            </div>--%><br/>

                            <div class="layui-inline">
                                <label class="layui-form-label">截单日</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="dealine_day" name="day" autocomplete="off" lay-verify="day" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">账期</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="account_period" name="account_period" autocomplete="off" lay-verify="integer" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">账期日</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="account_period_day" name="account_period_day" lay-verify="integer" autocomplete="off" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-inline">
                                <label class="layui-form-label">是否含税</label>
                                <div class="layui-input-inline mt4">
                                    <input id="is_tax" type="checkbox" name="is_tax" lay-skin="primary" value="1">
                                    <div class="layui-inline">
                                        <label class="layui-form-label" style="width: 110px;">框架合同</label>
                                        <div class="layui-input-inline mt6" style="width: 0">
                                            <input id="is_frame_contract" type="checkbox" name="is_frame_contract" lay-skin="primary" value="1">
                                        </div>
                                    </div>
                                </div>
                            </div><br/>
                            <div class="layui-inline">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">应收计费协议</h2>
                    <div class="layui-colla-content layui-show">
                        <div id="queryPositionForm" class="layui-form form-search" style="padding-top: 5px;">
                            <div class="row form-group">
                                <div class="col-xs-2_4">
                                    <label class="control-label col-xs-4">起运地</label>
                                    <div class="sns-addrselector col-xs-7" id="from-address">
                                        <input type="text" id="from_province_code" name="from_province_code" style="display: none">
                                        <input type="text" id="from_province" name="from_province" style="display: none">
                                        <input type="text" id="from_city_code" name="from_city_code" style="display: none">
                                        <input type="text" id="from_city" name="from_city" style="display: none">
                                        <input type="text" id="from_county_code" name="from_county_code" style="display: none">
                                        <input type="text" id="from_county" name="from_county" style="display: none">
                                    </div>
                                </div>
                                <div class="col-xs-2_4">
                                    <label class="control-label col-xs-4">目的地</label>
                                    <div class="sns-addrselector col-xs-7" id="to-address">
                                        <input type="text" id="to_province_code" name="to_province_code" style="display: none">
                                        <input type="text" id="to_province" name="to_province" style="display: none">
                                        <input type="text" id="to_city_code" name="to_city_code" style="display: none">
                                        <input type="text" id="to_city" name="to_city" style="display: none">
                                        <input type="text" id="to_county_code" name="to_county_code" style="display: none">
                                        <input type="text" id="to_county" name="to_county" style="display: none">
                                    </div>
                                </div>
                                <div class="col-xs-2_4 f0">
                                    <button class="layui-btn layui-btn-small" id="btn-queryPosition" type="button">查询</button>
                                    <button class="layui-btn layui-btn-small" id="btn-resetPosition" type="button">重置</button>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group" style="border-top: 1px solid #e2e2e2;">
                            <div class="col-xs-4">
                                <div class="btn-group">
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-addPosition"><i class="layui-icon">&#xe654;</i> 新增</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-deletePosition"><i class="layui-icon">&#xe640;</i> 删除</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-uploadFeeRate"><i class="layui-icon">&#xe6eb;</i> 导入</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-downloadFeeRate"><i class="layui-icon">&#xe653;</i> 下载</a>
                                </div>
                                <div class="layui-form">
                                    <table id="positionTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                                        <thead>
                                            <tr>
                                                <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                                                <th>起运地</th>
                                                <th>目的地</th>
                                                <th>商品</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div class="col-xs-8">
                                <div class="btn-group" style="margin-left: 5px;">
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-addFee"><i class="layui-icon">&#xe654;</i>新增</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-deleteFee"><i class="layui-icon">&#xe640;</i>删除</a>
                                </div>
                                <div class="layui-form" style="margin-left: 5px;">
                                    <input type="hidden" id="positionId" value="0">
                                    <table id="feeTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                                        <thead>
                                            <tr>
                                                <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                                                <th>费用名称</th>
                                                <th>区间</th>
                                                <th>单价</th>
                                                <th>保底价</th>
                                                <th style="width: 180px;">有效期</th>
                                                <th>类型</th>
                                                <th>状态</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab layui-tab-card" lay-filter="test" style="margin-top: 5px;">
                    <ul class="layui-tab-title">
                        <li class="layui-this" lay-id="11">合同条款</li>
                        <li lay-id="22">附件信息</li>
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <textarea id="contract_clause" name="contract_clause" placeholder="请输入合同条款" class="layui-textarea" style="min-height: 300px;"></textarea>
                        </div>
                        <div class="layui-tab-item">
                            <div class="layui-colla-content layui-show">
                                <div class="btn-group">
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-upload">上传</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-download">下载</a>
                                    <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-deleteAttach">删除</a>
                                </div>
                                <div class="layui-form">
                                    <table id="attachDateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                                        <thead>
                                            <tr>
                                                <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                                                <th>序号</th>
                                                <th>附件名称</th>
                                                <th>上传时间</th>
                                                <!-- <th>操作</th> -->
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
                <button class="layui-btn layui-btn-small" id="form-audit">审核</button>
                <button class="layui-btn layui-btn-small layui-btn-primary" id="form-unAudit">取消审核</button>
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
            </div>
        </form>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/cust/'}).use('csCustomerContractForm');
    </script>
</body>
</html>
