var id = xmtc.getUrlVars("id");
var action = xmtc.getUrlVars("action");
var position_id = xmtc.getUrlVars("position_id");
var startTime = xmtc.getUrlVars("startTime");
var endTime = xmtc.getUrlVars("endTime");
var cstatus = xmtc.getUrlVars("cstatus");
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	var start = {
		format: 'YYYY-MM-DD',
		min: startTime,
		max: endTime,
		istoday: false,
		choose: function (datas) {
			end.min = datas; //开始日选好后，重置结束日的最小日期
			end.start = datas //将结束日的初始值设定为开始日
		}
	};

	var end = {
		format: 'YYYY-MM-DD',
		min: startTime,
		max: endTime,
		istoday: false,
		choose: function (datas) {
			start.max = datas; //结束日选好后，重置开始日的最大日期
		}
	};

	$('#start_time').on('click', function () {
		start.elem = this;
		laydate(start);
	});
	$('#end_time').on('click', function () {
		end.elem = this;
		laydate(end);
	});

	// 自定义验证规则
	form.verify({
		num: function (value) {
			if (value) {
				var reg = /^\d+(?:\.\d{1,2})?$/;
				if (!reg.test(value)) {
					return '请输入整数或者最多两位小数';
				}
			} else {
				return '必填项不能为空';
			}
		}
	});

	getFeeById();

	// ================================================== 事件绑定 ===============================================================

	$("#fee_name").on('click', function () {
		top.xmtc.popUp(base + "/view/oms/fee/csFeeNameWin.jsp?pay_or_receive=01", "费用名称", 600, 432, "fee_name_code", "fee_name", function (res) {
			$("#fee_name").val(res["fee_name"]);
			$("#fee_name_code").val(res["fee_name_code"]);
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
		param.customer_contract_position_id = position_id;
		param.status = cstatus;
		if (id) {
			param.id = id;
		}
		if (Number(param.interval_from) > Number(param.interval_to)) {
			layer.msg("区间从不能大于区间到");
		} else {
			xmtc.ajaxPost(base + "/cust/contract/feeSubmit", param, function (json) {
				if (json.success) {
					xmtc.parentSuccessMsg('操作成功');
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				} else {
					layer.msg(json.msg);
				}
			});
		}
		return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	
	// ================================================== 私有方法 ===============================================================
	function getFeeById() {
		xmtc.ajaxPost(base + "/cust/contract/getFeeById", {id: id}, function (json) {
			if (json.data) {
				if ("copy" == action) {
					json.data.id = null;
					id = null;
					json.data.contract_fee_type = "2";
					json.data.fee_unit = "";
					json.data.reserve_price = "0";
					json.data.start_time = "";
					json.data.end_time = "";
					cstatus = "4"; // 待审核
				} else {
					cstatus = json.data.status;
				}
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});

			} else {
				xmtc.selectValue("contract_fee_type", "1");
				$("#interval_from").val("0");
				$("#interval_to").val("99999999999");
				$("#reserve_price").val("0");
				$("#start_time").val(startTime);
				$("#end_time").val(endTime);
			}
			form.render('select');
			form.render('checkbox'); //刷新checkbox选择框渲染
		});
	}

	exports('CsCustomerContractFeeForm', {});
});
