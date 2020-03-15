<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核分析</title>
</head>
<body class="body-grey">
    <div class="container">
    
        <div class="layui-form" style="float: left;">
			
			<div style="width:70%; float: left;">
				<table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
	                <thead>
	                    <tr>
	                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
	                        <th>序号</th>
	                        <th>考核项</th>
	                        <th>总票数</th>
	                        <th>异常票数</th>
	                        <th>考核率</th>
	                        <th>权重</th>
	                        <th>得分</th>
	                    </tr>
	                </thead>
	            </table>
			</div>
            
            <div  style="width:30%; float: right; clear: right; ">
            	<div id="main" style="width: 400px;height:400px;"></div>
            </div>
            
        </div>
    </div>
    <script src="${base}/static/frame/echarts/echarts.min.js"></script>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/supplier/'}).use('csSupplierAssessmentAnalyzeDetail');
        layui.use('element');
        
    </script>
    <script type="text/javascript">

        
    </script>
</body>
</html>
