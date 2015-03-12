var yeoman = require('yeoman-generator');
var generator = require('generator-ngfis');

module.exports = {
  name: 'init',
  desc: 'init a ngfis project',
  register: function(commander){
    commander
      .action(function() {
        var env = yeoman();
        env.registerStub(generator, 'ngfis');
        env.run('ngfis');
      });
  }
};