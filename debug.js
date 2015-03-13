//change process cwd
//var root = 'D:/Workspace/Code/ng-workflow/ngfis-showcase';
var root = 'D:/Workspace/Code/ninegame/ngm-static';
process.chdir(root);

//import conf
var fis = require('./index.js').fis;
require(root + '/fis-conf.js');

//debug release
var args = process.argv.concat([
  'release',
  //'-c',
  //'-p',
  //'-o',
  '-t',
  //'-r', fis.project.getProjectPath(), //root + '/src',
  '-d', 'D:/Workspace/Code/ng-workflow/ngfis/dist'
]);

//args = process.argv.concat([
//  'publish'
//]);

//var args = process.argv.concat([
//  'server',
//  'start'
//]);

//debug install
//var args = process.argv.concat([
//  'install',
//  //'angular/bower-angular-touch',
//  //'zepto',
//  //'angular',
//  //'boostrap',
//  //'ui-router',
//  'aui/artTemplate',
//  //'-c',
//  //'--dev',
//  //'--save-dev',
//  '-d', 'dist'
//]);

fis.cli.run(args);

