var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	getById();

    // 获取费用名称
    function getById() {
       xmtc.ajaxPost(base + "/api/oms/rule/csTaskType/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            } else {
                $('#code').removeAttr('disabled');
            }
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
        xmtc.ajaxPost(base + "/api/oms/rule/csTaskType/save", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('保存成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                parent.layer.close(index);
            } else {
                layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csTaskTypeForm', {});
});