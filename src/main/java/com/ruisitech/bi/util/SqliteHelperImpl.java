/*
 * Copyright 2018 本系统版权归成都睿思商智科技有限公司所有
 * 用户不能删除系统源码上的版权信息, 使用许可证地址:
 * https://www.ruisitech.com/licenses/index.html
 */
package com.ruisitech.bi.util;

import com.ruisi.ext.engine.dao.DatabaseHelper;
import com.ruisi.ext.engine.view.context.grid.PageInfo;

/**
 * bi系统的 sqlite 实现
 * @ClassName SqliteHelperImpl
 * @Description SqliteHelperImpl
 * @Author gdp
 * @Date 2020/6/2 1:17 下午
 */
public class SqliteHelperImpl implements DatabaseHelper {

    @Override
    public String getDatabaseType() {
        return "sqlite";
    }

    @Override
    public String getClazz() {
        return "org.sqlite.JDBC";
    }

    @Override
    public String getQueryPageSql(String sql, PageInfo page) {
        return "select * from ("+sql+") bb Limit "+ page.getPagesize()+" Offset " + (page.getCurtpage() * page.getPagesize());
    }
}
