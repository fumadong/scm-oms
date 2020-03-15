/**
 * 客户联系人弹出框
 * @author Devin
 */
//客户代码查询条件
var customer_code = xmtc.getUrlVars("customer_code");
var table;
var data = {};

/**
 * 确认按钮
 */
var getData = function() {
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
    			setData(row);
    		}
		}
	}
    return data;
}

/**
 * 设置返回的数据
 * @returns
 */
function setData(row) {
	data["contact_code"] = row.contact_code;
    data["contact_name"] = row.contact_name;
    data["customer_code"] = row.customer_code;
    data["customer_name"] = row.customer_name;
    data["customer_type"] = row.customer_type;
    data["province_code"] = row.province_code;
    data["province_name"] = row.province_name;
    data["city_code"] = row.city_code;
    data["city_name"] = row.city_name;
    data["county_code"] = row.county_code;
    data["county_name"] = row.county_name;
    data["address"] = row.address;
    data["mobile"] = row.mobile;
    data["tel"] = row.tel;
}

layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate = layui.laydate;

    table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength": 5,
        ajax: {
            url: base + "/cust/csCustomerContact/popWinQuery",
            data: function (obj) {
            	obj.contact_code = $.trim($("#contact_code").val());
            	obj.contact_name = $.trim($("#contact_name").val());
                if (xmtc.isNotEmpty(customer_code)) {
                	obj.customer_code = customer_code;
                }
            }
        },
        "columns": [                            // 自定义数据列
            { data: 
            	function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + 
                    '" data-code="' + obj.contact_code+ '" data-name="' + obj.contact_name + '"/>';
                }
            },
			{ data: 'contact_code' },
			{ data: 'contact_name' },
			{ data: 
				function (obj) {
	        		var html = '';
	        		if (obj.city_name) {
	        			html += obj.city_name;
	        		}
	        		if (obj.county_name) {
	        			html += obj.county_name
	        		}
	        		return html;
	        	}
			}
        ],
        "stateSaveParams": function () {			// 初始化完成调用事件
        	form.render('checkbox');				// 重新渲染form checkbox
        }
    }).on("dblclick", "tr", function () {			//给tr或者td添加click事件
        var row = table.row(this).data();			//获取值的对象数据
        setData(row);
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
    exports('csCustomerContactPopWin', {});
});
