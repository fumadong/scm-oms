/**
 * 发票
 *
 * @author Dylan Fu
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;


    getSupplierById();

    // 获取发票信息
    function getSupplierById() {
        //ajaxPost请求后端，根据Id,回调发票信息
        xmtc.ajaxPost(base + "/invoice/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {  //遍历发票数据
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));//为每个标签赋值
                    }
                });
            } else {
                $('#invoice_type_code').removeAttr('disabled');//移除标签的不可用属性
            }
            form.render('select');//渲染下拉框标签
        });
    }

    //关闭窗口
    $('#btn-close').on('click',function(){
        var index = parent.layer.getFrameIndex(window.name);//得到当前窗口的签名
        parent.layer.close(index);//调用关闭窗口的方法
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;//取得发票信息
        if (id) {
            param.id = id;
        }
        //ajaxPost请求后端，回调结果
        xmtc.ajaxPost(base + "/invoice/submit", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('操作成功');//显示成功信息
                var index = parent.layer.getFrameIndex(window.name);//得到当前窗口的签名
                parent.$('#btn-query').click();
                parent.layer.close(index);//关闭窗口方法
            } else {
                xmtc.failMsg(json.msg);//显示失败信息
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csInvoiceTypeEdit', {});
});
