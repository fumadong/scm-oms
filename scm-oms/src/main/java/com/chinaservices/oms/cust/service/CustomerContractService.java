package com.chinaservices.oms.cust.service;

import com.alibaba.fastjson.JSONObject;
import com.chinaservices.admin.model.CsAdministrativeRegion;
import com.chinaservices.oms.cust.model.CsCustomerContract;
import com.chinaservices.oms.cust.model.CsCustomerContractFee;
import com.chinaservices.oms.cust.model.CsCustomerContractPosition;
import com.chinaservices.oms.fee.model.CsFeeName;
import com.chinaservices.sdk.support.result.Result;
import com.chinaservices.sdk.util.DateUtil;
import com.chinaservices.sdk.util.ExcelReader;
import com.jfinal.plugin.activerecord.Db;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 类用途说明：合同管理
 * By：厦门同创空间信息技术有限公司 www.chinaservices.com.cn
 *
 * @author Aaron Zheng
 * @since 1.0, July 27, 2017
 */
public class CustomerContractService {

	public static final CustomerContractService me = new CustomerContractService();

	private Map<String, JSONObject> map = new HashMap<>();

	public Result importXls(File file, String contractNo, String creator) {
		Result ret = new Result();
		CsFeeName feeName = CsFeeName.dao.findFirst("select * from cs_fee_name where pay_or_receive='01'");
		CsCustomerContract customerContract = CsCustomerContract.dao.findByCode(contractNo);
		if (null == feeName || null == customerContract) {
			if (null == feeName) {
				ret.addError("费用名称没有数据");
			} else {
				ret.addError(String.format("合同编号：%s，不存在", contractNo));
			}
		} else {
			ExcelReader excelReader = new ExcelReader();
			List<List<String>> rows = excelReader.readXls(file, 0);
			ret = valid(rows);
			if (!ret.isSuccess()) {
				return ret;
			} else {
				CsCustomerContractPosition model = null;
				int i = 1;
				// 起运地、目的地、备注、保底价、10<X<20、20<=X<30、...
				List<String> xlsTitle = new ArrayList<>();
				for (List<String> ele : rows) {
					if (i == 1) {
						i++;
						xlsTitle = ele;
						continue;
					}
					JSONObject startAddr = findRegionByAddr(ele.get(0));
					JSONObject endAddr = findRegionByAddr(ele.get(1));
					model = new CsCustomerContractPosition();
					model.set("contract_code", contractNo);
					model.set("from_province_code", startAddr.getString("provinceCode"));
					model.set("from_province", startAddr.getString("provinceName"));
					model.set("from_city_code", startAddr.getString("cityCode"));
					model.set("from_city", startAddr.getString("cityName"));
					model.set("from_county_code", startAddr.getString("countyCode"));
					model.set("from_county", startAddr.getString("countyName"));

					model.set("to_province_code", endAddr.getString("provinceCode"));
					model.set("to_province", endAddr.getString("provinceName"));
					model.set("to_city_code", endAddr.getString("cityCode"));
					model.set("to_city", endAddr.getString("cityName"));
					model.set("to_county_code", endAddr.getString("countyCode"));
					model.set("to_county", endAddr.getString("countyName"));
					model.set("remark", ele.get(2));
					model.set("status", "1");
					model.set("creator", creator);
					model.set("create_time", DateUtil.now());
					model.save();
					List<CsCustomerContractFee> feeList = new ArrayList<>();
					CsCustomerContractFee customerContractFee;
					for (int j = 3; j < xlsTitle.size(); j++) {
						if (!StringUtils.isEmpty(xlsTitle.get(j))) {
							customerContractFee = new CsCustomerContractFee();
							customerContractFee.set("customer_contract_position_id", model.getInt("id"));
							customerContractFee.set("fee_name_code", feeName.getStr("fee_name_code"));
							customerContractFee.set("fee_name", feeName.getStr("fee_name"));
							if (StringUtils.isEmpty(ele.get(j))) {
								customerContractFee.set("fee_unit", 0);
							} else {
								customerContractFee.set("fee_unit", new BigDecimal(ele.get(j)));
							}
							BigDecimal[] intervals = getInterval(xlsTitle.get(j));
							customerContractFee.set("interval_from", intervals[0]);
							customerContractFee.set("interval_to", intervals[1]);
							customerContractFee.set("contract_fee_type", "1");
							customerContractFee.set("reserve_price", 0);
							customerContractFee.set("start_time", customerContract.getDate("contract_date_from"));
							customerContractFee.set("end_time", customerContract.getDate("contract_date_to"));
							customerContractFee.set("status", "1");
							customerContractFee.set("creator", creator);
							customerContractFee.set("create_time", DateUtil.now());
							feeList.add(customerContractFee);
						}
					}
					if (feeList.size() > 0) {
						Db.batchSave(feeList, feeList.size());
					}
					i++;
				}
			}
		}
		return ret;
	}

