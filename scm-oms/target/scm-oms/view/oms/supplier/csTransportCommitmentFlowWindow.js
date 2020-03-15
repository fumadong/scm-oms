/**
 * 客户联系人维护
 *
 * @author loemkie chen
 */
var commitment_id = xmtc.getUrlVars("commitment_id");
var flow_id = xmtc.getUrlVars("flow_id");

layui.define(['layer', 'form', 'laydate'], function (exports) {
	
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate;
    //选择地址
    $(".sns-addrselector").addrDropMenu({
    	"level" : 3,
    	"hotCity" : false
    });
    /**
     * 渲染数据到发货行政区划、收货行政区划
     * @param order
     */
    function setAddressToForm (model) {
    	// 设置发货地址行政区划
		var origin = {};
		origin['provinceCode'] = model.origin_province_code;
		origin['provinceName'] = model.origin_province_name;
		origin['cityCode'] = model.origin_city_code;
		origin['cityName'] = model.origin_city_name;
		origin['countyCode'] = model.origin_county_code;
		origin['countyName'] = model.origin_county_name;
		xmtc.setAddressSelectorValue('origin_address_select', origin);
		var destination = {};
		destination['provinceCode'] = model.dest_province_code;
		destination['provinceName'] = model.dest_province_name;
		destination['cityCode'] = model.dest_city_code;
		destination['cityName'] = model.dest_city_name;
		destination['countyCode'] = model.dest_county_code;
		destination['countyName'] = model.dest_county_name;
		xmtc.setAddressSelectorValue('dest_address_select', destination);
    };
    
    getById();
    
    // 获取联系人
    function getById() {
        xmtc.ajaxPost(base + "/api/oms/csTransportCommitment/getFlowById", {flow_id: flow_id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            }
            //处理渲染datagroid问题
            if(json.data){
            	setAddressToForm(json.data);
            }
        });
    }

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        param.commitment_id = commitment_id;
        if (flow_id) {
            param.id = flow_id;
        }
        xmtc.ajaxPost(base + "/api/oms/csTransportCommitment/saveFlow", param, function (json) {
        	if (json.success) {
				layer.msg("操作成功");
				id = json.data.id;
                //刷新列表信息,并关闭编辑弹出窗口
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                parent.layer.close(index);
			} 
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csTransportCommitmentFlowWindow', {});
});
