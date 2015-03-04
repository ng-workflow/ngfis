module.exports = {
  name: 'publish',
  desc: 'short cmd for release',
  register: function(commander){
    commander
      .option('-d, --dest <names>', 'release output destination', String, 'zip')
      .action(function() {
        var argv = process.argv;
        argv.splice(2, 1, 'release', '-opm');
        fis.log.notice('[ngfis-command-publish] exec: `ngfis ' + argv.slice(2).join(' ') + '`');
        fis.cli.run(argv);
      });
  }
};