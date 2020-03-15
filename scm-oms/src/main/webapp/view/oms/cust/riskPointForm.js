/**
 * 风险点维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var measuredNo = xmtc.getUrlVars("measured_no");
layui.define(['layer', 'form', 'laydate', 'element', 'layedit', 'upload'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	// ================================================  初始化 ======================================================
	getById();

	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	//========================================== 表单操作 ============================================================

	// 提交
	form.on('submit(form-add)', function (data) {
		var param = data.field;
		if (id) {
			param.id = id;
		}
		param.measured_no = measuredNo;
		xmtc.ajaxPost(base + "/cust/costMeasured/riskPointsubmit", param, function (json) {
			if (json.success) {
				var index = parent.layer.getFrameIndex(window.name);
				parent.$('#btn-query').click();
				parent.layer.close(index);
			}
			layer.msg(json.msg);
		});
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	//========================================= 私有方法 ======================================================
	function getById() {
		xmtc.ajaxPost(base + "/cust/costMeasured/getRiskPointById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
			}
		});
	}

	exports('riskPointForm', {});
});
