module.exports = function(content, file){
  if(file.isMod){
    var exports = '';
    //分析meta文件
    var componentJson = file.dirname + '/component.json';
    var bowerJson = file.dirname + '/bower.json';
    var metaFile = (fis.util.isFile(componentJson) && componentJson) || (fis.util.isFile(bowerJson) && bowerJson);
    if(metaFile){
      var json = require(metaFile);
      if(json.exports){
        var main = fis.util(file.dirname, json.main || 'index.js');
        if(main === file.realpath){
          exports = ';module.exports = ' + json.exports;
        }
      }
    }
    //包裹define
    content = "define('" + file.getId() + "', function(require, exports, module){\n\n" + content + exports + "\n\n});";
  }
  return content;
};