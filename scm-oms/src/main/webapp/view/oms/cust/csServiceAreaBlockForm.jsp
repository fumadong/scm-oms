<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    <title>服务范围区域维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
        	<input type="hidden" id="id" name="id"/>
        	<input type="hidden" id="service_area_code" name="service_area_code"/>
            <div class="layui-form-item">
            	<div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>类型</label>
                    <div class="layui-input-inline">
                        <%-- <layui:dictSelect id="block_type" type="select" lay_filter="onchange" field="block_type" cfgKey="block_type" layVerify="required"/> --%>
                        <fm:select id="block_type" name="block_type" lay_filter="onchange" dictType="block_type" lay_verify="required" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
                    </div>
                </div>
                 <div class="layui-inline addressDetail">
                    <label class="layui-form-label">客户</label>
		        	<div class="layui-input-inline">
	           			<input type="text" id="customer_code" name="customer_code" autocomplete="off" class="layui-input layui-hide">
	           			<input type="text" id="customer_name" name="customer_name" autocomplete="off" placeholder="请选择客户" class="layui-input popup col-xs-12" readonly="readonly"/>
	           		</div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span><span id='addressLable'>地址</span></label>
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
                        <div class="layui-form-mid addressDetail" style="padding-left: 8px">-</div>
                        <div class="layui-input-inline addressDetail">
                            <input type="text" id="address" name="address" autocomplete="off" class="layui-input" style="width:249px">
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">备注</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px;height: 50px;" maxLength="256"></textarea>
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
        layui.config({base: '${base}/view/oms/cust/'}).use('csServiceAreaBlockForm');
    </script>
</body>
</html>
