/**
 * 费用名称维护
 *
 * @author Adolph Zheng
 */
var id = xmtc.getUrlVars("id");
var service_area_code = xmtc.getUrlVars("service_area_code");
function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
	obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}
xmtc.getDictMap('yes_no');
layui.define(['layer', 'form', 'laydate'], function (exports) {
	var $ = layui.jquery, layer = layui.layer, form = layui.form(), layedit = layui.layedit, laydate = layui.laydate;
	//选择地址
    $(".sns-addrselector").addrDropMenu({
    	"level" : 3,
    	"hotCity" : false
    });
   

    function setAddressToForm (warehouse) {
        // 设置发货地址行政区划
        var address = {};
    	if (warehouse) {
    		// 入参存在，设置行政区划
    		address['provinceCode'] = warehouse.province_code;
	        address['provinceName'] = warehouse.province_name;
	        address['cityCode'] = warehouse.city_code;
	        address['cityName'] = warehouse.city_name;
	        address['countyCode'] = warehouse.county_code;
	        address['countyName'] = warehouse.county_name;
    	} else {
    		// 入参不存在，清空行政区划
    		address['provinceCode'] = null;
    		address['provinceName'] = null;
    		address['cityCode'] = null;
    		address['cityName'] = null;
    		address['countyCode'] = null;
    		address['countyName'] = null;
    	}
		xmtc.setAddressSelectorValue('address_select', address);
    }
    getWarehouseById();

    // 获取费用名称
    function getWarehouseById() {
       xmtc.ajaxPost(base + "/serviceAreaBlock/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
                $('#id').val(id);
                changeaddressDetail(json.data.block_type);
                setAddressToForm(json.data);
            } else {
                $('#warehouse_code').removeAttr('disabled');
            }
           
            $('#service_area_code').val(service_area_code);
            form.render('select');
        });
    }

    //关闭窗口
    $('#btn-close').on('click',function(){
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        xmtc.ajaxPost(base + "/serviceAreaBlock/saveOrUpdate", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('保存成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('#btn-sub-block-refresh').click();
                parent.layer.close(index);
            } else {
                layer.msg(json.msg);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    /**
     * 委托客户弹出框
     */
    $("#customer_name").on('click', function () {
    	var url = base + "/view/oms/cust/csCustomerAndContactPopWin.jsp";
    	top.xmtc.popUp(url, "客户", 600, 432, "code", "name", function(data) {
    		$("#customer_code").val(data["customer_code"]);
		    $("#customer_name").val(data["customer_name"]);
            $("#address").val(data["address"]);

            setAddressToForm(data);
    	});
    });
    
    /**
     * 类型选中事件
     */
    form.on('select(onchange)', function(data){
    	changeaddressDetail(data.value);
		  
	}); 
    /**
     * 改变地址及客户维护项
     */
    var changeaddressDetail = function(status){
    	if(status == '01'){ //省
			  $(".sns-addrselector").addrDropMenu({
			    	"level" : 1,
			    	"hotCity" : false
			    });
			  $('.addressDetail').hide();
			  $('#addressLable').html('省');
		  }else if(status == '02'){//市
			  $(".sns-addrselector").addrDropMenu({
			    	"level" : 2,
			    	"hotCity" : false
			    });
			  $('.addressDetail').hide();
             $('#addressLable').html('市');
		  }else if(status == '03'){ //区县
			  $(".sns-addrselector").addrDropMenu({
			    	"level" : 3,
			    	"hotCity" : false
			    });
			  $('.addressDetail').hide();
              $('#addressLable').html('区/县');
		  }else if(status == '04'){//地点
			  $(".sns-addrselector").addrDropMenu({
			    	"level" : 3,
			    	"hotCity" : false
			    });
			  $('.addressDetail').show();
              $('#addressLable').html('地址');
		  }
    };
    exports('csServiceAreaBlockForm', {});
});