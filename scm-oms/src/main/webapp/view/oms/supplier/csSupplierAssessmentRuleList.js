/**
 * 承运商考核规则
 * 
 * @author Samuel Yang
 */
layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate=layui.laydate;

    xmtc.getDictMap('property_status');
    
    /**
     * 承运商弹出框
     */
    $("#carrier_name").on('click', function () {
    	var url = base + "/view/oms/cust/supplierWin.jsp";
    	top.xmtc.popUp(url, "承运商", 600, 432, "unit", "unit_name", function(data) {
    		$("#carrier_code").val(data["unit"]);
    		$("#carrier_name").val(data["unit_name"]);
    	});
    });
    
    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/api/oms/csSupplierAssessmentRule/query",
            data: function (data) {
                data.rule_name = $.trim($("#rule_name_query").val());
                data.status = $.trim($("#status_query").val());
                data.remark = $.trim($("#remark_query").val());
            }
        },
        "columns": [                            // 自定义数据列
            {data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }},	
            {data: 'rule_name'},
            {data: function (row) {
                	if(row.effective_date){
                		return row.effective_date.substring(0,10);
                	}else{
                		return "";
                	}                    
                }},
            {data: function (row) {
		        	if(row.expiration_date){
		        		return row.expiration_date.substring(0,10);
		        	}else{
		        		return "";
		        	}                    
                }},
            {data: 'remark'},
            {data: function (obj) {
                    if (obj.status == "1") {
                        return '<span class="c-green">启用</span>';
                    } else {
                        return '<span class="layui-disabled">停用</span>';
                    }
                },
             width: 80,
             sClass: "text-c"},
            {data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
             width: 80,
             sClass: "text-c"}

        ],
        "stateSaveParams": function () {
            // 初始化完成调用事件
            // 重新渲染form checkbox
            form.render('checkbox');
        },"createdRow": function ( row, data, index ) {
        	// 创建行事件
        }
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        openRuleEdit("编辑规则", id);
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
    	openRuleEdit("编辑规则", null);
    });

    // 删除
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请选择记录");
        } else {
            var str = getSeclectStatus().join(",");
            if (str.indexOf("1") > -1) {
                layer.msg("已启用的规则不能删除");
            } else {
                layer.confirm('您确认要删除吗，删除后数据不可恢复？', function (index) {
                    xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentRule/delete", {id: ids.join(",")}, function (data) {
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
            xmtc.failMsg("请选择记录");
        } else {
            xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentRule/enable", {id: ids.join(",")}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg('启用失败');
                }
            });
        }
    }

    // 停用
    function disabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请选择记录");
        } else {
            xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentRule/disable", {id: ids.join(",")}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg('停用失败');
                }
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

    // 打开规则维护界面
    function openRuleEdit(title, id, ruleid) {
        var url = "csSupplierAssessmentRuleEdit.jsp";
        if (id) {
            url = url + "?id=" + id;
        }
        layer_show(title, url, $(window).width(), $(window).height(),function(){
        	table.ajax.reload();
        });
    }

    //日期格式化
    function dateFormat(date){
        var year = date.getFullYear();  
        var month = padleft0(date.getMonth() + 1);  
        var day = padleft0(date.getDate()); 
        return year + "-" + month + "-" + day;
    }
    
    //补齐两位数  
    function padleft0(obj) {  
        return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);  
    }
    
    exports('csSupplierAssessmentRuleList', {});
});
