/**
 * 客户合同
 *
 * @author Adolph Zheng
 */
layui.define(['laypage', 'layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage, laydate = layui.laydate;

	xmtc.daterange("sign_time_start_query", "sign_time_end_query", "YYYY-MM-DD");

	xmtc.getDictMap('common_audit_status');

	var table = $('#dateTable').DataTable({
		ajax: {
			url: base + "/cust/contract/page",
			data: function (data) {
				data.contract_code = $.trim($("#contract_code_query").val());
				data.contract_name = $.trim($("#contract_name_query").val());
				data.customer_code = $.trim($("#customer_code_query").val());
				data.status = $.trim($("#status_query").val());
				data.sign_personnel = $.trim($("#sign_personnel_query").val());
				data.sign_time_start = $.trim($("#sign_time_start_query").val());
				data.sign_time_end = $.trim($("#sign_time_end_query").val());
				data.is_frame_contract = $.trim($("#is_frame_contract_query").val());
			}
		},
		"columns": [                            // 自定义数据列
			{
				data: function (obj) {
					return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
				}
			},
			{data: 'contract_code'},
			{data: 'contract_name'},
			{data: 'customer_name'},
			{
				data: function (row) {
					if (row.sign_time) {
						return row.sign_time.substring(0, 10);
					} else {
						return row.sign_time;
					}
				}
			},
			{data: 'sign_personnel'},
			{data: 'tel'},
			{data: function (row) {
				return xmtc.getDictVal("is_frame_contract", row.is_frame_contract);
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
				sClass: "text-c"
			},
			{
				data: function (obj) {
					return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '" data-status="' + obj.status + '"><i class="layui-icon">&#xe642;</i></a>';
				},
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
			layer.msg("已启用的合同不能删除");
		} else if (status == "3") {
			layer.msg("已审核的合同不能删除");
		} else {
			layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
				xmtc.ajaxPost(base + "/cust/contract/delete", {id: id}, function (data) {
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
		openCustomerContractEdit("编辑合同", id);
	});

	form.on('checkbox(allChoose)', function (data) {
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
		child.each(function (index, item) {
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	// 查询
	$("#btn-query").on('click', function () {
		table.ajax.reload();
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

	// 新增
	$("#btn-add").on('click', function () {
		openCustomerContractEdit("新建合同", null);
	});

	$("#customer_name_query").on('click', function () {
		top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		$("#customer_code_query").val(res["unit"]);  
		    $("#customer_name_query").val(res["unit_name"]);
    	});
	});

	// 删除
	function deleteHanlder() {
		var ids = getSeclectIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选中一条数据");
		} else {
			var statusStr = getSeclectStatus().join(",");
			if (statusStr.indexOf("1") > -1) {
				layer.msg("已启用的合同不能删除");
			} else if (statusStr.indexOf("3") > -1) {
				layer.msg("已审核的合同不能删除");
			} else {
				layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
					xmtc.ajaxPost(base + "/cust/contract/delete", {id: ids.join(",")}, function (data) {
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
			} else {
				layer.confirm('确认要启用吗？', function (index) {
					xmtc.ajaxPost(base + "/cust/contract/updateStatus", {id: ids.join(","), status: "1"}, function (data) {
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
					xmtc.ajaxPost(base + "/cust/contract/updateStatus", {id: ids.join(","), status: "0"}, function (data) {
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
						xmtc.ajaxPost(base + "/cust/contract/audit", {id: ids.join(","), status: "3"}, function (data) {
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
						xmtc.ajaxPost(base + "/cust/contract/audit", {id: ids.join(","), status: "2"}, function (data) {
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
	function openCustomerContractEdit(title, id) {
		var url = "csCustomerContractForm.jsp";
		if (id) {
			url += "?id=" + id;
		}
		layer_show(title, url, $(window).width(), $(window).height(), function () {
			table.ajax.reload();
		});
	}

	exports('customerContractList', {});
});
