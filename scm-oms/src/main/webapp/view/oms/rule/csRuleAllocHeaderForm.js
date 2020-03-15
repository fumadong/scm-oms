/**
 * 分配规则
 *
 * @author Dylan Fu
 */
var id = xmtc.getUrlVars("id");

layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();


    element.on('collapse(collapse)', function(data){});
    getCustomerById();
    /**
     * 根据界面按钮是否可见
     */
    function setButtonStatus() {
        // 先全部隐藏
        $('#contart-toolbar').hide();

        // 以下情况设为可见
        if (id) {
            $('#contart-toolbar').show();
        }
    }

    // 获取分配规则详细
    function getCustomerById() {

        xmtc.ajaxPost(base + "/rule/csRuleAllocHeader/getById", {id: id}, function (json) {
            if (json.data) {

                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            }
       /*     if(json.data){
            	setAddressToForm(json.data);
            	$("#customer_code").attr("readonly",true);
            	$("#customer_code").addClass("layui-input-disabled");
            }*/
            //列表
            table = $('#dateTable').DataTable({
//                "dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": true,                      // 自适应宽度
                "stateSave": true,                      // 刷新后保存页数
                "ordering": false,
                "searching": false,                     // 本地搜索
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "aLengthMenu": [[5, 10], [5, 10]],
                "iDisplayLength": 5,
                "language": {                           // 国际化
                    "url": base + '/static/frame/jquery/language.json'
                },
                serverSide: true,                        //开启服务器模式
                ajax: {
                    url: base + "/rule/csRuleAllocDetail/query",
                    data: function (data) {
                        data.rule_alloc_header_id =$("#id").val();
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
                    {data: 'line_no'},
                    {data: 'package_uom_code'},
                    {
                        data: function (row) {
                            return xmtc.getDictVal('loc_use_type', row.loc_use_type);
                        }
                     },
                    {
                        data: function (row) {
                            return xmtc.getDictVal('is_clear_first', row.is_clear_first);
                        }
                    },
                    {
                        data: function (obj) {
                            return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                        },sClass:'text-c'
                    }
                ],
                "stateSaveParams": function () {           // 初始化完成调用事件
                	$("select[name='dateTable_length']").attr("lay-ignore","");                                       
                	// 重新渲染form checkbox
                    form.render('checkbox');
                    form.render('select');
                }
            }).on('click', '.btn-delete', function () {
                var id = $(this).attr('data-id');
                layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                    xmtc.ajaxPost(base + "/cust/csCustomerContact/delete", {id: id}, function (data) {
                        if (data.success) {
                            table.ajax.reload();
                            layer.msg('操作成功');
                        } else {
                            layer.msg('删除失败');
                        }
                    });
                });
            }).on('click', '.btn-edit', function () {
                var id = $(this).attr('data-id');
                gotoForm("编辑客户联系人", id);
            }).on("dblclick","tr",function(){//给tr或者td添加click事件
                var data=table.row(this).data();//获取值的对象数据
                 gotoForm("编辑客户联系人", data.id);
            });
            form.render('select');
        });
        //设置子表按钮状态
        setButtonStatus();
    }

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        // 提交保存不需要这个字段
        delete param["dateTable_length"];
        if (id) {
            param.id = id;
        }
        xmtc.ajaxPost(base + "/rule/csRuleAllocHeader/submit", param, function (json) {
            if (json.success) {
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                //parent.layer.close(index);
                $("#id").val(json.data.id);
                id = json.data.id;
                layer.msg("操作成功!");
            } else {
            	console.log(json.msg);
                xmtc.failMsg(json.msg);
                // layer.msg(json.msg);
            }
        });
        //设置子表按钮状态
        setButtonStatus();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
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
    
    $("#customer_name").on('blur', function () {
    	var param={};
    	param.customer_name=$("#customer_name").val();
    	param.id=id;
    	xmtc.ajaxPost(base + "/cust/csCustomer/getPinyin", param, function (json) {
    		if(json.data){
    			if($("#customer_code").val()==""){
    				$("#customer_code").val(json.data);
    			}
    		}
    	});
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
    	if($("#id").val()==""){
    		layer.msg("先保存客户信息！");
    		return false;
    	}
    	gotoForm("联系人新增", null);
    });

    // 删除联系人
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请至少选中一条数据");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/rule/csRuleAllocDetail/delete", {id: ids.join(",")}, function (data) {
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

    // 打开联系人维护界面
    function gotoForm(title, id) {
        var url = "csRuleAllocHeaderEdit.jsp?rule_alloc_header_id="+$("#id").val();
        if (id) {
            url += "&id=" + id;
        }
        //layer_show(title, url, 574,350);
        layer_show(title, url, 600,350);
    }
    exports('csCustomerForm', {});
});
