//简单的实现代码不压缩, 提供给第三方使用时, 会需要-debug包
module.exports = function (ret, conf, settings, opt){
  var venderList = fis.config.get('settings.vender');
  fis.util.map(venderList, function(targetFile, files){
    //获取到所有文件内容
    var content = files.map(function(f){
      var subFile = fis.file(fis.project.getProjectPath(f));
      if(subFile) {
        subFile.useCache = false;
        subFile.useOptimizer = false;
        fis.compile(subFile);
        return subFile.getContent();
      }
    }).filter(function(item){
      return !!item;
    }).join(';\n');

    //输出非混淆内容
    var file = fis.file(fis.project.getProjectPath(targetFile));
    file.useCache = false;
    file.useOptimizer = false;
    file.release = file.release.replace(/\.(js|css)$/, '-debug.$1');
    file.setContent(content);
    ret.pkg[file.release] = file;
  });

  //输出混淆内容
  fis.config.merge({
    pack : venderList
  });
};