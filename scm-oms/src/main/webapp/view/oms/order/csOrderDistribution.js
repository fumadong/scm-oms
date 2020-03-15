/**
 * 订单管理--订单分配弹窗
 * @author Devin
 */
// 系统订单号
var orderNo = xmtc.getUrlVars("order_no");
// 调用来源：list 列表界面 / form 编辑界面
var from = xmtc.getUrlVars("from");

var getUrlVars = function(name, flag){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
};
layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate, laypage = layui.laypage;
	
	// 当前订单
	var currentOrder = {};
	// 当前订单已分配情况
	var carrierDistributions = [];
	
	/**
	 * 查询订单及分配单
	 * @returns
	 */
	function getOrderAndDistributions() {
		xmtc.ajaxPost(base + "/order/csDistribution/getDistributionInfo", { order_no:orderNo }, function(json) {
			if (json) {
				currentOrder = json.order;
				carrierDistributions = json.distributions;
				initialization();
			}
		});
	};
	
	/**
	 * 初始化：界面饼图及右侧表单
	 * @returns
	 */
	function initialization() {
		// 设置右侧表单头信息
		var formTitle = "已分配商品总量: " + currentOrder.distribution_amount + ",  剩余量: " + currentOrder.remainder_amount;
		$("#dispatch_form_title").html(formTitle);
		// 设置右侧表单信息:分配量=订单剩余量
		$('#plan_amount').val(xmtc.nullToSpace(currentOrder.remainder_amount));
		$('#require_time_from').val(xmtc.nullToSpace(currentOrder.require_time_from));
		$('#require_time_to').val(xmtc.nullToSpace(currentOrder.require_time_to));
		$('#remark').val(xmtc.nullToSpace(currentOrder.remark));
		// 初始化做出图表
		carrierDistributionProportion();
	};
    
    /**
     * 设置订单承运商分配比例图表
     * @returns
     */
    function carrierDistributionProportion() {
    	// 根据订单承运商分配情况设置表格数据
    	if (carrierDistributions && carrierDistributions.length > 0) {
    		var datas = [];
    		for (var i = 0, j = carrierDistributions.length; i < j; i++) {
    			var data = {
    				value : carrierDistributions[i].plan_amount,
    				name: carrierDistributions[i].carrier_name
    			};
    			datas.push(data);
    		};
    		
    		var option = {
    			    tooltip : {
    			        trigger: 'item',
    			        formatter: "{a} <br/>{b} : {c} ({d}%)"
    			    },
    			    series : [{
    			            name: '',
    			            type: 'pie',
    			            radius : '55%',
    			            center: ['50%', '60%'],
    			            data: datas,
    			            itemStyle: {
    			                // 设置每个饼图区域对应的文字
    			            	normal:{
    			                     label:{
    			                        show:true,
    			                        formatter: '{b} : {c} ({d}%)'
    			                     },
    			                     labelLine:{
    			                        show:true
    			                     }
    			                },
    			                emphasis: {
    			                    shadowBlur: 10,
    			                    shadowOffsetX: 0,
    			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
    			                }
    			            }
    			        }
    			    ]
    			};
    			
    			initEcharts('carrier-distribution-monitor', option);
    	} else {
    		// 无数据，饼图区域显示无试图信息
    		initNoDatasEcharts('carrier-distribution-monitor');
    	}
    };
    
    /**
     * 初始化图表信息：有数据时显示
     */
    var initEcharts = function(divId, option) {
		// 初始化显示图表信息
		if (option) {
			// 显示图表DIV
			$("#" + divId).show();
			// 隐藏无数据DIV
			$("#" + divId + "-no-datas").hide();
			// 显示图表
			var tempEcharts = echarts.init(document.getElementById(divId));
			tempEcharts.setOption(option);
		}
	};
	
	/**
     * 初始化图表信息：无数据时显示
     */
    var initNoDatasEcharts = function(divId) {
		//切换无数据和图表
		if (divId) {
			//隐藏图表DIV
			$("#" + divId).hide();
			//显示无数据DIV
			$("#" + divId + "-no-datas").show();
		}
	};
	
	//======================================按钮事件=====================================
	
	/**
     * 确认-按钮
     */
    form.on('submit(form-confirm)', function(data) {
    	var param = data.field;
    	// 计划量校验
    	if (param.plan_amount <= 0) {
    		xmtc.failMsg('确认失败，计划量必须大于0');
    		return false;
    	} else if (param.plan_amount > currentOrder.remainder_amount) {
    		xmtc.failMsg('确认失败，计划量不能超过剩余量');
    		return false;
    	}
    	// 要求日期校验
    	if (param.require_time_from > param.require_time_to){
    		xmtc.failMsg('要求开始日期 不能晚于 要求结束日期');
    		return false;
    	}
    	// 订单分配
    	param.order_no = orderNo;
    	xmtc.ajaxPost( base + "/order/csDistribution/orderDistribution", param, function(json) {
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
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    /**
     * 关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
    //======================================界面设置=====================================
    /**
     * 表单格式
     */
    form.verify({
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
    $("#carrier_name").on('click', function () {
    	var url = base + "/view/oms/cust/supplierWin.jsp";
    	top.xmtc.popUp(url, "承运商", 600, 432, "unit", "unit_name", function(data) {
    		$("#carrier_code").val(data["unit"]);
    		$("#carrier_name").val(data["unit_name"]);
    	});
    });
    
    //=====================================界面弹出框配置End=====================================
    
    // 查询数据并初始化界面
    getOrderAndDistributions();
    
    exports('csOrderDistribution', {});
});