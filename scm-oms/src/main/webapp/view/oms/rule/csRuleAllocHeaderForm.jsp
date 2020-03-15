<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>分配规则</title>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
</head>
<body>
    <div class="container foot-mb">
    	<div class="layui-collapse" lay-filter="collapse">
	    	<div class="layui-colla-item">
	        <h2 class="layui-colla-title">基本信息</h2>
	        <div class="layui-colla-content layui-show"> 
		        <form class="layui-form" action="" id="form-add">
		        	<input type="hidden" id="id" name="id"/>
		                <div class="layui-form-item">
							<div class="layui-inline">
								<label class="layui-form-label">仓库代码</label>
								<div class="layui-input-inline">
									<input type="text" id="warehouse_code" name="warehouse_code" lay-verify="required" autocomplete="off" class="layui-input"   maxLength="32"/>
								</div>
							</div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">规则代码</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="rule_code" name="rule_code" lay-verify="required" autocomplete="off" class="layui-input"   maxLength="32"/>
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label"><span style="color: red;">*</span>规则名称</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="rule_name" name="rule_name" lay-verify="required" autocomplete="off"  maxLength="32" class="layui-input">
		                        </div>
		                    </div>

							<div class="layui-inline">
								<label class="layui-form-label"><span style="color: red;">*</span>发票类型</label>
								<div class="layui-input-inline">
									<input type="text" id="invoice_type_name" name="invoice_type_name" lay-verify="required" autocomplete="off"  maxLength="32" class="layui-input">
								</div>
							</div>

							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>生效时间从</label>
								<div class="layui-input-inline">
									<input type="text" id="effect_time_fm" name="effect_time_fm" lay-verify="required" autocomplete="off"
										   class="layui-input laydate-icon" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
								</div>
							</div>
							<div class="layui-inline">
								<label class="layui-form-label"><span class="c-red">*</span>生效时间到</label>
								<div class="layui-input-inline">
									<input type="text" id="effect_time_to" name="effect_time_to" lay-verify="required" autocomplete="off"
										   class="layui-input laydate-icon" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
								</div>
							</div>


							<div class="layui-inline">
								<label class="layui-form-label">状态</label>
								<div class="layui-input-inline">
									<fm:select id="status" name="status" dictType="property_status" itemLabel="label" itemValue="value" ></fm:select>
								</div>
							</div>
		                </div>
		                 <div class="foot">
		                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
		                <button  class="layui-btn layui-btn-small layui-btn-primary" type="button" onclick="layer_close()">关闭</button>
		            </div>
		        </form>
	        </div>
	        </div>
	        <div class="layui-colla-item">
	      	<h2 class="layui-colla-title">联系人</h2>
	        <div class="layui-colla-content layui-show">
		        <div class="btn-group" id="contart-toolbar" style="display: none;">
		            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-add">新增</a>
		            <a href="javascript:void(0);" class="layui-btn layui-btn-small" id="btn-delete">删除</a>
		            <a href="javascript:void(0);" class="layui-btn layui-btn-small layui-hide" id="btn-query">查询</a>
		        </div>
		        <div class="layui-form">
		            <table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
		                <thead>
		                    <tr>
		                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
		                        <th>行号</th>
		                        <th>包装单位</th>
		                        <th style="width: 100px">库位使用类型</th>
		                        <th style="width: 100px">清仓优先级</th>
		                        <th>操作</th>
		                    </tr>
		                </thead>
		            </table>
		        </div>
		    </div>
	    	</div>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/rule/'}).use(['csRuleAllocHeaderForm']);
    </script>
</body>
</html>
