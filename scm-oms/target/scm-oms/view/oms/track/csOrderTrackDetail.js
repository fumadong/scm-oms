/**
 * 订单维护界面
 *
 * @author Devin
 */

// 取得参数
var orderNo = xmtc.getUrlVars("orderNo");

layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
    
    // 当前编辑对象
    var currentOrder = null;
    
    // 通过系统订单号获取订单
    getOrderByOrderNo();
    
    /**
     * 通过系统订单号获取订单
     */ 
    function getOrderByOrderNo() {
    	debugger;
        xmtc.ajaxPost(base + "/api/oms/order/csOrder/getOrderByOrderNo", { order_no : orderNo }, function (json) {
            // 将数据渲染到表单
            setOrderToForm(json.data);
        });
    }
    
    /**
     * 判断字符串是否为空
     * @param obj
     * @returns
     */
    function isNotEmpty(obj) {
    	if(obj !== null && obj !==undefined && obj.trim() !== ""){
    		return true;
    	}else{
    		return false;
    	}
    }
    /**
     * 将订单渲染到表单
     */
    function setOrderToForm(order) {
    	debugger;
    	if (order) {
    		// 渲染到界面
			$.each(order, function (key, value) {
				if ($('#' + key)) {
					$('#' + key).val(xmtc.nullToSpace(value));
				}
			});
			// 渲染行政区划
			setAddressToForm(order);
            // 缓存当前编辑对象
            currentOrder = order;
            orderNo = order.order_no;
			// 重新渲染下拉框
			form.render('select');
    		var orderInfoText = "订单号：" + order.order_no + ",状态:" +  xmtc.getDictVal("order_status", order.status) + ",委托客户：" + order.customer_name + ",下单时间:" +
                				order.order_time + ",订单类型:" + xmtc.getDictVal("order_type", order.order_type);
                $("#orderInfo").html(orderInfoText);
		}
    }
    

    /**
     * 渲染数据到发货行政区划、收货行政区划
     * @param order
     */
    function setAddressToForm (order) {
    	// 设置发货地址行政区划
    	setShipperAddressToForm(order);
		// 设置收货地址行政区划
    	setConsigneeAddressToForm(order);
    }
    
    /**
     * 设置发货行政区划
     */ 
    function setShipperAddressToForm (order) {
    	var address = {};
    	if (order) {
    		// 入参存在，设置行政区划
    		address['provinceCode'] = order.shipper_province_code;
    		address['provinceName'] = order.shipper_province_name;
    		address['cityCode'] = order.shipper_city_code;
    		address['cityName'] = order.shipper_city_name;
    		address['countyCode'] = order.shipper_county_code;
    		address['countyName'] = order.shipper_county_name;
    	} else {
    		// 入参不存在，清空行政区划
    		address['provinceCode'] = null;
    		address['provinceName'] = null;
    		address['cityCode'] = null;
    		address['cityName'] = null;
    		address['countyCode'] = null;
    		address['countyName'] = null;
    	}
		xmtc.setAddressSelectorValue('shipper_address_select', address);
    }
    
    /**
     * 设置收货行政区划
     */ 
    function setConsigneeAddressToForm (order) {
    	var address = {};
    	if (order) {
    		// 入参存在，设置行政区划
    		address['provinceCode'] = order.consignee_province_code;
    		address['provinceName'] = order.consignee_province_name;
    		address['cityCode'] = order.consignee_city_code;
    		address['cityName'] = order.consignee_city_name;
    		address['countyCode'] = order.consignee_county_code;
    		address['countyName'] = order.consignee_county_name;
    	} else {
    		// 入参不存在，清空行政区划
    		address['provinceCode'] = null;
    		address['provinceName'] = null;
    		address['cityCode'] = null;
    		address['cityName'] = null;
    		address['countyCode'] = null;
    		address['countyName'] = null;
    	}
		xmtc.setAddressSelectorValue('consignee_address_select', address);
    }

    /**
     * 订单商品信息子列表
     */
    var cargoTable = $('#cargoTable').DataTable( {
        ajax: {
            url: base + "/order/csOrderCargo/query",
            data : function(data) {
                data.order_no = orderNo;
            }
        },
        "columns": [                            // 自定义数据列
            { data:
                function(obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
                }
            },
            { data: 'line_no' },			// 行号
            { data: 'cargo_code' },			// 商品代码
            { data: 'cargo_name' },			// 商品名称
            { data: 						// 商品类型
                function (obj) {
                    if (obj) {
                        return xmtc.getDictVal("cargo_type", obj.cargo_type);
                    } else {
                        return "";
                    }
                }
            },
            { data: 'package_name' },			// 包装规格
            { data: 'package_uom_name' },			// 包装单位
            { data: 'quantity' },		// 件数
            { data: 'ea_quantity' },// EA数
            { data:
                function(obj) {			// 操作
                    return  '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
                width: 80,
                sClass: "text-c"
            }
        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
            // 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    });

    /**
     * 订单商品信息子列表
     */
    var milestoneTable = $('#milestoneTable').DataTable( {
        ajax: {
            url: base + "/order/csOrderMilestone/query",
            data : function(data) {
                data.order_no = orderNo;
            }
        },
        "columns": [                            // 自定义数据列
            { data:
                function(obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
                }
            },
            {"data":"index",//序号
                "render":function(data,type,row,meta){
            	debugger;
                    var totalIndex = meta.settings._iRecordsTotal;
                    return totalIndex - meta.row;
                }},
            { data: 'order_status' },
            { data: 'operate_time' },
            { data: 'operator' },
            { data: 'remark' },
            { data:
                function(obj) {			// 操作
                    return  '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
                width: 80,
                sClass: "text-c"
            }
        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
            // 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    });

    /**
     * 列表头勾选事件
     */
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    //======================================界面设置=====================================
    
    /**
     * 订单类型变更事件: 当为销售订单时，设置计费节点为装货磅重；当为采购团订单时，设置计费节点为卸货磅重
     */
    form.on('select(order_type)', function (data) {
    	var order_type = $("#order_type").val();
    	setFormByOrderType(order_type);
    	form.render('select');
    });
    
    /**
     * 通过订单类型设置计费节点
     * @param order_type
     */
    function setFormByOrderType(order_type) {
    	if (!order_type) {
    		return;
    	}
    	if (order_type === "sale_order") {
    		// 销售订单，设置计费节点为装货磅重
    		xmtc.selectValue('charge_node', 'load');
    	} else if (order_type === "purchase_order") {
    		// 采购订单，设置计费节点为卸货磅重
    		xmtc.selectValue('charge_node', 'unload');
    	}
    }
    
    /**
     * 表单校验格式
     */
    form.verify({
    	// 必填项校验(js控制下拉框必填失效使用该方式)
    	required : function (value, item) {
    		if(!value) {
				return '必填项不能为空';
	      	}
    	},
    	// 电话
    	tel : function(value, item) {
    		if(value != '') {
    			if(!/(^(\d{3,4}-)?\d{7,8})$|^1\d{10}$/.test(value)) {
    				return '请输入正确的电话号码, 如 0592-1234567';
    			}
	      	}
        },
        // 手机
        phone : function(value, item) {
    		if(value != '') {
    			if(!/^\d{11}$/.test(value)) {
    				return '请输入正确的11位数字手机号码';
    			}
	      	}
        },
        // 数字
    	number : function (value) {
            if (value) {
                var reg = /^\d+(?:\.\d{1,2})?$/;
                if (!reg.test(value)) {
                    return '请输入整数或者最多两位小数';
                }
            }
        }
	});
    
    /**
     * 选择地址
     */ 
    $(".sns-addrselector").addrDropMenu({
    	"level" : 3,
    	"hotCity" : false
    });
    
    //=====================================按钮事件部分Start===================================

    /**
     * 订单主表-关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    /**
     * 弹出编辑商品弹窗
     */
    function editSubCargoHanlder(title, rowId) {
    	var url = "csOrderCargoForm.jsp?order_no=" + orderNo;
    	if (rowId) {
    		url += "&id=" + rowId;
    	}
    	// 弹出商品明细表单弹窗
    	layer_show(title, url, 600, 350);
    }
    /**
     * 获取列表勾选行id
     * @param tableId 表格id
     * @returns selectRowIds
     */
    function getSeclectTableIds(tableId) {
        var selectRowIds = [];
        $("#" + tableId).find(":checkbox:checked").each(function () {
        	selectRowIds.push($(this).attr("data-id"));
        });
        return selectRowIds;
    }
    /**
     * 商品信息Tab切换事件：更新商品信息列表
     */
    $('#sub-cargo').on('click',function() {
    	cargoTable.ajax.reload();
    	parent.$('#btn-query').click();
    });

    //=====================================界面弹出框配置Start=====================================
   
    
    //=====================================界面弹出框配置End=====================================


    exports('csOrderTrackDetail', {});
});
