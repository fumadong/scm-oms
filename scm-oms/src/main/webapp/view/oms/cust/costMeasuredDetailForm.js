/**
 * 成本测算明细维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var measuredNo = xmtc.getUrlVars("measured_no");
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form();

	// ================================================  初始化 ======================================================
	// 自定义验证规则
	form.verify({
		num: function (value) {
			if (value) {
				var reg = /^\d+(?:\.\d{1,2})?$/;
				if (!reg.test(value)) {
					return '请输入整数或者最多两位小数';
				}
			} else {
				return "必填项不能为空";
			}
		},
		integer: function (value) {
			if (value) {
				var reg = /^[0-9]*$/;
				if (!reg.test(value)) {
					return '请输入整数';
				}
			} else {
				return "必填项不能为空";
			}
		}
	});

	getById();

	// =============================================== 事件绑定 ===========================================================

	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	$("#num").on("change", function () {
		calculateCostAmount();
	});

	$("#price").on("change", function () {
		calculateCostAmount();
	});

	//========================================== 表单操作 ============================================================
	// 提交
	form.on('submit(form-add)', function (data) {
		var param = data.field;
		if (id) {
			param.id = id;
		}
		param.measured_no = measuredNo;
		xmtc.ajaxPost(base + "/cust/costMeasured/detailSubmit", param, function (json) {
			if (json.success) {
				xmtc.parentSuccessMsg('保存成功');
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			}
			layer.msg(json.msg);
		});
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	//========================================= 私有方法 ======================================================

	function calculateCostAmount() {
		var _num = Number($("#num").val());
		var _price = Number($("#price").val());
		if (_num && _price) {
			$("#cost_amount").val(_num * _price);
		} else {
			$("#cost_amount").val("0.00");
		}
	}

	function getById() {
		xmtc.ajaxPost(base + "/cust/costMeasured/getDetailById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
			}
			form.render('select');
			form.render('checkbox'); //刷新checkbox选择框渲染
		});
	}

	exports('costMeasuredDetailForm', {});
});
