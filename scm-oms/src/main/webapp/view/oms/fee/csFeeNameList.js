/**
 * 费用名称管理
 *
 * @author Adolph Zheng
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;

    xmtc.getDictMap('fee_type');
    xmtc.getDictMap('biz_fee_type');
    xmtc.getDictMap('yes_no');

    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/feeName/page",
            data: function (data) {
                data.fee_name_code = $.trim($("#fee_name_code_query").val());
                data.fee_name = $.trim($("#fee_name_query").val());
                data.fee_type = $.trim($("#fee_type_query").val());
                data.status = $.trim($("#status_query").val());
                data.pay_or_receive = $.trim($("#pay_or_receive_query").val());
            }
        },
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }
            },
            {data: 'fee_name_code'},
            {data: 'fee_name'},
            {
                data: function (row) {
                    return xmtc.getDictVal('fee_type', row.fee_type);
                }
            },
            {
                data: function (row) {
                    return xmtc.getDictVal('biz_fee_type', row.pay_or_receive);
                }
            },
            {data: 'subject_code'},
            {data: 'subject_name'},
            {data: 'outer_subject_code'},
            {
                data: function (row) {
                    return xmtc.getDictVal('yes_no', row.is_cost_accounting);
                },sClass: "text-c"
            },
            {
                data: function (row) {
                    return xmtc.getDictVal('yes_no', row.is_submit_financial_system);
                },sClass: "text-c"
            },
            {
            	data: function (row) {
                    return xmtc.getDictVal('yes_no', row.is_fueling_up);
                },sClass: "text-c"
            },
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
            layer.msg("已启用的不能删除");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/feeName/delete", {id: id}, function (data) {
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
        openFeeNameEdit("编辑费用名称", id);
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
        openFeeNameEdit("编辑费用名称", null);
    });

    // 删除车辆
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
                    xmtc.ajaxPost(base + "/feeName/delete", {id: ids.join(",")}, function (data) {
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
                    xmtc.ajaxPost(base + "/feeName/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
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
                    xmtc.ajaxPost(base + "/feeName/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
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
        $("#dateTable").find(":checkbox:checked").each(function () {
            ids.push($(this).attr("data-id"));
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

    // 打开维护界面
    function openFeeNameEdit(title, id) {
        var url = "csFeeNameForm.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url, "600","370");
    }

    exports('csFeeNameList', {});
});
