/**
 * 货主管理
 * @author Joan.Zhang
 */
var data = {};
var getData = function () {
	var codes = [];
	var names = [];
	var cbks = $("#dateTable").find(":checkbox:checked");
	if (cbks.length > 0) {
		cbks.each(function () {
			codes.push($(this).attr("data-supplier_code"));
			names.push($(this).attr("data-supplier_name"));
		});
		//父页面的
		data["unit"] = codes.toString();
		data["unit_name"] = names.toString();
	}
	return data;
}

layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage, laydate = layui.laydate;

	var table = $('#dateTable').DataTable({
		"aLengthMenu": [[5, 10], [5, 10]],
		"iDisplayLength": 5,
		ajax: {
			url: base + "/supplier/page",
			data: function (data) {
				var param = $("#queryFrom").serializeArray();
				if (Array.isArray(param)) {
					for (var i = 0; i < param.length; i++) {
						var _name = param[i].name;
						data[_name] = param[i].value;
					}
				}
			}
		},
		"columns": [                            // 自定义数据列
			{
				data: function (obj) {
					return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-supplier_code="' + obj.supplier_code + '" data-supplier_name="' + obj.supplier_name + '"/>';
				}
			},
			{data: 'supplier_code'},
			{data: 'supplier_name'},
			{data: 'tel'}

		],
		"stateSaveParams": function () {           // 初始化完成调用事件
			form.render('checkbox');
		}
	}).on("dblclick", "tr", function () {//给tr或者td添加click事件
		var dt = table.row(this).data();//获取值的对象数据
		data["unit"] = dt.supplier_code;
		data["unit_name"] = dt.supplier_name;
		//子触发确定按钮
		parent.$(".layui-layer-btn0").click();
	});

	form.on('checkbox(allChoose)', function (data) {
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
		child.each(function (index, item) {
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});
	// 查询
	$("#btn-query").on('click', function () {
		table.ajax.reload();
	});
	$("#btn-reset").on('click', function () {
		$("select[name='dateTable_length']").attr("lay-ignore", "");
	});
	exports('supplierWin', {});
});
