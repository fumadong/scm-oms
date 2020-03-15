/**
 * 客户管理
 *
 * @author loemkie chen
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;

    var table = $('#dateTable').DataTable({
       /* "dom": '<"top">rt<"bottom"flp><"clear">',*/
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
            url: base + "/cust/csCustomer/query",
            data: function (data) {
                data.customer_code = $.trim($("#customer_code").val());
                data.customer_name = $.trim($("#customer_name").val());
                data.customer_type = $.trim($("#customer_type option:selected").val());
                data.tax_code = $.trim($("#tax_code").val());
                data.status = $.trim($("#status option:selected").val());
                data.tel = $.trim($("#tel").val());
                data.office = $.trim($("#office").val());
            }
        },
        "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "sServerMethod": "POST",               // POST
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }
            },
            {data: 'customer_code'},
            {data: 'customer_name'},
            {data: 'customer_all_name'},
            {data: 
            	function (obj) {
            		return xmtc.getDictVal("customer_type",obj.customer_type);
            	}
            },
            /*{data: 'office'},*/
            {data: 'tel'},
            {
                data: function (obj) {
                	if(obj.address){
                		return xmtc.nullToSpace(obj.province_name)+xmtc.nullToSpace(obj.city_name)+xmtc.nullToSpace(obj.county_name)+"-"+xmtc.nullToSpace(obj.address);
                	}else{
                		return  "";
                	}
                }
            },
            {
                data: function (obj) {
                	if(obj.status=="1"){
    					return '<span class="c-green">启用</span>';
    				}else{
    					return '<span class="layui-disabled">停用</span>';
    				}
                },sClass:'text-c'
            },
            {
                data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '" ><i class="layui-icon">&#xe642;</i></a>';
                },sClass:'text-c'
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
        var status = $(this).attr('data-status');
        if(status !="0"){
            xmtc.failMsg('只有停用状态才能删除!');
        	 return false;
        }
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/cust/csCustomer/delete", {id: id}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg('操作失败');
                }
            });
        });
    }).on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        gotoForm("编辑客户", id);
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var data=table.row(this).data();//获取值的对象数据
         gotoForm("编辑客户", data.id);
    });
    form.on('select(customer_type)', function(data){
    	console.log(data.elem); //得到select原始DOM对象
    	console.log(data.value); //得到被选中的值
    	console.log(data.othis); //得到美化后的DOM对象
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
    $("#btn-reset").on('click', function () {
    	  /*$("#customer_code").val("");
    	  $("#customer_name").val("");
    	  $("#tax_code").val("");
    	  selectValue("customer_type","");*/
    	  $("select[name='dateTable_length']").attr("lay-ignore","");
    	  //form.render('select');
    	  //table.ajax.reload();
    });
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });

    $("#btn-enable").on('click', function () {
        enabledHandler();
    });

    $("#btn-disable").on('click', function () {
        disabledHandler();
    });

    // 新增
    $("#btn-add").on('click', function () {
    	gotoForm("客户新增", null);
    });

    // 删除客户
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
        	var status=getSeclectStatus();
        	if(status.join(",").indexOf("1")!=-1){
        		layer.msg('只有停用状态才能删除!');
        		return false;
        	}
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/cust/csCustomer/delete", {id: ids.join(",")}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        layer.msg('操作成功');
                    } else {
                        layer.msg('删除失败');
                    }
                });
            });
        }
    }

    // 启用
    function enabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            xmtc.ajaxPost(base + "/cust/csCustomer/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
                if (data.success) {
                    table.ajax.reload();
                    layer.msg('操作成功');
                } else {
                    layer.msg('操作失败');
                }
            });
        }
    }

    // 停用
    function disabledHandler() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
        	layer.confirm('确认要停用吗？', function (index) {
                xmtc.ajaxPost(base + "/cust/csCustomer/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        layer.msg('操作成功');
                    } else {
                        layer.msg('操作失败');
                    }
                });
            });
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

    // 打开客户维护界面
    function gotoForm(title, id) {
        var url = base+"/view/oms/cust/csCustomerForm.jsp";
        if (id) {
            url += "?id=" + id;
        }
        layer_show(title, url, '100%','100%');
    }

    exports('csCustomerList', {});
});
