# 睿思BI-开源商业智能，数据可视化系统 (开源版)

### 系统已升级为maven工程，通过 springmvc + spring + mybatis 构建。

“睿思BI”商业智能系统是由[成都睿思商智科技有限公司](http://www.ruisibi.cn)自主研发的企业数据分析系统。 系统包含数据建模、数据报表、多维分析、仪表盘、移动BI等功能模块，方便企业快速建立一套易用，灵活、低成本的商业智能平台，实现数据的快速分析及可视化。 <br>

# 产品特点：<br>
  1.轻量级BI, 支持快速建模，快速可视化数据。 <br> 
  2.多维分析/报表/仪表盘使用简单，功能强大，通过拖放等方式构建分析界面，支持下钻/上卷/排序/筛选/计算/联动等多种操作方式。 <br>
  3.支持移动BI，通过APP随时随地访问报表数据。 <br>
  4.开放源码，采用apache2.0开源协议，用户可任意使用而不需我公司授权（标准版除外）。<br>
  
  <p>
  
# 产品安装：<br/>
  1.安装数据，系统基于mysql数据库，先创建rs_report数据库，再解压datas/rs_report_data.zip文件，通过 mysql -u root -p rs_report< rs_report_data.bak 命令还原文件到 rs_report 数据库中。 <br>
  2.安装程序，此项目为maven工程，通过maven打包项目。 <br>
  3.修改数据库链接文件application.properties,主要修改 username, password 两项内容。  <br>
  4.发布到tomcat或通过启动jetty访问 <br>
<p/>

# 技术支持：<br/>
请加QQ群 648548832, 此群为我公司官方技术支持群，你遇到的问题都可以在群里提问，我们竭诚为您服务。 请注意： 加群需要缴费100元技术支持服务费。用微信扫描下方二维码付款，付款后再申请入群。<br/>
![微信支付](http://bi.ruisibi.cn/resource/img/wxzf.png?v2)  <br/>
(微信支付二维码)
<p/>

文档地址： http://www.ruisibi.cn/book.htm <br/>
演示地址： http://bi.ruisibi.cn/  <br/>
账号/口令：test/123456 <br/>
快速开始： https://my.oschina.net/u/3438563/blog/903393 <br/>
<p/>

# 产品截图：<br/>

数据多维分析<br/>
![olap](http://www.ruisitech.com/img/olap12.png?v2)  <br/>
数据可视化<br/>
![1](http://www.ruisibi.cn/img/ybpnew.png?v2)  <br/>
数据建模<br/>
![2](http://www.ruisibi.cn/img/kybmodel.png?v1)  <br/>
APP访问<br/>
![3](http://www.ruisitech.com/img/3g/IMG_1292.PNG?v3)  <br/>
