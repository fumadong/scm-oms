<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
    <title>运力承诺流向</title>
<script src="${base}/static/frame/jquery-selector/area-data.js"></script>
<script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>    
</head>
<body>
    <div class="container foot-mb">
        <form class="layui-form" action="" id="form-add">
        	<input type="hidden" id="id" name="id"/>
        	<input type="hidden" id="customer_id" name="customer_id"/>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>起运地</label>
                        <div class="layui-input-inline">
	                        <div class="sns-addrselector" id="origin_address_select">
								<input type="hidden" name="origin_province_code" />
								<input type="hidden" name="origin_province_name"  lay-verify="required"/>
								<input type="hidden" name="origin_city_code" />
								<input type="hidden" name="origin_city_name" />
								<input type="hidden" name="origin_county_code" />
								<input type="hidden" name="origin_county_name" />
	                        </div>
                        </div>
                    </div><br/>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span style="color: red;">*</span>目的地</label>
                        <div class="layui-input-inline">
	                        <div class="sns-addrselector" id="dest_address_select">
								<input type="hidden" name="dest_province_code" />
								<input type="hidden" name="dest_province_name"  lay-verify="required"/>
								<input type="hidden" name="dest_city_code" />
								<input type="hidden" name="dest_city_name" />
								<input type="hidden" name="dest_county_code" />
								<input type="hidden" name="dest_county_name" />
	                        </div>
                        </div>
                    </div><br/>
                    <div class="layui-inline">
                        <label class="layui-form-label">时效</label>
                        <div class="layui-input-inline">
                            <input type="text" id="transit_time" name="transit_time" autocomplete="off" class="layui-input" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">
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
        layui.config({base: '${base}/view/oms/supplier/'}).use(['csTransportCommitmentFlowWindow']);
    </script>
</body>
</html>
