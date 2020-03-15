/**
 * 科目管理
 * @author Joan.Zhang
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;

    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/fee/csSubject/page",
            data: function (data) {
                data.subject_code = $.trim($("#subject_code").val());
                data.subject_name = $.trim($("#subject_name").val());
            }
        },
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '"/>';
                }
            },
            {data: 'subject_code'},
            {data: 'subject_name'},
            {
                data: function (row) {
                	if(row.is_personal){
                        return xmtc.getDictVal('yes_no', row.is_personal);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            },
            {
                data: function (row) {
                	if(row.is_project){
                        return xmtc.getDictVal('yes_no', row.is_project);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            },
            {
                data: function (row) {
                	if(row.is_customer){
                        return xmtc.getDictVal('yes_no', row.is_customer);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            },
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
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
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
        	xmtc.ajaxPost(base + "/fee/csSubject/delete", {id: id}, function (data) {
        		if (data.success) {
        			table.ajax.reload();
        			layer.msg('操作成功');
                } else {
                	layer.msg('删除失败');
                }
           });
        });	
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        openEdit("编辑科目", id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
        openEdit("编辑科目", data.id);
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

    // 新增
    $("#btn-add").on('click', function () {
        openEdit("编辑科目", null);
    });

    // 删除科目
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            	xmtc.ajaxPost(base + "/fee/csSubject/delete", {id: ids.join(",")}, function (data) {
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

    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
        	if($(this).attr("data-id")){
        		ids.push($(this).attr("data-id"));
        	}            
        });
        return ids;
    }

    // 打开维护界面
    function openEdit(title, id) {
        var url = base+"/view/oms/fee/csSubjectForm.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url, "600","350");
    }

    exports('csSubjectList', {});
});
