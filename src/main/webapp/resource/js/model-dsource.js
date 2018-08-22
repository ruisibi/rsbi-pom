if($ == undefined){
	$ = jQuery;
}
function initdsourcetable(){
	if($("#dsourcetable").size() > 0){
		$("#dsourcetable").datagrid("load", {t:Math.random()});
		return;
	}
	var ctx = "<table id=\"dsourcetable\" title=\"数据源管理\" ><thead><tr><th data-options=\"field:'ck',checkbox:true\"></th><th data-options=\"field:'dsname',width:120\">名称</th><th data-options=\"field:'use',width:120,align:'center'\">类型</th><th data-options=\"field:'linkType',width:150,align:'center'\">数据库</th><th data-options=\"field:'linkUrl',width:300\">链接字符串</th><th data-options=\"field:'linkName',width:120,align:'center'\">用户名</th></tr></thead></table>";
	$("#optarea").html(ctx);
	$("#dsourcetable").datagrid({
		singleSelect:true,
		collapsible:false,
		pagination:false,
		border:false,
		fit:true,
		url:'listDataSource.action',
		toolbar:[{
		  text:'新增',
		  iconCls:'icon-add',
		  handler:function(){
			newdsource(false);
		  }
		},{
		  text:'修改',
		  iconCls:'icon-edit',
		  handler:function(){
			var row = $("#dsourcetable").datagrid("getChecked");
			if(row == null || row.length == 0){
				$.messager.alert("出错了。","您还未勾选数据。", "error");
				return;
			}
			newdsource(true, row[0].dsid);
		  }
		},{
		  text:'删除',
		  iconCls:'icon-cancel',
		  handler:function(){
			var row = $("#dsourcetable").datagrid("getChecked");
			if(row == null || row.length == 0){
				$.messager.alert("出错了。","您还未勾选数据。", "error");
				return;
			}
			delDsource(row[0].dsid);
		  }
		}]
	});
}
function delDsource(dsid){
	if(confirm("是否确认删除？")){
		$.ajax({
			url:'deleteDataSource.action',
			data: {dsid:dsid},
			type:'POST',
			dataType:'JSON',
			success:function(){
				$("#dsourcetable").datagrid("reload", {t:Math.random});
			},
			error:function(){
				msginfo("系统出错，请查看后台日志。");
			}
		});
	}
}
function newdsource(isupdate, dsid){
	var ds;
	if(isupdate){
		$.ajax({
			type:'GET',
			url:'getDataSource.action',
			dataType:'JSON',
			data:{dsid:dsid},
			async:false,
			success: function(resp){
			   ds = resp;
		    }
		});
	}
	 var ctx = "<div id=\"dsource_tab\" style=\"height:auto; width:auto;\"><div title=\"JDBC\"><form id=\"datasourceform\" name=\"datasourceform\"><input type=\"hidden\" name=\"connstate\" id=\"connstate\"><div class=\"textpanel\"><span class=\"inputtext\">数据源名称：</span><input type=\"text\" id=\"dsname\" name=\"dsname\" class=\"inputform\" style=\"width:400px;\" value=\""+(ds&&ds.use=='jdbc'?ds.dsname:"")+"\"><br/><span class=\"inputtext\">数据源类型：</span><select id=\"linkType\" name=\"linkType\" style=\"width:400px;\" class=\"inputform\"><option value=\"mysql\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='mysql'?"selected":"")+">mysql</option><option value=\"oracle\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='oracle'?"selected":"")+">oracle</option><option value=\"sqlser\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='sqlser'?"selected":"")+">SQL Server</option><option value=\"db2\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='db2'?"selected":"")+">DB2</option><option value=\"postgresql\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='postgresql'?"selected":"")+">postgresql</option><option value=\"hive\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='hive'?"selected":"")+">hive</option><option value=\"kylin\" "+(ds&&ds.use=='jdbc'&&ds.linkType=='kylin'?"selected":"")+">kylin</option></select><br/><span class=\"inputtext\">连接字符串：</span><input type=\"text\" id=\"linkUrl\" name=\"linkUrl\" class=\"inputform\" style=\"width:400px;\" value=\""+(ds&&ds.use=='jdbc'?ds.linkUrl:"jdbc:mysql://ip/database?useUnicode=true&characterEncoding=UTF8")+"\"><br/><span class=\"inputtext\">连接用户名：</span><input type=\"text\" id=\"linkName\" name=\"linkName\" class=\"inputform\" style=\"width:400px;\" value=\""+(ds&&ds.use=='jdbc'?ds.linkName:"")+"\"> <br/><span class=\"inputtext\">连接密码：</span><input type=\"password\" name=\"linkPwd\" id=\"linkPwd\" style=\"width:400px;\" value=\""+(ds&&ds.use=='jdbc'?ds.linkPwd:"")+"\" class=\"inputform\"></div></form></div><div data-options=\""+(ds&&ds.use=='jndi'?"selected:true":"")+"\" title=\"JNDI\"><div class=\"textpanel\"><span class=\"inputtext\">JNDI名称：</span><input type=\"text\" value=\""+(ds&&ds.use=='jndi'?ds.jndiName:"")+"\" style=\"width:400px;\" name=\"jndiName\" id=\"jndiName\" class=\"inputform\"><br/><span class=\"inputtext\">数据源类型：</span><select id=\"jndilinktype\" name=\"jndilinktype\" style=\"width:400px;\" class=\"inputform\"><option value=\"mysql\" "+(ds&&ds.use=='jndi'&&ds.linkType=='mysql'?"selected":"")+">mysql</option><option value=\"oracle\" "+(ds&&ds.use=='jndi'&&ds.linkType=='oracle'?"selected":"")+">oracle</option><option value=\"sqlser\" "+(ds&&ds.use=='jndi'&&ds.linkType=='sqlser'?"selected":"")+">SQL Server</option><option value=\"db2\" "+(ds&&ds.use=='jndi'&&ds.linkType=='db2'?"selected":"")+">DB2</option><option value=\"postgresql\" "+(ds&&ds.use=='jndi'&&ds.linkType=='postgresql'?"selected":"")+">postgresql</option><option value=\"hive\" "+(ds&&ds.use=='jndi'&&ds.linkType=='hive'?"selected":"")+">hive</option></select></div></div></div>";
	$('#pdailog').dialog({
		title: isupdate ? "编辑数据源" : '创建数据源',
		width: 540,
		height: 300,
		closed: false,
		cache: false,
		modal: true,
		toolbar:null,
		content:ctx,
		buttons:[{
			text:"测试连接",
			handler:function(){
				var tab = $('#dsource_tab').tabs('getSelected');
				var index = $('#dsource_tab').tabs('getTabIndex',tab);
				if(index == 0){
					var param = $("#datasourceform").serialize();
					$.ajax({
					   type: "POST",
					   url: "testDataSource.action",
					   dataType:"json",
					   data: param,
					   success: function(resp){
						   if(resp.result == 1){
							   msginfo("测试成功！", "suc");
							   $("#datasourceform #connstate").val("y");
						   }else{
							   msginfo("测试失败！<br/>"+resp.msg);
						   }
					   },
					   error:function(){
						   msginfo("测试失败！");
					   }
					});
				}else if(index == 1){
					var param = {"jndiName":$("#dsource_tab #jndiName").val()};
					$.ajax({
					   type: "POST",
					   url: "testJndi.action",
					   dataType:"json",
					   data: param,
					   success: function(resp){
						   if(resp.result == 1){
							   msginfo("测试成功！", "suc");
							   $("#datasourceform #connstate").val("y");
						   }else{
							   msginfo("测试失败！<br/>"+resp.msg);
						   }
					   },
					   error:function(){
						   msginfo("测试失败！");
					   }
					});
				}
			}
		},{
				text:'确定',
				iconCls:"icon-ok",
				handler:function(){
					var tab = $('#dsource_tab').tabs('getSelected');
					var index = $('#dsource_tab').tabs('getTabIndex',tab);
					if(index == 0){
						if($("#datasourceform #dsname").val() == ''){
							msginfo("请输入数据源名称！");
							$("#datasourceform #dsname").focus();
							return;
						}
						if($("#datasourceform #connstate").val() != "y"){
							msginfo("请先测试连接正常再确定！");
							return;
						}
						if(isupdate == false){
							var ds = {"linkType":$("#linkType").val(), "linkName":$("#linkName").val(), "linkPwd":$("#linkPwd").val(), "linkUrl":$("#linkUrl").val(),"dsname":$("#datasourceform #dsname").val(),"dsid":newGuid(),"use":"jdbc"};
							$.ajax({
								url:'saveDataSource.action',
								data: $.param(ds),
								type:'POST',
								dataType:'JSON',
								success:function(){
									$("#dsourcetable").datagrid("reload", {t:Math.random});
								},
								error:function(){
									msginfo("系统出错，请查看后台日志。");
								}
							});
						}else{
							var nds = {"linkType":$("#linkType").val(), "linkName":$("#linkName").val(), "linkPwd":$("#linkPwd").val(), "linkUrl":$("#linkUrl").val(),"dsname":$("#datasourceform #dsname").val(),"dsid":dsid,"use":"jdbc"};
							$.ajax({
								url:'updateDataSource.action',
								data:nds,
								type:'POST',
								dataType:'JSON',
								success:function(){
									$("#dsourcetable").datagrid("reload", {t:Math.random});
								},
								error:function(){
									msginfo("系统出错，请查看后台日志。");
								}
							});
						}
					}else if(index == 1){
						if($("#dsource_tab #jndiName").val() == ''){
							msginfo("请输入JNDI名称！");
							$("#dsource_tab #jndiName").focus();
							return;
						}
						if($("#datasourceform #connstate").val() != "y"){
							msginfo("请先测试连接正常再确定！");
							return;
						}
						if(isupdate == false){
							var ds = {"dsname":$("#dsource_tab #jndiName").val(),"linkType":$("#dsource_tab #jndilinktype").val(),"dsid":newGuid(),"use":"jndi"};
							$.ajax({
								url:'saveDataSource.action',
								data: ds,
								type:'POST',
								dataType:'html',
								success:function(){
									$("#dsourcetable").datagrid("reload", {t:Math.random});
								},
								error:function(){
									msginfo("系统出错，请查看后台日志。");
								}
							});
						}else{
							var ds = {"dsname":$("#dsource_tab #jndiname").val(),"linkType":$("#dsource_tab #jndilinktype").val(),"dsid":dsid,"use":"jndi"};
							$.ajax({
								url:'updateDataSource.action',
								data:ds,
								type:'POST',
								dataType:'html',
								success:function(){
									$("#dsourcetable").datagrid("reload", {t:Math.random});
								},
								error:function(){
									msginfo("系统出错，请查看后台日志。");
								}
							});
						}
					}
					$('#pdailog').dialog('close');
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$('#pdailog').dialog('close');
				}
			}]
	});
	$("#pdailog #dsource_tab").tabs({
		fit:true,border:false
	});
	$("#pdailog #linkType").change(function(){
		var val = $(this).val();
		if(val == "mysql"){
			$("#pdailog #linkUrl").val("jdbc:mysql://ip/database?useUnicode=true&characterEncoding=UTF8");
		}else if(val == "oracle"){
			$("#pdailog #linkUrl").val("jdbc:oracle:thin:@ip:1521/sid");
		}else if(val == "sqlser"){
			$("#pdailog #linkUrl").val("jdbc:jtds:sqlserver://ip:1433/database");
		}else if(val == "db2"){
			$("#pdailog #linkUrl").val("jdbc:db2://ip:50000/database");
		}else if(val == "postgresql"){
			$("#pdailog #linkUrl").val("jdbc:postgresql://ip:5432/database");
		}else if(val == "hive"){
			$("#pdailog #linkUrl").val("jdbc:hive2://ip:10000/default");
		}else if(val == "kylin"){
			$("#pdailog #linkUrl").val("jdbc:kylin://ip:7070/kylin_project_name");
		}
	});
}