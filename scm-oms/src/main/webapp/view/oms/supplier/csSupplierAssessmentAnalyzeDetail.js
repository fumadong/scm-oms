/**
 * 承运商考核分析
 * 
 * @author Samuel Yang
 */
layui.define(['laypage', 'layer', 'form','laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate=layui.laydate;
    var result_id = xmtc.getUrlVars("id");
    
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    
    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/api/oms/csSupplierAssessmentAnalyze/findResultDetailByRuleId",
            data: function (data) {
                data.result_id = result_id;
            }
        },
        "columns": [                            // 自定义数据列
            {data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '"/>';
                }},	
            {data: 'detail_no'},
            {data: 'detail_name'},
            {data: 'total_num'},
            {data: 'abnormal_num'},
            {data: 'percentage'},
            {data: 'weighing'},
            {data: 'score'}
        ],
        "stateSaveParams": function () {
            // 初始化完成调用事件
            // 重新渲染form checkbox
            form.render('checkbox');
        },
        "paging": false,
        "initComplete": function(settings, json) {
        	//在初始化完成后加载雷达图
        	var details = json.data;
        	var indicator = [];
        	var dataValue = [];
        	for(var i = 0; i<details.length; i++){
    			var detail = details[i];
        		var item = {name:detail.detail_name,max:100};
        		dataValue.push(detail.percentage);
        		indicator.push(item);
        	}
        	// 指定图表的配置项和数据
        	option = {
    		    title: {
    		        text: '考核雷达图'
    		    },
    		    tooltip: {},
//    		    legend: {
//    		        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
//    		    },
    		    radar: {
    		        // shape: 'circle',
    		        name: {
    		            textStyle: {
    		                color: 'black',
    		                backgroundColor: '#999',
    		                borderRadius: 3,
    		                padding: [3, 5]
    		           }
    		        },
    		        indicator: indicator
    		    },
    		    series: [{
//    		        name: '预算 vs 开销（Budget vs spending）',
    		        type: 'radar',
    		        // areaStyle: {normal: {}},
    		        data : [
    		            {
    		                value : dataValue,
    		                name : '考核通过率'
    		            }
    		        ]
    		    }]
    		};

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
	     }
    });
    
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    
    exports('csSupplierAssessmentAnalyzeDetail', {});
});