	private Result valid(List<List<String>> rows) {
		Result ret = new Result();
		ret.setSuccess(true);
		List<String> list = new ArrayList<>();
		int i = 1;
		// 起运地、目的地、10<X<20、20<=X<30、...
		List<String> xlsTitle = new ArrayList<>();
		for (List<String> ele : rows) {
			if (i == 1) {
				i++;
				xlsTitle = ele;
				if (xlsTitle.size() < 2) {
					ret.addError("费率导入模板表头格式不对");
					break;
				}
				continue;
			}
			if (StringUtils.isEmpty(ele.get(0)) || StringUtils.isEmpty(ele.get(1))) {
				ret.addError("第" + i + "行起运地或目的地为空。");
				break;
			}
			JSONObject startAddr = findRegionByAddr(ele.get(0));
			JSONObject endAddr = findRegionByAddr(ele.get(1));
			if (startAddr == null) {
				ret.addError("第" + i + "行起运地填写不对，请核对模板。");
				break;
			}
			if (endAddr == null) {
				ret.addError("第" + i + "行目的地填写不对，请核对模板。");
				break;
			}
			String key = ele.get(0) + ele.get(1);
			if (list.contains(key)) {
				ret.addError("第" + i + "行起运地、目的地有重复，请核对模板。");
			}
			list.add(key);
			i++;
		}
		return ret;
	}

	/**
	 * 获取价格区间
	 *
	 * @param str 10<X<=20，20<X<30
	 * @return
	 */
	private BigDecimal[] getInterval(String str) {
		BigDecimal[] bigDecimals = new BigDecimal[] {BigDecimal.ZERO, BigDecimal.ZERO};
		if (!StringUtils.isEmpty(str)) {
			bigDecimals[0] = new BigDecimal(str.substring(0, str.indexOf("<")));
			int lastEqaual = str.lastIndexOf("=");
			int lastLt = str.lastIndexOf("<");
			int start = lastEqaual > lastLt ? lastEqaual : lastLt;
			bigDecimals[1] = new BigDecimal(str.substring(start + 1, str.length()));
		}
		return bigDecimals;
	}

	/**
	 * 根据地址获取区县
	 *
	 * @param addr 思明区、厦门市
	 * @return
	 */
	public JSONObject findRegionByAddr(String addr) {
		if (map.containsKey(addr)) {
			return map.get(addr);
		} else {
			JSONObject region = new JSONObject();
			String provinceCode = "";
			String provinceName = "";
			String cityCode = "";
			String cityName = "";
			String countyCode = "";
			String countyName = "";
			CsAdministrativeRegion currentAddr = CsAdministrativeRegion.dao.findByName(addr);
			if (null == currentAddr) {
				return null;
			} else {
				String type = currentAddr.getStr("type");
				// 表示是省
				if ("province".equals(type)) {
					provinceCode = currentAddr.getStr("code");
					provinceName = addr;
				} else if ("city".equals(type)) {
					cityCode = currentAddr.getStr("code");
					cityName = addr;
					CsAdministrativeRegion province = CsAdministrativeRegion.dao.findByCode(currentAddr.getStr("parent_code"));
					provinceCode = province.getStr("code");
					provinceName = province.getStr("name");
				} else if ("county".equals(type)) {
					countyCode = currentAddr.getStr("code");
					countyName = addr;
					CsAdministrativeRegion city = CsAdministrativeRegion.dao.findByCode(currentAddr.getStr("parent_code"));
					cityCode = city.getStr("code");
					cityName = city.getStr("name");
					CsAdministrativeRegion province = CsAdministrativeRegion.dao.findByCode(city.getStr("parent_code"));
					provinceCode = province.getStr("code");
					provinceName = province.getStr("name");
				}
			}
			region.put("provinceCode", provinceCode);
			region.put("provinceName", provinceName);
			region.put("cityCode", cityCode);
			region.put("cityName", cityName);
			region.put("countyCode", countyCode);
			region.put("countyName", countyName);
			map.put(addr, region);
			return map.get(addr);
		}
	}
}
