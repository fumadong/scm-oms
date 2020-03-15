<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/common/meta.jsp" %>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
<title>服务范围管理维护</title>
</head>
<body>
<div class="container foot-mb">
    <div class="layui-collapse" lay-filter="collapse">
        <form class="layui-form" action="" id="form-add">
            <div class="layui-colla-item">
                <h2 class="layui-colla-title">基本信息</h2>
                <div class="layui-colla-content layui-show">
                    <div class="layui-form-item">
                        <input type="hidden" id="id" name="id"/>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>服务范围代码</label>
                            <div class="layui-input-inline">
                                <input type="text" id="service_area_code" name="service_area_code" lay-verify="required"
                                       autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>服务范围名称</label>
                            <div class="layui-input-inline">
                                <input type="text" id="service_area_name" name="service_area_name" lay-verify="required"
                                       autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">状态</label>
                            <div class="layui-input-inline">
                                <layui:dictSelect id="status" type="select" field="status" cfgKey="property_status"
                                                  disable="disabled"/>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-inline">
                                    <textarea type="text" id="remark_edit" name="remark" autocomplete="off"
                                              class="layui-input" style="width: 444px;height: 50px;"
                                              maxLength="256"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="foot">
                        <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                        <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
                    </div>
                </div>
            </div>
        </form>
        <div class="layui-colla-item">
            <div class="layui-tab layui-tab-card" lay-filter="sub-tab">
                <ul id="sub-tabs" class="layui-tab-title">
                    <li id="sub-cargo" class="layui-this">区域</li>
                    <li id="sub-distribution">地图范围</li>
                </ul>
                <div class="layui-tab-content">
                    <!-- 子表信息 - 商品信息 -->
                    <div class="layui-tab-item layui-show">
                        <div class="layui-colla-content layui-show">
                            <div class="btn-group" id="block-toolbar" style="display: none;">
                                <a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-block-add"><i
                                        class="layui-icon">&#xe654;</i>新增</a>
                                <a href="javascript:;" class="layui-btn layui-btn-small" id="btn-sub-block-delete"><i
                                        class="layui-icon">&#xe640;</i>删除</a>
                                <button class="layui-btn layui-btn-small" style="display:none;" id="btn-sub-block-refresh">刷新</button>
                            </div>
                            <div class="layui-form">
                                <table id="blockTable" class="layui-table" lay-even="" width="100%" lay-skin="line">
                                    <thead>
                                    <tr>
                                        <th width="10"><input type="checkbox" name="" lay-skin="primary"
                                                              lay-filter="allChoose"></th>
                                        <th>类型</th>
                                        <th>省/市/区/县</th>
                                        <th>地点</th>
                                        <th>客户</th>
                                        <th>备注</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- 地图 -->
                    <div class="layui-tab-item">
                        <div class="layui-colla-content layui-show">
                            <div class="btn-group" id="map_button">
                                <a href="javascript:;" class="layui-btn layui-btn-small"
                                   id="btn-sub-generating-service-scope"><i class="layui-icon">&#xe654;</i>生成服务范围</a>
                                <a href="javascript:;" class="layui-btn layui-btn-small"
                                   id="btn-sub-generating-limit-range"><i class="layui-icon">&#xe61f;</i>生成限制范围</a>
                                <%--<a href="javascript:;" class="layui-btn layui-btn-small"
                                   id="btn-sub-generating-show"><i class="layui-icon">&#xe640;</i>显示范围</a>--%>
                                <a href="javascript:;" class="layui-btn layui-btn-small"
                                   id="btn-sub-generating-clean"><i class="layui-icon">&#xe640;</i>清空范围</a>

                            </div>
                            <div class="layui-form">
                                <div class="layui-inline" style="float: right; margin-top: -40px;">
                                    <div class="layui-input-inline">
                                        <input type="text" id="mapAddress" name="mapAddress" autocomplete="off" style="width: 444px;height: 25px;"
                                               autocomplete="off" class="layui-input">
                                    </div>
                                    <button class="layui-btn layui-btn-small" id="mapQuery">查询</button>
                                </div>
                                <div style="border: #ccc solid 1px; height: 300px;" id="mapContent"></div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    layui.config({base: '${base}/view/oms/cust/'}).use('csServiceAreaForm');
</script>
</body>
</html>
