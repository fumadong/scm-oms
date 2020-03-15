<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
        <title>合同管理</title>
    </head>
    <body class="body-grey">
        <div class="container">
            <form class="layui-form form-search" action="" onsubmit="return false" method="get">
                <div class="row form-group">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">合同编号</label>
                        <input type="text" id="contract_code_query" name="contract_code" autocomplete="off" class="layui-input  col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">合同名称</label>
                        <input type="text" id="contract_name_query" name="contract_name" autocomplete="off" class="layui-input  col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">承运商</label>
                        <input type="hidden" id="customer_code_query" name="customer_code" autocomplete="off" class="layui-input  col-xs-7">
                        <input type="text" id="customer_name_query" name="customer_name" autocomplete="off" class="layui-input  col-xs-7 popup">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">状态</label>
                        <fm:select id="status_query" name="status" dictType="contract_status" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                    <div class="col-xs-2_4 f0">
                        <button class="layui-btn layui-btn-small" id="btn-query">查询</button>
                        <button class="layui-btn layui-btn-small" id="btn-reset" type="reset">重置</button>
                        <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-more">更多</button>
                    </div>
                </div>
                <div class="row form-group query-more">
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">签订人</label>
                        <input type="text" id="sign_personnel_query" name="sign_personnel" autocomplete="off" class="layui-input col-xs-7">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">签订时间从</label>
                        <input type="text" id="sign_time_start_query" name="sign_time_start" autocomplete="off" class="layui-input col-xs-7 laydate-icon">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">签订时间到</label>
                        <input type="text" id="sign_time_end_query" name="sign_time_end" autocomplete="off" class="layui-input col-xs-7 laydate-icon">
                    </div>
                    <div class="col-xs-2_4">
                        <label class="control-label col-xs-4">框架合同</label>
                        <fm:select id="is_frame_contract_query" name="is_frame_contract" dictType="is_frame_contract" itemLabel="label" itemValue="value" cssClass="col-xs-7"></fm:select>
                    </div>
                </div>
            </form>
            <div class="btn-group">
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add"><i class="layui-icon">&#xe654;</i>新增</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete"><i class="layui-icon">&#xe640;</i>删除</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-enable"><i class="layui-icon">&#xe605;</i>启用</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-disable"><i class="layui-icon">&#x1006;</i>停用</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-audit"><i class="layui-icon">&#xe605;</i>审核</a>
                <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-unaudit"><i class="layui-icon">&#x1006;</i>取消审核</a>
            </div>
            <div class="layui-form">
                <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                    <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>合同编号</th>
                        <th>合同名称</th>
                        <th>承运商</th>
                        <th>签订时间</th>
                        <th>签订人</th>
                        <th>电话</th>
                        <th>框架合同</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/cust/'}).use('customerContractList');
        </script>
    </body>
</html>
