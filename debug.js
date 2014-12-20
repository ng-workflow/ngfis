//change process cwd
var root = 'D:/Workspace/Code/ng-workflow/ngfis-showcase';
process.chdir(root);

//import conf
var fis = require('./index.js').fis;
require(root + '/fis-conf.js');

//debug release
var args = process.argv.concat([
  'release',
  '-c',
  //'-p',
  //'-r', fis.project.getProjectPath(), //root + '/src',
  '-d', 'D:/Workspace/Code/ng-workflow/ngfis/dist'
]);

//debug install
//var args = process.argv.concat([
//  'install',
//  //'angular/bower-angular-touch',
//  //'zepto',
//  //'angular',
//  //'boostrap',
//  //'ui-router',
//  //'-c',
//  //'--dev',
//  //'--save-dev',
//  //'-d', 'dist'
//]);

fis.cli.run(args);

