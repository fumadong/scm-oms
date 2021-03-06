/**
 * 任务类型弹出框
 * @author Adolph
 */
var data = {};
var getData = function () {
    var codes = [];
    var names = [];
    var isFuelingUp = [];
    var cbks = $("#dateTable").find(":checkbox:checked");
    if (cbks.length > 0) {
        cbks.each(function () {
            codes.push($(this).attr("data-code"));
            names.push($(this).attr("data-name"));
            isFuelingUp.push($(this).attr("data-is_fueling_up"));
        });
        // 父页面的
        data["code"] = codes.toString();
        data["name"] = names.toString();
    }
    return data;
};

layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form();

    var table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
		"iDisplayLength": 5,
        ajax: {
            url: base + "/api/oms/rule/csTaskType/query",
            data: function (data) {
                data.code = $.trim($("#code").val());
                data.name = $.trim($("#name").val());
                data.status = "1";
            }
        },
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-code="' + obj.code + '" data-name="' + obj.name + '"/>';
                }
            },
            {data: 'code'},
            {data: 'name'},
        ],
        "stateSaveParams": function () {
            // 初始化完成调用事件
            form.render('checkbox');
        }
    }).on("dblclick", "tr", function () {//给tr或者td添加click事件
        var dt = table.row(this).data();//获取值的对象数据
        data["code"] = dt.code;
        data["name"] = dt.name;
        //子触发确定按钮
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
    $("#btn-reset").on('click', function () {
        $("select[name='dateTable_length']").attr("lay-ignore", "");
    });
    exports('csTaskTypePopWin', {});
});
