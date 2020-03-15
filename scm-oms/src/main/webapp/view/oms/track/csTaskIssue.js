/**
 * 任务下发记录
 * @author Samuel
 */
layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage, laydate = layui.laydate;

    var table = $('#dateTable').DataTable(
    	{   ajax: {
	            url: base + "/api/oms/track/csTaskIssue/query",
	            data: function (data) {
	            	data.order_no = $.trim($("#order_no_query").val());
	                data.customer_order_no = $.trim($("#customer_order_no_query").val());
	                data.order_task_no = $.trim($("#order_task_no_query").val());
	                data.issue_status = $("#issue_status_query").val();
	                data.exclude_issue_status = "NEW";// 排除创建状态的任务
	                data.customer_code = $.trim($("#customer_code_query").val());
	                data.customer_name = $.trim($("#customer_name_query").val());
	                data.shipper_code = $.trim($("#shipper_code_query").val());
	                data.shipper_name = $.trim($("#shipper_name_query").val());
	                data.consignee_code = $.trim($("#consignee_code_query").val());
	                data.consignee_name = $.trim($("#consignee_name_query").val());
	            }
	        },
	        "columns": [                            // 自定义数据列
	            { data: 
	                function (obj) {
	                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.issue_status + '"/>';
	                }
	            },
	            { data: // 客户订单号、系统订单号 
	            	function (obj) {
	            		var orderHtml = '';
	            		if (obj.order_task_no) {
	            			orderHtml += obj.order_task_no;
	            		}
	            		orderHtml += '<br>';
	            		orderHtml += obj.order_no;
	            		return orderHtml;
	            	}
	            },
	            { data: 'task_type_name'}, // 订单任务类型
	            { data: // 状态
	                function (obj) {
	                	return xmtc.getDictVal("task_issue_status", obj.issue_status);
	                }
	            },
	            { data: 'issue_try_times' },
	            { data: 'issue_time' },
	            { data: 'customer_name' },
	            { data: // 收发客户
	            	function (obj) {
		            	var html = '发: ';
		            	if (obj.shipper_name) {
		            		html += obj.shipper_name;
		            	}
		            	html += '<br>' + '收: ';
		            	if (obj.consignee_name) {
		            		html += obj.consignee_name;
		            	}
		            	return html;
	            	}
	            },
	            { data:'warehouse_name'},
	            { data: 'carrier_name' },
	            {data: 
	            	function (obj) {
	            		return obj.order_time;
	            	}
	            },
	            {data: 
	            	function (obj) {
	                    return '<a title="重新下发" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe609;</i></a>';
	                },
	            	width: 80,
	            	sClass: "text-c"
	            }
	        ],
	        "stateSaveParams": function () {
	        	// 重新渲染form checkbox
	            form.render('checkbox');
	            form.render('select');
	        }
	    });

    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    // 查询-按钮
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    
    // 新增-查看下发日志
    $("#btn-log").on('click', function () {
    	var ids = getSeclectIds();
    	if (ids.length === 0) {
            xmtc.failMsg("请选择一条记录");
        } else if (ids.length > 1) {
        	xmtc.failMsg("请只选择一条记录");
        } else {
        	var url = base + "/view/oms/track/csTaskIssueLogWindow.jsp"+ "?order_task_id=" + ids[0];
        	// 编辑订单
        	layer_show("任务下发日志", url, '650','400');
        }
    });
    
    // 重新下发-按钮
    $("#btn-reissue").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]==="SUCCESS"){
        			xmtc.failMsg('任务已下发, 无法重新下发');
        			return;
        		}
        	}
        	xmtc.ajaxPost(base + "/api/oms/track/csTaskIssue/reissue", { ids: ids.join(",") }, function (data) {
        		if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('正在下发中，请刷新查看下发状态');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('重新下发失败');
                	}
                }
            });
        }
    });
    
    /**
     * 获取表格选中行的ID
     */ 
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
        });
        return ids;
    }
    
    /**
     * 获取表格选中行的状态
     */
    function getSeclectStatus() {
    	var status = [];
    	$("#dateTable").find(":checkbox:checked").each(function () {
    		status.push($(this).attr("data-status"));
    	});
    	return status;
    }
    
  //=====================================界面弹出框配置Start=====================================
    /**
     * 委托客户弹出框
     */
    $("#customer_name_query").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "委托客户", 600, 432, "code", "name", function(data) {
    		$("#customer_code_query").val(data["customer_code"]);  
		    $("#customer_name_query").val(data["customer_name"]);
    	});
    });
    
    /**
     * 发货客户弹出框
     */
    $("#shipper_name_query_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "发货客户", 600, 432, "code", "name", function(data) {
    		$("#shipper_code_query").val(data["customer_code"]);  
		    $("#shipper_name_query").val(data["customer_name"]);
    	});
    });
    
    /**
     * 发货客户弹出框手工编辑值后清空发货客户代码的值
     */
    $("#shipper_name_query").on('input', function(e) {
    	$("#shipper_code_query").val(null);
    });
    
    /**
     * 收货客户弹出框
     */
    $("#consignee_name_query_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "收货客户", 600, 432, "code", "name", function(data) {
    		$("#consignee_code_query").val(data["customer_code"]);  
		    $("#consignee_name_query").val(data["customer_name"]);
    	});
    });
    
    /**
     * 收货客户弹出框手工编辑值后清空收货客户代码的值
     */
    $("#consignee_name_query").on('input', function(e) {
    	$("#consignee_code_query").val(null);
    });
    //=====================================界面弹出框配置End=====================================

    exports('csTaskIssue', {});
});
