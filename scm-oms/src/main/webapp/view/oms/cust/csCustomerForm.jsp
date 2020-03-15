<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>客户管理</title>
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
		                        <label class="layui-form-label">客户代码</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="customer_code" name="customer_code" autocomplete="off" class="layui-input layui-input-disabled" readonly="readonly"  maxLength="32"/>
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label"><span style="color: red;">*</span>客户简称</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="customer_name" name="customer_name" lay-verify="required" autocomplete="off"  maxLength="32" class="layui-input">
		                        </div>
		                    </div>
		                     <div class="layui-inline">
		                        <label class="layui-form-label">客户全称</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="customer_all_name" name="customer_all_name" lay-verify=""  maxLength="32" autocomplete="off" class="layui-input">
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">客户类型</label>
		                        <div class="layui-input-inline">
		                          <%--   <fm:select id="customer_type" name="customer_type" items="customer_type" itemValue="value" itemLabel="label"></fm:select> --%>
		                            <fm:select id="customer_type" name="customer_type" dictType="customer_type" itemValue="value" itemLabel="label"></fm:select>
		                            <%-- <fm:select id="customer_type" name="customer_type" url="sys/dictSpec/getDictListJson?dictType=customer_type" itemValue="value" itemLabel="label"></fm:select> --%>
		                        </div>
		                    </div>
		                   <!--  <div class="layui-inline">
		                        <label class="layui-form-label">办事处</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="office" name="office" autocomplete="off" class="layui-input">
		                        </div>
		                    </div> -->
		                   
		                    <div class="layui-inline">
		                        <label class="layui-form-label">公司电话</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="tel" name="tel" autocomplete="off" class="layui-input" lay-verify="tel"  maxLength="32" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">
		                        </div>
		                    </div>
		                   
		                    <div class="layui-inline">
		                        <label class="layui-form-label">传真</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="fax" name="fax" autocomplete="off" class="layui-input" lay-verify="tel"  maxLength="32" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">税务代码</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="tax_code" name="tax_code"  maxLength="32" autocomplete="off" class="layui-input">
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">财务代码</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="financial_code" name="financial_code"  maxLength="32" autocomplete="off" class="layui-input">
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">工商登记号</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="business_registra_tion_number" name="business_registra_tion_number"  maxLength="32" autocomplete="off" class="layui-input">
		                        </div>
		                    </div>
		                      <div class="layui-inline">
		                        <label class="layui-form-label">行业类别</label>
		                        <div class="layui-input-inline">
		                            <fm:select id="industry_category" name="industry_category" dictType="industry_category" itemValue="value" itemLabel="label"></fm:select>
		                        </div>
		                    </div>
		                    <div class="layui-inline">
		                        <label class="layui-form-label">信用额度</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="credit_quota" name="credit_quota" autocomplete="off" maxLength="8" class="layui-input" lay-verify="num"
										   onkeyup="value=value.replace(/[^-\d\.]/g,'')">
		                        </div>
		                    </div>
		                     <div class="layui-inline">
		                        <label class="layui-form-label">信控期限(天)</label>
		                        <div class="layui-input-inline">
		                            <input type="text" id="credit_deadline" name="credit_deadline" autocomplete="off"  maxLength="8" class="layui-input"
		                            onkeyup="this.value=this.value.replace(/[^0-9]+/,'');">
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
		                            <input type="text" id="address" name="address" autocomplete="off" class="layui-input"  maxLength="32" style="width:249px">
		                        </div>
		                   </div>
		                   <div class="row form-group">     
								<label class="layui-form-label">主营业务</label>
								<div class="layui-input-block">
      								<textarea id="main_business" name="main_business" placeholder="" class="layui-textarea" style="width:445px" maxlength="256"  ></textarea>
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
		                        <th>代码</th>
		                        <th>联系人名称</th>
		                        <th style="width: 100px">手机</th>
		                        <th style="width: 100px">电话</th>
		                         <th style="width: 100px">QQ</th>
		                          <th style="width: 100px">微信</th>
		                        <th>默认联系人</th>
		                        <th>邮箱</th>
		                        <th style="width: 150px">省市区</th>
		                        <th style="width: 200px">详细地址</th>
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
        layui.config({base: '${base}/view/oms/cust/'}).use(['csCustomerForm']);
    </script>
</body>
</html>
