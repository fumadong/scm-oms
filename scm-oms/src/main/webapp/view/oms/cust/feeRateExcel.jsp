<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/common/meta.jsp" %>
        <title>费率导入</title>
        <!-- 图片上传 -->
        <link rel="stylesheet" href="${base}/static/frame/webuploader/webuploader.css" type="text/css">
        <script type="text/javascript" src="${base}/static/frame/webuploader/webuploader.min.js"></script>
    </head>
    <body>
        <div class="container foot-mb">
            <form class="layui-form" action="" id="form-add">
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">导入文件</label>
                        <div class="layui-input-inline mr-10">
                            <input id="fileExt" type="hidden" class="layui-input" readonly>
                            <input id="fileName" class="layui-input" readonly>
                        </div>
                        <div id="filePicker">选择文件</div>
                    </div>
                </div>
                <div class="foot">
                    <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-upload">上传</button>
                    <button class="layui-btn layui-btn-small layui-btn-primary" id="btn-close">关闭</button>
                </div>
            </form>
        </div>
        <script type="text/javascript">
            layui.config({base: '${base}/view/oms/cust/'}).use('feeRateExcel');
        </script>
    </body>
</html>
