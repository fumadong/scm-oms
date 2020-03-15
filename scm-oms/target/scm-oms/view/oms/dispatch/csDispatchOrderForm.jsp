<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<script src="${base}/static/frame/utils/hashMap.js"></script>
<title>派车单详情</title>
</head>
<body>
	<div class="container foot-mb">
		<div class="layui-collapse" lay-filter="collapse">
			<!-- 派车单表单信息 -->
			<form class="layui-form" action="" id="form-add">
				<!-- 基本信息 -->
				<div class="layui-colla-item">
					<h2 class="layui-colla-title">基本信息</h2>
					<div class="layui-colla-content layui-show">
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">系统订单号</label>
								<div class="layui-input-inline">
									<input type="text" id="order_no_edit" name="order_no" autocomplete="off" class="layui-input" disabled/>
								</div>
							</div>
							
							<div class="layui-inline">
								<label class="layui-form-label">分配单号</label>
								<div class="layui-input-inline">
									<input type="text" id="distribution_no_edit"
										name="distribution_no" autocomplete="off"
										class="layui-input" disabled>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">派车单号</label>
								<div class="layui-input-inline">
									<input type="text" id="dispatch_no_edit" name="dispatch_no"
										autocomplete="off" class="layui-input" disabled />
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>承运商</label>
								<div class="layui-input-inline">
									<input type="text" id="carrier_code_edit" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
									<input type="text" id="carrier_name_edit" name="carrier_name" autocomplete="off" lay-verify="required" class="layui-input popup" readonly="readonly" disabled="disabled">
								</div>
							</div>
						</div>
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">发货地址</label>
								<div class="layui-input-inline">
									<div class="sns-addrselector">
										<input type="text" id="shipper_edit" name="shipper" class="layui-input" disabled/> 
									</div>
								</div>
								<div class="layui-form-mid">-</div>
								<input type="text" id="shipper_address_edit" name="shipper_address" autocomplete="off" maxLength="256" class="layui-input" style="width: 257px" disabled>
							</div>

							<div class="layui-inline">
								<label class="layui-form-label">送达地址</label>
								<div class="layui-input-inline">
									<div class="sns-addrselector">
										<input type="text" id="consignee_edit" name="consignee" class="layui-input" disabled/> 
									</div>
								</div>
								<div class="layui-form-mid">-</div>
								<input type="text" id="consignee_address_edit" name="consignee_address" autocomplete="off" maxLength="256" class="layui-input" style="width: 258px" disabled>
							</div>
						</div>
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">车牌号</label>
								<div class="layui-input-inline">
									<input type="text" id="vehicle_no_edit" name="vehicle_no" autocomplete="off" class="layui-input" disabled="disabled">
								</div>
							</div>
							<div class="layui-inline"> 
					        	<label class="layui-form-label">计费节点</label>
					        	<div class="layui-input-inline">
				           			<fm:select id="charge_node_edit" name="charge_node" dictType="charge_node" itemValue="value" itemLabel="label" cssClass="col-xs-7" disabled="true"/>
				           		</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">派车时间</label>
								<div class="layui-input-inline">
									<input type="text" id="create_time_edit" name="create_time"
										autocomplete="off" disabled class="layui-input laydate-icon"
										onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})" />
								</div>
							</div>
						</div>
						
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">计划量</label>
								<div class="layui-input-inline">
									<input type="text" id="plan_amount_edit" name="plan_amount"
										autocomplete="off" class="layui-input" disabled>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">装货量</label>
								<div class="layui-input-inline">
									<input type="text" id="load_amount_edit" name="load_amount" autocomplete="off" class="layui-input" disabled>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">卸货量</label>
								<div class="layui-input-inline">
									<input type="text" id="unload_amount_edit" name="unload_amount" autocomplete="off" class="layui-input" disabled>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">磅差</label>
								<div class="layui-input-inline">
									<input type="text" id="difference_amount_edit"
										name="difference_amount" autocomplete="off"
										class="layui-input" disabled>
								</div>
							</div>
						</div>
						
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">备注</label> 
								<div class="layui-input-inline">
									<textarea type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width: 992px;height: 50px;" maxLength="256" disabled="disabled"></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 收发信息 -->
				<div class="layui-colla-item">
					<!-- 底部按钮 -->
					<div class="foot">
						<button class="layui-btn layui-btn-small" id="btn-form-refresh" style="display: none;">刷新</button>
						<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" code="">关闭</button>
					</div>
				</div>
			</form>

			<div class="layui-tab layui-tab-card">
				<ul class="layui-tab-title" id="sub-tabs">
					<li id="sub-fee" class="layui-this">费用信息</li>
				</ul>
				<div class="layui-tab-content">
					<!-- 子表信息 - 应收费用信息 -->
					<div class="layui-tab-item layui-show">
						<div class="layui-colla-content layui-show" style="padding-top: 0px;">
							<div class="btn-group">
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-add" code=""><i class="layui-icon">&#xe654;</i>新增</button> 
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-delete" code=""><i class="layui-icon">&#xe640;</i>删除</button>
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-cost" code="">费率计算</button> 
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-confirm" code="">费用确认</button>
							</div>
							<div class="layui-form">
								<table id="feeTable" class="layui-table" lay-even=""
									width="100%" lay-skin="line">
									<thead>
										<tr>
											<th width="10"><input type="checkbox" name=""
												lay-skin="primary" lay-filter="allChoose"></th>
											<th>费用名称</th>
											<th>费用类型</th>
											<th>结算对象</th>
											<th>数量</th>
											<th>单价</th>
											<th>总费用</th>
											<th>舍入方式</th>
											<th>币别</th>
											<th>税率</th>
											<th>备注</th>
											<th>是否已对账</th>
											<th>账期</th>
											<th>状态</th>
											<th style="text-align: center;">操作</th>
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
	</div>
	<script type="text/javascript">
		layui.config({
			base : '${base}/view/oms/dispatch/' //你的模块目录
		}).use('csDispatchOrderForm'); //加载入口
	</script>
</body>
</html>