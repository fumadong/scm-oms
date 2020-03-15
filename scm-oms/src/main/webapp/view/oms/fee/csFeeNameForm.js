/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form();

    // 自定义验证规则
    form.verify({
        num: function (value) {
            if (value) {
                var reg = /^\d+(?:\.\d{1,2})?$/;
                if (!reg.test(value)) {
                    return '请输入整数或者最多两位小数';
                }
            }
        }
    });

    getFeeNameById();

    // 获取费用名称
    function getFeeNameById() {
        xmtc.ajaxPost(base + "/feeName/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
                showOuterSubject();
            } else {
                $('#fee_name_code').removeAttr('disabled');
            }
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
        xmtc.ajaxPost(base + "/feeName/submit", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('操作成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                parent.layer.close(index);
            } else {
                layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 弹出选择
    $("#outer_subject_name").on('click', function () {
    	top.xmtc.popUp(base+"/view/oms/fee/csSubjectWin.jsp","科目",600,432,"subject_code","subject_name",function(res){
    		$("#outer_subject_code").val(res["subject_code"]);  
		    $("#outer_subject_name").val(res["subject_name"]);
    	});
    });
    
    /**
     * 借贷变更事件
     */
    form.on('select(onchange)', function (data) {
    	showOuterSubject();
		form.render('select');
    });
    
    // 控制外部科目是否可见
    function showOuterSubject() {
    	if($('#borrow_loan').val()=="debit"){
            $('#outerSubjectDiv').show();
         }else{
            $('#outerSubjectDiv').hide();
        }
    }
    
    exports('csFeeNameForm', {});
});