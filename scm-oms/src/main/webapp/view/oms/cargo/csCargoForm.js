/**
 * 商品维护
 * @author Joan.Zhang
 */
var id = xmtc.getUrlVars("id");
function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    // obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate, element = layui.element();
	if(id){
		getCargoById();
	}else{
		//设置默认值
		$("#unit_edit").val("10");//单位,默认为吨
		form.render('select');
	}
	
    // 获取商品
    function getCargoById() {
        xmtc.ajaxPost(base + "/cargo/csCargo/getById", {id: id}, function (json) {
        	 if (json.data) {
                 $.each(json.data, function (key, value) {
                     if ($('#' + key+"_edit")) {
                         $('#' + key+"_edit").val(xmtc.nullToSpace(value));
                     }
                 });
             }
             document.getElementById("cargo_code_edit").disabled=true;
             $("select[name='dateTable_length']").attr("lay-ignore","");
             form.render('select');
        });
    }
    
    //关闭窗口
    $('#btn-close').on('click',function(){
    	var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
    
    // 弹出选择
    $("#customer_name_edit").on('click', function () {
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/view/oms/cust/csCustomerWin.jsp","货主",600,432,"unit","unit_name",function(res){
    		$("#customer_code_edit").val(res["unit"]);  
		    $("#customer_name_edit").val(res["unit_name"]);
    	});
    });
    
    /**
     * 包装弹出框
     */
    $("#package_name_edit").on('click', function () {
    	var url = base + "/view/oms/cargo/csPackagePopWin.jsp";
    	top.xmtc.popUp(url, "包装", 600, 432, "code", "name", function(data) {
    		$("#package_code_edit").val(data["code"]);
		    $("#package_name_edit").val(data["name"]);
		    //获取包装代码对应的默认单位
		    // TODO
    	});
    });
    
 // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        // 提交保存不需要这个字段
        delete param["dateTable_length"];
        if (id) {
            param.id = id;
            param.cargo_type = $.trim($("#cargo_type_edit option:selected").val());
            param.package_specification = $.trim($("#package_specification_edit option:selected").val());
            param.unit = $.trim($("#unit_edit option:selected").val());
            param.currency = $.trim($("#currency_edit option:selected").val());
            param.validity_unit = $.trim($("#validity_unit_edit option:selected").val());
            param.warm_layer = $.trim($("#warm_layer_edit option:selected").val());
        }
        xmtc.ajaxPost(base + "/cargo/csCargo/submit", param, function (json) {
            if (json.success) {
            	var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                if(document.activeElement.id== "save"){ 
                     parent.layer.close(index);
                     xmtc.parentSuccessMsg('操作成功');
                 }else{
                	document.getElementById("form-add").reset();
                	document.getElementById("cargo_code_edit").disabled=false;
                	id=null;
                }           	               
            } else {
            	console.log(json.msg);
                xmtc.failMsg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    exports('csCargoForm', {});
});
