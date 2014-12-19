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

