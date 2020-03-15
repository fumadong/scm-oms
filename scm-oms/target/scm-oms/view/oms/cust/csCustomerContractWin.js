/**
 * 合同弹出框
 * @author Adolph
 */
var getUrlVars=function(name,flag){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
};
//获取查询条件
var customer_code = getUrlVars("customer_code");

var data = {};
var getData = function () {
    var codes = [];
    var names = [];
    var exts = [];
    var customerCodes = [];
    var cbks = $("#dateTable").find(":checkbox:checked");
    if (cbks.length > 0) {
        cbks.each(function () {
            codes.push($(this).attr("data-contract_code"));
            names.push($(this).attr("data-contract_name"));
            if ($(this).attr("data-customer_name") && $(this).attr("data-customer_name") != "null") {
                exts.push($(this).attr("data-customer_name"));
            }
            if ($(this).attr("data-customer_code") && $(this).attr("data-customer_code") != "null") {
                customerCodes.push($(this).attr("data-customer_code"));
            }
        });
        // 父页面的
        data["contract_code"] = codes.toString();
        data["contract_name"] = names.toString();
        data["customer_name"] = exts.toString();
        data["customer_code"] = customerCodes.toString();
    }
    return data;
};

layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form();

    var table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength": 5,
        ajax: {
            url: base + "/cust/contract/page",
            data: function (data) {
                data.contract_code = $.trim($("#contract_code").val());
                data.contract_name = $.trim($("#contract_name").val());
                data.customer_code = customer_code;
                data.status="3";
            }
        },
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-customer_name="' + obj.customer_name + '" data-contract_code="' + obj.contract_code + '" data-contract_name="' + obj.contract_name + '" data-customer_name="' + obj.customer_name + '"/>';
                }
            },
            {data: 'contract_code'},
            {data: 'contract_name'},
            {data: 'customer_code'},
            {data: 'customer_name'}
        ],
        "stateSaveParams": function () {
            // 初始化完成调用事件
            form.render('checkbox');
            
            //校验是否只有1条记录,若是则直接选择
            var allRows = table.data();
            if(allRows.length === 1){
            	var dt = allRows[0];
            	data["contract_code"] = dt.contract_code;
                data["contract_name"] = dt.contract_name;
                data["customer_name"] = dt.customer_name == 'null' ? '' : dt.customer_name;
                //子触发确定按钮
                parent.$(".layui-layer-btn0").click();
            }
        }
    }).on("dblclick", "tr", function () {//给tr或者td添加click事件
        var dt = table.row(this).data();//获取值的对象数据
        data["contract_code"] = dt.contract_code;
        data["contract_name"] = dt.contract_name;
        data["customer_name"] = dt.customer_name == 'null' ? '' : dt.customer_name;
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
    exports('csCustomerContractWin', {});
});
