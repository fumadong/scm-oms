<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>承运商管理</title>
</head>
<body>

	<div class="container mb-0">
	
	<form class="layui-form" >
		<div class="layui-form-item">
		   <label class="layui-form-label">排序方案</label>
		   <div class="layui-input-block">
		      <input class="planCheck" type="checkbox" name="like1[write]" lay-skin="primary" lay-filter="allCheck" title="价格优先" checked="">
		      <input class="planCheck" type="checkbox" name="like1[read]" lay-skin="primary" lay-filter="allCheck" title="时效优先">
		      <input class="planCheck" type="checkbox" name="like1[game]" lay-skin="primary" lay-filter="allCheck" title="综合排名">
		    </div>
		  </div>
	</form>
	<div class="layui-form">
			<table id="dateTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
				<thead>
					<tr>
						<th width="10"><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose"></th>
						<th>路线</th>
						<th>承运商</th>
						<th>运输方式（费用/时效）</th>
						<th>预计总费用</th>
						<th>预计总时效</th>
					</tr>
				</thead>
				<tbody>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>厦门-天津</td>
			        <td>中铁物流</td>
			        <td>铁路（￥5600/24小时）</td>
			        <td>￥5600</td>
			        <td>24小时</td>
			      </tr>
			      <tr>
			        <td><input type="checkbox" name="" lay-skin="primary"></td>
			        <td>厦门-上海<br/>上海-天津</td>
			        <td>中铁物流<br/>顺丰物流</td>
			        <td>铁路（￥3000/14小时）<br/>陆运（￥14000/12小时）</td>
			        <td>￥17000</td>
			        <td>26小时</td>
			      </tr>
			     </tbody>
			</table>
		</div>
		<div class="foot">
           <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id="save" code="">确认</button>
           <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close" code="">关闭</button>
       </div>
	</div>
	<script type="text/javascript">
	
	
	
	layui.use(['form','element','layer'], function(){
		  var form = layui.form();
		  
		  $('#dateTable').DataTable({
		    	serverSide: false,
		    	"aLengthMenu": [[5, 10], [5, 10]],
			    "iDisplayLength": 5,
		    });
		  
		  form.on('checkbox(allCheck)', function(data){
		    	//layer.msg("dd");
				var data = data;
				var this_ = this;
			    return false;
			  });
		  
		//关闭窗口
			$('#btn-close').on('click', function () {
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			});
		  
		});
	
    </script>
</body>
</html>