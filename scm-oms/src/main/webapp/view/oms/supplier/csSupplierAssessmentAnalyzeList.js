/**
 * 承运商考核分析
 * 
 * @author Samuel Yang
 */
layui.define(['laypage', 'layer', 'form','laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laypage = layui.laypage,laydate=layui.laydate,element = layui.element();

    xmtc.getDictMap('property_status');
    
    xmtc.daterange("create_time_from", "create_time_to", "YYYY-MM-DD");
    
    var rule_id, from = "", to = "", query_type = "query";

    // 起始年月
    var startTime = "2017-07";

    createMonthTab();

    // 生成历史月份
    function createMonthTab() {

        var html = "";
        var msg = "";
        var months = getLast12Months();
        for(var i = 0;i<months.length;i++){
            var year = months[i].split("-")[0];
            var month = months[i].split("-")[1];
            if(month!='12'){
                month = parseInt(month,10)+1;
            }else{
                month = 1;
                year = parseInt(year)+1;
            }

            var nextMonthDayOne = new Date(year+"/"+month+"/1");
            var minusDate=1000*60*60*24;
            var lastDay =  new Date(nextMonthDayOne.getTime()-minusDate);
            // 默认查询前一个月
            if(i==1){
                from = months[i]+"-01";
                to = months[i]+"-"+lastDay.getDate();
                html += '<a href="javascritp:void(0);" class="month-range active" data-from="'+months[i]+"-01"+'" data-to="'+months[i]+"-"+lastDay.getDate()+'">'+months[i]+'</a>';
            }else{
                html += '<a href="javascritp:void(0);" class="month-range" data-from="'+months[i]+"-01"+'" data-to="'+months[i]+"-"+lastDay.getDate()+'">'+months[i]+'</a>';
            }
            msg += months[i]+"-01/"+months[i]+"-"+lastDay.getDate();

        }

        $("#month-span").html(html);
        element.init()
    }

    /**
     * 获取近12个月
     * @returns {Array}
     */
    function getLast12Months(){
        var last12Months = [];
        var today = new Date();
        today.setMonth(today.getMonth()+1);
        for(var i=0;i<12;i++){
            today.setMonth(today.getMonth()-1);
            var month=today.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            last12Months[i] = today.getFullYear() + "-" + month;
        }
        return last12Months;
    }

    var table = $('#dateTable').DataTable({
        ajax: {
            url: base + "/api/oms/csSupplierAssessmentAnalyze/query",
            data: function (data) {
                data.rule_id = rule_id;
                data.is_assess = 1;
                data.create_time_from = from;
                data.create_time_to = to;
                data.query_type = query_type;
            }
        },
        "columns": [                            // 自定义数据列
            {data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }},	
            {data: 'ranking'},
            {data: 'supplier_name'},
            {data: 'score'},
            {data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-detail" style="color:blue" data-id="' + obj.id + '">考核明细</a>';
                },
             width: 80,
             sClass: "text-c"}

        ],
        "paging": false,
        "stateSaveParams": function () {
            // 初始化完成调用事件
            // 重新渲染form checkbox
            form.render('checkbox');
        },
        "preDrawCallback": function( settings ) {
        	var flag = true;
        	$.ajax({
                type: "POST",
                url: base + "/api/oms/csSupplierAssessmentAnalyze/findEffectiveRules",
                data: {},
                dataType: "json",
                timeout: 10000,
                async: false,
                beforeSend: function () {
                    index = layer.load("加载中...");
                },
                success: function (data) {
                    if (index) {
                        layer.close(index);
                    }
                    if (data.success) {
        				rule_id = data.data;
        			} else {
        				layer.msg("没有生效的考核规则");
        				flag = false;
        			}
                }
        	});
        	if(!flag){
        		return false;
        	}
        },
        "drawCallback": function(settings, json) {
            var results = table.rows().data();
	        // 数据加载完后，初始化报表
            if(results.length>0){
                initChart(results);
            }else{
                myChart.clear();
            }

	     }
    }).on('click', '.btn-detail', function () {
        var id = $(this).attr('data-id');
        openAnalyzeDetail("考核分析明细", id);
    });

    // 历史表
    var historyTable;

    function initHisTable(){
        historyTable = $('#historyTable').DataTable({
            ajax: {
                url: base + "/api/oms/csSupplierAssessmentAnalyze/query",
                data: function (data) {
                    data.rule_id = rule_id;
                    data.is_assess = 1;
                    data.create_time_from = from;
                    data.create_time_to = to;
                    data.query_type = query_type;
                }
            },
            "columns": [                            // 自定义数据列
                {data: function (obj) {
                    return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                }},
                {data: 'ranking'},
                {data: 'supplier_name'},
                {data: 'score'},
                {data: function (obj) {
                    return '<a title="编辑" class="ml-5 btn-detail" style="color:blue" data-id="' + obj.id + '">考核明细</a>';
                },
                    width: 80,
                    sClass: "text-c"}

            ],
            "paging": false,
            "stateSaveParams": function () {
                // 初始化完成调用事件
                // 重新渲染form checkbox
                form.render('checkbox');
            },
            "preDrawCallback": function( settings ) {
                var flag = true;
                $.ajax({
                    type: "POST",
                    url: base + "/api/oms/csSupplierAssessmentAnalyze/findEffectiveRules",
                    data: {},
                    dataType: "json",
                    timeout: 10000,
                    async: false,
                    beforeSend: function () {
                        index = layer.load("加载中...");
                    },
                    success: function (data) {
                        if (index) {
                            layer.close(index);
                        }
                        if (data.success) {
                            rule_id = data.data;
                        } else {
                            layer.msg("没有生效的考核规则");
                            flag = false;
                        }
                    }
                });
                if(!flag){
                    return false;
                }
            },
            "initComplete": function(settings, json) {
                json.data;
            }
        }).on('click', '.btn-detail', function () {
            var id = $(this).attr('data-id');
            openAnalyzeDetail("考核分析明细", id);
        });
    }



    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    // 查询
    $("#btn-query").on('click', function () {
        var create_time_from = $("#create_time_from").val();
        var create_time_to = $("#create_time_to").val();
        if(!create_time_from||!create_time_to){
            xmtc.failMsg("请输入开始时间和结束时间");
            return false;
        }
        from = create_time_from;
        to = create_time_to;
        query_type = "count";
        if(historyTable){
            historyTable.ajax.reload();
        }else{
            initHisTable();
        }
    });

    // 日期范围选择
    $(".month-range").on('click', function () {
    	from = $(this).attr('data-from');
    	to = $(this).attr('data-to');

    	// 如果当月则计算，其他月份则查询
    	if($(this).index()==0){
            query_type = "count";
        }else{
            query_type = "query";
        }

    	// 控制选中
    	$(this).toggleClass("active").siblings().removeClass("active");
    	table.ajax.reload();
    });

    // 打开规则维护界面
    function openAnalyzeDetail(title, id) {
        var url = "csSupplierAssessmentAnalyzeDetail.jsp";
        if (id) {
            url = url + "?id=" + id;
        }
        layer_show(title, url, $(window).width(), $(window).height());
    }

    // 切换报表
    form.on('switch(switchEcharts)', function(data) {
        if(!this.checked){
            // 切换到多选模式
            option.legend.selectedMode = 'multiple';
            var detailNames = option.legend.data;
            var selectedAll = {};
            for(var i=0;i<detailNames.length;i++){
                selectedAll[detailNames[i]] = true;
            }
            option.legend.selected = selectedAll;
            myChart.setOption(option);
        }else{
            // 切换到单选模式
            option.legend.selectedMode = 'single';
            myChart.setOption(option);
        }
    });

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var option = {};

    function initChart(results){
        var ids = [];
        var carrier = [];
        for(var i = 0; i<results.length;i++){
            ids.push(results[i].id);
            carrier.push(results[i].supplier_name);
        }
        // 查询子表数据
        xmtc.ajaxPost(base + "/api/oms/csSupplierAssessmentAnalyze/findResultDetailForChart", {result_id: ids.join(","),carrier_name:carrier.join(",")}, function (data) {
            if (data.success) {
                var detailInfo = data.data;
                var detailNames = detailInfo.detailNames;
                var carriers = detailInfo.carriers;
                var detailScores = detailInfo.detailScores;
                var series = [];
                for(var i = 0;i<detailScores.length;i++){
                    var a_series = {
                        name: detailNames[i],
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: detailScores[i]
                    };
                    series.push(a_series);
                }
                option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: detailNames,
                        selectedMode:'single',
                        selected : {}
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        data: carriers
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        });

    }

    exports('csSupplierAssessmentAnalyzeList', {});
});
