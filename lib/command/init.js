var generator = require('generator-scrat');

module.exports = {
    name: 'init',
    desc: 'init a ngfis project',
    register: function (commander) {
        commander
            .option('-c, --clean', 'clean generator cache', Boolean, false)
            .action(function () {
                var options = arguments[arguments.length - 1];
                generator.run({
                    tmpDir: fis.project.getTempPath('generator'),
                    clean: options.clean
                })
            });
    }
};
