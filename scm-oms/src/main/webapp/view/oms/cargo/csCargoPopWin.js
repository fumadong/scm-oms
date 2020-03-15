/**
 * 商品弹出框
 * @author Devin
 */
var data = {};
var getData = function(){
	var selectRows = xmtc.getRows(table, $('#dateTable'));
	if (selectRows.length > 0) {
		if (selectRows.length > 1) {
			xmtc.failMsg("只能选择一条记录");
			return;
		} else {
			for (var index in selectRows) {
				if (index !== '0') {
					continue;
				}
    			var row = selectRows[index];
    			data["cargo_code"] = row.cargo_code;
		        data["cargo_name"] = row.cargo_name;
		        data["cargo_type"] = row.cargo_type;
		        data["package_code"] = row.package_code;
		        data["package_name"] = row.package_name;
		        data["unit_code"] = row.unit_code;
		        data["unit_name"] = row.unit_name;
		        data["unit_quantity"] = row.unit_quantity;
    		}
		}
	}
    return data;
}

// 货主代码
var customer_code = xmtc.getUrlVars("customer_code");
var table;

layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate = layui.laydate;

    table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength": 5,
        ajax: {
            url: base + "/cargo/csCargo/popWinQuery",
            data: function (data) {
                data.cargo_code = $.trim($("#cargo_code").val());
                data.cargo_name = $.trim($("#cargo_name").val());
                data.status = '1';
                if (customer_code) {
                	data.customer_code = customer_code;
                }
            }
        },
        "columns": [                            // 自定义数据列
            { data: 
            	function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + 
                    '" data-cargo_code="' + obj.cargo_code+ '" data-cargo_name="' + obj.cargo_name + '"/>';
                }
            },
			{ data: 'cargo_code' },
			{ data: 'cargo_name' },
			{ data: 
				function (obj) {
    				if (obj) {
    					return xmtc.getDictVal("cargo_type", obj.cargo_type);
    				} else {
    					return "";
    				}
    			}
            },
            { data: 'customer_name' },
        ],
        "stateSaveParams": function () {			// 初始化完成调用事件
        	form.render('checkbox');				// 重新渲染form checkbox
        }
    }).on("dblclick", "tr", function () {			//给tr或者td添加click事件
        var row = table.row(this).data();			//获取值的对象数据
        data["cargo_code"] = row.cargo_code;
        data["cargo_name"] = row.cargo_name;
        data["cargo_type"] = row.cargo_type;
        data["package_code"] = row.package_code;
        data["package_name"] = row.package_name;
        data["unit_code"] = row.unit_code;
        data["unit_name"] = row.unit_name;
        data["unit_quantity"] = row.unit_quantity;
        // 子触发确定按钮
        parent.$(".layui-layer-btn0").click();
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
    $("#btn-reset").on('click', function () {} );
    exports('csCargoPopWin', {});
});
