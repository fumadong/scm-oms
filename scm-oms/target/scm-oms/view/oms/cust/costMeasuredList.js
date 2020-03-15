/**
 * 成本测算管理
 *
 * @author Adolph Zheng
 */
layui.define(['laypage', 'layer', 'form'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage;

	var table = $('#dateTable').DataTable({
		ajax: {
			url: base + "/cust/costMeasured/page",
			data: function (data) {
				var param = $("#queryFrom").serializeArray();
				$.each(param, function (i, el) {
					var _name = el.name;
					data[_name] = el.value;
				});
			}
		},
		columns: [                            // 自定义数据列
			{
				data: function (obj) {
					return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
				}
			},
			{data: 'measured_no'},
			{data: 'dept_name'},
			{data: function (row) {
				return xmtc.getDictVal("sign_type", row.sign_type);
			}},
			{data: 'customer_name'},
			{data: function (row) {
				if (row.is_billing == "1") {
					return "是";
				} else {
					return "否";
				}
			}},
			{
				data: function (row) {
					if (row.status === "0") {
						return '<span class="layui-disabled">停用</span>';
					} else if (row.status === "2") {
						return '<span class="layui-disabled">新增</span>';
					} else if (row.status === "1") {
						return '<span class="c-green">启用</span>';
					} else if (row.status === "3") {
						return '<span class="c-green">已审核</span>';
					}
					return xmtc.getDictVal('common_audit_status', row.status);
				},
				width: 80,
				sClass: "text-c"
			},
			{
				data: function (obj) {
					return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
				},
				width: 80,
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
		var status = $(this).attr('data-status');
		if (status == "1") {
			layer.msg("已启用的不能删除");
		} else if (status == "3") {
			layer.msg("已审核的不能删除");
		} else {
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/costMeasured/delete", {id: id}, function (data) {
					if (data.success) {
						table.ajax.reload();
						layer.msg('操作成功');
					} else {
						layer.msg('删除失败');
					}
				});
			});
		}
	}).on('click', '.btn-edit', function () {
		var id = $(this).attr('data-id');
		openCostMeasuredForm("编辑成本测算", id);
	});

	form.on('checkbox(allChoose)', function (data) {
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
		child.each(function (index, item) {
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	$("#dept_name_query").on('click', function () {
		top.xmtc.popUp(base + "/admin/sys/sysDeptWin.jsp", "部门列表", 600, 432, "dept_code", "dept_name", function (res) {
			$("#dept_name_query").val(res["dept_name"]);
		});
	});

	// 查询
	$("#btn-query").on('click', function () {
		table.ajax.reload();
	});

	// 新增
	$("#btn-add").on('click', function () {
		openCostMeasuredForm("添加成本测算", null);
	});

	$("#btn-delete").on('click', function () {
		deleteHanlder();
	});

	$("#btn-enable").on('click', function () {
		enabledHandler();
	});

	$("#btn-disable").on('click', function () {
		disabledHandler();
	});

	$("#btn-audit").on('click', function () {
		auditHandle();
	});

	$("#btn-unaudit").on('click', function () {
		unAuditHandle();
	});

	function deleteHanlder() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var statusStr = getSeclectStatus().join(",");
			if (statusStr.indexOf("1") > -1) {
				layer.msg("已启用的不能删除");
			} else if (statusStr.indexOf("3") > -1) {
				layer.msg("已审核的不能删除");
			} else {
				layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
					xmtc.ajaxPost(base + "/cust/costMeasured/delete", {id: ids.join(",")}, function (data) {
						if (data.success) {
							table.ajax.reload();
							layer.msg('操作成功');
						} else {
							layer.msg('删除失败');
						}
					});
				});
			}
		}
	}

	// 启用
	function enabledHandler() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var statusStr = getSeclectStatus();
			if (statusStr.join(",").indexOf("1") != -1) {
				layer.msg("已启用的数据不能重复启用");
			} else if (statusStr.join(",").indexOf("3") > -1) {
				layer.msg("已审核的数据不能启用");
			} else {
				layer.confirm('确认要启用吗？', function (index) {
					xmtc.ajaxPost(base + "/cust/costMeasured/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
						if (data.success) {
							table.ajax.reload();
							layer.msg('操作成功');
						} else {
							layer.msg('启用失败');
						}
					});
				});
			}
		}
	}

	// 停用
	function disabledHandler() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var statusStr = getSeclectStatus();
			if (statusStr.join(",").indexOf("0") != -1) {
				layer.msg("已停用的数据不能重复停用");
			} else {
				layer.confirm('确认要停用吗？', function (index) {
					xmtc.ajaxPost(base + "/cust/costMeasured/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
						if (data.success) {
							table.ajax.reload();
							layer.msg('操作成功');
						} else {
							layer.msg('停用失败');
						}
					});
				});
			}
		}
	}

	/**
	 * 审核
	 * 只有启用状态下，才允许审核
	 */
	function auditHandle() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var selectRows = getSeclectStatus();
			var statusStr = selectRows.join(",");
			if (statusStr.indexOf("0") != -1 || statusStr.indexOf("2") != -1) {
				layer.msg("只有启用状态，才能审核");
			} else {
				if (statusStr.indexOf("3") != -1) {
					layer.msg("已审核的数据不能重复审核");
				} else {
					layer.confirm('确认要审核吗？', function (index) {
						xmtc.ajaxPost(base + "/cust/costMeasured/audit", {id: ids.join(","), status: "3"}, function (data) {
							if (data.success) {
								table.ajax.reload();
								layer.msg('操作成功');
							} else {
								layer.msg('审核失败');
							}
						});
					});
				}
			}
		}
	}

	/**
	 * 取消审核
	 * 只有审核状态才允许
	 */
	function unAuditHandle() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var selectRows = getSeclectStatus();
			var statusStr = selectRows.join(",");
			if (statusStr.indexOf("0") != -1 || statusStr.indexOf("1") != -1) {
				layer.msg("只有审核状态，才能取消");
			} else {
				if (statusStr.indexOf("2") != -1) {
					layer.msg("已取消审核的数据不能重复取消");
				} else {
					layer.confirm('确认要取消审核吗？', function (index) {
						xmtc.ajaxPost(base + "/cust/costMeasured/audit", {id: ids.join(","), status: "2"}, function (data) {
							if (data.success) {
								table.ajax.reload();
								layer.msg('操作成功');
							} else {
								layer.msg('取消审核失败');
							}
						});
					});
				}
			}
		}
	}

	// 获取表格选中的行id集合
	function getSeclectIds() {
		var ids = [];
		$("#dateTable").find(":checkbox:checked").each(function () {
            if($(this).attr("data-id") !== undefined && $(this).attr("data-id") !== null && $(this).attr("data-id") !== ""){
                ids.push($(this).attr("data-id"));
            }
		});
		return ids;
	}

	function getSeclectStatus() {
		var ids = [];
		$("#dateTable").find(":checkbox:checked").each(function () {
			ids.push($(this).attr("data-status"));
		});
		return ids;
	}

	// 打开维护界面
	function openCostMeasuredForm(title, id) {
		var url = "costMeasuredForm.jsp";
		if (id) {
			url += "?id=" + id;
		}
		layer_show(title, url, $(window).width(), $(window).height(), function () {
			table.ajax.reload();
		});
	}

	exports('costMeasuredList', {});
});
