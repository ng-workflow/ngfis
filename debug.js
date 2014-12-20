var root = 'D:/Workspace/Code/ng-workflow/ngfis-showcase';
process.chdir(root);

var fis = require('./index.js').fis;
//fis.project.setProjectRoot(root + '/src');
require(root + '/fis-conf.js');

// debug release
//var args = process.argv.concat([
//  'release',
//  '-c',
//  '-p',
//  '-r', fis.project.getProjectPath(), //root + '/src',
//  '-d', '../dist'
//]);

// debug install
var args = process.argv.concat([
  'install',
  'zepto',
  'bootstrap',
  //'ui-router',
  //'-c',
  //'--dev',
  //'--save-dev',
  //'-d', 'dist'
]);

fis.cli.run(args);

