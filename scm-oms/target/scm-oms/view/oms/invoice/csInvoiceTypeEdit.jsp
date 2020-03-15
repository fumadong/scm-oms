<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商维护</title>
    <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
    <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>发票类型代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="invoice_type_code" name="invoice_type_code" lay-verify="required" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>发票类型名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="invoice_type_name" name="invoice_type_name" lay-verify="required" autocomplete="off" maxlength="64" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>收付标识</label>
                    <div class="layui-input-inline">
                        <layui:dictSelect id="rp_flag" type="select" field="rp_flag" cfgKey="rp_flag" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>代收代付</label>
                    <div class="layui-input-inline">
                        <layui:dictSelect id="cp_flag" type="select" field="cp_flag" cfgKey="cp_flag" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">科目名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="account_name" name="account_name" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <%--<div class="layui-inline">
                    <label class="layui-form-label">办事处</label>
                    <div class="layui-input-inline">
                        <input type="text" id="office" name="office" autocomplete="off" class="layui-input">
                    </div>
                </div>--%>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>子目名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="sub_account_name" lay-verify="required" name="sub_account_name" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>税率</label>
                    <div class="layui-input-inline">
                        <input type="text" id="taxrate" lay-verify="required" name="taxrate" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>备注</label>
                    <div class="layui-input-inline">
                        <input type="text" id="remark" lay-verify="required" name="remark" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <%--<div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>联系人电话</label>
                    <div class="layui-input-inline">
                        <input type="text" id="tel" lay-verify="required|tel" name="tel" autocomplete="off" class="layui-input" maxlength="32" onkeyup="value=value.replace(/[^\-?\d]/g, '')">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">地址</label>
                    <div class="layui-input-inline">
                        <div class="sns-addrselector" id="address_select">
                            <input type="hidden" name="province_code" />
                            <input type="hidden" name="province_name" />
                            <input type="hidden" name="city_code" />
                            <input type="hidden" name="city_name" />
                            <input type="hidden" name="county_code" />
                            <input type="hidden" name="county_name" />
                        </div>
                    </div>
                    <div class="layui-form-mid" style="padding-left: 8px">-</div>
                    <div class="layui-input-inline">
                        <input type="text" id="address" name="address" autocomplete="off" class="layui-input" maxlength="32" style="width:249px">
                    </div>
                </div>--%>
               <%-- <div class="layui-inline">
                    <label class="layui-form-label">电子邮箱</label>
                    <div class="layui-input-inline">
                        <input type="text" id="mail" lay-verify="emailExt" name="mail" autocomplete="off" maxlength="32" class="layui-input">
                    </div>
                </div>
                <br/>--%>
               <%-- <div class="layui-inline">
				   <label class="layui-form-label">供应商类型</label>
				   <div class="layui-input-block">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="铁路公司"  checked="">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="物流公司"  checked="">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="船舶公司">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="航空公司">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="船代">
				      <input class="planCheck" type="checkbox" lay-skin="primary" lay-filter="allCheck" title="货代" checked="">
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
        layui.config({base: '${base}/view/oms/invoice/'}).use('csInvoiceTypeEdit');
    </script>
</body>
</html>
