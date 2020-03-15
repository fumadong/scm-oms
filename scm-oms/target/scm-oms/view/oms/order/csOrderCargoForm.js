/**
 * 订单-商品维护弹窗
 *
 * @author Devin
 */
// 商品id
var id = xmtc.getUrlVars("id");
// 系统订单号
var order_no = xmtc.getUrlVars("order_no");
var order_id = xmtc.getUrlVars("order_id");
var customer_code = xmtc.getUrlVars("customer_code");
layui.define(['layer', 'form'], function (exports) {
    var $ = layui.jquery,layer = layui.layer,form = layui.form();
    
    // 查询订单商品信息
    getOrderCargoById();
    
    /**
     * 通过订单商品id获取订单商品
     */
    function getOrderCargoById() {
    	if (!id) {
    		return;
    	}
    	// 商品id存在，则为编辑，查询商品
    	xmtc.ajaxPost(base + "/order/csOrderCargo/getById", {id:id}, function(json) {
			if (json.data) {
				$.each(json.data, function(key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
				form.render('select');
			}
		});
	}
    
    /**
     * 商品-保存-按钮
     */
    form.on('submit(form-save)', function(data) {
    	var param = data.field;
    	// 校验
    	if (param.plan_amount <= 0) {
    		xmtc.failMsg('保存失败，数量必须大于0');
    		return false;
    	}
    	
    	param.order_no = order_no;
    	param.order_id = order_id;
    	if (id) {
    		param.id=id;
    	}
    	xmtc.ajaxPost( base + "/order/csOrderCargo/save", param, function(json) {
			if (json.success) {
				var index = parent.layer.getFrameIndex(window.name);
				xmtc.parentSuccessMsg('保存成功');
				// 重新查询商品列表数据
				parent.$('#sub-cargo').click();
				parent.layer.close(index);
			} else {
				xmtc.failMsg(json.msg);
			}
		});
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    /**
     * 商品-关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
  //======================================界面设置=====================================
    /**
     * 表单格式
     */
    form.verify({
        // 数字
    	number : function (value) {
            if (value) {
                var reg = /^\d+(?:\.\d{1,2})?$/;
                if (!reg.test(value)) {
                    return '请输入整数或者最多两位小数';
                }
            }
        }
	});
    
    //=====================================界面弹出框配置Start=====================================
    /**
     * 商品弹出框 
     */
    $("#cargo_name").on('click', function () {
    	debugger
    	var url = base + "/view/oms/cargo/csCargoPopWin.jsp?customer_code="+customer_code;
    	top.xmtc.popUp( url, "商品", 600, 432, "cargo_code", "cargo_name", function(res) {
    		$("#cargo_code").val(res["cargo_code"]);  
		    $("#cargo_name").val(res["cargo_name"]);
		    $("#package_code").val(res["package_code"]);
		    $("#package_name").val(res["package_name"]);
		    $("#package_uom_code").val(res["unit_code"]);
		    $("#package_uom_name").val(res["unit_name"]);
		    $("#package_uom_quantity").val(res["unit_quantity"]);
		    
		    xmtc.selectValue('cargo_type', res["cargo_type"]);
		    
		    // EA数换算
            var ea_quantity = parseInt($("#package_uom_quantity").val())*parseInt($("#quantity").val());
        	if(!isNaN(ea_quantity)){
        		$("#ea_quantity").val(ea_quantity);
        	}
			form.render('select');
    	});
    });
    
    /**
     * 包装单位弹出框
     */
    $("#package_uom_name").on('click', function () {
        var url = base + "/view/oms/cargo/csPackageUnitPopWin.jsp";
        var package_code =  $.trim($("#package_code").val());
        if(package_code){
            url += "?package_code="+package_code;
        }
        top.xmtc.popUp(url, "包装单位", 600, 432, "code", "name", function(data) {
            $("#package_uom_code").val(data["code"]);
            $("#package_uom_name").val(data["name"]);
            $("#package_uom_quantity").val(data["quantity"]);
            // EA数换算
            var ea_quantity = parseInt($("#package_uom_quantity").val())*parseInt($("#quantity").val());
        	if(!isNaN(ea_quantity)){
        		$("#ea_quantity").val(ea_quantity);
        	}
        });
    });
    
    $("#quantity").on('keyup', function () {
    	debugger
    	// 只能输入数字
        var thisValue = this.value;
        thisValue =  thisValue.replace(/[^0-9.]+/,"");
        $(this).val(thisValue);
        
        if(parseInt(thisValue)>0){
        	var ea_quantity = parseInt($("#package_uom_quantity").val())*thisValue;
        	if(!isNaN(ea_quantity)){
        		$("#ea_quantity").val(ea_quantity);
        	}
        }
    });
    
    //=====================================界面弹出框配置End=====================================
    
    exports('csOrderCargoForm', {});
});