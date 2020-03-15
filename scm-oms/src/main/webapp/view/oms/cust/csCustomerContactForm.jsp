<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>客户管理</title>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>    
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
        	<input type="hidden" id="id" name="id"/>
        	<input type="hidden" id="customer_id" name="customer_id"/>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>联系人代码</label>
                        <div class="layui-input-inline">
                            <input type="text" id="contact_code" name="contact_code" lay-verify="required" maxLength="32" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>联系人名称</label>
                        <div class="layui-input-inline">
                            <input type="text" id="contact_name" name="contact_name" lay-verify="required" maxLength="64" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">手机</label>
                        <div class="layui-input-inline">
                            <input type="text" id="mobile" onkeyup="this.value=this.value.replace(/\D/g, '')" name="mobile" maxLength="32" autocomplete="off" class="layui-input" lay-verify="phone" >
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">电话</label>
                        <div class="layui-input-inline">
                            <input type="text" id="tel" name="tel" autocomplete="off" class="layui-input" lay-verify="tel" maxLength="32" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">
                        </div>
                    </div>
                   <div class="layui-inline">
                        <label class="layui-form-label">QQ</label>
                        <div class="layui-input-inline">
                            <input type="text" id="qq" name="qq" autocomplete="off" class="layui-input" lay-verify="" maxLength="32" onkeyup="this.value=this.value.replace(/[^0-9]+/,'');">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">微信</label>
                        <div class="layui-input-inline">
                            <input type="text" id="weixin" name="weixin" autocomplete="off" class="layui-input" maxLength="32" lay-verify="">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">邮箱</label>
                        <div class="layui-input-inline">
                            <input type="text" id="mail" name="mail" autocomplete="off" class="layui-input" maxLength="32" lay-verify="mail">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">默认联系人</label>
                        <div class="layui-input-inline">
                            <!-- <input type="checkbox" id="is_default" name="is_default" autocomplete="off"> -->
                             <fm:select id="is_default" name="is_default" dictType="yes_no" itemValue="value" itemLabel="label"/>
                        </div>
                    </div>
                    <div class="row form-group">
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
                            <input type="text" id="address" name="address" autocomplete="off" maxLength="32" class="layui-input" style="width:249px">
                        </div>
                    </div>
                </div>
            <div class="foot">
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                <button  class="layui-btn layui-btn-small layui-btn-primary" type="button" onclick="layer_close()">关闭</button>
            </div>
        </form>
    </div>
    <script type="text/javascript">
    	$("select[name='dateTable_length']").attr("lay-ignore","");
        layui.config({base: '${base}/view/oms/cust/'}).use(['csCustomerContactForm']);
    </script>
</body>
</html>
