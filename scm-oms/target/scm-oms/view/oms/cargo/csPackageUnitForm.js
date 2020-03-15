/**
 * 包装-包装单位弹窗-维护弹窗
 * @author Devin
 */
// 包装单位id
var id = xmtc.getUrlVars("id");
var packageCode = xmtc.getUrlVars("packageCode");;
layui.define(['layer', 'form'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form();
    
    // 查询
    getById();
    
    /**
     * 通过id获取数据
     */
    function getById() {
    	if (!id) {
    		// 新增时，设置是否默认为否
    		xmtc.selectValue('is_default', '0');
    		// 重新渲染下拉框
			form.render('select');
    		return;
    	}
    	// id存在，则为编辑，查询数据
    	xmtc.ajaxPost(base + "/cargo/csPackageUnit/getById", { id:id }, function(json) {
			if (json.data) {
				setDataToForm(json.data);
			}
		});
	}
    
    /**
     * 将数据渲染到表单
     */
    function setDataToForm(data) {
    	if (data) {
    		currentObject = data;
    		// 渲染到界面
			$.each(data, function (key, value) {
				if ($('#' + key)) {
					$('#' + key).val(xmtc.nullToSpace(value));
				}
			});
			// 重新渲染下拉框
			form.render('select');
			// 设置界面标签是否可编辑
			setDefaultDataDisable(data);
		}
    }
    
    /**
     * 如果是默认包装单位，设置部分字段不可编辑
     */
    function setDefaultDataDisable(data) {
    	// 如果是默认包装单位设置单位代码不可编辑
    	if (data.code === 'EA' || data.code === 'IP' || data.code === 'CS' || data.code === 'PL' || data.code === 'OT') {
    		$('#code').attr("disabled","disabled");
    	}
    	// 如果代码是EA，数量不可编辑
    	if (data.code === 'EA') {
    		$('#quantity').attr("disabled","disabled");
    	}
    }
    
    /**
     * 保存/保存并新增-按钮
     */
    form.on('submit(form-save)', function(data) {
    	var packageUnit = data.field;
    	packageUnit.package_code = packageCode;
    	if (id) {
    		packageUnit.id = id;
    	}
    	xmtc.ajaxPost( base + "/cargo/csPackageUnit/save", packageUnit, function(result) {
			if (result.success) {
	        	// 保存：关闭本弹窗
	        	xmtc.parentSuccessMsg('操作成功');
	        	var index = parent.layer.getFrameIndex(window.name);
	        	parent.layer.close(index);
    		} else {
    			xmtc.failMsg(result.msg);
    		}
		});
    	//阻止表单跳转。如果需要表单跳转，去掉这段即可。
        return false;
    });
    
    /**
     * 关闭-按钮
     */
    $('#btn-close').on('click',function() {
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
    /**
     * 初始化为新增状态
     */
    function initToAdd() {
    	// 设置当前为空
    	id = null;
    	// 清空表单内容
    	document.getElementById("form-edit").reset();
    }
    
    /**
     * 表单格式
     */
    form.verify({
        // 数字
    	number : function (value) {
            if (value) {
                var reg = /^[1-9]\d*$/;
                if (!reg.test(value)) {
                    return '请输入正整数';
                }
            }
        }
	});
    
    exports('csPackageUnitForm', {});
});