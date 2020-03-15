<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%> 
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
<title>订单详情</title>
</head>
<body>
<div class="container foot-mb">
	<div class="layui-collapse" lay-filter="collapse">
		<!-- 订单表单信息 -->
		<form class="layui-form" action="" id="form-add">
			<!-- 基本信息 -->
			<div class="layui-colla-item">
		        <h2 class="layui-colla-title">基本信息</h2>
		        <div class="layui-colla-content layui-show"> 
					<div class="layui-form-item">
						<!-- 第一行 -->
						<div class="layui-inline">
							<label class="layui-form-label">系统订单号</label>
							<div class="layui-input-inline">
								<input type="text" id="order_no" name="order_no" placeholder="系统生成" autocomplete="off" class="layui-input" disabled/>
							</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">客户订单号</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="customer_order_no" name="customer_order_no" autocomplete="off" class="layui-input" maxlength="32">
			           		</div>
						</div>
						<div class="layui-inline">
				        	<label class="layui-form-label"><span class="c-red">*</span>订单类型</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="order_type" name="order_type" dictType="order_type" lay_filter="order_type" lay_verify="required" itemValue="value" itemLabel="label"></fm:select>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">状态</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="status" name="status" dictType="order_status" itemValue="value" itemLabel="label" disabled="true"></fm:select>
			           		</div>
						</div>
						<!-- 第二行 -->
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>委托客户</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="customer_code" name="customer_code" autocomplete="off" class="layui-input layui-hide">
			           			<input type="text" id="customer_name" name="customer_name" lay-verify="required" autocomplete="off" placeholder="请选择委托客户" class="layui-input popup col-xs-12" readonly="readonly"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>客户类型</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="customer_type" name="customer_type" lay_filter="customer_type" dictType="customer_type" lay_verify="required" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">下单人</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="order_person_code" name="order_person_code" autocomplete="off" class="layui-input layui-hide">
			           			<input type="text" id="order_person_name" name="order_person_name" autocomplete="off" placeholder="请选择下单人" class="layui-input popup col-xs-12" readonly="readonly"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>下单时间</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="order_time" name="order_time" lay-verify="required" autocomplete="off" 
			           				class="layui-input laydate-icon" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
			           		</div>
						</div>
						
						<!-- 第三行 -->
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>要求提货时间</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="require_time_from" name="require_time_from" lay-verify="required" autocomplete="off" 
			           				class="layui-input laydate-icon" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>要求送达时间</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="require_time_to" name="require_time_to" lay-verify="required" autocomplete="off" 
			           				class="layui-input laydate-icon" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>结算方式</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="charge_mode" name="charge_mode" dictType="charge_mode" lay_verify="required" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">订单来源</label>
				        	<div class="layui-input-inline">
			           			<fm:select id="order_source" name="order_source" dictType="order_source" itemValue="value" value="10" itemLabel="label" disabled="true"></fm:select>
			           		</div>
						</div>
						<!-- 第四行 -->
						<div class="layui-inline"> 
				        	<label class="layui-form-label">仓库</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="warehouse_code" name="warehouse_code" autocomplete="off" class="layui-input layui-hide">
			           			<input type="text" id="warehouse_name" name="warehouse_name" autocomplete="off" placeholder="请选择仓库" class="layui-input popup col-xs-12" readonly="readonly"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">承运商</label>
			           		<div class="layui-input-inline">
								<input type="text" id="carrier_code" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
								<input type="text" id="carrier_name" name="carrier_name" autocomplete="off" placeholder="请选择承运商" class="layui-input popup col-xs-12" readonly="readonly">
							</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">备注</label>
		           			<textarea type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 444px;" maxLength="1024"></textarea>
						</div>
						<!-- 第五行 -->
						
					</div>
				</div>
			</div>
			<!-- 收发信息 -->
			<div class="layui-colla-item">	
		        <h2 class="layui-colla-title">收发信息</h2>
		        <div class="layui-colla-content layui-show"> 
					<div class="layui-form-item">
						<!-- 第一行 -->
						<div class="layui-inline">
							<label class="layui-form-label"><span class="c-red">*</span>发货客户</label>
							<div class="layui-input-inline">
								<input type="text" id="shipper_code" name="shipper_code" autocomplete="off" class="layui-input layui-hide" maxlength="15">
			           			<input type="text" id="shipper_name" name="shipper_name" autocomplete="off" lay-verify="required" placeholder="请选择或输入客户" class="layui-input popup col-xs-12" maxlength="15"/>
			           			<span class="search-edit-icon" id="shipper_name_icon"></span>
							</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>发货联系人</label>
				        	<div class="layui-input-inline">
				        		<input type="text" id="shipper_contact_code" name="shipper_contact_code" autocomplete="off" class="layui-input layui-hide" maxlength="15">
			           			<input type="text" id="shipper_contact_name" name="shipper_contact_name" autocomplete="off" lay-verify="required" placeholder="请选择或输入联系人" class="layui-input popup col-xs-12" maxlength="15"/>
			           			<span class="search-edit-icon" id="shipper_contact_name_icon"></span>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">收货客户</label>
				        	<div class="layui-input-inline">
								<input type="text" id="consignee_code" name="consignee_code" autocomplete="off" class="layui-input layui-hide" maxlength="15">
			           			<input type="text" id="consignee_name" name="consignee_name" autocomplete="off" placeholder="请选择或输入客户" class="layui-input popup col-xs-12" maxlength="15"/>
			           			<span class="search-edit-icon" id="consignee_name_icon"></span>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">收货联系人</label>
				        	<div class="layui-input-inline">
				        		<input type="text" id="consignee_contact_code" name="consignee_contact_code" autocomplete="off" class="layui-input layui-hide" maxlength="15">
			           			<input type="text" id="consignee_contact_name" name="consignee_contact_name" autocomplete="off" placeholder="请选择或输入联系人" class="layui-input popup col-xs-12" maxlength="15"/>
			           			<span class="search-edit-icon" id="consignee_contact_name_icon"></span>
			           		</div>
						</div>
						<!-- 第二行 -->
						<div class="layui-inline"> 
				        	<label class="layui-form-label"><span class="c-red">*</span>手机</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="shipper_contact_mobile" name="shipper_contact_mobile" onkeyup="this.value=this.value.replace(/\D/g, '')" lay-verify="required|phone" autocomplete="off" class="layui-input">
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">是否需要提货</label>
			           		<div class="layui-input-inline">
			           			<fm:select id="need_pickup" name="need_pickup" dictType="yes_no" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">手机</label>
				        	<div class="layui-input-inline">
			           			<input type="text" id="consignee_contact_mobile" name="consignee_contact_mobile" onkeyup="this.value=this.value.replace(/\D/g, '')" lay-verify="phone" autocomplete="off" class="layui-input">
			           		</div>
						</div>
						<div class="layui-inline"> 
				        	<label class="layui-form-label">是否需要配送</label>
			           		<div class="layui-input-inline">
			           			<fm:select id="need_delivery" name="need_delivery" dictType="yes_no" itemValue="value" itemLabel="label" cssClass="col-xs-7"/>
			           		</div>
						</div>
						<!-- 第三行 -->
						<div class="layui-inline">
	                        <label class="layui-form-label"><span class="c-red" >*</span>发货地址</label>
	                        <div class="layui-input-inline">
	                            <div class="sns-addrselector" id="shipper_address_select">
									<input type="hidden" name="shipper_province_code" />
									<input type="hidden" name="shipper_province_name" />
									<input type="hidden" name="shipper_city_code" />
									<input type="hidden" name="shipper_city_name" />
									<input type="hidden" name="shipper_county_code" />
									<input type="hidden" name="shipper_county_name" />
		                        </div>
	                        </div>
	                        <div class="layui-form-mid" style="padding-left: 9px">-</div>
                            <input type="text" id="shipper_address" name="shipper_address" lay-verify="required" autocomplete="off" class="layui-input" style="width:248px" maxlength="32">
	                    </div>
	                    
	                    <div class="layui-inline">
	                        <label class="layui-form-label"><span class="c-red">*</span>送达地址</label>
	                        <div class="layui-input-inline">
	                            <div class="sns-addrselector" id="consignee_address_select">
									<input type="hidden" name="consignee_province_code" />
									<input type="hidden" name="consignee_province_name" />
									<input type="hidden" name="consignee_city_code" />
									<input type="hidden" name="consignee_city_name" />
									<input type="hidden" name="consignee_county_code" />
									<input type="hidden" name="consignee_county_name" />
								</div>
							</div>
							<div class="layui-form-mid" style="padding-left: 9px">-</div>
							<input type="text" id="consignee_address" name="consignee_address" lay-verify="required" autocomplete="off" class="layui-input" style="width:248px" maxlength="32">
						</div>
					</div>
				</div>
				<!-- 底部按钮 -->
				<div class="foot">
					<button class="layui-btn layui-btn-small" id="btn-new" lay-submit="" lay-filter="form-new" style="display: none;">保存</button>
					<button class="layui-btn layui-btn-small" id="btn-save" lay-submit="" lay-filter="form-save" style="display: none;">保存</button>
					<button class="layui-btn layui-btn-small" id="btn-saveAndNew" lay-submit="" lay-filter="form-save" style="display: none;">保存并新增</button>
					<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" style="display: none">关闭</button>
				</div>
			</div>
		</form>
		
		<!-- 子表信息 Start -->
		<div class="layui-colla-item">
			<div class="layui-tab layui-tab-card">
				<ul id="sub-tabs" class="layui-tab-title">
					<li id="sub-cargo" class="layui-this">商品信息</li>
					<li id="sub-task">订单任务</li>
				</ul>
				<div class="layui-tab-content">
					<!-- 子表信息 - 商品信息 -->
					<div class="layui-tab-item layui-show">
						<div class="layui-colla-content layui-show">
							<div class="btn-group" id="cargo-toolbar" style="display: none;">
								<a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-cargo-add"><i class="layui-icon">&#xe654;</i>新增</a>
								<a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-cargo-delete"><i class="layui-icon">&#xe640;</i>删除</a>
							</div>
							<div class="layui-form">
								<table id="cargoTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
									<thead>
										<tr>
											<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
											<th>行号</th>
											<th>商品代码</th>
											<th>商品名称</th>
											<th>商品类型</th>
											<th>包装</th>
											<th>单位</th>
											<th>件数</th>
											<th>EA数</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
					
					<!-- 子表信息 - 订单任务(分解结果) -->
					<div class="layui-tab-item">
						<div class="layui-colla-content layui-show">
							<div class="layui-form">
								<table id="taskTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
									<thead>
										<tr>
											<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
											<th style="width: 170px">任务号</th>
											<th>任务类型</th>
											<th>下发状态</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
		<!-- 子表信息 End -->
	</div>
</div>
<script type="text/javascript">
	layui.config({base: '${base}/view/oms/order/'}).use('csOrderEdit');
</script> 
</body>
</html>