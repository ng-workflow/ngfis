var fis = exports.fis = require('fis');
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
fis.cli.name = fis.cli.info.name;

//plugin search order
fis.require.prefixes = [ fis.cli.name, 'scrat', 'fis' ];

//merge config
var config = require('./config/default.js');
fis.config.merge(config);

//alias
Object.defineProperty(global, fis.cli.name, {
  enumerable : true,
  writable : false,
  value : fis
});