/**
 * 订单维护界面
 *
 * @author Devin
 */
// 取得参数
var isCopy = xmtc.getUrlVars("isCopy");
var id = xmtc.getUrlVars("id");
var orderNo = xmtc.getUrlVars("order_no");
layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
    
    // 当前编辑对象
    var currentOrder = null;
    
    // 通过系统订单号获取订单
    getById();
    
    /**
     * 通过系统订单号获取订单
     */ 
    function getById() {
    	if (!id) {
    		initToAdd();
    	} else {
    		xmtc.ajaxPost(base + "/api/oms/order/csOrder/getById", { id : id }, function (json) {
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
		$("#require_time_from").val(new Date().format("yyyy-MM-dd hh:mm:ss"));
		$("#require_time_to").val(null);
		// 设置订单来源为手工录入、状态为创建
		xmtc.selectValue('order_source', 'manually_added');
		xmtc.selectValue('status', '10');
		// 默认需要提货与配送
		$("#need_pickup").val("1");
		$("#need_delivery").val("1");
		// 设置按钮状态
		setButtonStatus(null);
    }
    
    /**
     * 将订单渲染到表单
     */
    function setOrderToForm(order) {
    	if (order) {
    		// id 
    		id = order.id;
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
    	$('#cargo-toolbar').hide();
    	
    	// 以下情况设为可见
    	if (orderStatus) {
    		// 订单非新增时
    		if (orderStatus === '10') {
        		// 订单为创建时：保存、确认、保存并新增、商品按钮栏可见
        		$('#btn-save').show();
        		$('#btn-saveAndNew').show();
        		$('#cargo-toolbar').show();
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
            		data.order_id = '-1';
            	} else {
                    //订单录入，订单id为空
                    if(id == null || id === "null" || id === undefined){
                        data.order_id = '-1';
                    }else{
                        data.order_id = id;
                    }
            	}
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
     * 订单分配信息子列表：分配单信息
     */
    var taskTable = $('#taskTable').DataTable( {
    	ajax: {  
            url: base + "/api/oms/order/csOrder/queryOrderTask",
            data : function(data) {
                if (isCopy && isCopy==='true') {
            		data.order_id = '-1';
            	} else {
                	//订单录入，订单id为空
                	if(id == null || id === "null" || id === undefined){
                        data.order_id = '-1';
					}else{
                        data.order_id = id;
					}

            	}
            }  
        }, 
        "columns": [                    	// 自定义数据列
        	{ data:
            	function(obj) {
                	return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
            	}
            },
        	{ data: 'order_task_no' },	// 任务号
            { data: 'task_type_name' },		// 任务类型
            { data: function (obj) {
	        		if (obj) {
	        			return xmtc.getDictVal("task_issue_status", obj.issue_status);
	        		} else {
	        			return "";
	        		}
	        	} 
            }, 		// 下发状态
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
    		xmtc.failMsg('要求提货时间不能晚于要求到货时间');
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
    		       	id = -1;
    		       	cargoTable.ajax.reload();
    	        } else {
    	        	// 保存：渲染表单数据
    	        	setOrderToForm(result.data);
    	        }
    			xmtc.successMsg('操作成功');
    			parent.$('#btn-query').click();
    		} else {
    			xmtc.failMsg(result.msg);
    		}
    	});
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
    	return false; 
    });
    
    /**
     * 订单主表-关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	debugger;
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.getFr
    	parent.layer.close(index);
    });

    /**
     * 订单商品列表-新增-按钮
     */
    $('#btn-sub-cargo-add').on('click',function() {
    	// 校验
    	var cargoArray = $('#cargoTable').dataTable().fnGetData();

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
    	var url = "csOrderCargoForm.jsp?order_no=" + orderNo + "&order_id=" + id + "&customer_code=" + currentOrder.customer_code;
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
                    xmtc.successMsg('操作成功');
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
     * 商品信息Tab切换事件：更新商品信息列表
     */
    $('#sub-cargo').on('click',function() {
    	cargoTable.ajax.reload();
    	parent.$('#btn-query').click();
    });
    
    /**
     * 分配信息Tab切换事件：更新分配信息列表
     */
    $('#sub-task').on('click',function() {
    	taskTable.ajax.reload();
    	parent.$('#btn-query').click();
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
     * 仓库弹出框
     */
    $("#warehouse_name").on('click', function () {
    	var url = base+"/view/oms/warehouse/csWarehouseWin.jsp";
    	top.xmtc.popUp(url, "仓库", 600, 432, "warehouse_code", "warehouse_name",function(res){
    		$("#warehouse_code").val(res["warehouse_code"]);  
		    $("#warehouse_name").val(res["warehouse_name"]);
    	});
    });
    
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
    
    //=====================================界面弹出框配置End=====================================

    exports('csOrderEdit', {});
});
