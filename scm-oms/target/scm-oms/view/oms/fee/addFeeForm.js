/**
 * 账单-费用维护弹窗
 *
 * @author Bill
 */
// 费用id
var getUrlVars=function(name,flag){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
};
var bill_no = xmtc.getUrlVars("bill_no");
layui.define(['layer', 'form', 'laydate','element'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
    
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
     * 获取字段值--为空时指定默认值
     * @param obj
     * @returns
     */
    function getDefaultValue(obj,defaultValue){
    	if(obj !== null && obj !==undefined && obj.trim() !== ""){
    		return obj;
    	}else{
    		return defaultValue;
    	}
    }
    
    /**
     * 查询
     */
    $("#btn-fee-query").on('click', function () {
    	feeTable.ajax.reload();
    });
    
    /**
     * 重置
     */
    $("#btn-fee-reset").on('click', function () {
    	 $("select[name='dateTable_length']").attr("lay-ignore","");
    });
    
    /**
     * 添加费用
     */
    form.on('submit(form-save)', function(data) {
    	//获取勾选的可调度车辆
    	var selectRows = xmtc.getRows(feeTable,$('#feeTable'));

    	if(selectRows.length > 0){
    		var ids = [];
    		for (var index = 0; index < selectRows.length; index++) {
    			ids.push(selectRows[index].id);
			}
    		//获取选中的记录
        	var param = {};
        	param.bill_no=bill_no;
        	param.ids=ids.join(",");
        	xmtc.ajaxPost( base + "/fee/csBillsFee/addFeeToBillsFee", param, function(json) {
    			if (json.success) {
    				var index = parent.layer.getFrameIndex(window.name);
    				xmtc.parentSuccessMsg('操作成功');
    				parent.$('#sub-fee').click();
    				parent.$('#btn-form-refresh').click();
    				parent.layer.close(index);
    			} else {
    				xmtc.failMsg(json.msg);
    			}
    		});
    	}
    	
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
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
            url: base + "/dispatch/csDispatchOrderFee/queryDispatchFee",
            data : function(data) {  
                data.order_no=$("#order_no_edit").val();
                data.dispatch_no=$("#dispatch_no_edit").val();
                data.distribution_no=$("#distribution_no_edit").val();
                data.account_period=$("#account_period_edit").val();
                data.occur_time_from=$("#occur_time_from_edit").val();
                data.occur_time_to=$("#occur_time_to_edit").val();
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
            { data: 'dispatch_no' },		// 派车单号
            { data: 'fee_name' },			// 费用名称
            { data: 						// 费用类型
            	function (obj) {
	            	return xmtc.getDictVal('fee_type', obj.fee_type);
            	}
            },
            { data: 'total_amount' },		// 金额
            { data: 'occur_time' }		// 发生时间
        ],
        "stateSaveParams": function () {
        	// 初始化完成调用事件
        	$("select[name='dateTable_length']").attr("lay-ignore","");
        	// 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    });
    
    /**
     * 关闭-按钮
     */
    $('#btn-close').on('click',function(){
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
    //=====================================界面弹出框配置End=====================================
    
    exports('addFeeForm', {});
});