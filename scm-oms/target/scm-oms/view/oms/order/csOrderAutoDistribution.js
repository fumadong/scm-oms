/**
 * 订单管理--自动分配承运商
 */
// 系统订单号
var orderNo = xmtc.getUrlVars("order_no");
// 调用来源：list 列表界面 / form 编辑界面
var from = xmtc.getUrlVars("from");

layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate, laypage = layui.laypage;
	
	var table;
	var remainingAmount;
	
	// 当前订单
	var currentOrder = {};
	
	function getById() {
		xmtc.ajaxPost(base + "/api/oms/order/csOrderAutoDistribution/getDistributionInfo", { order_no:orderNo }, function(json) {
			if (json) {
				currentOrder = json.data;
				var customerName = "";
        		var customerOrderNo = "";
        		var remainderAmount = "0";
        		if(currentOrder.customer_name){
        			customerName = currentOrder.customer_name;
        		}
        		
        		if(currentOrder.customer_order_no){
        			customerOrderNo = currentOrder.customer_order_no;
        		}
        		
        		if(currentOrder.remainder_amount){
        			remainderAmount = currentOrder.remainder_amount;
        			remainingAmount = remainderAmount;
        		}
        		
        		var orderInfo = "";
        		orderInfo+="客户：【 <B>"+customerName+"</B> 】";
        		orderInfo+=" 系统订单号：【 <B>"+currentOrder.order_no+"</B> 】";
        		orderInfo+=" 货物：【 <B>"+currentOrder.cargo_name+"</B> 】";
        		//组合流向信息
        		var flowTo = "";
        		if(currentOrder.shipper_county_name){
        			flowTo+=currentOrder.shipper_county_name;
        		}else if(currentOrder.shipper_city_name){
        			flowTo+=currentOrder.shipper_city_name;
        		}else if(currentOrder.shipper_province_name){
        			flowTo+=currentOrder.shipper_province_name;
        		}
        		
        		if(flowTo){            			
        			flowTo+=' - '
        		}
        		
        		if(currentOrder.consignee_county_name){
        			flowTo+=currentOrder.consignee_county_name;
        		}else if(currentOrder.consignee_city_name){
        			flowTo+=currentOrder.consignee_city_name;
        		}else if(currentOrder.consignee_province_name){
        			flowTo+=currentOrder.consignee_province_name;
        		}
        		orderInfo+=" 流向：【 <B>"+flowTo+"</B> 】";
        		orderInfo+=" 未分配数量：<B>"+remainderAmount+"</B> ";
        		
        		$("#total-info").html(orderInfo); 
        		
        		getCarrierByCommitment(currentOrder);
			}
		});
	};
	
	function getCarrierByCommitment(currentOrder) {
		table = $('#dateTable').DataTable({
			ajax: {
				url: base + "/api/oms/order/csOrderAutoDistribution/getCarrierByCommitment",
				data: function (data) {
					$.each(currentOrder, function (key, value) {
						data[key] = value
					});
				}
			},
			"paging": false,
			"columns": [                            // 自定义数据列
				{ data: function (obj) {
	                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.order_no + '" data-status="' + obj.status + '"/>';
	                }
	            },
				{data: 'carrier_name'},
				{data: function (obj) {
					return obj.origin + "-" + obj.destination;
				}},
				{data: function (obj) {
					return obj.transit_time;
					}
				},
//				{data: function (obj) {
//					return "3000(300km)/20"
//	        	}},
				{data: function (obj) {
					obj.plan_amount = 0;
					return '<input type="text" id="plan_amount-'+obj.row_id+'" class="input-proportion layui-input" lay-filter="plan_amoun" onkeyup="this.value=keyUpReturn(this.value);" onChange="changePlanAmount('+obj.row_id+',this.value)" value="'+obj.plan_amount+'">'
				}},
				{data: function (obj) {
					obj.require_time_from = currentOrder.require_time_from;
					return '<input type="text" id="require_time_from" autocomplete="off" class="layui-input laydate-icon" value="'+obj.require_time_from+'" onclick="layui.laydate({elem: this})">';
				}},
				{data: function (obj) {
					obj.require_time_to = currentOrder.require_time_to;
					return '<input type="text" id="require_time_from" autocomplete="off" class="layui-input laydate-icon" value="'+obj.require_time_to+'" onclick="layui.laydate({elem: this})">';
				}}
			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			},
	        "drawCallback": function(settings, json) {
	        	var rows = table.rows().data();
	        	if(rows.length==0){
	        		xmtc.failMsg("没有匹配到承运商，请手动分配");
	    			return false;
	        	}
	         }
		});
	};
	
	/**
	 * 考核占比改变事事件
	 */
	function changePlanAmount(index,value){
		value=value.replace(/[^0-9.]+/,"");
		var row = table.rows().data()[index-1];
		row.plan_amount = value;
	};
	window.changePlanAmount = changePlanAmount;
	
	/**
	 * 只允许输入数字
	 */
	function keyUpReturn(value) {
		return value.replace(/[^0-9.]+/,"");
	}
	window.keyUpReturn = keyUpReturn;
	
	/**
     * 确认-按钮
     */
    form.on('submit(form-confirm)', function(data) {
    	var param ={};
    	
    	var distributions = [];
    	var rows = table.rows().data();
    	if(rows.length==0){
    		xmtc.failMsg("没有匹配到承运商，请手动分配");
			return false;
    	}
    	
    	var allAmount = 0;
    	for(var i = 0; i<rows.length; i++){
    		var row = rows[i];
    		var distribution = {};
    		if(row.plan_amount > 0){
    			allAmount += parseInt(row.plan_amount);
    			distribution.plan_amount = row.plan_amount;
    			distribution.carrier_code = row.carrier_code;
    			distribution.carrier_name = row.carrier_name;
    			distribution.require_time_from = row.require_time_from;
    			distribution.require_time_to = row.require_time_to;
    			// 要求日期校验
    	    	if (distribution.require_time_from > distribution.require_time_to){
    	    		xmtc.failMsg('要求开始日期 不能晚于 要求结束日期');
    	    		return false;
    	    	}
    			distributions.push(distribution);
    		}
		}
    	
    	if(distributions.length==0){
    		xmtc.failMsg("请填写分配数量");
			return false;
    	}
    	
    	// 分配量是否大于剩余量
    	if(allAmount > remainingAmount){
    		xmtc.failMsg("分配数量超过订单总量，请修改");
			return false;
    	}
    	
    	// 订单分配
    	param.order_no = orderNo;
    	param.distributions = JSON.stringify(distributions);
    	xmtc.ajaxPost( base + "/api/oms/order/csOrderAutoDistribution/orderAutoDistribution", param, function(json) {
			if (json.success) {
				var index = parent.layer.getFrameIndex(window.name);
				xmtc.parentSuccessMsg('分配成功');
				// 更新数据
				if (from === 'list') {
					parent.$('#btn-query').click();
				} else if (from === 'form') {
					parent.$('#btn-form-refresh').click();
				}
				if(document.activeElement.id === "confirm-and-continue"){ 
    				// 确认并继续分配：初始化界面
					getOrderAndDistributions();
    	        } else {
    	        	// 确认：关闭弹窗
    	        	parent.layer.close(index);
    	        }
			} else {
				xmtc.failMsg(json.msg);
			}
		});
        return false; 
    });
	
	getById();
	
    exports('csOrderAutoDistribution', {});
});