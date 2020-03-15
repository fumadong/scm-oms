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
								<label class="layui-form-label">账单号</label>
								<div class="layui-input-inline">
									<input type="text" id="bill_no_edit" name="bill_no" autocomplete="off" class="layui-input" disabled/>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">承运商</label>
								<div class="layui-input-inline">
									<input type="text" id="carrier_code_edit" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
									<input type="text" id="carrier_name_edit" name="carrier_name" autocomplete="off" class="layui-input popup" readonly="readonly">
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">账期</label>
								<div class="layui-input-inline">
									<fm:select id="account_period_edit" name="account_period" dictType="account_period" itemValue="value" itemLabel="label" cssClass="col-xs-7"></fm:select>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label">账单总金额</label>
								<div class="layui-input-inline">
									<input type="text" id="total_amount_edit" name="total_amount" autocomplete="off" class="layui-input"  />
								</div>
							</div>
							
						</div>
						<div class="layui-form-item">
							<div class="layui-inline"> 
					        	<label class="layui-form-label">状态</label>
					        	<div class="layui-input-inline">
				           			<fm:select id="bill_status_edit" name="bill_status" dictType="bill_status" itemValue="value" itemLabel="label" cssClass="col-xs-7" disabled="true"/>
				           		</div>
							</div>
						</div>
						
						<div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">备注</label> 
								<div class="layui-input-inline">
									<textarea type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width: 992px;height: 50px;" maxLength="256"></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 收发信息 -->
				<div class="layui-colla-item">
					<!-- 底部按钮 -->
					<div class="foot">
						<button class="layui-btn layui-btn-small" id="btn-form-save-confirm">保存并确认</button>
						<button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-save" id="btn-form-save" >保存</button>
						<button class="layui-btn layui-btn-small" id="btn-form-refresh" style="display: none;">刷新</button>
						<button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" code="">关闭</button>
					</div>
				</div>
			</form>

			<div class="layui-tab layui-tab-card">
				<ul class="layui-tab-title" id="sub-tabs">
					<li id="sub-fee" class="layui-this">费用明细列表</li>
				</ul>
				<div class="layui-tab-content">
					<!-- 子表信息 - 应收费用信息 -->
					<div class="layui-tab-item layui-show">
						<div class="layui-colla-content layui-show" style="padding-top: 0px;">
							<div class="btn-group">
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-add" code=""><i class="layui-icon">&#xe654;</i>添加费用</button> 
								<button class="layui-btn layui-btn-small" id="btn-sub-fee-delete" code=""><i class="layui-icon">&#xe640;</i>删除</button>
							</div>
							<div class="layui-form">
								<table id="feeTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
									<thead>
										<tr>
											<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
											<th>系统订单号</th>
											<th>分配单号</th>
											<th>派车单号</th>
											<th>费用名称</th>
											<th>费用类型</th>
											<th>金额</th>
											<th>发生时间</th>
											<th>税率</th>
											<th>舍入方式</th>
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
			base : '${base}/view/oms/fee/' //你的模块目录
		}).use('csBillsForm'); //加载入口
	</script>
</body>
</html>