var id = xmtc.getUrlVars("id");
var contract_code = xmtc.getUrlVars("contract_code");
var action = xmtc.getUrlVars("action");
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
		}
	});

	getPositionById();

	// ================================================== 事件绑定 ===============================================================
	
	$("#cargo_name").on('click', function () {
		top.xmtc.popUp(base + "/view/oms/cargo/csCargoPopWin.jsp", "商品列表", 600, 432, "cargo_code", "cargo_name", function (res) {
			$("#cargo_name").val(res["cargo_name"]);
			$("#cargo_code").val(res["cargo_code"]);
		});
	});

	//关闭窗口
	$('#btn-close').on('click',function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	// 提交
	form.on('submit(form-add)', function (data) {
		var param = data.field;
		param.contract_code = contract_code;
		if (id) {
			param.id = id;
		}
		if (!param.from_province_code) {
			xmtc.failMsg('请选择起运地');
			return false;
		}
		if (!param.to_province_code) {
			xmtc.failMsg('请选择目的地');
			return false;
		}
		xmtc.ajaxPost(base + "/cust/contract/positionSubmit", param, function (json) {
			if (json.success) {
				xmtc.parentSuccessMsg('操作成功');
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			} else {
				layer.msg(json.msg);
			}
		});
		return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	// ================================================== 私有方法 ===============================================================
	function getPositionById() {
		xmtc.ajaxPost(base + "/cust/contract/getPositionById", {id: id}, function (json) {
			if ("copy" == action) {
				json.data.id = null;
				id = null;
			}
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
				setAddressForm('from-address-select', json.data);
				setAddressTo('to-address-select', json.data);
			}
			form.render('select');
			form.render('checkbox'); //刷新checkbox选择框渲染
			// 选择地址
			$(".sns-addrselector").addrDropMenu({
				"level" : 3,
				"hotCity" : false
			});
		});
	}

	/**
	 * 渲染数据到发货行政区划、收货行政区划
	 */
	function setAddressForm (targetId, data) {
		// 设置发货地址行政区划
		var address = {};
		address['provinceCode'] = data.from_province_code;
		address['provinceName'] = data.from_province;
		address['cityCode'] = data.from_city_code;
		address['cityName'] = data.from_city;
		address['countyCode'] = data.from_county_code;
		address['countyName'] = data.from_county;
		xmtc.setAddressSelectorValue(targetId, address);
	}

	function setAddressTo(targetId, data) {
		var address = {};
		address['provinceCode'] = data.to_province_code;
		address['provinceName'] = data.to_province;
		address['cityCode'] = data.to_city_code;
		address['cityName'] = data.to_city;
		address['countyCode'] = data.to_county_code;
		address['countyName'] = data.to_county;
		xmtc.setAddressSelectorValue(targetId, address);
	}

	exports('CsCustomerContractPositionForm', {});
});
