/**
 * 账单管理
 *
 * @author bill lin
 */
layui.define(['laypage', 'layer', 'laydate','form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,laypage = layui.laypage;
    
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
    
    var table = $('#dateTable').DataTable({
        "autoWidth": true,                      // 自适应宽度
        "stateSave": true,                      // 刷新后保存页数
        "ordering": false,
        "searching": false,                     // 本地搜索
        "info": true,                           // 控制是否显示表格左下角的信息
        "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
        "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
        "language": {                           // 国际化
            "url": base + '/static/frame/jquery/language.json'
        },
        serverSide: true,                        //开启服务器模式
        ajax: {
            url: base + "/fee/csBills/page",
            data: function (data) {
            	data.bill_no = $.trim($("#bill_no_query").val());
                data.carrier_code = $.trim($("#carrier_code_query").val());
                data.account_period = $.trim($("#account_period_query").val());
                data.bill_status = $.trim($("#bill_status_query option:selected").val());
                data.create_time_from = $.trim($("#create_time_from_edit").val());
                data.create_time_to = $.trim($("#create_time_to_edit").val());
            }
        },
        "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "sServerMethod": "POST",               // POST
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.dispatch_status + '"/>';
                }
            },
            {data: 'bill_no'},
            {data: 'carrier_name'},
            {data: 'total_amount'},
            {data: 'account_period'},
            {data: 'remark'},
            {data: 
            	function (obj) {
                	return xmtc.getDictVal("bill_status",obj.bill_status);
            	}
            },
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + 
                    '"  data-dispatch-no="' + obj.dispatch_no + '"  data-order-no="' + obj.order_no + '"><i class="layui-icon">&#xe642;</i></a>';
                }
            }

        ],
        "stateSaveParams": function () {
        	// 初始化完成调用事件
        	$("select[name='dateTable_length']").attr("lay-ignore","");
        	// 重新渲染form checkbox
            form.render('checkbox');
            form.render('select');
        }
    }).on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认要删除吗,删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/dispatch/csDispatchOrder/delete", {id: id}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg(data.msg);
                }
            });
        });
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        var dispatch_no = $(this).attr('dispatch-no');
        var order_no = $(this).attr('data-order-no');
        gotoForm("编辑费用", {id:id, dispatch_no:dispatch_no, order_no:order_no});
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
         gotoForm("编辑费用", data);
    });

    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    // 查询
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    
    // 重置
    $("#btn-reset").on('click', function () {
    	  $("select[name='dateTable_length']").attr("lay-ignore","");
    });
    
    //新增
    $("#btn-add").on('click', function () {
        addFeeHanlder();
    });
    
    //批量费率计算
    $("#btn-fee-cost").on('click', function () {
    	
    });
    
    //刷新主表
    $("#btn-dateTable-refresh").on('click', function () {
    	table.ajax.reload();
    });

    /**
     * 手工添加费用
     * @returns
     */
    function addFeeHanlder() {
    	//获取勾选的可调度车辆
    	var selectRows = xmtc.getRows(table,$('#dateTable'));

    	if(selectRows.length === 1){
    		gotoForm("费用编辑", {id:selectRows[0].id, dispatch_no:selectRows[0].dispatch_no, order_no:selectRows[0].order_no});
    	}else if(selectRows.length === 0){    		
    		xmtc.failMsg("请至少选中一条数据");
    	}else{
    		layer.msg("只能选择一条数据");
    	}
    }

    // 获取表格选中的行id集合
    function getSeclectIds() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
        });
        return ids;
    }

    function getSeclectStatus() {
        var ids = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
            ids.push($(this).attr("data-status"));
        });
        return ids;
    }
    
    /**
     * 承运商弹出框
     */
    $("#carrier_name_query").on('click', function () {
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/admin/cust/supplierWin.jsp","承运商",600,432,"unit","unit_name",function(res){
    		$("#carrier_code_query").val(res["unit"]);  
		    $("#carrier_name_query").val(res["unit_name"]);
    	});
    });
    
    /**
     * 主驾弹出框
     */
    $("#main_drive_name_query").on('click', function () {
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/admin/cust/csTransportPersonnelWin.jsp","主驾",600,432,"personnel_number","personnel_name",function(res){
    		$("#main_drive_code_query").val(res["personnel_number"]);  
		    $("#main_drive_name_query").val(res["personnel_name"]);
    	});
    });
    
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
    
    // 打开派车单维护界面
    function gotoForm(title, data) {
        var url = base+"/view/oms/fee/csBillsForm.jsp";
        if (data.id) {
            url += "?id=" + data.id+"&bill_no="+data.bill_no;
        }
        layer_show(title, url, '100%','100%');
    }

    exports('csBills', {});
});
