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

//if(process.argv.indexOf('-r') === -1 || process.argv.indexOf('--root') === -1){
//  process.argv.push('-r');
//  process.argv.push('./src');
//}

