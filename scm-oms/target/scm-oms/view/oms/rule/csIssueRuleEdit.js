/**
 *
 * @author Noaman
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;
    if(id){
        getDetailById();
    }else{
        $('#code').removeAttr('disabled');
    }


    // 获取费用名称
    function getDetailById() {
        if(id){
            xmtc.ajaxPost(base + "/rule/csIssueRule/getById", {id: id}, function (json) {
                if (json.data) {
                    $.each(json.data, function (key, value) {
                        if ($('#' + key)) {
                            $('#' + key).val(xmtc.nullToSpace(value));
                        }
                    });
                    $('#id').val(id);
                    $('#code').attr("disabled","disabled");
                } else {
                    $('#code').removeAttr('disabled');
                }
                //列表
                form.render('select');
            });
        }else{
            $('#code').removeAttr('disabled');
        }

    }



    //关闭窗口
    $('#btn-close').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        xmtc.ajaxPost(base + "/rule/csIssueRule/saveOrUpdate", param, function (json) {
            if (json.success) {
                xmtc.parentSuccessMsg('保存成功');
                var data = json.data;
                id = data.id;
                getDetailById();
                parent.$('#btn-query').click();
            } else {
                layer.msg(json.msg);
            }
        });

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    /**
     * 委托客户弹出框
     */
    $("#customer_name").on('click', function () {
        var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
        top.xmtc.popUp(url, "客户", 600, 432, "code", "name", function(data) {
            $("#customer_code").val(data["customer_code"]);
            $("#customer_name").val(data["customer_name"]);
        });
    });

    /**
     * 承运商弹出框
     */
    $("#carrier_name").on('click', function () {
        top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
            var carrierCode = res["unit"];
            $("#carrier_code").val(carrierCode);
            $("#carrier_name").val(res["unit_name"]);
        });
    });

    // 弹出选择
    $("#warehouse_name").on('click', function () {
        top.xmtc.popUp(base+"/view/oms/warehouse/csWarehouseWin.jsp","仓库",600,432,"warehouse_code","warehouse_name",function(res){
            $("#warehouse_code").val(res["warehouse_code"]);
            $("#warehouse_name").val(res["warehouse_name"]);
        });
    });


    /**
     * 任务类型弹出框
     */
    $("#task_type_name").on('click', function () {
        var url = base + "/view/oms/rule/csTaskTypePopWin.jsp";
        top.xmtc.popUp(url, "任务类型", 600, 432, "code", "name", function(data) {
            $("#task_type_code").val(data["code"]);
            $("#task_type_name").val(data["name"]);
        });
    });

    exports('csDivideRuleEdit', {});
});