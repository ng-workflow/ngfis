var root = 'D:/Workspace/Code/ng-workflow/ngfis-showcase';
process.chdir(root);

var fis = require('./index.js').fis;
//fis.project.setProjectRoot(root + '/src');
require(root + '/fis-conf.js');

var args = process.argv.concat([
  'release',
  '-c',
  '-p',
  '-r', fis.project.getProjectPath(), //root + '/src',
  '-d', './dist'
]);

var args = process.argv.concat([
  'install',
 //'bootstrap zz=zepto angular#>1.3.6 angular-touch',
  'zepto',
  //'-c',
  '-d', 'dist'
]);

fis.cli.run(args);
//var multimatch = require('multimatch');
//
//var list = ['bootstrap.css.map', 'bootstrap-theme.css', 'bootstrap-theme.min.css', 'bootstrap.css', 'bootstrap.min.css']
//
//var result = multimatch(list, ['*.css', '!*.min.css']);
//var result = multimatch(list, '*.css');
//console.log(result);
//
//var globby = require('globby');
//var patterns = ['**/*.js', '**/*.css',  '!**/*.min.*', '!**/*.map'];
//var files = globby.sync(patterns, {cwd: './bower_components/bootstrap/dist'});
//console.log(files)
