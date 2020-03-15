/**
 * 发票类型
 *
 * @author Dylan Fu
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;


    //获取table标签
    var table = $('#dateTable').DataTable({
        ajax: {
            //后端接口地址
            url: base + "/invoice/page",
            //前端数据解析
            data: function (data) {
                debugger;
                var param = $("#queryFrom").serializeArray();//将Form标签序列化
                if (Array.isArray(param)) {
                    for (var i = 0; i < param.length; i++) {//遍历表单的name 和 value
                        var _name = param[i].name;
                        data[_name] = param[i].value;
                    }
                }
            }
        },
        "columns": [  // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }
            },
            {data: 'invoice_type_code'},
            {data: 'invoice_type_name'},
            {
                data: function (row) {
                    return xmtc.getDictVal('rp_flag', row.rp_flag);
                }
            },
            {
                data: function (row) {
                    return xmtc.getDictVal('cp_flag', row.cp_flag);
                }

            },
            {data: 'account_name'},
            {data: 'sub_account_name'},
            {data: 'taxrate'},
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
                xmtc.ajaxPost(base + "/invoice/delete", {id: id}, function (data) {
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
    }).on("dblclick", "tr", function () {//给tr或者td添加click事件
        var data = table.row(this).data();//获取值的对象数据
        openSupplierEdit("编辑承运商", data.id);
    });


    //表单全选
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

    //删除
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });



    // 新增
    $("#btn-add").on('click', function () {
        openSupplierEdit("发票", null);
    });

    // 删除发票
    function deleteHanlder() {
        var ids = getSeclectIds();
        //判断选中状态
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            var str = getSeclectStatus().join(",");
            if (str.indexOf("1") > -1) {
                layer.msg("已启用的不能删除");
            } else {
                layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                    xmtc.ajaxPost(base + "/invoice/delete", {id: ids.join(",")}, function (data) {
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


    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            if ($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== "") {
                ids.push($(this).attr("data-id"));
            }
        });
        return ids;
    }

    //获取发票状态
    function getSeclectStatus() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            ids.push($(this).attr("data-status"));
        });
        return ids;
    }

    // 打开发票界面
    function openSupplierEdit(title, id) {
        var url = "csInvoiceTypeEdit.jsp";//需要打开的页面
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url, "600", "360");//设置窗口的标题，尺寸
    }

    exports('csInvoiceType', {});
});
