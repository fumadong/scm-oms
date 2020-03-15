/**
 * 供应商管理
 *
 * @author Adolph Zheng
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;

    $(".sns-addrselector").addrDropMenu({
        "level" : 3,
        "hotCity" : false
    });

    xmtc.getDictMap('supplier_type');
    var table = $('#dateTable').DataTable({
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
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }
            },
            {data: 'supplier_code'},
            {data: 'supplier_name'},
            {
                data: function (row) {
                    return xmtc.getDictVal('supplier_type', row.supplier_type);
                }
            },
            {data: 'settlement_code'},
            /*{data: 'office'},*/
            {data: 'contact'},
            {data: 'tel'},
            {data: function (row) {
                return xmtc.nullToSpace(row.province_name) + xmtc.nullToSpace(row.city_name) + xmtc.nullToSpace(row.county_name);
            }},
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
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        if (status == "1") {
            xmtc.failMsg("非停用状态的记录无法进行删除操作");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/supplier/delete", {id: id}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        layer.msg('操作成功');
                    } else {
                        layer.msg('删除失败');
                    }
                });
            });
        }
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        openSupplierEdit("编辑承运商", id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
        openSupplierEdit("编辑承运商", data.id);
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

    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });

    $("#btn-enable").on('click', function () {
        enabledHandler();
    });

    $("#btn-disable").on('click', function () {
        disabledHandler();
    });

    // 新增
    $("#btn-add").on('click', function () {
        openSupplierEdit("编辑承运商", null);
    });

    // 删除车辆
    function deleteHanlder() {
        debugger;
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            var str = getSeclectStatus().join(",");
            if (str.indexOf("1") > -1) {
                layer.msg("已启用的不能删除");
            } else {
                layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                    xmtc.ajaxPost(base + "/supplier/delete", {id: ids.join(",")}, function (data) {
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
            xmtc.ajaxPost(base + "/supplier/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg('操作失败');
                }
            });
        }
    }

    // 停用
    function disabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            layer.confirm('确认要停用吗？', function (index) {
                xmtc.ajaxPost(base + "/supplier/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        layer.msg('操作成功');
                    } else {
                        layer.msg('操作失败');
                    }
                });
            });
        }
    }

    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
        });
        return ids;
    }

    function getSeclectStatus() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            ids.push($(this).attr("data-status"));
        });
        return ids;
    }

    // 打开车辆维护界面
    function openSupplierEdit(title, id) {
        var url = "supplierEdit.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url,"600","360");
    }

    exports('supplierList', {});
});
