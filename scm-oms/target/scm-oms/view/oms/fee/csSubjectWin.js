/**
 * 科目管理
 * @author Joan.Zhang
 */
var data={};
var getData=function(){
	var codes = [];
	var names=[];
	var cbks=$("#dateTable").find(":checkbox:checked");
	if(cbks.length>0){
		cbks.each(function () {
	    	codes.push($(this).attr("data-subject_code"));
	    	names.push($(this).attr("data-subject_name"));
	    });
		//父页面的
	    data["subject_code"]=codes.toString();
	    data["subject_name"]=names.toString();
	}
    return data;
}

layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate = layui.laydate;

    var table = $('#dateTable').DataTable({
        "aLengthMenu": [[5, 10], [5, 10]],
        "iDisplayLength":5,
        ajax: {
            url: base + "/fee/csSubject/page",
            data: function (data) {
                data.subject_code = $.trim($("#subject_code").val());
                data.subject_name = $.trim($("#subject_name").val());
            }
        },
        "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "sServerMethod": "POST",               // POST
        "columns": [                            // 自定义数据列
            {
                data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-subject_code="' + obj.subject_code+ '" data-subject_name="' + obj.subject_name + '"/>';
                }
            },
            {data: 'subject_code'},
            {data: 'subject_name'},
            {
                data: function (row) {
                	if(row.is_personal){
                        return xmtc.getDictVal('yes_no', row.is_personal);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            },
            {
                data: function (row) {
                	if(row.is_project){
                        return xmtc.getDictVal('yes_no', row.is_project);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            },
            {
                data: function (row) {
                	if(row.is_customer){
                        return xmtc.getDictVal('yes_no', row.is_customer);
                	}else{
                		return "";
                	}
                },sClass:'text-c'
            }

        ],
        "stateSaveParams": function () {           // 初始化完成调用事件
                                                   // 重新渲染form checkbox
            form.render('checkbox');
        }
    }).on("dblclick","tr",function(){//给tr或者td添加click事件
        var dt=table.row(this).data();//获取值的对象数据
        data["subject_code"]=dt.subject_code;
        data["subject_name"]=dt.subject_name;
        //子触发确定按钮
        parent.$(".layui-layer-btn0").click();
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
    $("#btn-reset").on('click', function () {
    	  $("select[name='dateTable_length']").attr("lay-ignore","");
    });
    exports('csSubjectWin', {});
});
