var generator = require('generator-install');

module.exports = {
    name: 'init',
    desc: 'init a ngfis project',
    register: function (commander) {
        commander
            .option('-f, --file <filename>', 'generator config remote url or local path')
            .option('-c, --clean', 'clean generator cache', Boolean, false)
            .action(function () {
                var args = Array.prototype.slice.call(arguments);
                var options = args.pop();

                generator.run({
                    tmpDir: fis.project.getTempPath('generator'),
                    cfg: options.file,
                    pkg: args.shift(),
                    clean: options.clean
                })
            });
    }
};
