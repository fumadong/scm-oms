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
	            	data.order_no = $.trim($("#order_no_query").val());
	                data.customer_order_no = $.trim($("#customer_order_no_query").val());
	                data.customer_code = $.trim($("#customer_code_query").val());
	                data.customer_type = $("#customer_type_query").val();
	                data.status = '20';//审核页面查询审核状态的订单
	                data.order_type = $("#order_type_query").val();
	                data.shipper_code = $.trim($("#shipper_code_query").val());
	                data.shipper_name = $.trim($("#shipper_name_query").val());
	                data.consignee_code = $.trim($("#consignee_code_query").val());
	                data.consignee_name = $.trim($("#consignee_name_query").val());
	                data.charge_mode = $("#charge_mode_query").val();
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
	            { data: // 订单类型
	                function (obj) {
	                	var statusHtml = xmtc.getDictVal("order_type", obj.order_type) + '</span>';
	                	return statusHtml;
	                }
	            },
	            { data: 
	            	function (obj) {
	                	var html = obj.order_task_num==null?"未生成":obj.order_task_num;
	                	return html;
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
	        var id = $(this).attr('data-id');
	        editHanlder("edit", id);
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
    
    /**
     * 查询
     */
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    
    /**
     * 新增
     */
    $("#btn-add").on('click', function () {
    	editHanlder("add", null);
    });
    
    /**
     * 复制
     */
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
    
    /**
     * 删除
     */
    $("#btn-delete").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]!=="10"){
        			xmtc.failMsg('存在非创建状态的订单, 无法删除');
        			return;
        		}
        	}
        	// 执行删除
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/api/oms/order/csOrder/deleteOrdersAndSubDatas", { ids: ids.join(",")}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        xmtc.successMsg('删除成功');
                    } else {
                    	if (data.msg) {
                    		xmtc.failMsg(data.msg);
                    	} else {
                    		xmtc.failMsg('删除失败');
                    	}
                    }
                });
            });
        }
    });
    
    /**
     * 审核
     */
    $("#btn-audit").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]!=="10"){
        			xmtc.failMsg('存在非创建状态的订单, 无法审核');
        			return;
        		}
        	}
        	xmtc.ajaxPost(base + "/api/oms/order/csOrder/audit", { ids: ids.join(",") }, function (data) {
        		if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('确认成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('确认失败');
                	}
                }
            });
        }
    });
    
    /**
     *  取消审核
     */
    $("#btn-audit-cancel").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]!=="20"){
        			xmtc.failMsg('存在非审核状态的订单, 无法取消审核');
        			return;
        		}
        	}
        	// 执行取消确认
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/auditCancel", { ids: ids.join(",") }, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('取消审核成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('取消审核失败');
                	}
                }
            });
        }
    });
    
    /**
     * 下发
     */
    $("#btn-issue").on('click', function () {
    	var ids = getSeclectIds();
        if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var status = getSeclectStatus();
        	for(var i = 0; i<status.length;i++){
        		if(status[i]!=="20"){
        			xmtc.failMsg('存在非审核状态的订单, 无法下发');
        			return;
        		}
        	}
        	// 执行取消确认
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/issue", { ids: ids.join(",") }, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('下发成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('下发失败');
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
    
    // 自动分配承运商
    $("#btn-auto-distribution").on('click', function () {
    	var selectRows = xmtc.getRows(table, $('#dateTable'));
    	if (selectRows.length === 0) {
    		xmtc.failMsg("请选择一条记录");
    	} else if (selectRows.length > 1) {
    		xmtc.failMsg("请只选择一条记录");
    	} else {
			var row = selectRows[0];
			if (!(row.status === '20' || row.status === '30')) {
                xmtc.failMsg('订单状态不为确认、执行中，无法分配');
                return;
            }
			if (row.remainder_amount === 0) {
				xmtc.failMsg('订单剩余量为0，无需再分配');
                return;
			}
			// 打开分配订单界面
			var url = base + "/view/oms/order/csOrderAutoDistribution.jsp?order_no=" + row.order_no + "&from=list";
			layer_show('自动分配承运商', url, '100%','100%');
    	}
    });
    
    // 仓库分配
    $("#btn-wh-distribution").on('click', function () {
    	var selectRows = xmtc.getRows(table, $('#dateTable'));
    	if (selectRows.length === 0) {
    		xmtc.failMsg("请选择一条记录");
    	} else if (selectRows.length > 1) {
    		xmtc.failMsg("请只选择一条记录");
    	} else {
			var row = selectRows[0];
			//if (!(row.status === '20' || row.status === '30')) {
			//    xmtc.failMsg('订单状态不为确认、执行中，无法分配仓库');
			//    return;
			//}
			if(row.warehouse_code) {
				// 提示是否重新分配仓库
	            layer.confirm('仓库已存在, 是否重新分配？', function (index) {
	            	arrangeWarehouse(row);
	            });
			} else {
				arrangeWarehouse(row);
			}
    	}
    });
    
    /**
     * 仓库分配
     */
    function arrangeWarehouse(order) {
    	xmtc.ajaxPost(base + "/api/oms/order/csOrder/arrangeWarehouse", { id: order.id}, function (data) {
            if (data.success) {
                table.ajax.reload();
                xmtc.successMsg('仓库分配成功');
            } else {
            	if (data.msg) {
            		xmtc.failMsg(data.msg);
            	} else {
            		xmtc.failMsg('仓库分配失败');
            	}
            }
        });
    };
    
    /**
     * 获取表格选中行的ID
     */ 
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
        	var id = $(this).attr("data-id");
        	if(id){
        		ids.push(id);
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
    		var state = $(this).attr("data-status");
    		if(state){
    			status.push(state);
    		}
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

    exports('csOrderIssue', {});
});
