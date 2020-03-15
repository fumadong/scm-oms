/**
 * 包装弹出框
 * @author Devin
 */
var table;
var data = {};

/**
 * 确认按钮
 */
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
	data["code"] = row.code;
    data["name"] = row.name;
}

layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate = layui.laydate;

    table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength": 5,
        ajax: {
            url: base + "/cargo/csPackage/query",
            data: function (data) {
                data.code_like = $.trim($("#code").val());
                data.name = $.trim($("#name").val());
                data.status = '1'; // 启用状态
            }
        },
        "columns": [                            // 自定义数据列
            { data: 
            	function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + 
                    '" data-code="' + obj.code+ '" data-name="' + obj.name + '"/>';
                }
            },
            { data: 'code' },
			{ data: 'name' }
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
    // 重置
    $("#btn-reset").on('click', function () {} );
    
    exports('csPackagePopWin', {});
});
