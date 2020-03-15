<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核分析</title>
</head>
<body class="body-grey">
    <div class="container">
    	<div class="layui-tab layui-tab-card"  lay-filter="subTabs">
			<ul class="layui-tab-title" id="sub-tabs">
				<li class="layui-this" id="sub-load-before">按月排名</li>
   				<li id="sub-track">历史查询</li>
			</ul>
			<div class="layui-tab-content">
				<!-- 子表信息 - 每月排名 -->
				<div class="layui-tab-item  layui-show">
					<div class="layui-colla-content layui-show" style="padding-top: 0px;">
						
						<div class="layui-form">
					      	<div style="padding-top:10px;margin:10px">
								<span class="layui-breadcrumb" id="month-span" lay-separator="|">
								  <a href="javascritp:void(0);" class="month-range active" data-from="2017-08-01" data-to="2017-08-31">201708</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-07-01" data-to="2017-07-31">201707</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-06-01" data-to="2017-06-30">201706</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-05-01" data-to="2017-05-31">201705</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-04-01" data-to="2017-04-30">201704</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-03-01" data-to="2017-03-31">201703</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-02-01" data-to="2017-02-28">201702</a>
								  <a href="javascritp:void(0);" class="month-range" data-from="2017-01-01" data-to="2017-01-31">201701</a>
								</span>
					      	</div>

							<fieldset class="layui-elem-field">
								<legend>排名</legend>
								<div class="layui-field-box">

									<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
										<ul class="layui-tab-title">
											<li class="layui-this">综合排名</li>
											<li>单项排名</li>
										</ul>
										<div class="layui-tab-content">
											<div class="layui-tab-item layui-show">
												<table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
													<thead>
													<tr>
														<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
														<th>排名</th>
														<th>承运商</th>
														<th>综合分数</th>
														<th>操作</th>
													</tr>
													</thead>
												</table>

											</div>
											<div class="layui-tab-item">
												<input type="checkbox" lay-skin="switch" lay-filter="switchEcharts" lay-text="单项|综合" checked>
												<div id="main" style="width: 800px;height:400px;"></div>
											</div>
										</div>
									</div>

								</div>
							</fieldset>

					      </div>
						
					</div>
				</div>
				<!-- 子表信息 - 历史排名 -->
				<div class="layui-tab-item">
					<div class="layui-colla-content layui-show" style="padding-top: 0px;">
			            
			            <form class="layui-form form-search" action="" onsubmit="return false" method="get">
				            <div class="row form-group">
				                <div class="col-xs-2_4">
				                    <label class="control-label col-xs-4">开始时间</label>
					                <input type="text" id="create_time_from" name="create_time_from" lay-verify="required" autocomplete="off" class="col-xs-7 layui-input laydate-icon">
				                </div>
				                <div class="col-xs-2_4">
				                    <label class="control-label col-xs-4">结束时间</label>
					                <input type="text" id="create_time_to" name="create_time_to" lay-verify="required" autocomplete="off" class="col-xs-7 layui-input laydate-icon">
				                </div>
				                <div class="col-xs-2_4 f0">
				                    <button class="layui-btn layui-btn-small" id="btn-query" code="">查询</button>
				                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset" code="">重置</button>
				                </div>
				            </div>
				        </form>
			            <div class="layui-form" style="padding-top:10px;">
				            <table id="historyTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
				              <thead>
				                  <tr>
				                      <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
				                      <th>综合排名</th>
				                      <th>承运商</th>
				                      <th>综合分数</th>
				                      <th>操作</th>
				                  </tr>
				              </thead>
				          </table>
					  </div>
					</div>
				</div>
			</div>
		</div>
    
    
    </div>
	<script src="${base}/static/frame/echarts/echarts.min.js"></script>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/supplier/'}).use('csSupplierAssessmentAnalyzeList');
        layui.use('element');
    </script>
    <style type="text/css">
		.month-range{color:black!important;}
		.month-range.active{color:#01AAED!important;}
	</style>
</body>
</html>
