/**
 * 包装管理
 * @author Devin
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;
    
    // 包装列表
    var table = $('#dateTable').DataTable(
    	{   ajax: {
	            url: base + "/cargo/csPackage/query",
	            data: function (data) {
	                data.code_like = $.trim($("#code_like").val());
	                data.name = $.trim($("#name").val());
	                data.type = $("#type option:selected").val();
	            }
	        },
	        "columns": [                            // 自定义数据列
	            { data: 
	                function (obj) {
	                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-code="' + obj.code + '"/>';
	                }
	            },
	            { data: 'code' },
	            { data: 'name' },
	            { data: // 包装类型
	            	function (obj) {
	            		if (obj) {
	            			return xmtc.getDictVal("package_type", obj.type);
	            		} else {
	            			return "";
	            		}
	            	}
	            },
	            { data: 'remark' },
	            {data: 
	            	function (obj) {
	                    return '<a title="编辑" class="ml-5 btn-edit" data-code="' + obj.code + '"><i class="layui-icon">&#xe642;</i></a>';
	                },
	            	width: 80,
	            	sClass: "text-c"
	            }
	        ],
	        "stateSaveParams": function () {
	        	// 重新渲染form checkbox
	            form.render('checkbox');
	            form.render('select');
	        }
	    }).on('click', '.btn-edit', function () {
	        var code = $(this).attr('data-code');
	        editHanlder(code);
	    }).on("dblclick","tr",function () {
	    	//获取值的对象数据
	    	var data = table.row(this).data();
	        editHanlder(data.code);
	    }
	);

    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    // 查询-按钮
    $("#btn-query").on('click', function () {
        table.ajax.reload();
    });
    
    // 新增-按钮
    $("#btn-add").on('click', function () {
    	editHanlder(null);
    });
    
    // 删除-按钮
    $("#btn-delete").on('click', function () {
        deleteHanlder();
    });
    
    /**
     * 删除包装
     */ 
    function deleteHanlder() {
        var codes = getSeclectCodes();
        if (codes.length === 0) {
            xmtc.failMsg("请选择记录");
        } else {
        	// 执行删除
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/cargo/csPackage/deletePackagesAndSubDatasByCodes", { codes: codes.join(",")}, function (data) {
                    if (data.success) {
                        table.ajax.reload();
                        xmtc.successMsg('操作成功');
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
    }
    
    /**
     * 获取表格选中行的包装代码集合
     */ 
    function getSeclectCodes() {
        var codes = [];
        $("#dateTable").find(":checkbox:checked").each(function () {
        	codes.push($(this).attr("data-code"));
        });
        return codes;
    }
    
    /**
     * 打开维护界面
     */ 
    function editHanlder(code) {
    	var url = base + "/view/oms/cargo/csPackageForm.jsp";
        if (code) {
            url += "?code=" + code;
        }
    	// 打开明细界面
    	layer_show("编辑包装明细", url, '100%','100%');
    }
    
    exports('csPackage', {});
});
