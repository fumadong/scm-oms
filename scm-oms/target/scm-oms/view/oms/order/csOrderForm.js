/**
 * 订单维护界面
 *
 * @author Devin
 */

// 取得参数
var params = xmtc.getUrlVars("params");
var orderNo = null;
var isCopy = false;
getParmas();
function getParmas () {
	var parramArray = params.split('?');
	isCopy = parramArray[0];
	if (parramArray[1]) {
		orderNo = parramArray[1];
	}
}

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
    	if (!orderNo) {
    		initToAdd();
    	} else {
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/getOrderByOrderNo", { order_no : orderNo }, function (json) {
				// 将数据渲染到表单
    			setOrderToForm(json.data);
    			// 刷新当前子TAB页签内容
    			refreshCurrentShowSubTab();
    		});
    	}
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
     * 初始化为新增状态
     */
    function initToAdd() {
    	// 清空表单内容
    	document.getElementById("form-add").reset();
    	// 新增时默认字段赋值
    	setFormNew();
    	// 重新渲染下拉框
		form.render('select');
    }
    
    /**
     * 设置表单默认新增状态
     */
    function setFormNew() {
    	// 设置当期对象为空
    	currentOrder = null;
    	// 设置新增时系统控制参数默认值：这边会自动查询子表数据，若该字段为空，则会查询出所有数据，后续需修改为新增时不自动查询子表
		orderNo = '0'; 
		// 系统订单号
		$('#order_no').val(null);
		// 下单时间、要求开始日期：默认当前系统时间
		$("#order_time").val(new Date().format("yyyy-MM-dd hh:mm:ss"));
		$("#require_time_from").val(new Date().format("yyyy-MM-dd"));
		$("#require_time_to").val(null);
		// 设置订单来源为手工录入、状态为创建
		xmtc.selectValue('order_source', 'manually_added');
		xmtc.selectValue('status', '10');
		// 设置按钮状态
		setButtonStatus(null);
    }
    
    /**
     * 将订单渲染到表单
     */
    function setOrderToForm(order) {
    	if (order) {
    		// 渲染到界面
			$.each(order, function (key, value) {
				if ($('#' + key)) {
					$('#' + key).val(xmtc.nullToSpace(value));
				}
			});
			// 渲染行政区划
			setAddressToForm(order);
    		
    		if (isCopy && isCopy ==='true') {
    			setFormNew();
    		} else {
    			// 缓存当前编辑对象
    			currentOrder = order;
    			orderNo = order.order_no;
    			// 设置按钮状态
    			setButtonStatus(order.status);
    		}
			// 重新渲染下拉框
			form.render('select');
		}
    }
    
    /**
     * 刷新当前显示的TAB页签
     */ 
    function refreshCurrentShowSubTab() {
    	var selecLi = $("ul#sub-tabs li.layui-this");
    	if(selecLi.length > 0){
    		$("#" + selecLi[0].id).click();
    	}
        return false;
    }
    
    /**
     * 根据订单状态设置按钮状态：显示/隐藏
     * @param orderStatus 订单状态
     */
    function setButtonStatus (orderStatus) {
    	// 先全部隐藏
    	$('#btn-save').hide();
    	$('#btn-saveAndNew').hide();
    	$('#btn-confirm').hide();
    	$('#btn-distribution').hide();
    	$('#btn-complete').hide();
    	$('#cargo-toolbar').hide();
    	
    	// 以下情况设为可见
    	if (orderStatus) {
    		// 订单非新增时
    		if (orderStatus === '10') {
        		// 订单为创建时：保存、确认、保存并新增、商品按钮栏可见
        		$('#btn-save').show();
        		$('#btn-saveAndNew').show();
        		$('#btn-confirm').show();
        		$('#cargo-toolbar').show();
        	} else if (orderStatus === '20') {
        		// 订单为确认时：完成、分配按钮可见
        		$('#btn-complete').show();
        		$('#btn-distribution').show();
        	} else if (orderStatus === '30') {
        		// 订单为执行中时：完成、分配按钮可见
        		$('#btn-complete').show();
        		$('#btn-distribution').show();
        	}
    	} else {
    		// 按钮新增未保存时：保存、保存并新增按钮栏可见
    		$('#btn-save').show();
    		$('#btn-saveAndNew').show();
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
            	if (isCopy && isCopy==='true') {
            		data.order_no = '-1';
            	} else {
            		data.order_no = orderNo;
            	}
            }  
        }, 
        "columns": [                            // 自定义数据列
            { data:
            	function(obj) {
                	return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
            	}
            },
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
            { data: 						// 包装方式
            	function (obj) {
            		if (obj) {
            			return xmtc.getDictVal("package_specification", obj.package_specification);
            		} else {
            			return "";
            		}
            	}
            },
            { data: 						// 单位
            	function (obj) {
            		if (obj) {
            			return xmtc.getDictVal("unit", obj.unit);
            		} else {
            			return "";
            		}
            	}
            },
            { data: 'plan_amount' },		// 计划量
            { data: 'distribution_amount' },// 已分配量
            { data: 						// 剩余量
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
     * 订单分配信息子列表：分配单信息
     */
    var distributionTable = $('#distributionTable').DataTable( {
    	ajax: {  
            url: base + "/order/csDistribution/getPage",
            data : function(data) {
                if (isCopy && isCopy==='true') {
            		data.order_no = '-1';
            	} else {
            		data.order_no = orderNo;
            	}
            }  
        }, 
        "columns": [                    	// 自定义数据列
        	{ data:
            	function(obj) {
                	return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
            	}
            },
        	{ data: 'distribution_no' },	// 分配单号
            { data: 'carrier_name' },		// 承运商
            { data: 'plan_amount' }, 		// 计划量
            { data: 'complete_amount' }, 	// 已完成量
            { data: 						// 未完成量
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
            { data: 						// 要求日期
            	function (obj) {
            		return obj.require_time_from.substring(0, 10) + " ~ " + obj.require_time_to.substring(0, 10);
            	}
            },
            { data: 'distribute_time' }, 	// 下发时间
            { data: 						// 状态
            	function (obj) {
	            	return xmtc.getDictVal("distribution_status", obj.status);
            	}
            }
        ],
        "stateSaveParams": function () {
        	// 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    });
    
    /**
     * 订单发货信息子列表：派车单信息
     */
    var sendTable = $('#sendTable').DataTable( {
        ajax: {  
            url: base + "/dispatch/csDispatchOrder/query",
            data : function(data) {
                if (isCopy && isCopy==='true') {
            		data.order_no = '-1';
            	} else {
            		data.order_no = orderNo;
            	}
            }  
        }, 
        "columns": [                    	// 自定义数据列
            { data: 'dispatch_no' },		// 系统派车单号 
            { data: 'distribution_no' },	// 系统派车单号 
            { data: 'carrier_name' },		// 承运商
            { data: 'vehicle_no' }, 		// 车牌号
            { data: 'plan_amount' }, 		// 计划量
            { data: 'load_amount' }, 		// 装货量
            { data: 'unload_amount' }, 		// 卸货量
            { data: 						// 磅差
            	function (obj) {
            		// 当磅差值不为0时，使用红色显示
	            	var differenceAmountHtml = '';
	            	if (null !== obj.difference_amount) {
	            		if (obj.difference_amount !== 0) {
	            			differenceAmountHtml = '<span class="c-red">' + obj.difference_amount + '</span>';
	            		} else {
	            			differenceAmountHtml = obj.difference_amount;
	            		}
	            	}
	            	return differenceAmountHtml;
            	}
            },
            { data: 						// 抵达时间
            	function (obj) {
	            	var timeHtml = '';
	            	if (obj.arrive_load_time) {
	            		timeHtml += obj.arrive_load_time;
	            	}
	            	timeHtml += '<br>'
	            	if (obj.arrive_unload_time) {
	            		timeHtml += obj.arrive_unload_time;
	            	}
	            	return timeHtml;
            	}
            },
            { data: 						// 状态
            	function (obj) {
	            	var statusHtml;
	            	if (obj.status != '60') {
	            		statusHtml = '<span class="c-green">';
	            	} else {
	            		statusHtml = '<span class="layui-disabled">';
	            	}
	            	statusHtml += xmtc.getDictVal("dispatch_status", obj.status) + '</span>';
	            	return statusHtml;
            	}
            },
        ],
        "stateSaveParams": function () {
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
     * 订单主表-保存/保存并新增-按钮
     */ 
    form.on('submit(form-save)', function (data) {
    	// 数据校验
    	if (!buttonEnableCheckIsOk()) {
    		return false;
    	}
    	var order = data.field;
    	// 要求日期校验
    	if (order.require_time_from > order.require_time_to){
    		xmtc.failMsg('要求开始日期 不能晚于 要求结束日期');
    		return false;
    	}
    	// 起运地行政区划非空校验
    	if (!isNotEmpty(order.shipper_province_name) || !isNotEmpty(order.shipper_city_name)) {
    		xmtc.failMsg('发货地址的省/市不能为空');
    		return false;
    	}
    	// 目的地行政区划非空校验
    	if (!isNotEmpty(order.consignee_province_name) || !isNotEmpty(order.consignee_city_name)) {
    		xmtc.failMsg('收货地址的省/市不能为空');
    		return false;
    	}
    	// 订单类型不能为空（复制情况下若复制的属性下拉框为空且必填，控件必填失效）
    	if (!isNotEmpty(order.order_type)) {
    		xmtc.failMsg('订单类型不能为空');
    		return false;
    	}
    	// 计费节点不能为空
    	if (!isNotEmpty(order.charge_node)) {
    		xmtc.failMsg('计费节点不能为空');
    		return false;
    	}
    	
    	// 保存不需要这个字段
    	delete order["dateTable_length"];
    	// 设置id
    	if (currentOrder && currentOrder.id) {
    		order.id = currentOrder.id;
    	}
    	
    	xmtc.ajaxPost(base + "/api/oms/order/csOrder/save", order, function (result) {
    		if (result.success) {
    			isCopy = 'false';
    			
    			if(document.activeElement.id === "btn-saveAndNew"){ 
    				// 保存并新增：初始化编辑界面
    		       	initToAdd();
    	        } else {
    	        	// 保存：渲染表单数据
    	        	setOrderToForm(result.data);
    	        }
    			
    			xmtc.successMsg('保存成功');
    			parent.$('#btn-query').click();
    		} else {
    			xmtc.failMsg(result.msg);
    		}
    	});
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
    	return false; 
    });
    
    /**
     * 订单主表-确认-按钮
     */
    $('#btn-confirm').on('click',function(){
    	if (currentOrder) {
    		// 状态校验
    		if (currentOrder.status !== '10') {
    			xmtc.failMsg('订单不是创建状态，无法确认');
    			return false;
    		}
    		// 是否存在没有维护商品的订单，若存在则给出提示信息
            var cargos = cargoTable.data();
            if (cargos.length > 0) {
            	// 执行确认
        		ajaxConfirmOrders();
            } else {
            	layer.confirm('订单没有维护商品，确认要继续操作吗？', function (index) {
            		// 执行确认
            		ajaxConfirmOrders();
            	});
            }
    	} else {
    		xmtc.failMsg('新增订单请先保存后再操作');
    	}
    	return false;
    });
    
    /**
     * 调用后端执行确认
     */
    function ajaxConfirmOrders() {
    	xmtc.ajaxPost(base + "/api/oms/order/csOrder/confirmOrders", { order_nos: orderNo }, function (result) {
    		if (result.success) {
	        	setOrderToForm(result.data[0]);
                xmtc.successMsg('确认成功');
                parent.$('#btn-query').click();
            } else {
            	if (result.msg) {
            		xmtc.failMsg(result.msg);
            	} else {
            		xmtc.failMsg('确认失败');
            	}
            }
        });
    }
    
    /**
     * 订单主表-分配-按钮
     */
    $('#btn-distribution').on('click',function(){
    	// 若订单商品剩余量>0，打开订单分配界面
    	if (currentOrder && cargoTable.data().length > 0) {
    		var cargos = cargoTable.data();
    		var remainderAmount = cargos[0].plan_amount - cargos[0].distribution_amount;
    		if (remainderAmount > 0) {
    			var url = "csOrderDistribution.jsp?order_no=" + orderNo + "&from=form";
    			// 弹出订单分配弹窗
    			layer_show('分配订单', url, '100%','100%');
    		} else {
    			xmtc.failMsg('订单已全部分配，无需再分配');
    		}
    	} else {
    		xmtc.failMsg('没有需要分配的商品');
    	}
    	return false;
    });
    
    /**
     * 订单主表-完成-按钮
     */
    $('#btn-complete').on('click',function(){
    	if (currentOrder) {
    		if (!(currentOrder.status === '20' || currentOrder.status ==='30')) {
    			xmtc.failMsg('订单不是确认/执行中状态，无法完成');
    			return false;
    		}
    		
    		// 判断是否有剩余商品
    		var isExstNotZreo = false;
    		var cargos = cargoTable.data();
    		for (var index in cargos) {
    			if (cargos[index].remainder_amount > 0) {
    				isExstNotZreo = true;
    				layer.confirm('存在剩余量不为零的商品，确认要完成吗？', function (index) {
                		// 执行完成
                		ajaxCompleteOrder();
                	});
                	break;
    			}
    		}
    		
    		if (!isExstNotZreo) {
            	// 执行完成
            	ajaxCompleteOrder();
            }
    	} else {
    		xmtc.failMsg('订单不是确认/执行中状态，无法完成');
    	}
    	return false;
    });
    
    /**
     * 调用后端执行完成
     */
    function ajaxCompleteOrder () {
    	// 执行完成
		xmtc.ajaxPost(base + "/api/oms/order/csOrder/completeOrders", { order_nos: orderNo }, function (result) {
			if (result.success) {
				setOrderToForm(result.data[0]);
				xmtc.successMsg('完成成功');
				parent.$('#btn-query').click();
            } else {
            	if (result.msg) {
            		xmtc.failMsg(data.msg);
            	} else {
            		xmtc.failMsg('完成失败');
            	}
            }
        });
    }
    
    /**
     * 刷新表单数据
     */
    $('#btn-form-refresh').on('click',function() {
    	// 重新刷新订单信息
    	getOrderByOrderNo();
    	parent.$('#btn-query').click();
    	return false;
    });
    
    /**
     * 订单主表-关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });

    /**
     * 订单商品列表-新增-按钮
     */
    $('#btn-sub-cargo-add').on('click',function() {
    	// 校验
    	var cargoArray = $('#cargoTable').dataTable().fnGetData();
    	if (cargoArray && cargoArray.length>0 ) {
    		xmtc.failMsg('已存在商品，不允许再新增');
    		return false;
    	}
    	if (!buttonEnableCheckIsOk()) {
    		return false;
    	}
    	if (!currentOrder) {
    		xmtc.failMsg('请先保存订单信息');
    		return false;
    	}
    	// 弹出编辑表单
    	editSubCargoHanlder("编辑商品","");
    });
    
    /**
     * 订单商品列表-删除-按钮
     */ 
    $("#btn-sub-cargo-delete").on('click', function () {
    	// 校验
    	if (!buttonEnableCheckIsOk()) {
    		return false;
    	}
    	var ids = getSeclectTableIds('cargoTable');
    	if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
            return false;
        } 
    	// 执行删除
        deleteSubCargoHanlder(ids.join(","));
    });
    
    /**
     * 订单商品列表-编辑-图标按钮
     */
    $("#cargoTable").on('click','.btn-edit', function(){
    	// 校验
    	if (!buttonEnableCheckIsOk()) {
    		return false;
    	}
    	// 弹出商品明细表单
        var id = $(this).attr('data-id');
        editSubCargoHanlder("编辑商品", id);
    });
    
    /**
     * 订单分配单列表-删除-按钮
     */ 
    $("#btn-sub-distribution-delete").on('click', function () {
    	// 校验
    	var ids = getSeclectTableIds('distributionTable');
    	if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
            return false;
        } 
    	// 执行删除
    	deleteSubDistributionHanlder(ids.join(","));
    });
    
    //=====================================按钮事件部分End=====================================
    
    /**
     * 校验按钮是否可操作：通过订单状态校验
     */
    function buttonEnableCheckIsOk() {
    	// 数据校验
    	if (currentOrder && currentOrder.id) {
    		var status = currentOrder.status;
    		if (status !== '10') {
    			xmtc.failMsg('订单不是创建状态，不可操作');
    			return false;
    		} else {
    			return true;
    		}
    	} else {
    		return true;
    	}
    };
    
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
     * 删除订单商品
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */ 
    function deleteSubCargoHanlder(idsString) {
    	// 执行删除
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/order/csOrderCargo/delete", { ids : idsString }, function (data) {
                if (data.success) {
                	cargoTable.ajax.reload();
                    xmtc.successMsg('删除成功');
                    parent.$('#btn-query').click();
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
     * 删除订单分配单
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */
    function deleteSubDistributionHanlder(idsString) {
    	// 如果首个字符是逗号，则删除
    	if (idsString.substr(0,1) === ',' ) {
    		idsString = idsString.substr(1);
    	}
    	// 执行删除
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/order/csDistribution/delete", { ids : idsString }, function (data) {
                if (data.success) {
                	// 刷新数据
                	$('#btn-form-refresh').click();
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
    
    /**
     * 商品信息Tab切换事件：更新商品信息列表
     */
    $('#sub-cargo').on('click',function() {
    	cargoTable.ajax.reload();
    	parent.$('#btn-query').click();
    });
    
    /**
     * 分配信息Tab切换事件：更新分配信息列表
     */
    $('#sub-distribution').on('click',function() {
    	distributionTable.ajax.reload();
    	parent.$('#btn-query').click();
    });
    
    /**
     * 派车信息Tab切换事件：更新派车信息列表
     */
    $('#sub-send').on('click',function() {
    	sendTable.ajax.reload();
    });

    //=====================================界面弹出框配置Start=====================================
    /**
     * 委托客户弹出框：选择后带出客户类型、下单人
     */
    $("#customer_name").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "委托客户", 600, 432, "code", "name", function(data) {
    		$("#customer_code").val(data["customer_code"]);  
		    $("#customer_name").val(data["customer_name"]);
		    $("#order_person_code").val(data["contact_code"]);
		    $("#order_person_name").val(data["contact_name"]);
		    // 设置客户类型，并根据客户类型设置表单联动控件
		    xmtc.selectValue('customer_type', data["customer_type"]);
		    form.render('select');
    	});
    });
    
    /**
     * 下单人弹出框
     */
    $("#order_person_name").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerContactPopWin.jsp";
    	// 取得委托客户代码
    	var customer_code = $('#customer_code').val();
    	if (customer_code) {
            url += "?customer_code=" + customer_code;
        }
    	top.xmtc.popUp(url, "下单人", 600, 432, "code", "name", function(data) {
    		$("#customer_code").val(data["customer_code"]);  
		    $("#customer_name").val(data["customer_name"]);
		    $("#order_person_code").val(data["contact_code"]);
		    $("#order_person_name").val(data["contact_name"]);
		    xmtc.selectValue('customer_type', data["customer_type"]);
			form.render('select');
    	});
    });
    
    /**
     * 发货客户弹出框
     */
    $("#shipper_name_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "发货客户", 600, 432, "code", "name", function(data) {
    		$("#shipper_code").val(data["customer_code"]);  
		    $("#shipper_name").val(data["customer_name"]);
		    $("#shipper_contact_code").val(data["contact_code"]);
		    $("#shipper_contact_name").val(data["contact_name"]);
		    $("#shipper_contact_mobile").val(data["mobile"]);
		    $("#shipper_contact_tel").val(data["tel"]);
		    $("#shipper_address").val(data["address"]);
		    // 行政区划
		    var addressData = new Object();
		    addressData.shipper_province_code = data["province_code"];
		    addressData.shipper_province_name = data["province_name"];
		    addressData.shipper_city_code = data["city_code"];
		    addressData.shipper_city_name = data["city_name"];
		    addressData.shipper_county_code = data["county_code"];
		    addressData.shipper_county_name = data["county_name"];
		    setShipperAddressToForm (addressData);
    	});
    });
    
    /**
     * 发货客户弹出框手工编辑值后清空发货客户代码的值
     */
    $("#shipper_name").on('input', function(e) {
    	$("#shipper_code").val(null);
    });
    
    /**
     * 发货联系人弹出框
     */
    $("#shipper_contact_name_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerContactPopWin.jsp";
    	// 取得发货客户代码
    	var customer_code = $('#shipper_code').val();
    	if (customer_code) {
            url += "?customer_code=" + customer_code;
        }
    	top.xmtc.popUp(url, "发货联系人", 600, 432, "code", "name", function(data) {
    		$("#shipper_code").val(data["customer_code"]);  
		    $("#shipper_name").val(data["customer_name"]);
		    $("#shipper_contact_code").val(data["contact_code"]);
		    $("#shipper_contact_name").val(data["contact_name"]);
		    $("#shipper_contact_mobile").val(data["mobile"]);
		    $("#shipper_contact_tel").val(data["tel"]);
		    $("#shipper_address").val(data["address"]);
		    // 行政区划
		    var addressData = new Object();
		    addressData.shipper_province_code = data["province_code"];
		    addressData.shipper_province_name = data["province_name"];
		    addressData.shipper_city_code = data["city_code"];
		    addressData.shipper_city_name = data["city_name"];
		    addressData.shipper_county_code = data["county_code"];
		    addressData.shipper_county_name = data["county_name"];
		    setShipperAddressToForm (addressData);
    	});
    });
    
    /**
     * 发货联系人弹出框手工编辑值后清空发货联系人代码的值
     */
    $("#shipper_contact_name").on('input', function(e) {
    	$("#shipper_contact_code").val(null);
    });
    
    /**
     * 收货客户弹出框
     */
    $("#consignee_name_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "收货客户", 600, 432, "code", "name", function(data) {
    		$("#consignee_code").val(data["customer_code"]);  
		    $("#consignee_name").val(data["customer_name"]);
		    $("#consignee_contact_code").val(data["contact_code"]);
		    $("#consignee_contact_name").val(data["contact_name"]);
		    $("#consignee_contact_mobile").val(data["mobile"]);
		    $("#consignee_contact_tel").val(data["tel"]);
		    $("#consignee_address").val(data["address"]);
		    // 行政区划
		    var addressData = new Object();
		    addressData.consignee_province_code = data["province_code"];
		    addressData.consignee_province_name = data["province_name"];
		    addressData.consignee_city_code = data["city_code"];
		    addressData.consignee_city_name = data["city_name"];
		    addressData.consignee_county_code = data["county_code"];
		    addressData.consignee_county_name = data["county_name"];
		    setConsigneeAddressToForm (addressData);
    	});
    });
    
    /**
     * 收货客户弹出框手工编辑值后清空收货客户代码的值
     */
    $("#consignee_name").on('input', function(e) {
    	$("#consignee_code").val(null);
    });
    
    /**
     * 收货联系人弹出框
     */
    $("#consignee_contact_name_icon").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerContactPopWin.jsp";
    	// 取得发货客户代码
    	var customer_code = $('#consignee_code').val();
    	if (customer_code) {
            url += "?customer_code=" + customer_code;
        }
    	top.xmtc.popUp(url, "收货联系人", 600, 432, "code", "name", function(data) {
    		$("#consignee_code").val(data["customer_code"]);  
		    $("#consignee_name").val(data["customer_name"]);
		    $("#consignee_contact_code").val(data["contact_code"]);
		    $("#consignee_contact_name").val(data["contact_name"]);
		    $("#consignee_contact_mobile").val(data["mobile"]);
		    $("#consignee_contact_tel").val(data["tel"]);
		    $("#consignee_address").val(data["address"]);
		    // 行政区划
		    var addressData = new Object();
		    addressData.consignee_province_code = data["province_code"];
		    addressData.consignee_province_name = data["province_name"];
		    addressData.consignee_city_code = data["city_code"];
		    addressData.consignee_city_name = data["city_name"];
		    addressData.consignee_county_code = data["county_code"];
		    addressData.consignee_county_name = data["county_name"];
		    setConsigneeAddressToForm (addressData);
    	});
    });
    
    /**
     * 发货联系人弹出框手工编辑值后清空发货联系人代码的值
     */
    $("#consignee_contact_name").on('input', function(e) {
    	$("#consignee_contact_code").val(null);
    });
    
    /**
     * 委托客户弹出框：选择后带出客户类型、下单人
     */
    $("#warehouse_name").on('click', function () {
    	var url = base+"/view/oms/warehouse/csWarehouseWin.jsp";
    	top.xmtc.popUp(url, "仓库", 600, 432, "warehouse_code", "warehouse_name",function(res){
    		$("#warehouse_code").val(res["warehouse_code"]);  
		    $("#warehouse_name").val(res["warehouse_name"]);
    	});
    });
    
    //=====================================界面弹出框配置End=====================================


    var tableData = [{order: "CR201711060002", cg_order: "CG201711060001", name: "深圳合力蔬然批发部", address: "福建省漳州市芗城区新华东路世纪广场9号楼603", status: "提交", fm_require_date: "2017-11-06 11:32", to_require_date: "2017-11-07 11:32", place_order_date: "2017-11-06 11:32", place_order_count: "3",unit: "吨"},
        {order: "CR201711060005", cg_order: "CG201711060002", name: "好新鲜蔬菜直营店", address: "福建省漳州市芗城区新华西路南25栋15号", status: "提交", fm_require_date: "2017-11-06 16:22", to_require_date: "2017-11-07 16:22", place_order_date: "2017-11-06 16:22", place_order_count: "8",unit: "吨"},
        {order: "CR201711110001", cg_order: "CG201711110001", name: "自然堂蔬菜批发", address: "福建省漳州市芗城区新浦路13-6号", status: "提交", fm_require_date: "2017-11-11 9:08", to_require_date: "2017-11-12 9:08", place_order_date: "2017-11-11 9:08", place_order_count: "11",unit: "吨"},
        {order: "CR201711110002", cg_order: "CG201711110002", name: "好有缘蔬菜经营部", address: "福建省厦门市湖里区台湾街363号", status: "提交", fm_require_date: "2017-11-11 15:33", to_require_date: "2017-11-12 15:33", place_order_date: "2017-11-11 15:33", place_order_count: "6",unit: "吨"},
        {order: "CR201711110003", cg_order: "CG201711110003", name: "非常蔬菜", address: "福建省厦门市湖里区祥店路101", status: "提交", fm_require_date: "2017-11-11 10:02", to_require_date: "2017-11-12 10:02", place_order_date: "2017-11-11 10:02", place_order_count: "19",unit: "千克"},
        {order: "CR201711230002", cg_order: "CG201711230001", name: "鲜生生果蔬批发部", address: "福建省厦门市思明区文园路54号之106", status: "提交", fm_require_date: "2017-11-23 9:01", to_require_date: "2017-11-24 9:01", place_order_date: "2017-11-23 9:01", place_order_count: "52",unit: "千克"},
        {order: "CR201711250006", cg_order: "CG201711250022", name: "果有源生鲜", address: "福建省厦门市思明区万寿路阳鸿新城一之5", status: "提交", fm_require_date: "2017-11-25 11:55", to_require_date: "2017-11-26 11:55", place_order_date: "2017-11-25 11:55", place_order_count: "23",unit: "千克"},
        {order: "CR201711280011", cg_order: "CG201711280006", name: "果菜批发", address: "福建省厦门市思明区阳台山路25号", status: "提交", fm_require_date: "2017-11-28 10:52", to_require_date: "2017-11-29 10:52", place_order_date: "2017-11-28 10:52", place_order_count: "22",unit: "吨"},
        {order: "CR201712080023", cg_order: "CG201712090001", name: "台湾水果缘批发部", address: "福建省厦门市思明区厦禾路840号之1", status: "新增", fm_require_date: "2017-12-08 17:18", to_require_date: "2017-12-09 17:18", place_order_date: "2017-12-08 17:18", place_order_count: "9",unit: "吨"},
        {order: "CR201712080026", cg_order: "CG201712090002", name: "进口水果直营店", address: "福建省厦门市思明区文园路65号", status: "新增", fm_require_date: "2017-12-08 15:46", to_require_date: "2017-12-09  15:46", place_order_date: "2017-12-08 15:46", place_order_count: "21",unit: "吨"}];

    /**
     * 订单发货信息子列表：派车单信息
     */
    var purchaseTable = $('#purchaseTable').DataTable( {
        serverSide: false,
        "paging": false,
        "columns": [                    	// 自定义数据列
            {
                data: function(obj){
                    return '<input type="checkbox" lay-skin="primary" style="vertical-align:middle; margin-top: -5px;" lay-filter="oneChoose" data-id="' + obj.id +  '"/>';
                }
            },
            {data: 'order'},
            {data: 'cg_order'},
            {data: 'name'},
            {data: 'address'},
            {data: 'status'},
            {data: 'fm_require_date'},
            {data: 'to_require_date'},
            {data: 'place_order_date'},
            {data: 'place_order_count'},
            {data: 'unit'}
        ],
        "stateSaveParams": function () {
            // 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    });
    initPurchase();
    function initPurchase(){
        $.each(tableData, function (key, value) {
            purchaseTable.row.add(value).draw(false);
        });
	}
    /**
     * 合单信息Tab切换事件：更新合单信息列表
     */
    $('#sub-purchase').on('click',function() {

    });


    exports('csOrderForm', {});
});
