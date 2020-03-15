package com.chinaservices.oms.order.service;

import com.chinaservices.oms.track.model.CsOrderMilestone;
import com.chinaservices.sdk.util.DateUtil;

import java.util.List;

public class CsOrderMilestonelService {
	
    private static final CsOrderMilestone dao = new CsOrderMilestone();

    /**
     * 根据id查询
     * @param id
     * @return
     */
    public CsOrderMilestone findById(Integer id) {
    	return dao.findById(id);
    }

    /**
     * 批量保存
     * @param models
     */
    public void saveAll(List<CsOrderMilestone> models){
        for (CsOrderMilestone model:models ) {
            saveOrUpdate(model);
        }
    }
    /**
     * 保存或者更新
     *
     * @param model
     */
    public void saveOrUpdate(CsOrderMilestone model) {
        if (null == model.get("id")) {
            model.set("create_time", DateUtil.now());
            model.set("rec_ver", 1);
            model.set("modify_time", DateUtil.now());
            model.save();
        } else {
            model.set("modify_time", DateUtil.now());
            model.update();
        }
    }
    /**
     * 根据id删除
     * @param ids
     */
    public void deleteByIds(String[] ids) {
    	for (String id : ids) {
    		dao.deleteById(id);
		}
    }
}
