/**
 * 仓库管理
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;
	xmtc.getDictMap('yes_no');
	xmtc.getDictMap('warehouse_type');
	var table= $('#dataTable').DataTable({
		ajax: {
			url: base + "/warehouse/page",
			data: function(data){
				data.warehouse_code = $.trim($('#warehouse_code').val());
				data.warehouse_name = $.trim($('#warehouse_name').val());
				data.superior_warehouse_name = $.trim($('#superior_warehouse_name').val());
				data.service_area_code = $.trim($('#service_area_code').val());
				data.service_area_name = $.trim($('#service_area_name').val());
				data.status = $.trim($('#status_query').val());
			}
		},
		"columns":[
			{
				data: function(obj){
					 return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
				}
			},
			{data: 'warehouse_name'},
			{data: 'superior_warehouse_name'},
			{data: 'service_area_name'},
			{data: function (obj) {
        		if (obj) {
        			return xmtc.getDictVal("warehouse_type", obj.warehouse_type);
        		} else {
        			return "";
        		}
        	}},
			{data: 'tel'},
			{data: 'area'},
			{data: 'volume'},
			{data: 'address'},
			{
				 data: function (obj) {
	                    if (obj.status == "1") {
	                        return '<span class="c-green">启用</span>';
	                    } else {
	                        return '<span class="layui-disabled">停用</span>';
	                    }
	                },
	                width: 80,
	                sClass: "text-c"
            },
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
                width: 80,
                sClass: "text-c"
            }
		],
		"stateSaveParams": function () {
            // 初始化完成调用事件
            // 重新渲染form checkbox
            form.render('checkbox');
        }
	}).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        openWarehouseEdit("编辑仓库", id);
    }).on('dblclick', 'tr', function () {
        var data = table.row(this).data();
        openWarehouseEdit("编辑仓库", data.id);
    });
	  // 查询
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    
    // 新增
    $("#btn-add").on('click', function () {
        openWarehouseEdit("编辑仓库", null);
    });
    
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });

    $("#btn-enable").on('click', function () {
        enabledHandler();
    });

    $("#btn-disable").on('click', function () {
        disabledHandler();
    });
    // 打开维护界面
    function openWarehouseEdit(title, id) {
        var url = "csWarehouseForm.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url, "600","450");
    }
	
    // 删除
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            var str = getSeclectStatus().join(",");
            if (str.indexOf("1") > -1) {
                layer.msg("已启用的不能删除");
            } else {
                layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                    xmtc.ajaxPost(base + "/warehouse/delete", {id: ids.join(",")}, function (data) {
                        if (data.success) {
                            table.ajax.reload();
                            layer.msg('操作成功');
                        } else {
                            layer.msg('删除失败');
                        }
                    });
                });
            }
        }
    }

    // 启用
    function enabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("1") != -1) {
                layer.msg("已启用的数据不能重复启用");
            } else {
                layer.confirm('确认要启用吗？', function (index) {
                    xmtc.ajaxPost(base + "/warehouse/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
                        if (data.success) {
                            table.ajax.reload();
                            layer.msg('操作成功');
                        } else {
                            layer.msg('启用失败');
                        }
                    });
                });
            }
        }
    }

    // 停用
    function disabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("0") != -1) {
                layer.msg("已停用的数据不能重复停用");
            } else {
                layer.confirm('确认要停用吗？', function (index) {
                    xmtc.ajaxPost(base + "/warehouse/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
                        if (data.success) {
                            table.ajax.reload();
                            layer.msg('操作成功');
                        } else {
                            layer.msg('停用失败');
                        }
                    });
                });
            }
        }
    }
    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dataTable").find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
        });
        return ids;
    }
    
    function getSeclectStatus() {
        var ids = [];
        $("#dataTable").find(":checkbox:checked").each(function () {
            ids.push($(this).attr("data-status"));
        });
        return ids;
    }
    
	exports('csWarehouseList', {});
});