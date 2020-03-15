<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>客户管理</title>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>    
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
        	<input type="hidden" id="id" name="id"/>
       	<input type="hidden" id="rule_alloc_header_id" name="rule_alloc_header_id"/>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>行号</label>
                        <div class="layui-input-inline">
                            <input type="text" id="line_no" name="line_no" lay-verify="required" maxLength="32" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>包装单位</label>
                        <div class="layui-input-inline">
                            <input type="text" id="package_uom_code" name="package_uom_code" lay-verify="required" maxLength="64" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">库位使用类型</label>
                        <div class="layui-input-inline">
                            <!-- <input type="checkbox" id="is_default" name="is_default" autocomplete="off"> -->
                             <fm:select id="loc_use_type" name="loc_use_type" dictType="loc_use_type" itemValue="value" itemLabel="label"/>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">清仓优先级</label>
                        <div class="layui-input-inline">
                            <!-- <input type="checkbox" id="is_default" name="is_default" autocomplete="off"> -->
                            <fm:select id="is_clear_first" name="is_clear_first" dictType="is_clear_first" itemValue="value" itemLabel="label"/>
                        </div>
                    </div>

                </div>
            <div class="foot">
                <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add">保存</button>
                <button  class="layui-btn layui-btn-small layui-btn-primary" type="button" onclick="layer_close()">关闭</button>
            </div>
        </form>
    </div>
    <script type="text/javascript">
    	$("select[name='dateTable_length']").attr("lay-ignore","");
        layui.config({base: '${base}/view/oms/rule/'}).use(['csRuleAllocHeaderEdit']);
    </script>
</body>
</html>
