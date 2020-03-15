/**
 * 客户投诉管理
 *
 * @author Bill Lin
 */
var id = xmtc.getUrlVars("id");
var sourceType = xmtc.getUrlVars("sourceType");//来源类型值说明:  1,为普通维护; 2,为投诉处理
layui.define(['layer', 'form', 'laydate','element'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate,element = layui.element();
    
    /**
     * 获取客户投诉信息明细
     * @returns
     */
    function getCustomerComplaintsById() {
        xmtc.ajaxPost(base + "/cust/csCustomerComplaints/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key+'_edit')) {
                        $('#' + key+'_edit').val(xmtc.nullToSpace(value));
                    }
                });
                
                //设置界面类型显示是否可编辑
                setView();
            }else{
            	//设置默认值
            	$('#complaints_status_edit').val("10");
            }
            form.render('select');
            form.render('checkbox');
        });
    }
    
    /**
     * 加载客户信息
     */ 
    getCustomerComplaintsById();
    
    /**
     * 根据来源类型,设置界面是否可编辑栏位
     * @returns
     */
    function setView() {
    	//设置所有字段都不可编辑
    	$('#complaints_no_edit').attr("disabled","disabled");
    	$('#bill_type_edit').attr("disabled","disabled");
    	$('#bill_no_edit').attr("disabled","disabled");
    	$('#complaints_status_edit').attr("disabled","disabled");
    	$('#complaints_type_edit').attr("disabled","disabled");
    	$('#complainant_edit').attr("disabled","disabled");
    	$('#occurrence_time_edit').attr("disabled","disabled");
    	$('#complete_time_edit').attr("disabled","disabled");
    	$('#carrier_name_edit').attr("disabled","disabled");
    	$('#drive_name_edit').attr("disabled","disabled");
    	$('#vehicle_no_edit').attr("disabled","disabled");
    	$('#complaints_content_edit').attr("disabled","disabled");
    	$('#handle_opinions_edit').attr("disabled","disabled");
    	$('#customer_feedback_edit').attr("disabled","disabled");
    	$('#preventive_measure_edit').attr("disabled","disabled");
    	$('#remark_edit').attr("disabled","disabled");
    	
    	if(sourceType === "2"){
    		//处理操作,只开启处理意见、客户反馈、预防措施字段
        	if($('#complaints_status_edit').val() === "20"){
        		//已处理
        		$('#btn-save').hide();
        	}else{
        		$('#handle_opinions_edit').attr("disabled",false);
            	$('#customer_feedback_edit').attr("disabled",false);
            	$('#preventive_measure_edit').attr("disabled",false);
            	$('#btn-save').html("处理");
        	}
    	}else{
    		//普通维护操作，关闭处理意见、客户反馈、预防措施等字段	
    		if($('#complaints_status_edit').val() === "20"){
    			//已处理
        		$('#btn-save').hide();
    		}else{
    			$('#bill_type_edit').removeAttr("disabled");
            	$('#bill_no_edit').attr("disabled",false);
            	$('#complaints_type_edit').removeAttr("disabled");
            	$('#complainant_edit').attr("disabled",false);
            	$('#occurrence_time_edit').attr("disabled",false);
            	$('#carrier_name_edit').attr("disabled",false);
            	$('#drive_name_edit').attr("disabled",false);
            	$('#vehicle_no_edit').attr("disabled",false);
            	$('#complaints_content_edit').attr("disabled",false);
            	$('#remark_edit').attr("disabled",false);
            	$('#btn-save').html("保存");
    		}
        	
    	}
    	
    	form.render('select');
        form.render('checkbox');
    }
    
    /**
     *	保存
     */
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
        	 param.id = id;
             if(sourceType === "2"){  
             	param.complete_time = new Date().format("yyyy-MM-dd hh:mm:ss");
             	param.complaints_status = "20";
             }
        }
        xmtc.ajaxPost(base + "/cust/csCustomerComplaints/submit", param, function (json) {
            if (json.success) {
            	parent.layer.msg("操作成功");
                var index = parent.layer.getFrameIndex(window.name);
                parent.table.ajax.reload();
                parent.layer.close(index);
            } else {
            	parent.layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    //=====================================界面弹出框配置Start=====================================
    /**
     * 承运商弹出框
     */
    $("#carrier_name_edit").on('click', function () {
    	var oldCarrierCode = $("#carrier_code_edit").val();
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(base+"/admin/cust/supplierWin.jsp","承运商",600,432,"unit", "unit_name",function(res){
    		var carrierCode = res["unit"];
    		$("#carrier_code_edit").val(carrierCode);  
		    $("#carrier_name_edit").val(res["unit_name"]);
		    
		    //清空车牌号
		    $("#vehicle_no_edit").val("");
		    // 重新渲染下拉框
			form.render('select');
    	});
    });
    
    /**
     * 主驾弹出框
     */
    $("#drive_name_edit").on('click', function () {
    	// 取得承运商名称
    	var url = base + "/admin/cust/csTransportPersonnelWin.jsp";
    	var carrier_name = $('#carrier_name_edit').val();
    	if (carrier_name) {
            url += "?carrier_name=" + carrier_name;
        }
    	
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(url,"主驾",600,432,"personnel_number","personnel_name",function(res){
    		$("#drive_code_edit").val(res["personnel_number"]);  
		    $("#drive_name_edit").val(res["personnel_name"]);
    	});
    });
    
    /**
     * 车牌号弹出框
     */
    $("#vehicle_no_edit").on('click', function () {
    	// 取得承运商代码
    	var url = base + "/admin/vehicle/vehicleWin.jsp";
    	var carrier_code = $('#carrier_code_edit').val();
    	if (carrier_code) {
            url += "?carrier_code=" + carrier_code;
        }
    	
    	//url,title,width,hight,id,name,callback
    	top.xmtc.popUp(url,"车牌号",600,432,"vehicle_number","vehicle_number_name",function(res){
		    $("#vehicle_no_edit").val(res["vehicle_number"]);
		    $("#carrier_code_edit").val(res["supplier_code"]);  
		    $("#carrier_name_edit").val(res["supplier_name"]);
		    // 重新渲染下拉框
			form.render('select');
    	});
    });
  //=====================================界面弹出框配置End=====================================

    exports('csCustomerComplaintsForm', {});
});
