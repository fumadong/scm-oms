/**
 * 科目管理
 * @author Joan.Zhang
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form();
    if(id){
    	getSubjectById();
    }
    // 获取科目
    function getSubjectById() {
        xmtc.ajaxPost(base + "/fee/csSubject/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            } 
            document.getElementById("subject_code").disabled=true;
            form.render('select');
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
        xmtc.ajaxPost(base + "/fee/csSubject/submit", param, function (json) {
            if (json.success) {
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                if(document.activeElement.id== "save"){ 
                    parent.layer.close(index);
                    xmtc.parentSuccessMsg('操作成功');
                }else{
                	document.getElementById("form-add").reset();
                	document.getElementById("subject_code").disabled=false;
                	xmtc.successMsg('操作成功');
                	id=null;
               }
            } else {
                layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csSubjectForm', {});
});
