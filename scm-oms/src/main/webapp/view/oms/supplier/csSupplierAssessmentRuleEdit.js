/**
 * 承运商考核规则维护
 *
 * @author Samuel Yang
 */
var id = xmtc.getUrlVars("id");
layui.define(['layer', 'form', 'laydate', 'element'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;

	xmtc.daterange("effective_date", "expiration_date", "YYYY-MM-DD");
	
	/**
	 * 执行获取规则方法
	 */
	getRuleById();

	/**
	 * 考核明细表变量
	 */
	var table;

	/**
	 * 考核明细表初始化
	 */
	function initTable() {
		table = $('#dateTable').DataTable({
			ajax: {
				url: base + "/api/oms/csSupplierAssessmentRule/findRuleDetails",
				data: function (data) {
					data.rule_id = id;
				}
			},
			"paging": false,
			"columns": [                            // 自定义数据列
				{data: 'ds_order'},
				{data: 'ds_value'},
				{data: 'desc'},
				{data: function (obj) {
					//是否考核
					if(obj.is_assess==1){
						return '<input type="checkbox" class="ckb-assess" data-index="'+obj.ds_order+'" checked="" name="open" lay-skin="switch" lay-filter="switchAssess" lay-text="是|否">';
					}else{
						return '<input type="checkbox" class="ckb-assess" data-index="'+obj.ds_order+'" name="close" lay-skin="switch" lay-filter="switchAssess" lay-text="是|否">';
					}
            	}},
                {data: function (obj) {
                    //考核占比
                    var weighing = obj.weighing==null?0:obj.weighing;
                    return '<input type="text" class="input-weighing layui-input" value="'+weighing+'">'
                }}
			],
			"stateSaveParams": function () {
				// 初始化完成调用事件
				// 重新渲染form checkbox
				form.render('checkbox');
			}
		}).on('keyup', '.input-weighing', function () {
		    // 只能输入数字
            var thisValue = this.value;
            thisValue =  thisValue.replace(/[^0-9.]+/,"");
            $(this).val(thisValue);
            // 改变行记录
            var rowIndex = $(this).closest('tr')[0].rowIndex;
            var row = table.rows().data()[rowIndex-1];
            row.weighing = thisValue;
        });;
	}
	
	/**
	 * 根据id获取规则
	 */
	function getRuleById() {
		xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentRule/getById", {id: id}, function (json) {
			if (json.data) {
				$.each(json.data, function (key, value) {
					if ($('#' + key)) {
						$('#' + key).val(xmtc.nullToSpace(value));
					}
				});
				initTable();
			} else {
				initTable();
			}
			form.render('select');
		});
	};

	/**
	 * 是否考核开关监听事件
	 */
	form.on('switch(switchAssess)', function(data) {
		var index = $(this).attr('data-index');
		var row = table.rows().data()[index-1];
		if(this.checked){
			row.is_assess=1;
		}else{
			row.is_assess=0;
			//不考核时占比为0
			row.weighing=0;
			var input_weighings = $('.input-weighing');
            var $input_weighing = $(input_weighings[index-1]);
            $input_weighing.val(0);
		}
	});
	
	//关闭窗口
	$('#btn-close').on('click', function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});

	// 提交
	form.on('submit(form-add)', function (data) {
		var rule = data.field;
		// 判断失效时间大于生效时间
		if(rule.effective_date>=rule.expiration_date){
			layer.msg("有效期结束时间需大于开始时间");
			return false;
		}
		var rows = table.rows().data();
		var details = [];
		//启用的考核明细占比之和需为100
		var sumProportion = 0;
		//至少有一条启动的规则
		var hasRule = false;
		for(var i = 0; i<rows.length; i++){
			rows[i].detail_no = rows[i].ds_order;
			rows[i].detail_code = rows[i].ds_code;
			rows[i].detail_name = rows[i].ds_value;
			rows[i].detail_remark = rows[i].desc;
			rows[i].rule_id = id;
			details.push(rows[i]);
			if(rows[i].is_assess==1){
				if(rows[i].weighing==0) {
					layer.msg("启用的考核项权重不能为0");
					return false;
				}
				sumProportion += parseInt(rows[i].weighing);
				hasRule = true;
			}
		}
		
		if(!hasRule) {
			layer.msg("至少要有一项启用的考核项");
			return false;
		}
		
		if(sumProportion!=100){
			layer.msg("启用项占比和应为100");
			return false;
		}
		
		if (id) {
			rule.id = id;
		}
		rule.details = JSON.stringify(details);

		xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentRule/save", rule, function (json) {
			if (json.success) {
				layer.msg("操作成功");
				id = json.data.id;
				if (document.activeElement.id == "save") {

				} else {
					document.getElementById("form-add").reset();
					id = null;
					table.ajax.reload();
				}
			} else {
				layer.msg(json.msg);
			}
		});
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	exports('csSupplierAssessmentRuleEdit', {});
});
