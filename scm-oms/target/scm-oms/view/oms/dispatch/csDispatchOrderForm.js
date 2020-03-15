/**
 * 派车单维护界面
 *
 * @author Bill
 */
var id = xmtc.getUrlVars("id");
var dispatch_no = xmtc.getUrlVars("dispatch_no");
var order_no = xmtc.getUrlVars("order_no");
xmtc.getDictMap('yes_no');

layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
        
    // 当前编辑对象
    var currentOrder = null;
    // 订单承运商成本费用
    var carrierCostMap = new HashMap();
    
    /**
     * 判断字符串是否为空
     * @param obj
     * @returns
     */
    function isNotEmpty(obj){
    	if(obj !== null && obj !==undefined && obj.trim() !== ""){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    /**
     * 通过ID获取派车单信息
     */ 
    function getDispatchById() {
    	if (id) {
    		xmtc.ajaxPost(base + "/dispatch/csDispatchOrder/getDispatchById", { id : id }, function (json) {
				// 将数据渲染到表单
    			setOrderToForm(json.data);
    			
    			//刷新当前子TAB页签内容
    			refreshCurrentShowSubTab();
    		});
    	}
    }
    
    // 通过ID获取派车单信息
    getDispatchById();
    
    /**
     * 将派车单渲染到表单
     */
    function setOrderToForm(order) {
    	if (order) {
			// 缓存当前编辑对象
			currentOrder = order;
			id = order.id;
			dispatch_no = order.dispatch_no;
			// 渲染到界面
			$.each(order, function (key, value) {
				if ($('#' + key+"_edit")) {
					$('#' + key+"_edit").val(xmtc.nullToSpace(value));
				}
			});
			
			//结算方式联动设置
			setChargeMode(order.charge_mode);
			// 根据客户类型设置临时计费协议、临时运价是否必填
			setTemporaryCharge(order.customer_type);
			//设置底部按钮权限
			$('#btn-confirm-form').hide();//审核
			$('#btn-cancel-confirm-form').hide();//取消审核
			
			if (order.dispatch_status === "10") {
				//创建
				$('#btn-confirm-form').show();//审核
			} else if (order.dispatch_status === "20") {
				//已审核
				$('#btn-cancel-confirm-form').show();//取消审核
			}
			
			//根据状态设置表单字段是否可编辑
			setFormStatus(order.dispatch_status);
			
			// 渲染行政区划
			setAddressToForm(order);
			// 重新渲染下拉框
			form.render('select');
		}
    }
    
    /**
     * 设置表单状态：当派车单为审核时，设置表单哪些可编辑，哪些不可编辑
     */
    function setFormStatus(dispatchOrderStatus) {
    	// 其它：不可编辑
		$('#customer_dispatch_no_edit').attr("disabled", "disabled");
		$('#vehicle_no_edit').attr("disabled", "disabled");
		$('#main_drive_name_edit').attr("disabled", "disabled");
		$('#main_drive_tel_edit').attr("disabled", "disabled");
		$('#copilot_drive_code_edit').attr("disabled", "disabled");
		$('#copilot_drive_tel_edit').attr("disabled", "disabled");
		$('#require_time_from_edit').attr("disabled", "disabled");
		$('#require_time_to_edit').attr("disabled", "disabled");
		$('#vehicle_type_edit').attr("disabled", "true");
		$('#require_time_from_edit').attr("disabled","disabled");
		$('#require_time_to_edit').attr("disabled","disabled");
    }
    
    /**
     * 渲染数据到发货行政区划、收货行政区划
     * @param order
     */
    function setAddressToForm (order) {
    	// 设置发货地址行政区划
		var shipperAddress = "";
		if(order.shipper_province){
			shipperAddress+=order.shipper_province;
		}
		if(order.shipper_city){
			shipperAddress+=order.shipper_city;
		}
		if(order.shipper_county){
			shipperAddress+=order.shipper_county;
		}
		$("#shipper_address_select").val(shipperAddress);
		// 设置收货地址行政区划
		var consigneeAddress = "";
		if(order.consignee_province){
			consigneeAddress+=order.consignee_province;
		}
		if(order.consignee_city){
			consigneeAddress+=order.consignee_city;
		}
		if(order.consignee_county){
			consigneeAddress+=order.consignee_county;
		}
		$("#consignee_address_select").val(consigneeAddress);
    }
    
    /**
     * 派车单发货信息子列表：应收费用
     */
    var feeTable = $('#feeTable').DataTable(
    	{  "dom": '<"top">rt<"bottom"flp><"clear">',
	        "autoWidth": true,                      // 自适应宽度
	        "stateSave": true,                      // 刷新后保存页数
	        "ordering" : false,                      
	        "searching": false,                     // 本地搜索
	        "info": true,                           // 控制是否显示表格左下角的信息
	        "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
	        "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
	        "language": {                           // 国际化
	        "url": base + '/static/frame/jquery/language.json'
        },
        serverSide:true,                        //开启服务器模式
        ajax: {  
            url: base + "/dispatch/csDispatchOrderFee/query",
            data : function(data) {  
                data.dispatch_no = dispatch_no;
            }  
        }, 
        "deferRender": true,            	// 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "sServerMethod" : "POST",       	// POST
        "columns": [                    	// 自定义数据列
        	{ data:
            	function(obj) {
                	return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
            	}
            },
            { data: 'fee_name' },			// 费用名称
            { data: 						// 费用类型
            	function (obj) {
	            	return xmtc.getDictVal('fee_type', obj.fee_type);
            	}
            },
            { data: 'balance_name' },	// 结算对象
            { data: 'count' },			// 数量
            { data: 'unit_price' },		// 单价
            { data: 'total_amount' },	// 总费用
            { data: 						// 舍入方式
            	function (obj) {
	            	return xmtc.getDictVal('rounding_way', obj.rounding_way);
            	}
            },
            { data: 						// 币别
            	function (obj) {
	            	return xmtc.getDictVal('currency', obj.currency);
            	}
            },
            { data: 'tax_rate' }, 	// 税率
            { data: 'remark' },			// 备注
            { data:						// 是否已对账
            	function (obj) {
	            	return xmtc.getDictVal('yes_no', obj.is_balance_account);
            	}
            },
            { data: 'account_period' },			// 账期
            {data: 						// 状态
            	function (obj) {
            		var statusHtml;
                	if (obj.dispatch_status !== '20') {
                		statusHtml = '<span class="c-green">';
                	} else {
                		statusHtml = '<span class="layui-disabled">';
                	}
                	statusHtml += xmtc.getDictVal("fee_status",obj.fee_status) + '</span>';
                	return statusHtml;
            	}
            },
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id +'"><i class="layui-icon">&#xe642;</i></a>';
                }
            }
            
        ],
        "stateSaveParams": function () {
        	// 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 执行删除
        deleteSubFeeHanlder([id].join(","),'01');
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        // 弹出编辑表单
    	editSubFeeHanlder("编辑费用",id,'02');
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=feeTable.row(this).data();//获取值的对象数据
        // 弹出编辑表单
     	editSubFeeHanlder("编辑费用",data.id,'02');
    });
    
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    //=====================================按钮事件部分Start===================================
    
    /**
     * 费用信息列表
     */
    $('#sub-fee').on('click',function() {
    	feeTable.ajax.reload();
    });
    
    /**
     * 派车单应收费用列表-新增-按钮
     */
    $('#btn-sub-fee-add').on('click',function() {
    	if (!currentOrder) {
    		xmtc.failMsg('请先保存派车单信息');
    		return false;
    	}
    	//获取表格数据
    	var allRows = feeTable.data();
    	if(allRows.length>0){
    		for(var i=0;i<allRows.length;i++){
    			if(allRows[i].fee_code=="inbound_fee"){
    				xmtc.successMsg('已经存在运输费用，无法新增');
    				return false;
    			}
    		}
    	}    	
    	// 弹出编辑表单
    	editSubFeeHanlder("编辑费用","",'02');
    });
    
    /**
     * 派车单应收费用列表-删除-按钮
     */ 
    $("#btn-sub-fee-delete").on('click', function () {
    	var ids = getSeclectSubFeeIds('01');
    	if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
            return false;
        } 
    	
    	// 执行删除
        deleteSubFeeHanlder(ids.join(","),'01');
    });
    
    /**
     * 派车单应收费用列表-费用计算-按钮
     */ 
    $("#btn-sub-fee-cost").on('click', function () {
    	//计费前的校验
    	xmtc.ajaxPost(base + "/dispatch/csDispatchOrderFee/calculateCheck", { dispatch_no : dispatch_no }, function (data) {
            if (data.success) {
            	// 执行费用计算
            	calculateSubFeeHanlder([id].join(","),'01');
            } else {
            	if (isNotEmpty(data.msg)) {
            		// 计费前的校验
                    layer.confirm('已费率计算,重新计费将删除之前使用费率计算出费用,并且数据不可恢复,确认要重新计费吗？', function (index) {
                    	// 执行费用计算
                    	calculateSubFeeHanlder([id].join(","),'01');
                    });
            	} else {
            		xmtc.failMsg('存在已确认的费用,不能进行费率计算');
            	}
            }
        });
    });
    
    /**
     * 派车单应收费用列表-费用确认-按钮
     */ 
    $("#btn-sub-fee-confirm").on('click', function () {
    	//判断派车单是否已卸货确认
    	var dispatch_status = $('#dispatch_status_edit').val();
    	//应收费用只有卸货确认后才能进行费用确认，目的是卸货量需要有值
    	if(dispatch_status&&dispatch_status!="50"&&dispatch_status!="60"){
    		xmtc.successMsg("只有卸货确认后才能进行费用确认");
            return false;
    	}
    	var ids = getSeclectSubFeeIds('01');
    	if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
            return false;
        } 
    	
    	//费用确认
    	xmtc.ajaxPost(base + "/dispatch/csDispatchOrderFee/feeConfirm", { id:ids.join(","),dispatch_no : dispatch_no }, function (data) {
            if (data.success) {
            	if (isNotEmpty(data.msg)) {
            		xmtc.successMsg(data.msg);
            	} else {
            		xmtc.successMsg('操作成功');
            	}
            	
            	//重新加载费用信息
            	feeTable.ajax.reload();
            } else {
            	xmtc.failMsg('费用确认失败');
            }
        });
    });
    
    /**
     * 关闭-按钮
     */
    $('#btn-close').on('click',function(){
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
    /**
     * 刷新表单数据
     */
    $('#btn-form-refresh').on('click',function(){
    	//重新刷新派车单信息
    	getDispatchById();
    	parent.$("#btn-dateTable-refresh").click();
    	return false;
    });
    
    //=====================================按钮事件部分End=====================================
    
    /**
     * 弹出编辑费用弹窗
     */
    function editSubFeeHanlder(title, rowId,pay_or_receive) {
    	var url = base+"/view/oms/dispatch/csDispatchFeeForm.jsp?dispatch_no=" + dispatch_no+"&pay_or_receive="+pay_or_receive;
    	if (rowId) {
    		url += "&id=" + rowId;
    	}
    	url +="&carrier_code="+currentOrder.carrier_code+"&carrier_name="+currentOrder.carrier_name+"&customer_code="+currentOrder.customer_code+"&customer_name="+currentOrder.customer_name;
		
    	// 弹出商品明细表单弹窗
    	layer_show(title, url, 600, 432);
    }
    
    /**
     * 删除派车单费用
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */ 
    function deleteSubFeeHanlder(idsString,pay_or_receive) {
    	// 执行删除
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/dispatch/csDispatchOrderFee/delete", { ids : idsString }, function (data) {
                if (data.success) {
                	if(pay_or_receive === "01"){
                		//应收
                		feeTable.ajax.reload();
                	}else if(pay_or_receive === "02"){
                		//应付
                		payTeeTable.ajax.reload();
                	}
                    xmtc.successMsg('操作成功');
                    
                    //重新刷新派车单信息
                	getDispatchById();
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
     * 计算派车单费用
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */ 
    function calculateSubFeeHanlder(idsString,pay_or_receive) {
        xmtc.ajaxPost(base + "/dispatch/csDispatchOrder/calculateSubFeeHanlder", { ids : idsString }, function (data) {
            if (data.success) {
            	if(pay_or_receive === "01"){
            		//应收
            		feeTable.ajax.reload();
            	}else if(pay_or_receive === "02"){
            		//应付
            		payTeeTable.ajax.reload();
            	}
                xmtc.successMsg('操作成功');
            } else {
            	if (data.msg) {
            		xmtc.failMsg(data.msg);
            	} else {
            		xmtc.failMsg('计费失败');
            	}
            }
        });
    }
    
    /**
     * 获取派车单费用表格选中行的id集合
     */ 
    function getSeclectSubFeeIds(pay_or_receive) {
        var feeIds = [];
        if(pay_or_receive === "01"){
    		//应收
        	$("#feeTable").find(":checkbox:checked").each(function () {
                if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                    ids.push($(this).attr("data-id"));
                }
            });
    	}
        return feeIds;
    }
    
    /**
     * 刷新当前显示的TAB页签
     */ 
    function refreshCurrentShowSubTab() {
    	var selecLi = $("ul#sub-tabs li.layui-this");
    	if(selecLi.length > 0){
    		$("#"+selecLi[0].id).click();
    	}
        
        return false;
    }
    
    /**
     * 结算方式变更事件
     */
    form.on('select(charge_mode)', function (data) {
    	setChargeMode(data.value);
    });
    
    /**
     * 是否需要清罐
     */
    form.on('select(is_clean_pot)',function (data) {
    	if(data.value === '1'){
    		//启用
    		$("#clean_pot_remark_edit").attr("disabled",false);
    	}else{
    		//停用
    		$("#clean_pot_remark_edit").val("");
    		$("#clean_pot_remark_edit").attr("disabled",true);
    	}
    });
    
    /**
     * 通过客户类型设置表单相关字段的联动控制
     * @param customeType
     */
    function setChargeMode(charge_mode) {
    	//根据结算方式修改收款方式是否必填
    	if(!isNotEmpty(charge_mode)){
    		charge_mode = $("#charge_mode").val();
    	}
    	if(charge_mode === "billing"){
    		//开票时,非必填
    		$("#receivables_way_span").hide();
    		$("#receivables_way_edit").removeAttr("lay-verify");
    	}else{
    		//现金、完成后付,必填
    		$("#receivables_way_span").show();
    		$("#receivables_way_edit").attr("lay-verify", "required");
    	}
		form.render('select');
    };
    
    /**
     * 通过客户类型设置临时计费协议、临时运价是否必填
     * @param customerType 订单类型
     */
    function setTemporaryCharge(customerType) {
    	if(customerType === "contract_customer") {
    		// 设置临时计费协议、临时运价非必录
    		$("#temporary_charge_protocol_span").hide();
    		$('#temporary_charge_protocol_edit').removeAttr("lay-verify");
    		$("#temporary_charge_cost_span").hide();
    		$('#temporary_charge_cost_edit').removeAttr("lay-verify");
    	} else if (customerType === "temporary_customer") {
    		// 设置临时计费协议、临时运价必录，且可编辑
    		$("#temporary_charge_protocol_span").show();
    		$('#temporary_charge_protocol_edit').attr("lay-verify", "required");
    		$('#temporary_charge_cost_span').show();
    		$('#temporary_charge_cost_edit').attr("lay-verify", "required|number");
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
    
	//=====================================界面弹出框配置Start=====================================
    /**
     * 承运商弹出框
     */
    $("#carrier_name_edit").on('click', function () {
    	var oldCarrierCode = $("#carrier_code_edit").val();
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/admin/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		var carrierCode = res["unit"];
    		$("#carrier_code_edit").val(carrierCode);  
		    $("#carrier_name_edit").val(res["unit_name"]);
		    
		    // 判断承运商是否有变更，若变更则带出成本运价，并清空成本运费
		    if (carrierCode !== oldCarrierCode) {
		    	if (carrierCostMap.get(carrierCode)) {
		    		$("#cost_unit_freight_rate_edit").val(carrierCostMap.get(carrierCode));
			    } else {
			    	$("#cost_unit_freight_rate_edit").val("");
			    }
		    	$("cost_freight_rate_edit").val("");
		    }
		    
		    //清空车牌号和车型
		    $("#vehicle_no_edit").val("");
		    $("#vehicle_type_edit").val("");
		    // 重新渲染下拉框
			form.render('select');
    	});
    });
    
    /**
     * 车牌号弹出框
     */
    $("#vehicle_no_edit").on('click', function () {
    	// 取得承运商代码
    	var url = base + "/admin/vehicle/vehicleWin.jsp";
    	var carrier_code = $('#carrier_code_edit').val();
    	if (carrier_code) {
            url += "?carrier_code=" + carrier_code;
        }
    	
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(url,"车牌号",600,432,"vehicle_number","vehicle_number_name",function(res){
		    $("#vehicle_no_edit").val(res["vehicle_number"]);
		    $("#vehicle_type_edit").val(res["vehicle_type"]);
		    $("#carrier_code_edit").val(res["supplier_code"]);  
		    $("#carrier_name_edit").val(res["supplier_name"]);
		    // 重新渲染下拉框
			form.render('select');
    	});
    });
    
    /**
     * 主驾弹出框
     */
    $("#main_drive_name_edit").on('click', function () {
    	// 取得承运商名称
    	var url = base + "/admin/cust/csTransportPersonnelWin.jsp";
    	var carrier_name = $('#carrier_name_edit').val();
    	if (carrier_name) {
            url += "?carrier_name=" + carrier_name;
        }
    	
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(url,"主驾",600,432,"personnel_number","personnel_name",function(res){
    		$("#main_drive_code_edit").val(res["personnel_number"]);  
		    $("#main_drive_name_edit").val(res["personnel_name"]);
		    $("#main_drive_tel_edit").val(res["phone_number"]);
    	});
    });
    
    /**
     * 副驾弹出框
     */
    $("#copilot_drive_name_edit").on('click', function () {
    	// 取得承运商名称
    	var url = base + "/admin/cust/csTransportPersonnelWin.jsp";
    	var carrier_name = $('#carrier_name_edit').val();
    	if (carrier_name) {
            url += "?carrier_name=" + carrier_name;
        }
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(url,"副驾",600,432,"personnel_number","personnel_name",function(res){
    		$("#copilot_drive_code_edit").val(res["personnel_number"]);  
		    $("#copilot_drive_name_edit").val(res["personnel_name"]);
		    $("#copilot_drive_tel_edit").val(res["phone_number"]);
    	});
    });
    //=====================================界面弹出框配置End=====================================
    
    
    exports('csDispatchOrderForm', {});
});
