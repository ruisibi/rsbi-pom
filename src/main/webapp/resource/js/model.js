if($ == undefined){
	$ = jQuery;
}
function initModelTree(){
	$("#modeltree").tree({
		data:[{
			id:"datasource",
			text:"数据源",
			iconCls:"icon-dsource",
			attributes:{type:'dsource'}
		},{
			id:"dataset",
			text:"数据集",
			iconCls:"icon-dataset2",
			attributes:{type:'dset'}
		},{
			id:"cube",
			iconCls:"icon-cube",
			text:"立方体",
			attributes:{type:'cube'}
		}],
		onClick:function(node){
			if(node.attributes && node.attributes.type == "dsource"){
				initdsourcetable();
			}else if(node.attributes && node.attributes.type == "dset"){
			    initdsetTable();
			}else if(node.attributes && node.attributes.type == "cube"){
			    initcubeTable();
			}
		}
	});
	$('#modeltree').tree('select', $("#modeltree div[node-id='datasource']"));
	initdsourcetable();
}
//tp表示是提示信息还是错误信息
function msginfo(input, tp){
	var str = null;
	if(tp && tp == 'suc'){
		str = "<div class='msginfo msgsuc'>" + input +"</div>";
	}else{
		str = "<div class='msginfo msgerr'>" + input+"</div>";
	}
	$.messager.show({
		title: (tp && tp == 'suc')? '成功了' : '出错了',
		msg:str,
		showType:'fade',
		timeout:2000,
		style:{
			right:'',
			top:document.body.scrollTop+document.documentElement.scrollTop + 10,
			bottom:''
		}
	});
}
//在textarea光标处插入文本
function insertText2focus(obj,str) {
	str = str　+ " ";
	obj.focus();
	if (document.selection) {
		var sel = document.selection.createRange();
		sel.text = str;
	} else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
		var startPos = obj.selectionStart,
			endPos = obj.selectionEnd,
			cursorPos = startPos,
			tmpStr = obj.value;
		obj.value = tmpStr.substring(0, startPos) + "" + str + tmpStr.substring(endPos, tmpStr.length);
		cursorPos += str.length;
		obj.selectionStart = obj.selectionEnd = cursorPos;
	} else {
		obj.value += str;
	}
}
function ischinese(a){
	if (/[\u4E00-\u9FA5]/i.test(a)) {
		return true;  
	}else{    return false }
}
//生成唯一标识
function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      //if((i==8)||(i==12)||(i==16)||(i==20))
      //  guid += "-";
    }
    return guid;    
}
//去除重复
Array.prototype.uniqueArray = function(){
 var res = [];
 var json = {};
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   res.push(this[i]);
   json[this[i]] = 1;
  }
 }
 return res;
}