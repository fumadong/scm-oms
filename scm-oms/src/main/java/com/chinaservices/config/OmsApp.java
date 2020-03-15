package com.chinaservices.config;

import com.chinaservices.event.EventManager;
import com.chinaservices.event.guava.AsyncEventPolicy;
import com.chinaservices.oms.edi.listener.SystemEventListener;
import com.chinaservices.oms.edi.listener.TmsEvnetLinstener;
import com.chinaservices.oms.edi.listener.WmsEventListener;
import com.chinaservices.plugins.sqlinxml.SqlInXmlPlugin;
import com.chinaservices.sdk.app.App;
import com.chinaservices.sdk.app.AppConfig;

import java.util.Properties;

/**
 * Created by simon on 2017/12/12.
 */
public class OmsApp implements App {
    @Override
    public String name() {
        return "oms";
    }

    @Override
    public void start(Properties properties) {

    }

    @Override
    public AppConfig getConfig() {
        return null;
    }

    @Override
    public void afterStart() {
        // 配置sql语句xml化
        SqlInXmlPlugin sqlInXml = new SqlInXmlPlugin();
        sqlInXml.start();
        
        // 事件注册
 		EventManager.setEventPolicy(new AsyncEventPolicy());
 		EventManager.register(new SystemEventListener());
 		EventManager.register(new WmsEventListener());
 		EventManager.register(new TmsEvnetLinstener());
    }
}
