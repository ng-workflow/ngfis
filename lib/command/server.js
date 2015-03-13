/**
 * Created by fouber on 14-2-19.
 */

'use strict';


var child_process = require('child_process');
var spawn = child_process.spawn;

exports.name = 'server';
exports.usage = '<command> [options]';
exports.desc = 'launch nodejs server';
exports.register = function(commander) {

    function touch(dir){
        if(fis.util.exists(dir)){
            if(!fis.util.isDir(dir)){
                fis.log.error('invalid directory [' + dir + ']');
            }
        } else {
            fis.util.mkdir(dir);
        }
        return fis.util.realpath(dir);
    }

    var root = touch((function(){
        var key = 'FIS_SERVER_DOCUMENT_ROOT';
        if(process.env && process.env[key]){
            var path = process.env[key];
            if(fis.util.exists(path) && !fis.util.isDir(path)){
                fis.log.error('invalid environment variable [' + key + '] of document root [' + path + ']');
            }
            return path;
        } else {
            return fis.project.getTempPath('www');
        }
    })());

    function open(path, callback) {
        fis.log.notice('browse ' + path.yellow.bold + '\n');
        var cmd = fis.util.escapeShellArg(path);
        if(fis.util.isWin()){
            cmd = 'start "" ' + cmd;
        } else {
            if(process.env['XDG_SESSION_COOKIE']){
                cmd = 'xdg-open ' + cmd;
            } else if(process.env['GNOME_DESKTOP_SESSION_ID']){
                cmd = 'gnome-open ' + cmd;
            } else {
                cmd = 'open ' + cmd;
            }
        }
        child_process.exec(cmd, callback);
    }

    function getPidFile() {
        return fis.project.getTempPath('server/pid');
    }

    function lanuch(file){
        var child_process = spawn(process.execPath, [ file ], { cwd : root });
        child_process.stderr.pipe(process.stderr);
        child_process.stdout.pipe(process.stdout);
        process.stderr.write(' ➜ server is running\n');
        fis.util.write(getPidFile(), child_process.pid);
    }

    function startServer(){
        if(fis.util.exists(root + '/Procfile')){
            var content = fis.util.read(root + '/Procfile', true);
            var reg = /^web\s*:\s*.*?node\s+([\S]+)/im;
            var match = content.match(reg);
            if(match && match[1]){
                lanuch(match[1]);
            } else {
                lanuch('.');
            }
        } else if(fis.util.exists(root + '/index.js')){
            lanuch('index.js');
        } else {
            lanuch('.');
        }
    }

    function start(){
        var cwd;
        if(fis.util.exists(root + '/server/package.json')){
            cwd = root + '/server';
        } else if(fis.util.exists(root + '/package.json')){
            cwd = root;
        }
        if(cwd){
            var npm = child_process.exec('npm install', { cwd : cwd });
            npm.stderr.pipe(process.stderr);
            npm.stdout.pipe(process.stdout);
            npm.on('exit', function(code){
                if(code === 0){
                    startServer();
                } else {
                    process.stderr.write('launch server failed\n');
                }
            });
        } else {
            startServer();
        }
    }

    function stop(callback){
        var tmp = getPidFile();
        if (fis.util.exists(tmp)) {
            var pid = fis.util.fs.readFileSync(tmp, 'utf8').trim();
            var list, msg = '';
            var isWin = fis.util.isWin();
            if (isWin) {
                list = spawn('tasklist');
            } else {
                list = spawn('ps', ['-A']);
            }

            list.stdout.on('data', function (chunk) {
                msg += chunk.toString('utf-8').toLowerCase();
            });

            list.on('exit', function() {
                msg.split(/[\r\n]+/).forEach(function(item){
                    var reg = new RegExp('\\bnode\\b', 'i');
                    if (reg.test(item)) {
                        var iMatch = item.match(/\d+/);
                        if (iMatch && iMatch[0] == pid) {
                            try {
                                process.kill(pid, 'SIGINT');
                                process.kill(pid, 'SIGKILL');
                            } catch (e) {}
                            process.stdout.write('shutdown node process [' + iMatch[0] + ']\n');
                        }
                    }
                });
                fis.util.fs.unlinkSync(tmp);
                if (callback) {
                    callback();
                }
            });
        } else {
            if (callback) {
                callback();
            }
        }
    }

    commander
        .action(function(){
            var args = Array.prototype.slice.call(arguments);
            args.pop();
            var cmd = args.shift();
            if(root){
                if(fis.util.exists(root) && !fis.util.isDir(root)){
                    fis.log.error('invalid document root [' + root + ']');
                } else {
                    fis.util.mkdir(root);
                }
            } else {
                fis.log.error('missing document root');
            }

            switch (cmd) {
                case 'start':
                    stop(start);
                    break;
//                case 'stop':
//                    stop(function(){});
//                    break;
                case 'echo-root':
                  console.log(root);
                  break;
                case 'open':
                    open(root);
                    break;
                case 'clean':
                    process.stdout.write(' δ '.bold.yellow);
                    var now = Date.now();
                    var include = fis.config.get('server.clean.include', null);
                    var reg = new RegExp('^' + fis.util.escapeReg(root + '/node_modules/'), 'i');
                    var exclude = fis.config.get('server.clean.exclude', reg);
                    fis.util.del(root, include, exclude);
                    process.stdout.write((Date.now() - now + 'ms').green.bold);
                    process.stdout.write('\n');
                    break;
                default :
                    commander.help();
            }
        });

    commander
        .command('start')
        .description('start server');

//    commander
//        .command('stop')
//        .description('shutdown server');

    commander
        .command('open')
        .description('open document root directory');

    commander
        .command('clean')
        .description('clean files in document root');
};