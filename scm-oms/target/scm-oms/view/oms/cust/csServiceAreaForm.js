/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
xmtc.getDictMap('yes_no');
layui.define(['layer', 'form', 'laydate', 'element', 'LoadScript'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate,
        element = layui.element();
    var blockTable;
    getWarehouseById();

    // 获取费用名称
    function getWarehouseById() {
        xmtc.ajaxPost(base + "/serviceArea/getById", {id: id}, function (json) {
            if (json.data) {
                setButtonStatus(false);
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
                blockTable = $('#blockTable').DataTable({
                    //      "dom": '<"top">rt<"bottom"flp><"clear">',
                    "autoWidth": true,                      // 自适应宽度
                    "stateSave": true,                      // 刷新后保存页数
                    "ordering": false,
                    "searching": false,                     // 本地搜索
                    "info": true,                           // 控制是否显示表格左下角的信息
                    "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                    "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                    "language": {                           // 国际化
                        "url": base + '/static/frame/jquery/language.json'
                    },
                    serverSide: true,                        //开启服务器模式
                    ajax: {
                        url: base + "/serviceAreaBlock/page",
                        data: function (data) {
                            data.service_area_code = $("#service_area_code").val();
                        }
                    },
                    "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
                    "sServerMethod": "POST",               // POST
                    "columns": [                            // 自定义数据列
                        {
                            data: function (obj) {
                                return '<input type="checkbox" lay-skin="primary" lay-filter="oneChoose" data-id="' + obj.id + '" data-status="' + obj.status + '"/>';
                            }
                        },
                        {data: 'block_type'},
                        {
                            data: // 省市区县
                                function (obj) {
                                    var orderHtml = '';
                                    if (obj.province_name) {
                                        orderHtml += obj.province_name;
                                    }
                                    if (obj.city_name) {
                                        orderHtml += obj.city_name;
                                    }
                                    if (obj.county_name) {
                                        orderHtml += obj.county_name;
                                    }
                                    return orderHtml;
                                }
                        },
                        {data: 'address'},
                        {data: 'customer_name'},
                        {data: 'remark'},
                        {
                            data: function (obj) {
                                return '<a title="编辑" class="ml-5 btn-edit" data-id="' + obj.id + '"><i class="layui-icon">&#xe642;</i></a>';
                            }, sClass: 'text-c'
                        }

                    ],
                    "stateSaveParams": function () {           // 初始化完成调用事件
                        $("select[name='dateTable_length']").attr("lay-ignore", "");
                        // 重新渲染form checkbox
                        form.render('checkbox');
                        form.render('select');
                    }
                }).on('click', '.btn-delete', function () {
                    var id = $(this).attr('data-id');
                    layer.confirm('确认要删除吗，删除后数据不可恢复？', function (index) {
                        xmtc.ajaxPost(base + "/cust/csCustomerContact/delete", {id: id}, function (data) {
                            if (data.success) {
                                table.ajax.reload();
                                layer.msg('操作成功');
                            } else {
                                layer.msg('删除失败');
                            }
                        });
                    });
                }).on('click', '.btn-edit', function () {
                    var id = $(this).attr('data-id');
                    gotoBlockForm("编辑区域", id);
                }).on("dblclick", "tr", function () {//给tr或者td添加click事件
                    var data = blockTable.row(this).data();//获取值的对象数据
                    gotoBlockForm("编辑区域", data.id);
                });
                $('#id').val(id);
            } else {
                setButtonStatus(true);
                $('#service_area_code').removeAttr('disabled');
            }
            //列表
            form.render('select');
        });
    }



    //关闭窗口
    $('#btn-close').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        xmtc.ajaxPost(base + "/serviceArea/saveOrUpdate", param, function (json) {
            if (json.success) {
                xmtc.parentSuccessMsg('操作成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-query').click();
                parent.layer.close(index);
            } else {
                layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    function setButtonStatus(status) {
        $("#block-toolbar").show();
        $("#map_button").show();
        if (status) {
            $("#block-toolbar").hide();
            $("#map_button").hide();
        }
    }

    /**
     * 添加服务范围区域
     */
    $('#btn-sub-block-add').on('click', function () {
        gotoBlockForm('服务范围区域维护', null);
    });
    /**
     * 刷新列表
     */
    $('#btn-sub-block-refresh').on('click', function () {
        blockTable.ajax.reload();
    })

    // 服务范围区域维护界面
    function gotoBlockForm(title, id) {
        var url = "csServiceAreaBlockForm.jsp?service_area_code=" + $("#service_area_code").val();
        if (id) {
            url += "&id=" + id;
        }
        layer_show(title, url, 600, 280);
    }


    /**
     * 地图初始化
     */
    var map = null;
    var local = null;
    var mainZoom = null;
    var mainCenter = null;

    var areaPoint = [];
    var areaLimitPoint = [];
    var tempPoint = [];

    var mapEdit = false;
    var allPoints = [];
    var areaCollect = [];
    var locationOverlays = [];
    var editOverlays = [];


    var isEmpty = function (object) {
        return (object === null || object === undefined || object === '');
    };

    var setMapEdit = function (isEdit) {
        mapEdit = isEdit;
    };

    var getArea = function (id) {
        for (var i = 0; i < areaCollect.length; i++) {
            if (areaCollect[i].id === id) {
                return areaCollect[i];
            }
        }
        return null;
    };

    var pushArea = function (areaInfo) {
        areaCollect.push(areaInfo);
    };

// 从地图中移除指定下标的服务区域
    var removeOverlay = function (index) {
        var areaInfo = areaCollect[index];
        if (!isEmpty(areaInfo.polygons)) {
            for (var i = 0; i < areaInfo.polygons.length; i++) {
                map.removeOverlay(areaInfo.polygons[i]);
            }
        }

    };

    var removeArea = function () {
        for (var i = 0; i < areaCollect.length; i++) {
            // 从地图中移除
            removeOverlay(i);
            // 从点集合中移除
            areaCollect.splice(i, 1);
        }
    };

// 地址查询
    var addressSearch = function () {
        var address = $('#mapAddress').val();
        local.search(address);
    };

// 回车事件
    var autoConfirmEvent = function () {
        addressSearch();
    };

    // 绑定按钮事件
     var bindButtonEvent = function() {
         $("#mapQuery").on("click", function() {
             addressSearch();
         });
     }
// 建立一个自动完成的对象
    var autoHighlightEvent = function (e) {
        var tempValue = e.fromitem.value;
        var value = '';
        if (e.fromitem.index > -1) {
            value = tempValue.business;
        }

        if (e.toitem.index > -1) {
            tempValue = e.toitem.value;
            value = tempValue.business;
        }
        $('#mapAddress').val(value);
    };

    var clearTempOverlays = function () {
        if (map !== null) {
            for (var i = 0; i < editOverlays.length; i++) {
                map.removeOverlay(editOverlays[i]);
            }
        }
    };

//清除临时点数据
    var clearTempPoints = function () {
        tempPoint = [];
    };

// 点击地图事件
    var clickMapEvent = function (event) {
        if (mapEdit) {
            map.getOverlays();
            var location = event.point;
            var marker = new BMap.Marker(location);
            map.addOverlay(marker);
            editOverlays.push(marker);
            tempPoint.push(location);

            if (tempPoint.length === 2) {
                var polyline = new BMap.Polyline(tempPoint, {
                    strokeColor: "purple",
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                });
                map.addOverlay(polyline);
                editOverlays.push(polyline);
            } else if (tempPoint.length > 2) {
                var polygon = new BMap.Polygon(tempPoint, {
                    strokeColor: "purple",
                    fillColor: "purple",
                    strokeWeight: 2,
                    fillOpacity: 0.3,
                    strokeOpacity: 0.5,
                    strokeStyle: 'solid'
                });
                clearTempOverlays();
                map.addOverlay(polygon);
                editOverlays.push(polygon);
            }

        }
    };

    // 定义需要动态引入的js文件列表
    var scriptArr = ['http://api.map.baidu.com/getscript?v=1.4&ak=826e806b86676d155282de3d37188137&services=&t=20170220193356', 'http://api.map.baidu.com/library/MarkerTool/1.2/src/MarkerTool_min.js', 'http://api.map.baidu.com/library/CityList/1.4/src/CityList_min.js'];
    // 从索引i=0的文件开始引入，i++直到最后一个引入完成后回调callback
    layui.LoadScript(scriptArr, 0, function () {
        initMap();
    });
    var initMap = function () {
        if (map != null) {
            return;
        }
        mapEdit = true;
        map = new BMap.Map("mapContent");
        map.centerAndZoom("中国", 5);
        map.enableScrollWheelZoom();
        map.addEventListener("click", clickMapEvent);

        local = new BMap.LocalSearch(map, {
            renderOptions: {
                map: map
            }
        });

        var autocompleteOptions = {};
        autocompleteOptions.input = 'mapAddress';
        autocompleteOptions.location = map;
        var autoComplete = new BMap.Autocomplete(autocompleteOptions);
        autoComplete.addEventListener('onhighlight', autoHighlightEvent);
        autoComplete.addEventListener('onconfirm', autoConfirmEvent);
        areaPoint = [];
        areaLimitPoint = [];
        tempPoint = [];
        areaCollect = [];

        bindButtonEvent();
    };
// 设置中心位置
    var setCenterAndZoom = function (rows) {
        if (rows && rows.length > 0) {
            if (rows.length === 1) {
                mainZoom = 12;
                map.setZoom(mainZoom);
            }
            var points = [];
            for (var i = 0; i < rows.length; i++) {
                var point = new BMap.Point(rows[i].lng, rows[i].lat);
                points.push(point);
            }
            map.setViewport(points);
        } else {
            map.setCenter(mainCenter);
            map.setZoom(mainZoom);
        }
    };
    //清除地图元素
    var clearMap = function () {
        if (map !== null) {
            map.clearOverlays();
            areaPoint = [];
            areaLimitPoint = [];
            tempPoint = [];
            areaCollect = [];
            allPoints = [];
        }
    };

    // 转化数据
    var convertPoints = function (value) {
        var ebsaLatlngs = [];
        if (value) {
            ebsaLatlngs = value.split("|");
        }
        var points = [];
        for (var i = 0; i < ebsaLatlngs.length; i++) {
            var ebsaLatlng = ebsaLatlngs[i].split(",");
            if (ebsaLatlng.length > 1) {
                var point = new BMap.Point(ebsaLatlng[1], ebsaLatlng[0]);
                points.push(point);
            }
        }
        return points;
    };
// 转化数据
    var buildPoints = function (points) {
        var ebsaLatlngs = [];
        for (var i = 0; i < points.length; i++) {
            ebsaLatlngs.push(points[i].lat + "," + points[i].lng);
        }
        return ebsaLatlngs.join("|");
    };

    var setCenter = function (points) {
        if (map) {
            var viewport = allPoints.concat(points);
            map.setViewport(viewport);
        }
    };

    //画图
    var drawingArea = function (id, points, isLimit) {
        if (map === null) {
            return;
        }
        setCenter(points);

        var color = "green";
        if (isLimit) {
            color = "red";
        }
        var styleOptions = {
            strokeColor: color, // 边线颜色。
            fillColor: color, // 填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 2, // 边线的宽度，以像素为单位。
            strokeOpacity: 0.5, // 边线透明度，取值范围0 - 1。
            fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' // 边线的样式，solid或dashed。
        };

        var polygons = [];
        if (points.length > 0) {
            var polygon = new BMap.Polygon(points, styleOptions);
            // 显示多边形
            map.addOverlay(polygon);
            polygons.push(polygon);
        }

        var label = new BMap.Label("测试", {
            offset: new BMap.Size(1, -1),
            position: new BMap.Point(123, 33)
        });
        map.addOverlay(label);

        var areaInfo = getArea(id);
        if (areaInfo != null) {
            areaInfo.polygons = areaInfo.polygons.concat(polygons);
            areaInfo.polygons = areaInfo.polygons.concat(polygons);
        } else {
            areaInfo = {};
            areaInfo.id = id;
            areaInfo.polygons = polygons;
            pushArea(areaInfo);
        }

    };

//画服务范围
    var showEbsaArea = function (rowData) {
        // initMap();
        if (isEmpty(rowData.id) || isEmpty(rowData.map_area)) {
            return;
        }
        var locations = convertPoints(rowData.map_area);
        allPoints = allPoints.concat(locations);
        drawingArea(rowData.id, locations, false);
    };

//画限制服务范围
    var showEbsaLimitArea = function (rowData) {
        // initMap();
        if (isEmpty(rowData.id) || isEmpty(rowData.map_area)) {
            return;
        }

        var locations = convertPoints(rowData.map_area);
        allPoints = allPoints.concat(locations);
        return drawingArea(rowData.id, locations, true);

    };

    /**
     * 显示范围
     */
    var showArea = function () {
        initMap();
        xmtc.ajaxPost(base + "/serviceAreaMap/getByCode", {service_area_code: $('#service_area_code').val()}, function (json) {
            if (json.data) {
                setButtonStatus(false);
                $.each(json.data, function (key, value) {
                    if(value.map_type == '01'){
                        showEbsaArea(value);
                    }else{
                        showEbsaLimitArea(value);
                    }
                });
            } else {
                initMap();
            }
        });


    };

    var getAreaData = function () {
        if (tempPoint.length > 0 && mapEdit) {
            // 不再保存原点位 areaPoint = areaPoint.concat(tempPoint);
            return buildPoints(tempPoint);
        }
        return null;
    };

    var getLimitAreaData = function () {
        if (tempPoint.length > 0 && mapEdit) {
            return buildPoints(tempPoint);
        }
        return null;
    };

    var afterMapSave = function () {
        /*// 移除原范围
        removeArea();
        // 移除临时范围
        clearTempOverlays();*/
        clearMap();
        tempPoint = [];

        // 重新画现在的范围
        showArea();
    };

    //后台服务区域数据保存操作
    var saveLocation = function (isLimit) {
        var saveBean = {};
        saveBean.service_area_code = $('#service_area_code').val();
        if (tempPoint.length < 3) {
            layer.msg('小于三个点不能形成区域！');
            return;
        }
        if (isLimit) {
            // saveBean.ebsaLatlng = node.ebsaLatlng;
            saveBean.map_type = '01'; //服务范围
            saveBean.map_area = getLimitAreaData();
        } else {
            saveBean.map_type = '02'; //限制范围
            saveBean.map_area = getAreaData();
            // saveBean.ebsaLimitLatlng = node.ebsaLimitLatlng;
        }
        // 调用后端处理
        xmtc.ajaxPost(base + "/serviceAreaMap/saveOrUpdate", saveBean, function (json) {
            if (json.success) {
                // 提示成功信息
                layer.msg('操作成功');
                afterMapSave();
            } else {
                // 提示失败信息
                layer.msg(json.msg || '保存失败');
            }
        });
    };

    $('#btn-sub-generating-service-scope').on('click', function () {
        saveLocation(true);
    });
    $('#btn-sub-generating-limit-range').on('click', function () {
        saveLocation(false);
    });
    $('#btn-sub-generating-show').on('click', function () {
        clearMap();
        showArea();
    });
    //tab监听
    element.on('tab(sub-tab)', function(data){
        if(data.index == '1'){
            clearMap();
            showArea();
        }
    });

    $('#btn-sub-generating-clean').on('click', function () {
        //清空覆盖物
        clearMap();

        var saveBean = {};
        saveBean.service_area_code = $('#service_area_code').val();
        // 调用后端处理
        xmtc.ajaxPost(base + "/serviceAreaMap/deleteAllByCode", saveBean, function (json) {
            if (json.success) {
                // 提示成功信息
                layer.msg('操作成功');
                afterMapSave();
            } else {
                // 提示失败信息
                layer.msg(json.msg || '保存失败');
            }
        });
    });

    exports('csWarehouseForm', {});
});