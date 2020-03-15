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
	                data.order_nos = getSplitString($.trim($("#order_no").val()));
                    data.customer_code = $.trim($("#customer_code_query").val());
                    data.order_type = $.trim($("#order_type").val());
                    data.create_time_from = $.trim($("#create_time_from").val());
                    data.create_time_to = $.trim($("#create_time_to").val());
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
	            {data:
	            	function (obj) {
	            		return obj.order_time.substring(0, 10);
	            	}
	            },
                { data: 						// 商品类型
                    function (obj) {
                        if (obj) {
                            return xmtc.getDictVal("order_type", obj.order_type);
                        } else {
                            return "";
                        }
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
     * 打开维护界面
     */ 
    function editHanlder(type, orderNo) {
    	debugger;
        var url = base + "/view/oms/track/csOrderTrackDetail.jsp";
        if (orderNo) {
            url += "?orderNo=" + orderNo;
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


    // 空白（空格、换行、tab）和逗号分隔的字符串，变成用逗号分隔
    function getSplitString(str) {
    	var resultData = [];
        var arr = str.split(",");
        var resources = "";
        for (var i = 0; i < arr.length; i++) {
            var arr1 = arr[i].split(/\s+/);
            for (var j = 0; j < arr1.length; j++) {
                if (jQuery.trim(arr1[j]) != "") {
                    resources += jQuery.trim(arr1[j]) + ",";
                    resultData.push(jQuery.trim(arr1[j]));
                }
            }
        }
        return resources;
    }
    exports('csOrderTrack', {});
});
