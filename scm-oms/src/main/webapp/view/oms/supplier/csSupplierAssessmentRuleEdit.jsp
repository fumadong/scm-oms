<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核规则维护</title>
</head>
<body>
    <div class="container foot-mb">
    	<form class="layui-form" action="" id="form-add">
       		<div class="layui-collapse" lay-filter="collapse">
				<div class="layui-colla-item">
				    <h2 class="layui-colla-title">考核规则</h2>
				    <div class="layui-colla-content layui-show">
				        <div class="layui-form-item">
				            <div class="layui-inline">
				                <label class="layui-form-label"><span style="color: red;">*</span>规则名称</label>
				              <div class="layui-input-inline">
				                  <input type="text" id="rule_name" name="rule_name" lay-verify="required" autocomplete="off" class="layui-input">
				              </div>
				          </div>
				          <div class="layui-inline">
				              <label class="layui-form-label"><span style="color: red;">*</span>有效期限从</label>
				              <div class="layui-input-inline">
				                  <input type="text" id="effective_date" name="effective_date" lay-verify="required" autocomplete="off" class="layui-input laydate-icon">
				              </div>
				          </div>
				          <div class="layui-inline">
				              <label class="layui-form-label"><span style="color: red;">*</span>有效期限到</label>
				              <div class="layui-input-inline">
				                  <input type="text" id="expiration_date" name="expiration_date" lay-verify="required" autocomplete="off" class="layui-input laydate-icon">
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
				              <div class="layui-input-inline w437">
				                  <input type="text" id="remark" name="remark" autocomplete="off" class="layui-input" style="width: 340px;">
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
				<div class="layui-colla-item">
				    <h2 class="layui-colla-title">考核明细</h2>
				    <div class="layui-colla-content layui-show">
				   		<table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
				            <thead>
				                <tr>
				                    <th width="50">序号</th>
				                    <th>考核项</th>
				                    <th>考核项说明</th>
				                    <th>是否考核</th>
				                    <th>考核占比(启用项占比和应为100)</th>
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
        layui.config({base: '${base}/view/oms/supplier/'}).use('csSupplierAssessmentRuleEdit');
    </script>
</body>
</html>
