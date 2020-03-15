/**
 * 分配规则详细
 *
 * @author loemkie chen
 */
var id = xmtc.getUrlVars("id");
var rule_alloc_header_id = xmtc.getUrlVars("rule_alloc_header_id");

layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate;


    getCustomerContactById();
    // 获取联系人
    function getCustomerContactById() {
        xmtc.ajaxPost(base + "/rule/csRuleAllocDetail/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            }
            $("#rule_alloc_header_id").val(rule_alloc_header_id);
            /*if(json.data["is_default"]==1){
//            	document.getElementById("is_default").checked=true;
            	//xmtc.setCheckBoxVal("is_default",true);
            }else{
//            	document.getElementById("is_default").checked=false;
            	//xmtc.setCheckBoxVal("is_default",false);
            }*/
            //处理渲染datagroid问题
            if(json.data){
            	setAddressToForm(json.data);
            	//$("#contact_code").attr("readonly",true);
            	//$("#contact_code").addClass("layui-input-disabled");
            }
            form.render('select');
            form.render('checkbox');
        });
    }

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        debugger;
        if (id) {
            param.id = id;
        }
        //var is_default=$("#is_default").attr("checked");
        /*var is_default=document.getElementById("is_default").checked;
        if(is_default){
        	param["is_default"]="1";
        }else{
        	param["is_default"]="0";
        }*/
        xmtc.ajaxPost(base + "/rule/csRuleAllocDetail/submit", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('操作成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.table.ajax.reload();
                parent.layer.close(index);
            } else {
            	console.log(json.msg);
            	if(json.msg=="1"){
            		layer.confirm('是否替换原默认联系人？', function (index) {
                        xmtc.ajaxPost(base + "/cust/csCustomerContact/submitIgnore", param, function (data) {
                        	console.log(data.success);
                            if (data.success) {
                            	xmtc.parentSuccessMsg('操作成功');
                            	parent.table.ajax.reload();
                            	layer_close();
                            } 
                        });
                    });
            		parent.table.ajax.reload();
                    parent.layer.close(index);
            	}else{
            	    xmtc.failMsg(json.msg);
            		// layer.msg(json.msg);
            	}
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csRuleAllocHeaderEdit', {});
});
