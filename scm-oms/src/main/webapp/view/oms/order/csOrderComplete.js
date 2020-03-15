/**
 * 订单审核
 * @author Samuel
 */
layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage, laydate = layui.laydate;

    var table = $('#dateTable').DataTable(
    	{   ajax: {
	            url: base + "/api/oms/order/csOrder/query",
	            data: function (data) {
	                data.customer_order_no = $.trim($("#customer_order_no").val());
	                data.customer_code = $.trim($("#customer_code_query").val());
	                data.customer_type = $("#customer_type option:selected").val();
	                data.order_type = $("#order_type option:selected").val();
	                data.status = "30"
	                data.shipper_code = $.trim($("#shipper_code_query").val());
	                data.shipper_name = $.trim($("#shipper_name_query").val());
	                data.consignee_code = $.trim($("#consignee_code_query").val());
	                data.consignee_name = $.trim($("#consignee_name_query").val());
	                data.charge_mode = $("#charge_mode option:selected").val();
	                data.order_no = $.trim($("#order_no").val());
	            }
	        },
	        "columns": [                            // 自定义数据列
	            { data:
	                function (obj) {
	                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
	                }
	            },
	            { data: // 客户订单号、系统订单号
	            	function (obj) {
	            		var orderHtml = '';
	            		if (obj.customer_order_no) {
	            			orderHtml += obj.customer_order_no;
	            		}
	            		orderHtml += '<br>';
	            		orderHtml += obj.order_no;
	            		return orderHtml;
	            	}
	            },
	            { data: // 状态
	                function (obj) {
	                	var statusHtml;
	                	if (obj.status != '40') {
	                		statusHtml = '<span class="c-green">';
	                	} else {
	                		statusHtml = '<span class="layui-disabled">';
	                	}
	                	statusHtml += xmtc.getDictVal("order_status", obj.status) + '</span>';
	                	return statusHtml;
	                }
	            },
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
	            { data: // 订单要求日期
	            	function (obj) {
	        			var requireTime = obj.require_time_from + '<br>' + obj.require_time_to;
		        		return requireTime;
	            	}
	            },
	            { data:'warehouse_name'},
	            { data: 'carrier_name' },
	            { data: 'ea_quantity' }, // 数量
	            {data:
	            	function (obj) {
	            		return obj.order_time;
	            	}
	            },
	            {data:
	            	function (obj) {
	                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
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
	    }).on('click', '.btn-edit', function () {
            var order_id = $(this).attr('data-id');
            editHanlder("edit", order_id);
		}).on("dblclick","tr",function () {
			//获取值的对象数据
			var data = table.row(this).data();
			editHanlder("edit", data.id);
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

    /**
     * 完成
     */
    $("#btn-complete").on('click', function () {
        var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
            // 状态校验
            var status = getSeclectStatus();
            for(var i = 0; i<status.length;i++){
                if(status[i]!=="30"){
                    xmtc.failMsg('存在非下发状态的订单, 无法完成');
                    return;
                }
            }
            xmtc.ajaxPost(base + "/api/oms/order/csOrder/complete", { ids: ids.join(",") }, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('操作成功');
                } else {
                    if (data.msg) {
                        xmtc.failMsg(data.msg);
                    } else {
                        xmtc.failMsg('操作失败');
                    }
                }
            });
        }
    });
    
    /**
     * 取消下发
     */
    $("#btn-issue-cancel").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]!=="30"){
        			xmtc.failMsg('存在非下发状态的订单, 无法取消下发');
        			return;
        		}
        	}
        	// 执行取消确认
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/issueCancel", { ids: ids.join(",") }, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('取消下发成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('取消下发失败');
                	}
                }
            });
        }
    });

    // 复制-按钮
    $("#btn-copy").on('click', function () {
        var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择一条记录");
        } else if (ids.length > 1) {
            xmtc.failMsg("请只选择一条记录");
        } else {
            editHanlder("copy", ids[0]);
        }
    });

    // 取消订单-按钮
    $("#btn-cancel-order").on('click', function () {
        var ids = getSeclectIds();
        var prompt = "确认要取消订单吗？";
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
            // 状态校验
            var status = getSeclectStatus();
            for(var i = 0; i<status.length;i++){
                if(status[i]==="90" || status[i]==="99"){
                    xmtc.failMsg('存在完成/取消状态的订单, 不能订单');
                    return;
                }
                if(status[i]==="30"){
                    prompt = "存在已下发订单，是否取消订单？";
				}
            }
            // 执行取消确认，
            layer.confirm(prompt, function (index) {
                xmtc.ajaxPost(base + "/api/oms/order/csOrder/abolish", {ids: ids.join(",")}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        xmtc.successMsg('取消订单成功');
                    } else {
                        if (data.msg) {
                            xmtc.failMsg(data.msg);
                        } else {
                            xmtc.failMsg('取消订单失败');
                        }
                    }
                });
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
     * 获取表格选中行的系统订单号集合
     */ 
    function getSeclectOrderNos() {
        var orderNos = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
        	orderNos.push($(this).attr("data-id"));
        });
        return orderNos;
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

    /**
     * 打开维护界面
     */
    function editHanlder(type, id) {
        var url = base + "/view/oms/order/csOrderEdit.jsp";
        if (type === "copy") {
            url += "?isCopy=true";
        } else {
            url += "?isCopy=false";
        }
        if (id) {
            url += "&id=" + id;
        }

        if (type === "edit") {
            // 编辑订单
            layer_show("编辑订单", url, '100%','100%');
        } else {
            // 新增订单:新增、复制触发
            layer_show("编辑订单", url, '100%','100%');
        }
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

    exports('csOrderComplete', {});
});
