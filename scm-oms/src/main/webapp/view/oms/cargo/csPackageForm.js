/**
 * 包装维护界面
 * @author Devin
 */
// 取得参数
var code = xmtc.getUrlVars("code");

layui.define(['layer', 'form', 'element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), element = layui.element();
    
    // 当前编辑对象
    var currentPackage = null;
    // 子表-包装单位列表
    var unitTableunitTable = $('#unitTable').DataTable( {
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength":5,
        ajax: {
            url: base + "/cargo/csPackageUnit/query",
            data : function(data) {
                data.package_code = code;
            }
        },
        "bRetrieve": true, 				// 若没有该属性，主表包装后，报警告提示信息（DataTables warning: table id=unitTable - Cannot reinitialise DataTable. For more information about this error, please see http://datatables.net/tn/3）
        "columns": [                    // 自定义数据列
            { data:
                function(obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" />';
                }
            },
            { data: 'sequences_no' },	// 序号
            { data: 'code' },			// 单位代码
            { data: 'name' },			// 单位名称
            { data: 'quantity' },		// 数量
            { data: 					// 是否默认
                function (obj) {
                    if (obj) {
                        return xmtc.getDictVal("yes_no", obj.is_default);
                    } else {
                        return "";
                    }
                }
            },
            { data:
                function(obj) {			// 操作
                    return  '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                },
                width: 80,
                sClass: "text-c"
            }
        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
            // 重新渲染form的勾选框、下拉框
            form.render('checkbox');
            form.render('select');
        }
    }).on("dblclick","tr",function () {
        //获取值的对象数据
        var data = unitTableunitTable.row(this).data();
        editSubUnitHanlder(data.id);
    });
    
    // 通过包装代码查询包装信息
    getPackageByCode();
    
    /**
     * 通过包装代码查询包装信息
     */ 
    function getPackageByCode() {
    	if (!code) {
    		initToAdd();
    	} else {
    		xmtc.ajaxPost(base + "/cargo/csPackage/getByCode", { code : code }, function (json) {
				// 将数据渲染到表单
    			setPackageToForm(json.data);
    		});
    	}
    }
    
    /**
     * 初始化为新增状态
     */
    function initToAdd() {
    	// 清空表单内容
    	document.getElementById("form-add").reset();
    	// 设置表单默认新增状态
    	setFormNew();
    	// 重新渲染下拉框
		form.render('select');
		// 设置按钮状态
		setButtonStatus();
    }
    
    /**
     * 设置表单默认新增状态
     */
    function setFormNew() {
    	// 设置当期对象为空
    	currentPackage = null;
    	// 设置新增时系统控制参数默认值：这边会自动查询子表数据，若该字段为空，则会查询出所有数据，后续需修改为新增时不自动查询子表
		code = '';
		// 代码可编辑
		$('#code').removeAttr("disabled");
    }
    
    /**
     * 将订单渲染到表单
     */
    function setPackageToForm(data) {
    	if (data) {
    		// 渲染到界面
			$.each(data, function (key, value) {
				if ($('#' + key)) {
					$('#' + key).val(xmtc.nullToSpace(value));
				}
			});
			// 缓存当前编辑对象
			currentPackage = data;
			code = data.code;
			// 代码不可编辑
			$('#code').attr("disabled","disabled");
			// 重新渲染下拉框
			form.render('select');
			// 设置子表按钮栏状态
			setButtonStatus();
			// 查询子表数据
			initTable();
		}
    }
    
    /**
     * 根据界面按钮是否可见
     */
    function setButtonStatus() {
    	// 隐藏子表按钮栏
    	$('#unit-toolbar').hide();
    	// 以下情况设为可见
    	if (code) {
    		// 包装代码存在时，按钮栏可见
    		$('#unit-toolbar').show();
    	}
    }

    
    /**
     * 列表头勾选事件
     */
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    //=====================================按钮事件部分Start===================================
    /**
     * 主表-保存
     */ 
    form.on('submit(form-save)', function (data) {
    	var package = data.field;
    	// 设置id
    	if (currentPackage && currentPackage.id) {
    		package.id = currentPackage.id;
    	}
    	xmtc.ajaxPost(base + "/cargo/csPackage/save", package, function (result) {
    		if (result.success) {
	        	// 保存：渲染表单数据
	        	setPackageToForm(result.data);
    			xmtc.successMsg('操作成功');
    			parent.$('#btn-query').click();
    		} else {
    			xmtc.failMsg(result.msg);
    		}
    	});
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
    	return false; 
    });
    
    /**
     * 刷新表单数据
     */
    $('#btn-form-refresh').on('click',function() {
    	// 重新刷新信息
    	getPackageByCode();
    	parent.$('#btn-query').click();
    	return false;
    });
    
    /**
     * 主表-关闭
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });

    /**
     * 包装单位子表-新增
     */
    $('#btn-sub-unit-add').on('click',function() {
    	// 弹出编辑表单
    	editSubUnitHanlder(null);
    });
    
    /**
     * 包装单位子表-删除
     */ 
    $("#btn-sub-unit-delete").on('click', function () {
    	// 校验
    	var selectRows = xmtc.getRows(unitTable, $('#unitTable'));
    	if (selectRows.length === 0) {
    		xmtc.failMsg("请选择记录");
            return false;
    	}
    	var ids = [];
    	var isOk = true;
		for (var index in selectRows) {
			var unitCode = selectRows[index].code;
            if (unitCode === 'EA' || unitCode === 'IP' || unitCode === 'CS' || unitCode === 'PL' || unitCode === 'OT') {
            	isOk = false;
            	xmtc.failMsg('默认包装单位(EA、IP、CS、PL、OT)不可删除');
            	break;
            }
            ids.push(selectRows[index].id);
        }
    	
    	// 执行删除
		if (isOk) {
			deleteSubUnitHanlder(ids.join(","));
		}
    });
    
    /**
     * 包装单位子表-编辑
     */
    $("#unitTable").on('click','.btn-edit', function(){
    	// 弹出包装单位明细表单
        var id = $(this).attr('data-id');
        editSubUnitHanlder(id);
    });
    
    //=====================================按钮事件部分End=====================================
    
    /**
     * 弹出编辑商品弹窗
     */
    function editSubUnitHanlder(rowId) {
    	var url = "csPackageUnitForm.jsp?packageCode=" + code;
    	if (rowId) {
    		url += "&id=" + rowId;
    	}
    	// 弹出商品明细表单弹窗
    	layer_show("编辑包装单位", url, "600", "350", function () {
    		// 弹窗关闭后更新列表
    		unitTable.ajax.reload();
		});
    }
    
    /**
     * 删除包装单位
     * @param idsString: id组合的字符串，通过逗号‘,’隔开
     */ 
    function deleteSubUnitHanlder(idsString) {
    	// 执行删除
        layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
            xmtc.ajaxPost(base + "/cargo/csPackageUnit/deleteByIds", { ids : idsString }, function (data) {
                if (data.success) {
                	unitTable.ajax.reload();
                    xmtc.successMsg('操作成功');
                } else {
                	if (data.msg) {
                		xmtc.failMsg(data.msg);
                	} else {
                		xmtc.failMsg('删除失败');
                	}
                }
            });
        });
    }
    
    exports('csPackageForm', {});
});
