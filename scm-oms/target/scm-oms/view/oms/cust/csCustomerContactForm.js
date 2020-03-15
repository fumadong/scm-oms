/**
 * 客户联系人维护
 *
 * @author loemkie chen
 */
var id = xmtc.getUrlVars("id");
var customer_id = xmtc.getUrlVars("customer_id");

layui.define(['layer', 'form', 'laydate'], function (exports) {
    var $ = layui.jquery, layer = layui.layer, form = layui.form(), laydate = layui.laydate;
  //选择地址
    $(".sns-addrselector").addrDropMenu({
    	"level" : 3,
    	"hotCity" : false
    });
    form.verify({  
      tel: function(value, item){
      	if(value != ''){
      		if(!/(^(\d{3,4}-)?\d{7,8})$|^1\d{10}$/.test(value)){
	              return '请输入正确的电话号码,如 0592-1234567！';
	        }
      	}
      },
      mail: function(value, item){
        	if(value != ''){
  	            if(!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)){
  	              return '请输入正确的邮箱！';
  	            }
        	}
        },
      phone: function (value) {
		if (value != '') {
  			if(!/^\d{11}$/.test(value)) {
  				return '请输入正确的11位数字手机号码';
  			}
		}
      }
  });
    /**
     * 渲染数据到发货行政区划、收货行政区划
     * @param order
     */
    function setAddressToForm (customer) {
    	// 设置发货地址行政区划
		var address = {};
		address['provinceCode'] = customer.province_code;
		address['provinceName'] = customer.province_name;
		address['cityCode'] = customer.city_code;
		address['cityName'] = customer.city_name;
		address['countyCode'] = customer.county_code;
		address['countyName'] = customer.county_name;
		xmtc.setAddressSelectorValue('address_select', address);
    }
    getCustomerContactById();
    // 获取联系人
    function getCustomerContactById() {
        xmtc.ajaxPost(base + "/cust/csCustomerContact/getById", {id: id}, function (json) {
            if (json.data) {
                $.each(json.data, function (key, value) {
                    if ($('#' + key)) {
                        $('#' + key).val(xmtc.nullToSpace(value));
                    }
                });
            }
            $("#customer_id").val(customer_id);
            /*if(json.data["is_default"]==1){
//            	document.getElementById("is_default").checked=true;
            	//xmtc.setCheckBoxVal("is_default",true);
            }else{
//            	document.getElementById("is_default").checked=false;
            	//xmtc.setCheckBoxVal("is_default",false);
            }*/
            //处理渲染datagroid问题
            if(json.data){
            	setAddressToForm(json.data);
            	$("#contact_code").attr("readonly",true);
            	$("#contact_code").addClass("layui-input-disabled");
            }
            form.render('select');
            form.render('checkbox');
        });
    }

    // 提交
    form.on('submit(form-add)', function (data) {
        var param = data.field;
        if (id) {
            param.id = id;
        }
        //var is_default=$("#is_default").attr("checked");
        /*var is_default=document.getElementById("is_default").checked;
        if(is_default){
        	param["is_default"]="1";
        }else{
        	param["is_default"]="0";
        }*/
        xmtc.ajaxPost(base + "/cust/csCustomerContact/submit", param, function (json) {
            if (json.success) {
            	xmtc.parentSuccessMsg('操作成功');
                var index = parent.layer.getFrameIndex(window.name);
                parent.table.ajax.reload();
                parent.layer.close(index);
            } else {
            	console.log(json.msg);
            	if(json.msg=="1"){
            		layer.confirm('是否替换原默认联系人？', function (index) {
                        xmtc.ajaxPost(base + "/cust/csCustomerContact/submitIgnore", param, function (data) {
                        	console.log(data.success);
                            if (data.success) {
                            	xmtc.parentSuccessMsg('操作成功');
                            	parent.table.ajax.reload();
                            	layer_close();
                            } 
                        });
                    });
            		parent.table.ajax.reload();
                    parent.layer.close(index);
            	}else{
            	    xmtc.failMsg(json.msg);
            		// layer.msg(json.msg);
            	}
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    exports('csCustomerContactForm', {});
});
