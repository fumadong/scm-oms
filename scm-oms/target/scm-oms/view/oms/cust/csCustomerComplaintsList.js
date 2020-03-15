/**
 * 客户投诉管理
 *
 * @author Bill Lin
 */

var table = null;
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;
    
    xmtc.getDictMap('complaints_type');
    xmtc.getDictMap('complaints_status');
    xmtc.getDictMap('bill_type');
    
    table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/cust/csCustomerComplaints/query",
            data: function (data) {
                data.customer_id = $("#id").val();
            }
        },
        "columns": [                            // 自定义数据列
        	{
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
                }
            },
            {data: 'complaints_no'},
            {
            	data: function (obj) {
                	return xmtc.getDictVal("bill_type",obj.bill_type);
                }
            },
            {data: 'bill_no'},
            {
            	data: function (obj) {
                	return xmtc.getDictVal("complaints_type",obj.complaints_type);
                }
            },
            {data: 'complainant'},
            {data: 'create_time'},
            {data: 'carrier_name'},
            {data: 'drive_name'},
            {data: 'vehicle_no'},
            {data: 'occurrence_time'},
            {
            	data: function (obj) {
                	return xmtc.getDictVal("complaints_status",obj.complaints_status);
                }
            },
            {data: 'complaints_content'},
            {data: 'remark'},
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>' +
                        '<a title="删除" class="ml-5 btn-delete" data-id="' + obj.id + '"><i class="layui-icon">&#xe640;</i></a>';
                },
                class: 'text-center',
                width: 92
            }
        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
        	$("select[name='dateTable_length']").attr("lay-ignore","");                                       
        	// 重新渲染form checkbox
            form.render('checkbox');
            form.render('select');
        }
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/cust/csCustomerComplaints/delete", {id: id}, function (data) {
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
        gotoForm("维护客户投诉", id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
         gotoForm("维护客户投诉", data.id);
    });
    
    // 查询
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    $("#btn-reset").on('click', function () {
    	  $("select[name='dateTable_length']").attr("lay-ignore","");
    	  form.render('select');
    });
    
    // 新增
    $("#btn-add").on('click', function () {
    	gotoForm("编辑客户投诉", null);
    });
    
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });

    $("#btn-handle").on('click', function () {
    	handleHandler();
    });
    
    /**
     * 处理
     * @returns
     */
    function handleHandler() {
    	//获取勾选的行记录
    	var selectRows = xmtc.getRows(table,$('#dateTable'));

        if (selectRows.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
        	
        	//跳转到明细界面进行处理
            gotoForm("投诉处理", selectRows[0].id,"2")
        }
    }

    /**
     * 删除客户投诉记录
     * @returns
     */
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/cust/csCustomerComplaints/delete", {id: ids.join(",")}, function (data) {
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

    // 打开客户投诉界面
    function gotoForm(title, id,sourceType) {
    	
    	if(!sourceType){
    		//来源类型非空时,默认为1
    		sourceType = 1;
    	}
        var url = "csCustomerComplaintsForm.jsp";
        if (id) {
            url += "?id=" + id+"&sourceType="+sourceType;
        }
        layer_show(title, url, '100%','100%');
    }

    exports('csCustomerComplaintsList', {});
});
