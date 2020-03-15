<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>客户投诉管理</title>
        <%@ include file="/common/meta.jsp"%>
        <script src="${base}/static/frame/jquery-selector/area-data.js"></script>
        <script src="${base}/static/frame/jquery-selector/jquery.selector.js"></script>
    </head>
    <body>
        <div class="container foot-mb">
            <form class="layui-form" action="" id="form-add">
            	<div class="layui-form-item">
            		<div class="layui-inline">
                        <label class="layui-form-label">投诉编号</label>
                        <div class="layui-input-inline">
                            <input type="text" id="complaints_no_edit" name="complaints_no" autocomplete="off" class="layui-input" disabled>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">单据类型</label>
                        <div class="layui-input-inline">
                            <div class="layui-input-inline">
								<layui:dictSelect id="bill_type_edit" type="select" field="bill_type" cfgKey="bill_type"/>
							</div>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">单据号</label>
                        <div class="layui-input-inline">
                            <input type="text" id="bill_no_edit" name="bill_no" autocomplete="off" class="layui-input" maxLength="32">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="c-red">*</span>处理状态</label>
                        <div class="layui-input-inline">
                        	<layui:dictSelect id="complaints_status_edit" disable="disabled" type="select" field="complaints_status" cfgKey="complaints_status" layVerify="required" />
						</div>
                    </div>
            	</div>
            	<div class="layui-form-item">
            		<div class="layui-inline">
                        <label class="layui-form-label"><span class="c-red">*</span>投诉类型</label>
                        <div class="layui-input-inline">
							<layui:dictSelect id="complaints_type_edit" type="select" field="complaints_type" cfgKey="complaints_type" layVerify="required"/>
						</div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="c-red">*</span>投诉人</label>
                        <div class="layui-input-inline">
                            <input type="text" id="complainant_edit" name="complainant" autocomplete="off" class="layui-input"  lay_verify="required" maxLength="64">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="c-red">*</span>发生时间</label>
                        <div class="layui-input-inline">
							<input type="text" id="occurrence_time_edit" name="occurrence_time" autocomplete="off" class="layui-input laydate-icon"
									lay-verify="required" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
						</div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">完成时间</label>
                        <div class="layui-input-inline">
							<input type="text" id="complete_time_edit" name="complete_time" autocomplete="off" class="layui-input laydate-icon"
									disabled="disabled" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"/>
						</div>
                    </div>
            	</div>
            	<div class="layui-form-item">
            		<div class="layui-inline">
                        <label class="layui-form-label">承运商</label>
                        <div class="layui-input-inline">
							<input type="text" id="carrier_code_edit" name="carrier_code" autocomplete="off" class="layui-input layui-hide"> 
							<input type="text" id="carrier_name_edit" name="carrier_name" autocomplete="off" class="layui-input popup" readonly="readonly">
						</div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">司机</label>
                        <div class="layui-input-inline">
							<input type="text" id="drive_code_edit" name="drive_code" autocomplete="off" class="layui-input layui-hide"> 
							<input type="text" id="drive_name_edit" name="drive_name" autocomplete="off" class="layui-input popup" readonly="readonly">
						</div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">车牌号</label>
                        <div class="layui-input-inline">
							<input type="text" id="vehicle_no_edit" name="vehicle_no" autocomplete="off" class="layui-input popup" readonly="readonly">
						</div>
                    </div>
            	</div>
                <div class="layui-form-item">
					<div class="layui-inline"> 
			        	<label class="layui-form-label"><span class="c-red">*</span>投诉内容</label>
			        	<div class="layui-input-inline"> 
				            <textarea type="text" id="complaints_content_edit" name="complaints_content" maxLength="256"  lay_verify="required" class="layui-input" style="width: 992px;height: 50px;"></textarea>
					    </div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">处理意见</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="handle_opinions_edit" name="handle_opinions" autocomplete="off" class="layui-input" style="width: 992px;height: 50px;" maxLength="256"></textarea>
						</div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-inline"> 
			        	<label class="layui-form-label">客户反馈</label>
			        	<div class="layui-input-inline"> 
				            <textarea type="text" id="customer_feedback_edit" name="customer_feedback" maxLength="256" class="layui-input" style="width: 992px;height: 50px;"></textarea>
					    </div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">预防措施</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="preventive_measure_edit" name="preventive_measure" autocomplete="off" class="layui-input" style="width: 992px;height: 50px;" maxLength="256"></textarea>
						</div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">备注</label> 
						<div class="layui-input-inline">
							<textarea type="text" id="remark_edit" name="remark" autocomplete="off" class="layui-input" style="width: 992px;height: 50px;" maxLength="256"></textarea>
						</div>
					</div>
				</div>
                <div class="foot">
                    <button class="layui-btn layui-btn-small" lay-submit="" lay-filter="form-add" id = "btn-save">保存</button>
                    <button  class="layui-btn layui-btn-small layui-btn-primary" type="button" onclick="layer_close()">关闭</button>
                </div>
            </form>
        </div>
        <script type="text/javascript">
            $("select[name='dateTable_length']").attr("lay-ignore","");
            layui.config({base: '${base}/view/oms/cust/'}).use(['csCustomerComplaintsForm']);
        </script>
    </body>
</html>
