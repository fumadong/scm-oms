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
                        <label class="layui-form-label">起运地<span style="color: red;">*</span></label>
                        <div class="layui-input-inline"> <!-- style="width:444px;" -->
                            <div class="sns-addrselector" id="from-address-select">
                                <input type="hidden" name="from_province_code" >
                                <input type="hidden" name="from_province" >
                                <input type="hidden" name="from_city_code" >
                                <input type="hidden" name="from_city" >
                                <input type="hidden" name="from_county_code" >
                                <input type="hidden" name="from_county" >
                            </div>
                        </div>
                    </div>
                    <div class="layui-inline">
                    	<label class="layui-form-label" style="width:10px;text-align:center;">-</label>
                    	<div class="layui-input-inline">
                            <input type="text" id="from_address" name="from_address" autocomplete="off" class="layui-input" style="width:240px">
                        </div>
                    </div><br/>
                    <%--<div class="layui-inline">
                        <label class="layui-form-label">详细地址</label>
                        <div class="layui-input-inline">
                            <input type="text" id="from_address" name="from_address" autocomplete="off" class="layui-input">
                        </div>
                    </div>--%>
                    <div class="layui-inline">
                        <label class="layui-form-label">目的地<span style="color: red;">*</span></label>
                        <div class="layui-input-inline"> <!-- style="width:444px;" -->
                            <div class="sns-addrselector" id="to-address-select">
                                <input type="hidden" name="to_province_code" >
                                <input type="hidden" name="to_province" >
                                <input type="hidden" name="to_city_code" >
                                <input type="hidden" name="to_city" >
                                <input type="hidden" name="to_county_code" >
                                <input type="hidden" name="to_county" >
                            </div>
                        </div>
                    </div>
                    <div class="layui-inline">
                    	<label class="layui-form-label" style="width:10px;text-align:center;">-</label>
                    	<div class="layui-input-inline">
                            <input type="text" id="to_address" name="to_address" autocomplete="off" class="layui-input" style="width:240px">
                        </div>
                    </div><br/>
                    <div class="layui-inline">
                        <label class="layui-form-label">商品</label>
                        <div class="layui-input-inline">
                            <input type="text" id="cargo_name" name="cargo_name" autocomplete="off" class="layui-input popup" readonly>
                            <input type="hidden" id="cargo_code" name="cargo_code" autocomplete="off" class="layui-input">
                        </div>
                    </div><br/>
                    <div class="layui-inline">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-inline">
                            <textarea id="remark" name="remark" placeholder="" class="layui-textarea" maxlength="256" style="width: 444px"></textarea>
                        </div>
                    </div>
                    <%--<div class="layui-inline">
                        <label class="layui-form-label">详细地址</label>
                        <div class="layui-input-inline">
                            <input type="text" id="to_address" name="to_address" autocomplete="off" class="layui-input">
                        </div>
                    </div>--%>
                </div>
                <div class="foot">
                    <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                    <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
                </div>
            </form>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/cust/'}).use('CsCustomerContractPositionForm');
        </script>
    </body>
</html>
