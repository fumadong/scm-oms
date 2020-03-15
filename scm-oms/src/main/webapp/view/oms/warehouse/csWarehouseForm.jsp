<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    <title>仓库管理维护</title>
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>仓库代码</label>
                    <div class="layui-input-inline">
                        <input type="text" id="warehouse_code" name="warehouse_code" lay-verify="required" autocomplete="off" class="layui-input" disabled>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>仓库名称</label>
                    <div class="layui-input-inline">
                        <input type="text" id="warehouse_name" name="warehouse_name" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label"><span style="color: red;">*</span>仓库类型</label>
                    <div class="layui-input-inline">
                        <layui:dictSelect id="warehouse_type" type="select" field="warehouse_type" cfgKey="warehouse_type" layVerify="required"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">状态</label>
                    <div class="layui-input-inline">
                    	<layui:dictSelect id="status" type="select" field="status" cfgKey="property_status" disable="disabled"/>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">上级仓库</label>
		        	<div class="layui-input-inline">
	           			<input type="text" id="superior_warehouse_code" name="superior_warehouse_code" autocomplete="off" class="layui-input layui-hide">
	           			<input type="text" id="superior_warehouse_name" name="superior_warehouse_name" autocomplete="off" placeholder="请选择上级仓库" class="layui-input popup col-xs-12" readonly="readonly"/>
	           		</div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">覆盖范围</label>
		        	<div class="layui-input-inline">
	           			<input type="text" id="service_area_code" name="service_area_code" autocomplete="off" class="layui-input layui-hide">
	           			<input type="text" id="service_area_name" name="service_area_name" autocomplete="off" placeholder="请选择覆盖范围" class="layui-input popup col-xs-12" readonly="readonly"/>
	           		</div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库面积m³</label>
                    <div class="layui-input-inline">
                        <input type="text" id="area" name="area" onkeyup="num(this)" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库容量m³</label>
                    <div class="layui-input-inline">
                        <input type="text" id="volume" name="volume" onkeyup="num(this)" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库联系人</label>
                    <div class="layui-input-inline">
                        <input type="text" id="contact_person" name="contact_person" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库电话</label>
                    <div class="layui-input-inline">
                        <input type="text" id="tel" name="tel" lay-verify="tel" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库传真</label>
                    <div class="layui-input-inline">
                        <input type="text" id="fax" name="fax" lay-verify="fax" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">仓库邮编</label>
                    <div class="layui-input-inline">
                        <input type="text" id="zip_code" name="zip_code" lay-verify="emailExt" autocomplete="off" class="layui-input">
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
                        <input type="text" id="address" name="address" autocomplete="off" class="layui-input" style="width:249px">
                    </div>
                </div>
	             <div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">备注</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width: 444px;height: 50px;" maxLength="256"></textarea>
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
        layui.config({base: '${base}/view/oms/warehouse/'}).use('csWarehouseForm');
    </script>
</body>
</html>
