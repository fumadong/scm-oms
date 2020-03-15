/**
 * 商品管理
 * @author Joan.Zhang
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;
    
    xmtc.getDictMap("cargo_type");
    xmtc.getDictMap("package_specification");
    xmtc.getDictMap("validity_unit");
    xmtc.getDictMap("unit");
    xmtc.getDictMap("currency");
    xmtc.getDictMap("warm_layer");
    
    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/cargo/csCargo/query",
            data: function (data) {
                data.cargo_code = $.trim($("#cargo_code").val());
                data.cargo_name = $.trim($("#cargo_name").val());
                data.cargo_type = $.trim($("#cargo_type option:selected").val());
                data.status = $.trim($("#status option:selected").val());
                data.customer_code = $.trim($("#customer_code").val());
                data.package_specification = $.trim($("#package_specification").val());
            }
        },
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }
            },
            {data: 'cargo_code'},
            {data: 'cargo_name'},
            {data: 'customer_name'},
            {data: 'package_name'},
            {
            	data: function (obj) {
    				if(obj){
    					return xmtc.getDictVal("cargo_type",obj.cargo_type);
    				}else{
    					return "";
    				}
    			}
            }, 
            {
            	data: function (obj) {
    				if(obj){
    					return xmtc.getDictVal("warm_layer",obj.warm_layer);
    				}else{
    					return "";
    				}
    			}
            },//温层
            {data: function(obj){ return obj.remark;},sClass:'layui-elip'},
            {
            	data: function (obj) {
            		if(obj.status=="1"){
    					return '<span class="c-green">启用</span>';
    				}else{
    					return '<span class="layui-disabled">停用</span>';
    				}
    			},sClass:'text-c'
            }, 
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },sClass:'text-c'
            }

        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
        	$("select[name='dateTable_length']").attr("lay-ignore","");
            form.render('checkbox');
            form.render('select');
        }
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/cargo/csCargo/delete", {id: id}, function (data) {
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
        gotoForm("编辑商品", id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
         gotoForm("编辑商品", data.id);
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
    	  $("select[name='dateTable_length']").attr("lay-ignore","");
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

    // 弹出选择
    $("#customer_name").on('click', function () {
    	//url,title,width,hight,id,name,callback
        var url = base + "/view/oms/cust/csCustomerWin.jsp";
    	xmtc.popUp(url,"货主",600,432,"unit","unit_name",function(res){
    		$("#customer_code").val(res["unit"]);  
		    $("#customer_name").val(res["unit_name"]);
    	});
    });

    // 新增
    $("#btn-add").on('click', function () {
    	gotoForm("商品新增", null);
    });

    // 删除商品
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");

        } else {
            var idsByStatus = getIdsByStatus("0");//获取启用状态的id集
            if (idsByStatus.length == 0) {
                layer.msg("非停用状态的记录无法进行删除操作");
                return false;
            }
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/cargo/csCargo/delete", {id: ids.join(",")}, function (data) {
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

    // 启用
    function enabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
        	var idsByStatus = getIdsByStatus("0");//获取停用状态的id集
            if (idsByStatus.length == 0) {
                layer.msg("已启用的数据不能重复启用");
            } else {
                xmtc.ajaxPost(base + "/cargo/csCargo/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        layer.msg('操作成功');
                    } else {
                        layer.msg('操作失败');
                    }
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
        	var idsByStatus = getIdsByStatus("1");//获取启用状态的id集
            if (idsByStatus.length == 0) {
                layer.msg("已停用的数据不能重复停用");
            } else {
                layer.confirm('确认要停用吗？', function (index) {
                    xmtc.ajaxPost(base + "/cargo/csCargo/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
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
    }

    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
        	var dataId = $(this).attr("data-id");
        	if(dataId){
        		ids.push(dataId);
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
    
    //获取选中行指定状态的id集合
    function getIdsByStatus(status) {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            var sts = $(this).attr("data-status");
            var id = $(this).attr("data-id");
            if(sts && sts == status && id){
            	ids.push(id);
            }           
        });
        return ids;
    }

    // 打开商品维护界面
    function gotoForm(title, id) {
        var url = base+"/view/oms/cargo/csCargoForm.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url,"100%","100%");
    }

    exports('csCargoList', {});
});
