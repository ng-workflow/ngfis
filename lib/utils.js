var path = require('path');
var fs = require('fs');

exports.findFile = function(fileName, basePath){
  var root = basePath || process.cwd();
  while(fs.existsSync(root)){
    if(fs.existsSync(path.join(root, fileName))){
      break;
    }else if(root === path.dirname(root)){
      root = null;
      break;
    }else{
      root = path.dirname(root);
    }
  }
  return root;
};

exports.getProjectDir = function(){
  return exports.findFile('fis-conf.js');
};

/**
 * format date.
 *
 *     formatDate(new Date(),"yyyy-MM-dd hh:mm:ss")
 *     formatDate(new Date().setHours(0,0,0,0),"yyyy-MM-dd hh:mm:ss")
 *
 * 更建议用类库: [moment.js](http://momentjs.com/)
 *
 * @param {Date/Number} [obj] date to format, support Date or timestamp
 * @param {String} [format] 格式
 * @return {String} 格式化后的字符串
 */
exports.formatDate = function(obj, format){
  var date = obj || new Date();
  if(obj && obj.toString !== '[object Date]'){
    if(isNaN(obj)){
      date = new Date(obj);
    }else{
      date = new Date();
      date.setTime(obj);
    }
  }

  format = format || "yyyy-MM-dd hh:mm:ss";

  var o = {
    "M+" : date.getMonth()+1, //month
    "d+" : date.getDate(),    //day
    "h+" : date.getHours(),   //hour
    "m+" : date.getMinutes(), //minute
    "s+" : date.getSeconds(), //second
    "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
    "S" : date.getMilliseconds() //millisecond
  };
  if(/(y+)/.test(format)){
    format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
};