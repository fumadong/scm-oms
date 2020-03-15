/**
 * 承运商考核规则维护
 *
 * @author Samuel Yang
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	xmtc.daterange("effective_date", "expiration_date", "YYYY-MM-DD");
	
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
	
	/**
	 * 执行获取规则方法
	 */
	getRuleById();

	/**
	 * 子表
	 */
	var table;

	/**
	 * 子表初始化
	 */
	function initTable() {
		table = $('#dateTable').DataTable({
            "aLengthMenu": [[5, 10], [5, 10]],
            "iDisplayLength": 5,
			ajax: {
				url: base + "/api/oms/csTransportCommitment/findSubFlows",
				data: function (data) {
					data.commitment_id = id;
				}
			},
			"columns": [                            // 自定义数据列
				{data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '"/>';
                }},	
				{data: function (obj) {
						var province = obj.origin_province_name==null?"":obj.origin_province_name;;
						var city = obj.origin_city_name==null?"":obj.origin_city_name;
						var county = obj.origin_county_name==null?"":obj.origin_county_name;
	                    return province + city + county;
                	}},
				{data: function (obj) {
						var province = obj.dest_province_name==null?"":obj.dest_province_name;;
						var city = obj.dest_city_name==null?"":obj.dest_city_name;
						var county = obj.dest_county_name==null?"":obj.dest_county_name;
	                    return province + city + county;
	            	}},
				{data: 'transit_time'},
				{data: function (obj) {
	                    return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
	                },
	             width: 80,
	             sClass: "text-c"}
			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			}
		}).on('click', '.btn-edit', function () {
	        var id = $(this).attr('data-id');
	        openFlowForm("编辑流向", id);
	    }).on("dblclick","tr",function(){
            //行记录双击处理
            var data=table.row(this).data();//获取值的对象数据
            openFlowForm("编辑流向", data.id);
        });
        form.on('checkbox(allChoose)', function (data) {
            var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
            child.each(function (index, item) {
                item.checked = data.elem.checked;
            });
            form.render('checkbox');
        });
	}
	
	/**
	 * 根据id获取规则
	 */
	function getRuleById() {
		xmtc.ajaxPost(base + "/api/oms/csTransportCommitment/getById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
				initTable();
			} else {
				initTable();
                $('#status').val(xmtc.nullToSpace("1"));
			}
			form.render('select');
		});
	};
	
	// 新增
    $("#btn-flow-add").on('click', function () {
    	if(!id){
    		layer.msg("先保存运力承诺！");
    		return false;
    	}
    	openFlowForm("编辑流向", null);
    });
    $("#btn-flow-delete").on('click', function () {
        deleteHanlder();
    });
    /**
     * 查询
     */
    $("#btn-query").on('click', function () {
        table.ajax.reload();
        return false;
    });

    // 删除
    function deleteHanlder() {
        var ids = getSeclectIds();
        if (ids.length == 0) {
            xmtc.failMsg("请选择记录");
        } else {
            layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                xmtc.ajaxPost(base + "/api/oms/csTransportCommitment/deleteFlow", {id: ids.join(",")}, function (data) {
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
    
	// 打开联系人维护界面
    function openFlowForm(title, flow_id) {
        var url = "csTransportCommitmentFlowWindow.jsp?commitment_id="+id;
        if (flow_id) {
        	 url = url + "&flow_id=" + flow_id;
        }
        layer_show(title, url, 600,350,function(){
        	table.ajax.reload();
        });
    }
	
	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	// 提交
	form.on('submit(form-add)', function (data) {
		var rule = data.field;
		
		if (id) {
			rule.id = id;
		}
		
		xmtc.ajaxPost(base + "/api/oms/csTransportCommitment/save", rule, function (json) {
			if (json.success) {
				layer.msg("操作成功");
				id = json.data.id;
				if (document.activeElement.id == "save") {

				} else {
					document.getElementById("form-add").reset();
					id = null;
					table.ajax.reload();
				}
			} else {
				xmtc.failMsg(json.msg);
			}
		});
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
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
	exports('csTransportCommitmentEdit', {});
});
