/**
 * 账单维护界面
 *
 * @author Bill
 */
var id = xmtc.getUrlVars("id");
var bill_no = xmtc.getUrlVars("bill_no");
xmtc.getDictMap('yes_no');

layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
        
    // 当前编辑对象
    var currentOrder = null;
    
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
     * 通过ID获取账单信息
     */ 
    function getDispatchById() {
    	if (id) {
    		xmtc.ajaxPost(base + "/fee/csBills/getById", { id : id }, function (json) {
				// 将数据渲染到表单
    			setOrderToForm(json.data);
    		});
    	}
    }
    
    // 通过ID获取账单信息
    getDispatchById();
    
    /**
     * 将账单渲染到表单
     */
    function setOrderToForm(order) {
    	if (order) {
			// 缓存当前编辑对象
			currentOrder = order;
			id = order.id;
			bill_no = order.bill_no;
			dispatch_no = order.dispatch_no;
			// 渲染到界面
			$.each(order, function (key, value) {
				if ($('#' + key+"_edit")) {
					$('#' + key+"_edit").val(xmtc.nullToSpace(value));
				}
			});
			
			// 重新渲染下拉框
			form.render('select');
		}
    }
    
    
    /**
     * 账单发货信息子列表：费用明细
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
            url: base + "/fee/csBillsFee/page",
            data : function(data) {  
                data.bill_no = bill_no;
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
            { data: 'order_no' },			// 系统订单号
            { data: 'distribution_no' },	// 分配单号
            { data: 'dispatch_no' },		// 账单号
            { data: 'fee_name' },			// 费用名称
            { data: 						// 费用类型
            	function (obj) {
	            	return xmtc.getDictVal('fee_type', obj.fee_type);
            	}
            },
            { data: 'total_amount' },		// 金额
            { data: 'occur_time' },			// 发生时间
            { data: 'tax_rate' }, 			// 税率
            { data: 						// 舍入方式
            	function (obj) {
	            	return xmtc.getDictVal('rounding_way', obj.rounding_way);
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
        deleteSubFeeHanlder([id].join(","));
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        // 弹出编辑表单
    	editSubFeeHanlder("添加费用",id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=feeTable.row(this).data();//获取值的对象数据
        // 弹出编辑表单
     	editSubFeeHanlder("添加费用",data.id);
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
     * 账单应收费用列表-新增-按钮
     */
    $('#btn-sub-fee-add').on('click',function() {
    	if (!currentOrder) {
    		xmtc.failMsg('请先保存账单信息');
    		return false;
    	}	
    	
    	// 弹出编辑表单
    	editSubFeeHanlder("添加费用","");
    });
    
    /**
     * 账单应收费用列表-删除-按钮
     */ 
    $("#btn-sub-fee-delete").on('click', function () {
    	var ids = getSeclectSubFeeIds('01');
    	if (ids.length === 0) {
            xmtc.failMsg("请选择记录");
            return false;
        } 
    	
    	// 执行删除
        deleteSubFeeHanlder(ids.join(","));
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
    	//重新刷新账单信息
    	getDispatchById();
    	parent.$("#btn-dateTable-refresh").click();
    	return false;
    });
    
    //=====================================按钮事件部分End=====================================
    
    /**
     * 弹出编辑费用弹窗
     */
    function editSubFeeHanlder(title, rowId) {
    	var url = base+"/view/oms/fee/addFeeForm.jsp?bill_no="+bill_no;
    	if (rowId) {
    		url += "&id=" + rowId;
    	}
		
    	// 弹出商品明细表单弹窗
    	layer_show(title, url, 900, 432);
    }
    
    /**
     * 删除账单费用
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */ 
    function deleteSubFeeHanlder(idsString) {
    	// 执行删除
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/fee/csBillsFee/delete", { ids : idsString }, function (data) {
                if (data.success) {
                	feeTable.ajax.reload();
                    xmtc.successMsg('操作成功');
                    
                    //重新刷新账单信息
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
     * 获取账单费用表格选中行的id集合
     */ 
    function getSeclectSubFeeIds(pay_or_receive) {
        var feeIds = [];
        if(pay_or_receive === "01"){
    		//应收
        	$("#feeTable").find(":checkbox:checked").each(function () {
            	feeIds.push($(this).attr("data-id"));
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
    
    /**
     * 保存
     */ 
    function saveHandler(param) {
    	//保存
    	xmtc.ajaxPost(base + "/fee/csBills/submit", param, function (json) {
    		if (json.success) {
    			var index = parent.layer.getFrameIndex(window.name);
    			setOrderToForm(json.data);
    			xmtc.parentSuccessMsg('操作成功');
    			parent.$('#btn-query').click();
    		} else {
    			xmtc.successMsg(json.msg);
    		}
    	});
    	
        return false;
    }
    
    /**
     * 派车单主表-保存并确认-按钮
     */ 
    $("#btn-form-save-confirm").on('click', function () {
    	var param = {};
    	param.id = id;
    	param.bill_no = $("#bill_no_edit").val();
    	param.carrier_code = $("#bill_no_edit").val();
    	param.carrier_name = $("#carrier_name_edit").val();
    	param.account_period = $("#account_period_edit").val();
    	param.total_amount = $("#total_amount_edit").val();
    	param.bill_status = "20";
    	param.remark = $("#remark_edit").val();
    	saveHandler(param);
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
    	return false; 
    });
    
    /**
     * 派车单主表-保存-按钮
     */ 
    form.on('submit(form-save)', function (data) {
    	var param = data.field;
    	// 保存不需要这个字段
    	delete param["dateTable_length"];
    	if (currentOrder && currentOrder.id) {
    		param.id = currentOrder.id;
    	}
    	
    	saveHandler(param)
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
    	return false; 
    });
    
	//=====================================界面弹出框配置Start=====================================
    /**
     * 承运商弹出框
     */
    $("#carrier_name_edit").on('click', function () {
    	var oldCarrierCode = $("#carrier_code_edit").val();
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		var carrierCode = res["unit"];
    		$("#carrier_code_edit").val(carrierCode);  
		    $("#carrier_name_edit").val(res["unit_name"]);
    	});
    });
    
    //=====================================界面弹出框配置End=====================================
    exports('csBillsForm', {});
});
