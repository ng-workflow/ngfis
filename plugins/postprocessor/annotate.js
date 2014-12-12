var ngAnnotate = require('ng-annotate');

module.exports = function(content, file){
  if(file.isJsLike) {
    var result = ngAnnotate(content, {add: true, single_quotes: true});
    if(!result.errors){
      content = result.src;
    }else{
      result.errors.forEach(function (error) {
        fis.log.error(error);
      });
    }
  }
  return content;
};