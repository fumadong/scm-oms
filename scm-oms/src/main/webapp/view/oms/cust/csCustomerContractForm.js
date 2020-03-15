/**
 * 合同维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var status = "";
layui.define(['layer', 'form', 'laydate', 'element', 'layedit', 'upload'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;
	var feeTable;
	var positionTable;
	var fileTable;
	
	xmtc.daterange("contract_date_from", "contract_date_to", "YYYY-MM-DD");
	xmtc.getDictMap("contract_fee_type");
	xmtc.getDictMap("contract_status");

	// 选择地址
	$(".sns-addrselector").addrDropMenu({
		"level" : 3,
		"hotCity" : false
	});

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
		},
		day:function(value){
			if(value){
				var reg = /^((0?[1-9])|((1|2)[0-9])|30|31)$/;
				if(!reg.test(value)){
					return "请输入1-31";
				}
			}			
		}
	});

	getById();

	// ==================================================== 事件绑定 ==========================================================
	$("#customer_name").on('click', function () {
		top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		$("#customer_code").val(res["unit"]);  
		    $("#customer_name").val(res["unit_name"]);
    	});
	});

	$("#btn-queryPosition").on('click', function () {
		positionTable.ajax.reload();
	});

	$("#btn-resetPosition").on('click', function () {
		$("#queryPositionForm input").val("");
	});

	$("#btn-addPosition").on("click", function () {
		if (status == "3") {
			layer.msg("合同已审核，无法进行新增！");
		} else {
			openPositionForm("编辑合同流向", null);
		}
	});

	$("#btn-uploadFeeRate").click(function () {
		if (status == "3") {
			layer.msg("合同已审核，无法进行导入！");
		} else {
			layer_show('导入', base + '/view/oms/cust/feeRateExcel.jsp?contractCode=' + $("#contract_code").val(), 560, 160, function () {
				positionTable.ajax.reload();
			});
		}
	});

	$("#btn-downloadFeeRate").click(function () {
		window.parent.parent.open(base + "/common/downLoadTemplate?type=0");
	});

	$("#btn-addFee").on("click", function () {
		if (status == "3") {
			layer.msg("合同已审核，无法进行新增！");
		} else {
			var positionId = $("#positionId").val();
			if (positionId && positionId != "0") {
				openFeeForm("编辑合同费率", null);
			} else {
				xmtc.failMsg("请选择一条费用流向");
			}
		}
	});

	$("#btn-deletePosition").click(function () {
		if (status == "3") {
			layer.msg("合同已审核，无法进行删除！");
		} else {
			var rows = xmtc.getRows(positionTable, $("#positionTable"));
			if (rows.length == 0) {
				xmtc.failMsg("请至少选中一条数据");
			} else {
				var ids = xmtc.getPropValueFromRows(rows, "id");
				deletePosition(ids);
			}
		}
	});

	$("#btn-deleteFee").click(function () {
		if (status == "3") {
			layer.msg("合同已审核，无法进行删除！");
		} else {
			var rows = xmtc.getRows(feeTable, $("#feeTable"));
			if (rows.length == 0) {
				xmtc.failMsg("请至少选中一条数据");
			} else {
				var ids = xmtc.getPropValueFromRows(rows, "id");
				deleteFee(ids);
			}
		}
	});

	$("#btn-upload").on("click", function () {
		var contractCode = $("#contract_code").val();
		if (!contractCode) {
			xmtc.failMsg("请先保存合同基础信息");
		} else {
			layer_show('附件上传', base + '/view/oms/cust/contractAttch.jsp?contractCode=' + contractCode, 560, 160, function () {
				fileTable.ajax.reload();
			});
		}
	});

	//文件下载
	$('#btn-download').on('click', function (e) {
		var fileIds = getSeclectFileIds();
		if (fileIds.length == 0) {
			xmtc.failMsg("请选择一条数据");
		} else if (fileIds.length == 1) {
			window.open(base + "/common/download?uuid=" + fileIds[0]);
			return false;
		} else {
			layer.msg("只能选择一条数据");
		}
	});

	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	form.on('checkbox(allChoose)', function (data) {
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
		child.each(function (index, item) {
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	// 提交
	form.on('submit(form-add)', function (data) {
		var param = data.field;
		if (id) {
			param.id = id;
		}
		param.contract_clause = $("#contract_clause").val();
		if (param.status == "3") {
			layer.msg("已审核的合同不能保存");
		} else {
			xmtc.ajaxPost(base + "/cust/contract/submit", param, function (json) {
				if (json.success) {
					id = json.data.id;
					status = json.data.status;
					$("#contract_code").val(json.data.contract_code);
					layer.msg("保存成功");
				} else {
					layer.msg(json.msg);
				}
			});
		}
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	$("#form-audit").click(function (evt) {
		if (!status) {
			xmtc.failMsg("请先保存");
		} else {
			if (status == "0" || status == "2") {
				layer.msg("只有启用状态，才能审核");
			} else {
				if (status == "3") {
					layer.msg("已审核的数据不能重复审核");
				} else {
					xmtc.ajaxPost(base + "/cust/contract/audit", {id: id, status: "3"}, function (data) {
						if (data.success) {
							layer.msg('审核成功');
							var index = parent.layer.getFrameIndex(window.name);
							parent.$('#btn-query').click();
							parent.layer.close(index);
						} else {
							layer.msg('审核失败');
						}
					});
				}
			}
		}
		evt.preventDefault();
	});

	/**
	 * 取消审核不关闭编辑页
	 */
	$("#form-unAudit").click(function (evt) {
		if (!status) {
			xmtc.failMsg("请先保存");
		} else {
			if (status == "0" || status == "1") {
				layer.msg("只有审核状态，才能取消");
			} else {
				if (status == "2") {
					layer.msg("已取消审核的数据不能重复取消");
				} else {
					xmtc.ajaxPost(base + "/cust/contract/audit", {id: id, status: "2"}, function (data) {
						if (data.success) {
							layer.msg('取消审核成功');
							var index = parent.layer.getFrameIndex(window.name);
							parent.$('#btn-query').click();
							status = "1";//取消审核后状态为启用1
							xmtc.selectValue("status", "1");
							form.render('select');
							feeTable.ajax.reload();
//							parent.layer.close(index);
						} else {
							layer.msg('取消审核失败');
						}
					});
				}
			}
		}
		evt.preventDefault();
	});

	// ==================================================== 私有方法 ==========================================================
	// 获取车辆
	function getById() {
		xmtc.ajaxPost(base + "/cust/contract/getById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						if (key == "is_tax" || key == "is_frame_contract") {
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
				xmtc.selectValue("status", "1");
			}
			initPositionTable();
			initFileTable();
			form.render('select');
			form.render('checkbox'); //刷新checkbox选择框渲染
		});
	}

	function openPositionForm(title, _id, action) {
		if (!id) {
			xmtc.failMsg("请先保存基本信息");
		} else {
			var url = "CsCustomerContractPositionForm.jsp?contract_code=" + $("#contract_code").val();
			if (_id) {
				url += "&id=" + _id;
			}
			if (!action) {
				action = "addOrEdit";
			}
			url += "&action=" + action;
			layer_show(title, url, "600", "350", function () {
				positionTable.ajax.reload();
			});
		}
	}

	function openFeeForm(title, _id, action) {
		if (!id) {
			xmtc.failMsg("请先保存基本信息");
		} else {
			var url = "CsCustomerContractFeeForm.jsp?position_id=" + $("#positionId").val() + "&startTime=" + $("#contract_date_from").val() + "&endTime=" + $("#contract_date_to").val() + "&cstatus=" + $("#status").val();
			if (_id) {
				url += "&id=" + _id;
			}
			if (!action) {
				action = "addOrEdit";
			}
			url += "&action=" + action;
			layer_show(title, url, "600", "350", function () {
				feeTable.ajax.reload();
			});
		}
	}

	function initFileTable() {
		fileTable = $('#attachDateTable').DataTable({
			ajax: {
				url: base + "/cust/contract/attachPage",
				data: function (data) {
					data.contract_code = $.trim($("#contract_code").val());
				}
			},
			"columns": [                            // 自定义数据列
				{
					data: function (obj) {
						return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-fileId="' + obj.file_no + '"/>';
					},
					width: '15px'
				},
				{
					data: function (row, type, val, meta) {
						return Number(meta.row) + 1;
					}
				},
				{data: 'attach_name'},
				{
					data: function (row) {
						if (row.create_time) {
							return row.create_time.substring(0, 10);
						} else {
							return row.create_time;
						}
					}
				}
			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			}
		}).on('click', '.btn-delete', function () {
			var id = $(this).attr('data-id');
			if (status == "3") {
				layer.msg("合同已审核，无法进行删除！");
			} else {
				layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
					xmtc.ajaxPost(base + "/cust/contract/deleteAttch", {id: id}, function (data) {
						if (data.success) {
							fileTable.ajax.reload();
						}
						layer.msg(data.msg);
					});
				});
			}
		});
	}

	function initPositionTable() {
		positionTable = $("#positionTable").DataTable({
			aLengthMenu: [[5, 10], [5, 10]],
			iDisplayLength: 5,
			ajax: {
				url: base + "/common/page",
				data: function (data) {
					data.queryKey = "cust.contractPosition.getPage";
					data.contractCode = $("#contract_code").val();
					data.from_province_code = $("#from_province_code").val();
					data.from_city_code = $("#from_city_code").val();
					data.from_county_code = $("#from_county_code").val();
					data.to_province_code = $("#to_province_code").val();
					data.to_city_code = $("#to_city_code").val();
					data.to_county_code = $("#to_county_code").val();
				}
			},
			"columns": [                            // 自定义数据列
				{
					data: function (obj) {
						return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-fileId="' + obj.file_no + '"/>';
					},
					width: '15px'
				},
				{
					data: function (row) {
						var addr = "";
						if (row.from_province) {
							addr = addr + row.from_province;
						}
						if (row.from_city) {
							addr = addr + row.from_city;
						}
						if (row.from_county) {
							addr = addr + row.from_county;
						}
						return addr;
					}
				},
				{
					data: function (row) {
						var addr = "";
						if (row.to_province) {
							addr = addr + row.to_province;
						}
						if (row.to_city) {
							addr = addr + row.to_city;
						}
						if (row.to_county) {
							addr = addr + row.to_county;
						}
						return addr;
					}
				},
				{data: 'cargo_name'},
				{
					data: function (obj) {
						return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '" data-status="' + obj.status + '"><i class="layui-icon">&#xe642;</i></a>' +
							'<a title="复制" class="ml-5 btn-copy" data-id="' + obj.id + '" data-status="' + obj.status + '"><i class="layui-icon">&#xe621;</i></a>';
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
			if (status == "3") {
				layer.msg("合同已审核，无法进行删除！");
			} else {
				deletePosition([id]);
			}
		}).on("click", ".btn-edit", function () {
			var id = $(this).attr('data-id');
			if (status == "3") {
				layer.msg("合同已审核，无法进行修改！");
			} else {
				openPositionForm("编辑合同流向", id);
			}
		}).on("click", ".btn-copy", function () {
			var id = $(this).attr('data-id');
			if (status == "3") {
				layer.msg("合同已审核，无法进行复制！");
			} else {
				openPositionForm("编辑合同流向", id, "copy");
			}
		}).on("draw.dt", function () {
			var ftr = $("#positionTable").find('tbody tr:first-child');
			ftr.click();
		});

		$("#positionTable tbody").on("click", "tr", function (evt) {
			var data = positionTable.row(this).data(); // 获取值的对象数据
			if (data && data.id) {
				$("#positionId").val(data.id);
				feeTable.ajax.reload();
			}
		});

		initFeeTable();
	}

	function initFeeTable() {
		feeTable = $("#feeTable").DataTable({
			aLengthMenu: [[5, 10], [5, 10]],
			iDisplayLength: 5,
			ajax: {
				url: base + "/common/page",
				data: function (data) {
					data.queryKey = "cust.contractFee.getPage";
					data.contractFeeType = "";
					data.customerContractPositionId = $("#positionId").val();
				}
			},
			columns: [                            // 自定义数据列
				{
					data: function (obj) {
						return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-fileId="' + obj.file_no + '"/>';
					},
					width: '15px'
				},
				{data: 'fee_name'},
				{data: function (row) {
					return "[" + row.interval_from + ", " + row.interval_to + "]";
				}},
				{data: 'fee_unit'},
				{data: 'reserve_price'},
				{data: function (row) {
					if (!row.start_time || !row.end_time) {
						return "";
					}
					return row.start_time.substring(0, 10) + " ~ " + row.end_time.substring(0, 10);
				}},
				{data: function (row) {
					return xmtc.getDictVal("contract_fee_type", row.contract_fee_type);
				}},
				{data: function (row) {
					return xmtc.getDictVal("contract_status", row.status);
				}},
				{
					data: function (obj) {
						return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '" data-status="' + obj.status + '"><i class="layui-icon">&#xe642;</i></a>' +
						'<a title="复制" class="ml-5 btn-copy" data-id="' + obj.id + '" data-status="' + obj.status + '"><i class="layui-icon">&#xe621;</i></a>';
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
			if (status == "3") {
				layer.msg("合同已审核，无法进行删除！");
			} else {
				deleteFee([id]);
			}
		}).on("click", ".btn-edit", function () {
			var id = $(this).attr('data-id');
			if (status == "3") {
				layer.msg("合同已审核，无法进行修改！");
			} else {
				openFeeForm("编辑合同费率", id);
			}
		}).on("click", ".btn-copy", function () {
			var id = $(this).attr('data-id');
			openFeeForm("编辑合同费率", id, "copy");
		});
	}

	function getSeclectFileIds() {
		var ids = [];
		$("#attachDateTable").find(":checkbox:checked").each(function () {
			if ($(this).attr("data-fileId")) {
				ids.push($(this).attr("data-fileId"));
			}
		});
		return ids;
	}

	function deletePosition(ids) {
		layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
			xmtc.ajaxPost(base + "/cust/contract/deletePosition", {id: ids.join(",")}, function (data) {
				if (data.success) {
					positionTable.ajax.reload();
					$("#positionId").val("0");
					feeTable.ajax.reload();
				}
				layer.msg(data.msg);
			});
		});
	}

	function deleteFee(ids) {
		layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
			xmtc.ajaxPost(base + "/cust/contract/deleteFee", {id: ids.join(",")}, function (data) {
				if (data.success) {
					feeTable.ajax.reload();
				}
				layer.msg(data.msg);
			});
		});
	}
	
	//附件删除
	$('#btn-deleteAttach').on('click', function (e) {
		var ids = getSeclectAttachIds();
		if (ids.length == 0) {
			xmtc.failMsg("请至少选择一条数据");
		} else {
			if (status == "3") {
				layer.msg("合同已审核，无法进行删除！");
			} else {
				layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
					xmtc.ajaxPost(base + "/cust/contract/deleteAttch", {id: ids.join(",")}, function (data) {
						if (data.success) {
							fileTable.ajax.reload();
							layer.msg('删除成功');
						}else{
							layer.msg(data.msg);
						}
					});
				});
			}
		}
	});

	function getSeclectAttachIds() {
		var ids = [];
		$("#attachDateTable").find(":checkbox:checked").each(function () {
			if ($(this).attr("data-id")) {
				ids.push($(this).attr("data-id"));
			}
		});
		return ids;
	}
	
	exports('csCustomerContractForm', {});
});
