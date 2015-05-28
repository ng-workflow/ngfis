var JSZip = require("jszip");
var fs = require('fs');
var moment = require('moment');

var cwd = process.cwd();

function normalizePath(to, root){
  if (!to){
    to = '/';
  }else if(to[0] === '.'){
    to = fis.util(cwd + '/' +  to);
  } else if(/^output\b/.test(to)){
    to = fis.util(root + '/' +  to);
  }else {
    to = fis.util(to);
  }
  return to;
}

module.exports = function(files, settings, callback){
  if(!fis.util.is(settings, 'Array')){
    settings = [settings];
  }
  var conf = {};
  settings.forEach(function(setting){
    fis.util.merge(conf, setting);
  });

  conf.file = conf.file || ('../dist/' + fis.config.get('name') + '_v' + fis.config.get('version') + '_' + moment().format('YYYYMMDDHHmmss') + '.zip');

  var targetPath = normalizePath(conf.file, fis.project.getProjectPath());
  if(!fis.util.exists(targetPath)){
    fis.util.mkdir(fis.util.pathinfo(targetPath).dirname);
  }
  var zip = new JSZip();
  files.forEach(function(fileInfo){
    var file = fileInfo.file;
    if(!file.release){
      fis.log.error('unable to get release path of file[' + file.realpath + ']: Maybe this file is neither in current project or releasable');
    }
    var name = fileInfo.dest.release.replace(/^\/*/g, '');
    zip.file(name, fileInfo.content);
    fis.log.debug('[deploy-compress] pack file [' + name + ']');
  });

  fis.log.notice('[deploy-compress] compress to: ' + targetPath);
  fs.writeFileSync(targetPath, zip.generate({type:"nodebuffer"}));
};

module.exports.fullpack = true;