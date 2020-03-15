/**
 * 订单管理
 *
 * @author Devin
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
	                data.status = $("#status option:selected").val();
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
	                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.order_no + '" data-status="' + obj.status + '"/>';
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
	            { data:'warehouse_name'},
	            { data: 'plan_amount' },
	            { data: 'distribution_amount' }, // 已分配量
	            { data:	// 剩余量(当数量不为0时红色显示，值=计划量-已分配量)
	            	function (obj) {
	            		var remainderAmount = obj.remainder_amount;
	            		var html;
	            		if (remainderAmount !== 0) {
	            			html = '<span class="c-red">' + remainderAmount + '</span>';
	            		} else {
	            			html = remainderAmount;
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
	            { data: // 计费节点
	            	function (obj) {
	            		if (obj) {
	            			return xmtc.getDictVal("charge_node", obj.charge_node);
	            		} else {
	            			return "";
	            		}
	            	}
	            },
	            { data: // 结算方式
	            	function (obj) {
	            		if (obj) {
	            			return xmtc.getDictVal("charge_mode", obj.charge_mode);
	            		} else {
	            			return "";
	            		}
	            	}
	            },
	            {data: 
	            	function (obj) {
	            		return obj.order_time.substring(0, 10);
	            	}
	            },
	            {data: 
	            	function (obj) {
	                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.order_no + '"><i class="layui-icon">&#xe642;</i></a>';
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
	        var orderNo = $(this).attr('data-id');
	        editHanlder("edit", orderNo);
	    }).on("dblclick","tr",function () {
	    	//获取值的对象数据
	    	var data = table.row(this).data();
	        editHanlder("edit", data.order_no);
	    }).on('click', '.btn-delete', function () {
	    	var status = $(this).attr('data-status');
	    	// 数据校验
	        if (status !== '10') {
	            xmtc.failMsg('订单不是创建状态, 无法删除');
	            return;
	        }
	    	// 执行删除
	        var orderNo = $(this).attr('data-id');
	        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
	            xmtc.ajaxPost(base + "/api/oms/order/csOrder/deleteOrdersAndSubDatas", { order_nos: orderNo }, function (data) {
	                if (data.success) {
	                    table.ajax.reload();
	                    xmtc.successMsg('操作成功');
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
	);

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
    
    // 新增-按钮
    $("#btn-add").on('click', function () {
    	editHanlder("add", null);
    });
    
    // 复制-按钮
    $("#btn-copy").on('click', function () {
    	var orderNos = getSeclectOrderNos();
        if (orderNos.length === 0) {
            xmtc.failMsg("请选择一条记录");
        } else if (orderNos.length > 1) {
        	xmtc.failMsg("请只选择一条记录");
        } else {
        	editHanlder("copy", orderNos[0]);
        }
    });
    
    // 删除-按钮
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });
    
    // 确认-按钮
    $("#btn-confirm").on('click', function () {
    	confirmHanlder();
    });
    
    // 取消确认-按钮
    $("#btn-cancelConfirm").on('click', function () {
    	cancelConfirmHanlder();
    });
    
    // 分配-按钮
    $("#btn-distribution").on('click', function () {
    	distributionHanlder();
    });
    
    // 完成-按钮
    $("#btn-complete").on('click', function () {
    	completeHanlder();
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
    
    //物流方案
    $("#btn-plan").on('click', function () {
    	//弹出物流方案框
    	var url = base + "/view/oms/order/csLogisticsPlanWin.jsp";
		layer_show('物流方案', url, '700','440');
    	
    });
    
    /**
     * 仓库分配
     */
    function arrangeWarehouse(order) {
    	xmtc.ajaxPost(base + "/api/oms/order/csOrder/arrangeWarehouse", { id: order.id}, function (data) {
            if (data.success) {
                table.ajax.reload();
                xmtc.successMsg('操作成功');
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
     * 删除订单
     */ 
    function deleteHanlder() {
        var orderNos = getSeclectOrderNos();
        if (orderNos.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("20") !== -1
            		|| statusStr.join(",").indexOf("30") !== -1
            		|| statusStr.join(",").indexOf("40") !== -1
            	) {
                xmtc.failMsg('存在非创建状态的订单, 无法删除');
                return;
            } 
        	// 执行删除
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/api/oms/order/csOrder/deleteOrdersAndSubDatas", { order_nos: orderNos.join(",")}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        xmtc.successMsg('操作成功');
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
    }
    
    /**
     * 确认订单
     */
    function confirmHanlder() {
        var orderNos = getSeclectOrderNos();
        if (orderNos.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("20") !== -1
            		|| statusStr.join(",").indexOf("30") !== -1
            		|| statusStr.join(",").indexOf("40") !== -1
            	) {
            	xmtc.failMsg('存在非创建状态的订单, 无法确认');
                return;
            } 
            // 是否存在没有维护商品的订单，若存在则给出提示信息
            var isOk = true;
            var selectRows = xmtc.getRows(table, $('#dateTable'));
            for (var index in selectRows) {
                if (selectRows[index].plan_amount === 0) {
                	isOk = false;
                	layer.confirm('存在没有维护商品的订单，确认要继续操作吗？', function (index) {
                		// 执行确认
                		ajaxConfirmOrders(orderNos);
                	});
                	break;
                }
            }
            if (isOk) {
            	// 执行确认
        		ajaxConfirmOrders(orderNos);
            }
        }
    }
    
    /**
     * 调用后端执行确认
     */
    function ajaxConfirmOrders(orderNos) {
    	xmtc.ajaxPost(base + "/api/oms/order/csOrder/confirmOrders", { order_nos: orderNos.join(",") }, function (data) {
			if (data.success) {
                table.ajax.reload();
                xmtc.successMsg('操作成功');
            } else {
            	if (data.msg) {
            		xmtc.failMsg(data.msg);
            	} else {
            		xmtc.failMsg('确认失败');
            	}
            }
        });
    }
    
    /**
     * 取消确认订单
     */
    function cancelConfirmHanlder() {
    	var orderNos = getSeclectOrderNos();
        if (orderNos.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("10") !== -1
            		|| statusStr.join(",").indexOf("30") !== -1
            		|| statusStr.join(",").indexOf("40") !== -1
            	) {
                xmtc.failMsg('存在非确认状态的订单, 无法取消确认');
                return;
            } 
        	// 执行取消确认
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/cancelConfirmOrders", { order_nos: orderNos.join(",") }, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    xmtc.successMsg('操作成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('取消确认失败');
                	}
                }
            });
        }
    }
    
    /**
     * 分配订单
     */
    function distributionHanlder() {
        var selectRows = xmtc.getRows(table, $('#dateTable'));
    	if (selectRows.length === 0) {
    		xmtc.failMsg("请选择一条记录");
    	} else if (selectRows.length > 1) {
    		xmtc.failMsg("请只选择一条记录");
    	} else {
    		for (var i=0,j=selectRows.length; i<j; i++) {
    			var row = selectRows[i];
    			if (!(row.status === '20' || row.status === '30')) {
                    xmtc.failMsg('订单状态不为确认、执行中，无法分配');
                    return;
                }
    			if (row.remainder_amount === 0) {
    				xmtc.failMsg('订单剩余量为0，无需再分配');
                    return;
    			}
    			// 打开分配订单界面
    			var url = base + "/view/oms/order/csOrderDistribution.jsp?order_no=" + row.order_no + "&from=list";
    			layer_show('分配订单', url, '100%','100%');
    		}
    	}
    }
    
    /**
     * 完成订单
     */
    function completeHanlder() {
        var orderNos = getSeclectOrderNos();
        if (orderNos.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 状态校验
        	var statusStr = getSeclectStatus();
            if (statusStr.join(",").indexOf("10") !== -1
            		|| statusStr.join(",").indexOf("40") !== -1
            	) {
                xmtc.failMsg('存在非确认、执行中状态的订单, 无法完成');
                return;
            } 
            // 剩余量不为零提示
            var isExstNotZreo = false;
            var selectRows = xmtc.getRows(table, $('#dateTable'));
            for (var index in selectRows) {
                if (selectRows[index].remainder_amount > 0) {
                	isExstNotZreo = true;
                	layer.confirm('存在剩余量不为零的订单，确认要完成吗？', function (index) {
                		// 执行完成
                		ajaxCompleteOrders(orderNos);
                	});
                	break;
                }
            }
            
            if (!isExstNotZreo) {
            	// 执行完成
            	ajaxCompleteOrders(orderNos);
            }
        }
    }
    
    /**
     * 调用后端执行完成
     */
    function ajaxCompleteOrders(orderNos) {
    	// 执行完成
		xmtc.ajaxPost(base + "/api/oms/order/csOrder/completeOrders", { order_nos: orderNos.join(",") }, function (data) {
            if (data.success) {
                table.ajax.reload();
                xmtc.successMsg('操作成功');
            } else {
            	if (data.msg) {
            		xmtc.failMsg(data.msg);
            	} else {
            		xmtc.failMsg('完成失败');
            	}
            }
        });
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
    function editHanlder(type, orderNo) {
        var url = base + "/view/oms/order/csOrderForm.jsp";
        if (type === "copy") {
        	url += "?params=true";
        } else {
        	url += "?params=false";
        }
        if (orderNo) {
            url += "?" + orderNo;
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

    exports('csOrder', {});
});
