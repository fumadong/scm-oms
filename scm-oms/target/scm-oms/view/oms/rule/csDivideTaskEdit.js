/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var divide_rule_id = xmtc.getUrlVars("divide_rule_id");
xmtc.getDictMap('yes_no');
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;


    getWarehouseById();

    // 获取费用名称
    function getWarehouseById() {
       xmtc.ajaxPost(base + "/rule/csDivideTask/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            }
            form.render();
        });
    }

    //关闭窗口
    $('#btn-close').on('click',function(){
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        if (divide_rule_id) {
            param.divide_rule_id = divide_rule_id;
        }

        xmtc.ajaxPost(base + "/rule/csDivideTask/saveOrUpdate", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('保存成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-sub-refresh').click();
                parent.layer.close(index);

            } else {
                layer.msg(json.msg);
            }
            return false;
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    var checkIsNull = function (value) {
        if(value === undefined || value === null || value.length <= 0){
            return true
        }
        return false;
    };
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
    exports('csDivideTaskEdit', {});
});