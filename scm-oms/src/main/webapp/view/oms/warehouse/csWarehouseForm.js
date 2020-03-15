/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
	obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}
xmtc.getDictMap('yes_no');
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;
	//选择地址
    $(".sns-addrselector").addrDropMenu({
    	"level" : 3,
    	"hotCity" : false
    });
    // 自定义验证规则
    form.verify({
        num: function (value) {
            if (value) {
                var reg = /^\d+(?:\.\d{1,2})?$/;
                if (!reg.test(value)) {
                    return '请输入整数或者最多两位小数';
                }
            }
        },
        emailExt: function (value) {
            if (value) {
                var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                if (!reg.test(value)) {
                    return '请输入正确邮箱';
                }
            }
        },
        tel: function (value) {
            if (value) {
                var length = value.length;
                var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
                if (tel.test(value) || (length == 11 && mobile.test(value))) {
                } else {
                    return "请正确填写您的联系方式";
                }
            }
        },
        fax: function (value) {
            if (value) {
                var fax =  /^(\d{3,4}-)?\d{7,8}$/;
                if (fax.test(value)) {
                } else {
                    return "请正确填写您的传真";
                }
            }
        }
    });

    function setAddressToForm (warehouse) {
        // 设置发货地址行政区划
        var address = {};
    	if (warehouse) {
    		// 入参存在，设置行政区划
    		address['provinceCode'] = warehouse.province_code;
	        address['provinceName'] = warehouse.province_name;
	        address['cityCode'] = warehouse.city_code;
	        address['cityName'] = warehouse.city_name;
	        address['countyCode'] = warehouse.county_code;
	        address['countyName'] = warehouse.county_name;
    	} else {
    		// 入参不存在，清空行政区划
    		address['provinceCode'] = null;
    		address['provinceName'] = null;
    		address['cityCode'] = null;
    		address['cityName'] = null;
    		address['countyCode'] = null;
    		address['countyName'] = null;
    	}
		xmtc.setAddressSelectorValue('address_select', address);
    }
    getWarehouseById();

    // 获取费用名称
    function getWarehouseById() {
       xmtc.ajaxPost(base + "/warehouse/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
                setAddressToForm(json.data);
            } else {
                $('#warehouse_code').removeAttr('disabled');
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
        xmtc.ajaxPost(base + "/warehouse/saveOrUpdate", param, function (json) {
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
    $("#superior_warehouse_name").on('click', function () {
    	top.xmtc.popUp(base+"/view/oms/warehouse/csWarehouseWin.jsp","仓库",600,432,"superior_warehouse_code","superior_warehouse_name",function(res){
    		$("#superior_warehouse_code").val(res["warehouse_code"]);  
		    $("#superior_warehouse_name").val(res["warehouse_name"]);
    	});
    });

    // 弹出选择
    $("#service_area_name").on('click', function () {
        top.xmtc.popUp(base+"/view/oms/warehouse/csServiceAreaWin.jsp","服务范围",600,432,"service_area_code","service_area_name",function(res){
            $("#service_area_code").val(res["service_area_code"]);
            $("#service_area_name").val(res["service_area_name"]);
        });
    });
    
    
    exports('csWarehouseForm', {});
});