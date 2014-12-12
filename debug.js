var fis = require('./index.js').fis;
var root = 'D:/Workspace/Code/ng-workflow/ngfis-showcase';
//fis.project.setProjectRoot(root + '/src');
require(root + '/fis-conf.js');

var args = process.argv.concat([
  'release',
  '-c',
  '-p',
  '-r', fis.project.getProjectPath(), //root + '/src',
  '-d', './dist'
]);

fis.cli.run(args);
