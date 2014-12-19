var path = require('path');
var utils = require('./lib/utils');

var fis = exports.fis = require('fis');
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
fis.cli.name = fis.cli.info.name;

//plugin search order
fis.require.prefixes = [ fis.cli.name, 'scrat', 'fis' ];

//merge config
var config = require('./config/default.js');
fis.config.merge(config);

//register command plugins
['install'].forEach(function(name){
  fis.require._cache['command-' + name] = require('./lib/command/' + name);
});

//alias
Object.defineProperty(global, fis.cli.name, {
  enumerable : true,
  writable : false,
  value : fis
});

//find root
var root = utils.getProjectDir();
if(!root){
  fis.log.error('fis.conf not found.');
}else{
  fis.project.configDir = root;
  fis.project.setProjectRoot(path.join(root, 'src'));
  if(process.cwd() !== root){
    process.chdir(root);
  }
}


