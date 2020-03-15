/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var lot_id;
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;
    var dataTable = $('#dataTable').DataTable({
        "autoWidth": true,                      // 自适应宽度
        "stateSave": true,                      // 刷新后保存页数
        "ordering": false,
        "searching": false,                     // 本地搜索
        "info": false,                           // 控制是否显示表格左下角的信息
        "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
        "paging": true,
        "language": {                           // 国际化
            "url": base + '/static/frame/jquery/language.json'
        },
        // serverSide: true,                        //开启服务器模式
        ajax: {
            url: base + "/rule/csDivideTask/query",
            data: function (data) {
                data.divide_rule_id = id;
            }
        },
        "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "sServerMethod": "POST",               // POST
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '"/>';
                }
            },
            {data: 'task_sequence'},
            {data: 'task_type_code'},
            {data: 'task_type_name'},
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                }, sClass: 'text-c'
            }

        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
                                                   // 重新渲染form checkbox
            form.render('checkbox');
            form.render('select');
        }
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/customer/csCustomerContact/delete", {id: id}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('删除成功');
                } else {
                    layer.msg('删除失败');
                }
            });
        });
    }).on('click', '.btn-edit', function () {
        var detailId = $(this).attr('data-id');
        gotoDetailForm("编辑详情", detailId);
    }).on("dblclick", "tr", function () {//给tr或者td添加click事件
        var data = dataTable.row(this).data();//获取值的对象数据
        gotoDetailForm("编辑详情", data.id);
    });
    if(id){
        getDetailById();
    }else{
        $('#code').removeAttr('disabled');
        dataTable.ajax.reload();
    }


    // 获取费用名称
    function getDetailById() {
        if(id){
            xmtc.ajaxPost(base + "/rule/csDivideRule/getById", {id: id}, function (json) {
                if (json.data) {
                    $.each(json.data, function (key, value) {
                        if ($('#' + key)) {
                            $('#' + key).val(xmtc.nullToSpace(value));
                        }
                    });
                    dataTable.ajax.reload();
                    $('#id').val(id);
                    $('#code').attr("disabled","disabled");
                } else {
                    $('#code').removeAttr('disabled');
                }
                //列表
                form.render('select');
            });
        }else{
            $('#code').removeAttr('disabled');
        }

    }



    //关闭窗口
    $('#btn-close').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        xmtc.ajaxPost(base + "/rule/csDivideRule/saveOrUpdate", param, function (json) {
            if (json.success) {
                xmtc.parentSuccessMsg('保存成功');
                var data = json.data;
                id = data.id;
                getDetailById();
                parent.$('#btn-query').click();
            } else {
                layer.msg(json.msg);
            }
        });

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    /**
     * 刷新列表
     */
    $('#btn-sub-refresh').on('click', function () {
        dataTable.ajax.reload();
    });


    // 规则明细维护界面
    function gotoDetailForm(title, detailId) {
        var url = "csDivideTaskEdit.jsp?divide_rule_id=" + $('#id').val();
        if (detailId) {
            url += "&id=" + detailId;
        }
        layer_show(title, url, 600, 280);
    }

    //新增
    $('#btn-add').on('click', function () {
        if($('#id').val()){
            gotoDetailForm("编辑详情", null);
        }else{
            xmtc.failMsg('请先保存分解规则');
        }

    });

    //刷新列表
    $('#btn-sub-refresh').on('click', function () {
        dataTable.ajax.reload();
    });

    $('#btn-delete').on('click', function () {
        deleteHanlder();
    });

    // 删除
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/rule/csDivideTask/delete", {id: ids.join(",")}, function (data) {
                    if (data.success) {
                        dataTable.ajax.reload();
                        layer.msg('删除成功');
                    } else {
                        layer.msg('删除失败');
                    }
                });
            });
        }
    }

    /**
     * 委托客户弹出框
     */
    $("#customer_name").on('click', function () {
        var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
        top.xmtc.popUp(url, "客户", 600, 432, "code", "name", function(data) {
            $("#customer_code").val(data["customer_code"]);
            $("#customer_name").val(data["customer_name"]);
        });
    });

    /**
     * 承运商弹出框
     */
    $("#carrier_name").on('click', function () {
        top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
            var carrierCode = res["unit"];
            $("#carrier_code").val(carrierCode);
            $("#carrier_name").val(res["unit_name"]);
        });
    });

    // 弹出选择
    $("#warehouse_name").on('click', function () {
        top.xmtc.popUp(base+"/view/oms/warehouse/csWarehouseWin.jsp","仓库",600,432,"warehouse_code","warehouse_name",function(res){
            $("#warehouse_code").val(res["warehouse_code"]);
            $("#warehouse_name").val(res["warehouse_name"]);
        });
    });


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


    exports('csDivideRuleEdit', {});
});