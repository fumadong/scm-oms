/**
 * @author Samuel
 */
//客户代码查询条件
var order_task_id = xmtc.getUrlVars("order_task_id");
var table;
layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage, laydate = layui.laydate;
    
    $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength": 5,
        ajax: {
            url: base + "/api/oms/track/csTaskIssue/queryIssueLog",
            data: function (obj) {
            	debugger
            	obj.order_task_id = order_task_id;
            }
        },
        "columns": [                            // 自定义数据列
            { data: 
            	function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + 
                    '" data-code="' + obj.contact_code+ '" data-name="' + obj.contact_name + '"/>';
                }
            },
            { data: 
				function (obj) {
					if(obj.status==='1'){
						return '成功';
					} else {
						return '失败';
					}
	        	}
			},
			{ data: 'issue_time' },
			{ data: 'operator' },
			{ data: 'message' }
        ],
        "stateSaveParams": function () {			// 初始化完成调用事件
        	form.render('checkbox');				// 重新渲染form checkbox
        }
    });

    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    exports('csTaskIssueLogWindow', {});
});
