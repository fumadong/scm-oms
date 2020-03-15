<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商考核规则</title>
</head>
<body class="body-grey">
    <div class="container">
        <form class="layui-form form-search" action="" onsubmit="return false" method="get">
            <div class="row form-group">
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">运输方式</label>
                    <input type="text" id="name_query" name="name" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4">
                    <label class="control-label col-xs-4">承运商</label>
					<input type="text" id="name_query" name="name" class="layui-input col-xs-7">
                </div>
                <div class="col-xs-2_4 f0">
                    <button class="layui-btn layui-btn-small" id="btn-query" code="">查询</button>
                    <button class="layui-btn layui-btn-small" id="btn-reset" type="reset" code="">重置</button>
                </div>
            </div>
        </form>
        <div class="btn-group">
            <button class="layui-btn layui-btn-small" id="btn-add" code=""><i class="layui-icon">&#xe654;</i> 新增</button>
            <button class="layui-btn layui-btn-small" id="btn-delete" code=""><i class="layui-icon">&#xe640;</i> 删除</button>
        </div>
        <div class="layui-form">
            <table id="dateTable" class="layui-table" lay-even="" lay-skin="line" width="100%">
                <thead>
                    <tr>
                        <th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
                        <th>承运商</th>
                        <th>运输方式</th>
                        <th>起运地(港)</th>
                        <th>目的地(港)</th>
                        <th>成本单价</th>
                        <th>时效</th>
                    </tr>
                </thead>
                <tbody>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>中铁物流</td>
			        <td>铁路</td>
			        <td>天津</td>
			        <td>厦门</td>
			        <td>￥56</td>
			        <td>24小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>中铁物流</td>
			        <td>铁路</td>
			        <td>天津</td>
			        <td>上海</td>
			        <td>￥20</td>
			        <td>24小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>中铁物流</td>
			        <td>铁路</td>
			        <td>上海</td>
			        <td>厦门</td>
			        <td>￥36</td>
			        <td>24小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>顺丰航空</td>
			        <td>空运</td>
			        <td>天津</td>
			        <td>厦门</td>
			        <td>￥1000</td>
			        <td>6小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>跨越物流</td>
			        <td>公路</td>
			        <td>天津</td>
			        <td>济南</td>
			        <td>￥50</td>
			        <td>10小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>撒加物流</td>
			        <td>公路</td>
			        <td>济南</td>
			        <td>徐州</td>
			        <td>￥56</td>
			        <td>12小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>民安物流</td>
			        <td>铁路</td>
			        <td>福州</td>
			        <td>厦门</td>
			        <td>￥80</td>
			        <td>5小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>中铁物流</td>
			        <td>铁路</td>
			        <td>天津</td>
			        <td>厦门</td>
			        <td>￥56</td>
			        <td>24小时</td>
			      </tr>
			    </tbody>
            </table>
        </div>
    </div>
    <script type="text/javascript">
        layui.config({base: '${base}/view/oms/supplier/'}).use('csTransportResource');
    </script>
</body>
</html>
