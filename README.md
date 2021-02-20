# 睿思BI-开源商业智能，数据可视化系统 (开源版)

VUE版本已发布，请访问：https://github.com/ruisibi/rsbi-vue <br/>

BI系统支撑库变更说明：
支撑库已更新为sqlite， 直接打成war包即可运行，如果还是需要使用mysql做支撑库，请修改如下配置：<br/>

```java
application.properties文件：

 #使用mysql
 jdbc.driver=com.mysql.cj.jdbc.Driver
 jdbc.url=jdbc:mysql://localhost:3306/rs_report?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true&serverTimezone=GMT%2B8
 jdbc.username=root
 jdbc.password=12345678

src/main/webapp/WEB-INF/ext2/ext-config/ext-config.xml文件
#修改支撑库为mysql：
<constant name="dbName" value="mysql" />
```
直接下载war包（sqlite支撑库）：https://www.ruisitech.com/files/rsbi.war (下载后放入tomcat直接运行)

“睿思BI”商业智能系统是由[成都睿思商智科技有限公司](https://www.ruisitech.com)自主研发的企业数据分析系统。 系统包含数据建模、数据报表、多维分析、仪表盘、移动BI等功能模块，方便企业快速建立一套易用，灵活、低成本的商业智能平台，实现数据的快速分析及可视化。 <br>

![系统架构图](https://www.ruisitech.com/img/xtjgt.png)  <br/>

# 产品特点：<br>
  1.轻量级BI, 支持快速建模，快速可视化数据。 <br> 
  2.多维分析/报表/仪表盘使用简单，功能强大，通过拖放等方式构建分析界面，支持下钻/上卷/排序/筛选/计算/联动等多种操作方式。 <br>
  3.支持移动BI，通过APP随时随地访问报表数据。 <br>
  4.开放源码，采用apache2.0开源协议，用户可任意使用而不需我公司授权（标准版除外）。<br>
  
# 系统功能：<br>
  1.数据源 (支持：mysql/oracle/sqlserver/db2/postgresql/hive/kylin) <br>
  2.多维分析 <br>
  3.数据报表 <br>
  4.移动BI <br> 
  5.权限管理  <br>
  
# 产品安装：<br/>
  1.安装数据，系统基于mysql数据库，先创建rs_report数据库，再解压datas/rs_report_data.zip文件，通过 mysql -u root -p rs_report< rs_report_data.bak 命令还原文件到 rs_report 数据库中。 <br>
  2.安装程序，此项目为maven工程，通过maven打包项目。 <br>
  3.修改数据库链接文件application.properties,主要修改 username, password 两项内容。  <br>
  4.发布到tomcat或通过启动jetty访问 <br>
<p/>

# 技术支持：<br/>
请加QQ群 648548832, 此群为我公司官方技术支持群，你遇到的问题都可以在群里提问。<br/>
<p/>

文档地址： http://www.ruisibi.cn/book.htm <br/>
演示地址： http://bi.ruisitech.com/  <br/>
快速开始： https://blog.csdn.net/zhuifengsn/article/details/79822585 <br/>
<p/>

# 产品截图：<br/>

数据多维分析<br/>
![olap](http://www.ruisitech.com/img/olap3.png?v4)  <br/>
数据可视化<br/>
![1](http://www.ruisibi.cn/img/ybpnew.png?v5)  <br/>
数据建模<br/>
![2](http://www.ruisibi.cn/img/kybmodel.png?v3)  <br/>
APP访问<br/>
![3](http://www.ruisitech.com/img/3g/IMG_1292.PNG?v3)  <br/>
