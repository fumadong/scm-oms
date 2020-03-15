<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核规则维护</title>
</head>
<body>
    <div class="container foot-mb">
    	<form class="layui-form" action="" id="form-add">
       		<div class="layui-collapse" lay-filter="collapse">
				<div class="layui-colla-item">
				    <h2 class="layui-colla-title">承运商运力承诺</h2>
				    <div class="layui-colla-content layui-show">
				        <div class="layui-form-item">
				          	<div class="layui-inline">
				              	<label class="layui-form-label"><span style="color: red;">*</span>运力承诺名称</label>
				              	<div class="layui-input-inline">
				                  	<input type="text" id="name" name="name" lay-verify="required" autocomplete="off" class="layui-input">
				              	</div>
				          	</div>
				          	<div class="layui-inline">
				              	<label class="layui-form-label"><span class="c-red">*</span>承运商</label>
								<div class="layui-input-inline">
									<input type="text" id="carrier_code" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
									<input type="text" id="carrier_name" name="carrier_name" autocomplete="off" lay-verify="required" class="layui-input popup" readonly="readonly">
								</div>
				          	</div>
				          	<div class="layui-inline">
				              	<label class="layui-form-label">车辆数</label>
				              	<div class="layui-input-inline">
				                  	<input type="number" id="vehicle_num" name="vehicle_num" autocomplete="off"onkeyup="this.value=this.value.replace(/[^0-9]+/,'');" class="layui-input">
				              	</div>
				          	</div>
				          	<div class="layui-inline">
				              	<label class="layui-form-label">状态</label>
				              	<div class="layui-input-inline">
				                  	<fm:select id="status" name="managed_type" dictType="property_status" itemLabel="label" itemValue="value" disabled="true"></fm:select>
				              	</div>
				          	</div><br/>
				          
				          	<div class="layui-inline">
				              	<label class="layui-form-label">备注</label>
				              	<div class="layui-input-inline w437"  style="width: 444px;">
				                  	<input type="text" id="remark" name="remark" autocomplete="off" class="layui-input">
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
				
				<div class="layui-colla-item">
				    <h2 class="layui-colla-title">流向</h2>
				    <div class="layui-colla-content layui-show">
					    <div class="btn-group">
				            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-flow-add">新增</a>
				            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-flow-delete">删除</a>
							<button class="layui-btn layui-btn-small layui-hide" id="btn-query">查询</button>
				        </div>
				   		<table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
				            <thead>
				                <tr>
				                	<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
				                    <th>起运地</th>
				                    <th>目的地</th>
				                    <th>时效</th>
				                    <th>操作</th>
				                </tr>
				            </thead>
				        </table>
				    </div>
				</div>
	        </div>
	        <div class="foot">
	            <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="save" code="">保存</button>
	            <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="saveAndNew" code="">保存并新增</button>
	            <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" code="">关闭</button>
	        </div>
	    </form>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/supplier/'}).use('csTransportCommitmentEdit');
    </script>
</body>
</html>
