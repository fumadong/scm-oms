/**
 * 派车单-费用维护弹窗
 *
 * @author Bill
 */
// 费用id
var getUrlVars=function(name,flag){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
};
var id = xmtc.getUrlVars("id");
var dispatch_no = xmtc.getUrlVars("dispatch_no");// 系统派车单号
var pay_or_receive = xmtc.getUrlVars("pay_or_receive");
var carrier_code = getUrlVars("carrier_code");
var carrier_name = getUrlVars("carrier_name");
var customer_code = getUrlVars("customer_code");
var customer_name = getUrlVars("customer_name");
layui.define(['layer', 'form', 'laydate','element'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
    
    /**
     * 判断字符串是否为空
     * @param obj
     * @returns
     */
    function isNotEmpty(obj){
    	if(obj !== null && obj !==undefined && obj.trim() !== ""){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    /**
     * 获取字段值--为空时指定默认值
     * @param obj
     * @returns
     */
    function getDefaultValue(obj,defaultValue){
    	if(obj !== null && obj !==undefined && obj.trim() !== ""){
    		return obj;
    	}else{
    		return defaultValue;
    	}
    }
    
    // 查询订单商品信息
    getDispatchFeeById();
    
    /**
     * 通过派车单费用id获取费用信息
     */
    function getDispatchFeeById() {
    	if (!id) {
    		//设置默认值
    		$('#currency_edit').val("01");
    	    
    		return;
    	}
    	// 商品id存在，则为编辑，查询商品
    	xmtc.ajaxPost(base + "/dispatch/csDispatchOrderFee/getFeeById", {id:id}, function(json) {
			if (json.data) {
				$.each(json.data, function(key, value) {
					if ($('#' + key)) {
						$('#' + key+"_edit").val(xmtc.nullToSpace(value));
					}
				});
				
				form.render('select');
				
				//费用为确认状态时,将按钮隐藏
				if(json.data.fee_status === "01"){
					$("#btn-fee-save").hide();
					$("#btn-fee-reset").hide();
				}else{
					$("#btn-fee-save").show();
					$("#btn-fee-reset").show();
				}
			}
		});
	}
    
    /**
     * 保存派车单费用
     */
    form.on('submit(form-save)', function(data) {
    	var param = data.field;
    	param.dispatch_no = dispatch_no;
    	if (id) {
    		param.id=id;
    	}else{
    		param.id=null;
    		param.fee_status="00";
    		param.fee_source="10";
    		param.unique_no="";
    	}
    	
    	if(param.fueling_up){
			if(param.remark.indexOf(" 加油")!=-1){
				var remark = param.remark.split(" 加油");
				var fueling_up = remark[remark.length-1].substr(0,remark[1].indexOf('升'));
				if(fueling_up!=param.fueling_up){
					param.remark = param.remark +" 加油"+ param.fueling_up +"升";
				}					
			}else{
				param.remark = param.remark +" 加油"+ param.fueling_up +"升";
			}
		}  	
    	xmtc.ajaxPost( base + "/dispatch/csDispatchOrderFee/save", param, function(json) {
			if (json.success) {
				var index = parent.layer.getFrameIndex(window.name);
				xmtc.parentSuccessMsg('操作成功');
				parent.$('#sub-pay-fee').click();
				parent.$('#btn-form-refresh').click();
				parent.layer.close(index);
			} else {
				xmtc.failMsg(json.msg);
			}
		});
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    //=====================================界面弹出框配置Start=====================================
    /**
     * 费用名称弹出框 
     */
    $("#fee_name_edit").on('click', function () {
    	var url = base + "/view/oms/fee/csFeeNameWin.jsp?pay_or_receive="+pay_or_receive;
    	top.xmtc.popUp( url, "费用名称", 600, 432, "fee_name_code", "fee_name", function(res) {
    		$("#fee_code_edit").val(res["fee_name_code"]);  
		    $("#fee_name_edit").val(res["fee_name"]);
		    if(isNotEmpty(res["fee_type"])){
		    	xmtc.selectValue('fee_type_edit', res["fee_type"]);
		    }else{
		    	xmtc.selectValue('fee_type_edit', " ");
		    }
		    
			form.render('select');
    	});
    });
    
    /**
     * 结算方式变更
     */
    form.on('select(pay_account_type)',function () {
    	//清空结算对象
    	$("#balance_code_edit").val("");  
	    $("#balance_name_edit").val("");
    });
    
    /**
     * 单价变更
     */
    $("#unit_price_edit").on('change',function () {
    	//计算总费用
    	$("#total_amount_edit").val(Number(getDefaultValue($("#unit_price_edit").val(),0))*Number(getDefaultValue($("#count_edit").val(),0)));  
    });
    
    /**
     * 数量变更
     */
    $("#count_edit").on('change',function () {
    	//计算总费用
    	$("#total_amount_edit").val(Number(getDefaultValue($("#unit_price_edit").val(),0))*Number(getDefaultValue($("#count_edit").val(),0)));  
    });
    
    /**
     * 结算对象弹出框 
     */
    $("#balance_name_edit").on('click', function () {
    	//承运商
		top.xmtc.popUp(base+"/view/oms/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		$("#balance_code_edit").val(res["unit"]);  
		    $("#balance_name_edit").val(res["unit_name"]);
    	});
    });
    
    /**
     * 关闭-按钮
     */
    $('#btn-close').on('click',function(){
    	var index = parent.layer.getFrameIndex(window.name);
    	parent.layer.close(index);
    });
    
    //=====================================界面弹出框配置End=====================================
    
    exports('csDispatchFeeForm', {});
});