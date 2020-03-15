/**
 * 合同附件下载
 */
var contractCode = xmtc.getUrlVars("contractCode");
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate;

	var index = 0;

	var uploader = WebUploader.create({
		auto: false,
		// swf文件路径
		swf: base + '/static/frame/webuploader/Uploader.swf',
		// 文件接收服务端。
		server: base + "/cust/contract/uploadFile?contractNo=" + contractCode,
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#filePicker',
		// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		resize: false,
		method: 'POST'
	});

	// 当有文件被添加进队列的时候
	uploader.on('fileQueued', function (file) {
		$("#fileName").val(file.name);
		$("#fileExt").val(file.ext);
	});

	uploader.on("uploadSuccess", function () {
		parent.layer.closeAll();
	});

	uploader.on("uploadAccept", function (file, data) {
		if (!data.success) {
			layer.closeAll();
			layer.msg(data.msg ? data.msg : "上传失败");
			return false;
		}
	});

	uploader.on('uploadError', function (file, reason) {
		$("#fileName").val("");
		$("#fileExt").val("");
		uploader.reset();
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function (file, percentage) {

	});

	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	// 提交
	form.on('submit(form-upload)', function (data) {
		if ($("#fileExt").val() == "xls") {
			uploader.upload();
			index = layer.load(1, {
				shade: [0.1, '#fff'] //0.1透明度的白色背景
			});
		} else {
			$("#fileName").val("");
			$("#fileExt").val("");
			uploader.reset();
			xmtc.failMsg("请选择正确模板文件（*.xls）");
		}
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	exports('feeRateExcel', {});
});
