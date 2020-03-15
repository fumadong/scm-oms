/**
 * 成本测算维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var status = "";
layui.define(['layer', 'form', 'laydate', 'element', 'layedit', 'upload'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	var detailTable;
	var riskPointTable;
	// ================================================  初始化 ======================================================
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
		integer: function (value) {
			if (value) {
				var reg = /^[0-9]*$/;
				if (!reg.test(value)) {
					return '请输入整数';
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

	getById();

	// =============================================== 事件绑定 ===========================================================

	$("#customer_name").on('click', function () {
		top.xmtc.popUp(base + "/view/oms/cust/csCustomerWin.jsp", "客户列表", 600, 432, "unit", "unit_name", function (res) {
			$("#customer_code").val(res["unit"]);
			$("#customer_name").val(res["unit_name"]);
		});
	});

	$("#dept_name").on('click', function () {
		top.xmtc.popUp(base + "/view/admin/sys/sysDeptWin.jsp", "部门列表", 600, 432, "dept_code", "dept_name", function (res) {
			$("#dept_no").val(res["dept_code"]);
			$("#dept_name").val(res["dept_name"]);
		});
	});

	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	$("#btn-addDetail").on("click", function () {
		if (beforeAdd()) {
			openDetailForm("编辑成本测算明细", null);
		}
	});

	$("#btn-addRiskPoint").on("click", function () {
		if (beforeAdd()) {
			openRiskPointForm("编辑风险点", null);
		}
	});

	$("#btn-deleteDetail").on("click", function () {
		var ids = getSelectIds("detailTable");
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var str = ids.join(",");
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/costMeasured/deleteDetail", {id: str}, function (data) {
					if (data.success) {
						detailTable.ajax.reload();
						layer.msg('操作成功');
					} else {
						layer.msg('删除失败');
					}
				});
			});
		}
	});

	$("#btn-deleteRiskPoint").on("click", function () {
		var ids = getSelectIds("riskPointTable");
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var str = ids.join(",");
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/costMeasured/deleteRiskPoint", {id: str}, function (data) {
					if (data.success) {
						riskPointTable.ajax.reload();
						layer.msg('操作成功');
					} else {
						layer.msg('删除失败');
					}
				});
			});
		}
	});

	form.on('checkbox(allChoose)', function (data) {
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
		child.each(function (index, item) {
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});
	//========================================== 表单操作 ============================================================

	// 提交
	form.on('submit(form-add)', function (data) {
		var param = data.field;
		if (id) {
			param.id = id;
		}
		if (param.status == "3") {
			layer.msg("已审核的数据不能保存");
		} else {
			xmtc.ajaxPost(base + "/cust/costMeasured/submit", param, function (json) {
				if (json.success) {
					id = json.data.id;
					status = json.data.status;
					$("#measured_no").val(json.data.measured_no);
				}
				layer.msg(json.msg);
			});
		}
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	//========================================= 私有方法 ======================================================
	function beforeAdd() {
		if (!id) {
			xmtc.failMsg("请先保存基础信息");
			return false;
		}
		return true;
	}

	function openRiskPointForm(title, id) {
		var url = "riskPointForm.jsp?measured_no=" + $("#measured_no").val();
		if (id) {
			url += "&id=" + id;
		}
		layer_show(title, url, "600", "400", function () {
			riskPointTable.ajax.reload();
		});
	}

	function openDetailForm(title, id) {
		var url = "costMeasuredDetailForm.jsp?measured_no=" + $("#measured_no").val();
		if (id) {
			url += "&id=" + id;
		}
		layer_show(title, url, "600", "400", function () {
			detailTable.ajax.reload();
		});
	}

	/**
	 * 获取选择的行id集合
	 * @param tableId
	 * @returns {Array}
	 */
	function getSelectIds(tableId) {
		var ids = [];
		$("#" + tableId).find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
		});
		return ids;
	}

	function getById() {
		xmtc.ajaxPost(base + "/cust/costMeasured/getById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						if (key == "is_billing") {
							if (xmtc.nullToSpace(value) == "1") {
								$('#' + key).attr("checked", "checked");
							} else {
								$('#' + key).removeAttr("checked");
							}
						} else {
							$('#' + key).val(xmtc.nullToSpace(value));
						}
					}
				});
				status = json.data.status;
			} else {
				status = "1";
			}
			xmtc.selectValue("status", status);
			initDetailTable();
			initRiskPointTable();
			form.render('select');
			form.render('checkbox'); //刷新checkbox选择框渲染
		});
	}

	function initDetailTable() {
		detailTable = $('#detailTable').DataTable({
			ajax: {
				url: base + "/cust/costMeasured/detailPage",
				data: function (data) {
					data.measured_no = $("#measured_no").val();
				}
			},
			columns: [                            // 自定义数据列
				{
					data: function (obj) {
						return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-fileId="' + obj.file_no + '"/>';
					},
					width: '15px'
				},
				{data: 'cost_item'},
				{data: 'num'},
				{data: 'price'},
				{data: 'cost_amount'},
				{data: 'formula'},
				{data: 'remark'},
				{
					data: function (obj) {
						return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
					},
					width: 35,
					sClass: "text-c"
				}

			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			}
		}).on('click', '.btn-delete', function () {
			var id = $(this).attr('data-id');
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/costMeasured/deleteDetail", {id: id}, function (data) {
					if (data.success) {
						detailTable.ajax.reload();
					}
					layer.msg(data.msg);
				});
			});
		}).on('click', '.btn-edit', function () {
			var id = $(this).attr('data-id');
			openDetailForm("编辑成本测算明细", id);
		});
	}

	function initRiskPointTable() {
		riskPointTable = $('#riskPointTable').DataTable({
			ajax: {
				url: base + "/cust/costMeasured/riskPointPage",
				data: function (data) {
					data.measured_no = $("#measured_no").val();
				}
			},
			columns: [                            // 自定义数据列
				{
					data: function (obj) {
						return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-fileId="' + obj.file_no + '"/>';
					},
					width: '15px'
				},
				{data: 'risk_point'},
				{data: 'control_means'},
				{data: 'risk_control_man'},
				{data: 'feedback_cycle'},
				{data: 'remark'},
				{
					data: function (obj) {
						return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
					},
					width: 35,
					sClass: "text-c"
				}

			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			}
		}).on('click', '.btn-edit', function () {
			var id = $(this).attr('data-id');
			openRiskPointForm("编辑风险点", id);
		}).on('click', '.btn-delete', function () {
			var id = $(this).attr('data-id');
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/costMeasured/deleteRiskPoint", {id: id}, function (data) {
					if (data.success) {
						riskPointTable.ajax.reload();
						layer.msg('操作成功');
					} else {
						layer.msg('删除失败');
					}
				});
			});
		});
	}

	exports('costMeasuredForm', {});
});
