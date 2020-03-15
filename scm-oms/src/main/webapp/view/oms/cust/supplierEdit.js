/**
 * 供应商维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

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
        }
    });

    function setAddressToForm (customer) {
        // 设置发货地址行政区划
        var address = {};
        address['provinceCode'] = customer.province_code;
        address['provinceName'] = customer.province_name;
        address['cityCode'] = customer.city_code;
        address['cityName'] = customer.city_name;
        address['countyCode'] = customer.county_code;
        address['countyName'] = customer.county_name;
        xmtc.setAddressSelectorValue('address_select', address);
    }

    getSupplierById();

    // 获取车辆
    function getSupplierById() {
        xmtc.ajaxPost(base + "/supplier/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
                setAddressToForm(json.data);
            } else {
                $('#supplier_code').removeAttr('disabled');
            }
            $(".sns-addrselector").addrDropMenu({
                "level" : 3,
                "hotCity" : false
            });
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
        xmtc.ajaxPost(base + "/supplier/submit", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('操作成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                parent.layer.close(index);
            } else {
                xmtc.failMsg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('supplierEdit', {});
});
