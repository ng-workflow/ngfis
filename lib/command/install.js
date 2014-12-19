'use strict';

var util = require('util');
var fs = require('fs-extra');
var path = require('path');
var shelljs = require('shelljs');
var bower = require('bower');
var inquirer = require('inquirer');
var globby = require('globby');
var mkdirp = require('mkdirp');
var _ = require('lodash');

exports.name = 'install';
exports.usage = '[name] [name#version...] [options]';
exports.desc = 'install bower modules';
exports.register = function (commander){
  commander
    .option('-c, --clean', 'clean cached packages')
    .option('-d, --directory [path]', 'set install directory, default: `src/component_modules`', 'src/component_modules')
    .option('--dev', 'also install project devDependencies')
    .option('--no-save', 'do not save installed packages into the project dependencies')
    .option('--save-dev', 'save installed packages into the project devDependencies')
    .action(function (){
      var args = Array.prototype.slice.call(arguments);
      var options = args.pop();

      if (options.clean){
        console.log('[Installer] clean bower cache.');
        bower.commands.cache.clean();
      }

      var root = fis.project.configDir;
      var directory = path.join(root, options.directory);
      var projectMeta = getProjectMeta(root);

      //change `z=zepto#1.0.0` to 'zepto#1.0.0'
      var repo = args.map(function(name){
        var m = name.match(/([^=]+=)*(.*)/);
        return m[2];
      });

      var bowerOptions = {
        save: options.save && !options.saveDev,
        saveDev: options.saveDev,
        forceLatest: true,
        production: !options.dev
      };

      var bowerConfigs = {
        cwd: root,
        //Notify: if use full path, it will block.
        directory: options.directory,
        interactive: true
      };

      console.log('[Installer] bower install %s to: %s', repo, directory);

      //start install
      var installer = bower.commands.install(repo, bowerOptions, bowerConfigs);
      installer.on('log', function (data){
        var endpoint = data.data.endpoint;
        var targetMsg = data.data.endpoint ? util.format('%s#%s', endpoint.name, endpoint.target) : '';
        var str = util.format('   %s  %s %s', targetMsg, data.id, data.message);
        console.log(str);
      });
      installer.on('prompt', function (prompts, callback) {
        inquirer.prompt(prompts, callback);
      });
      installer.on("error", function (data){
        fis.log.error(data);
      });
      installer.on("end", function (installed) {
        simplify(installed, projectMeta, directory);
      });
    });
};

/**
 * read bower.json, if not exsit, create one using pkgInfo.
 */
function getProjectMeta(root){
  var metaPath = path.join(root, 'bower.json');
  var projectMeta = fs.readJsonSync(metaPath, {throws: false});
  if(!projectMeta){
    var pkgMeta = fs.readJsonSync(path.join(root, 'package.json'));
    projectMeta = {
      name: pkgMeta.name,
      private: true
    };
    fs.writeJsonSync(metaPath, projectMeta);
  }
  return projectMeta;
}

/**
 * simplify component deps, using `meta.mapping`
 */
function simplify(installed, bowerMeta, root){
  installed = installed || {"zepto":{"endpoint":{"name":"zepto","source":"zepto","target":"~1.1.6"},"canonicalDir":"d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\zepto","pkgMeta":{"name":"zepto","description":"Shim repository for the Zepto.js JavaScript library.","version":"1.1.6","main":"./zepto.js","ignore":["*.md",".gitignore","Makefile"],"homepage":"https://github.com/components/zepto","_release":"1.1.6","_resolution":{"type":"version","tag":"1.1.6","commit":"508d1a05bde2454251a86273ccef7a3368857719"},"_source":"git://github.com/components/zepto.git","_target":"*"},"dependencies":{},"nrDependants":1},"angular":{"endpoint":{"name":"angular","source":"angular","target":"~1.3.7"},"canonicalDir":"d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\angular","pkgMeta":{"name":"angular","version":"1.3.7","main":"./angular.js","ignore":[],"dependencies":{},"homepage":"https://github.com/angular/bower-angular","_release":"1.3.7","_resolution":{"type":"version","tag":"v1.3.7","commit":"6bede464de3d762812b1a64a931b5b828e833b9d"},"_source":"git://github.com/angular/bower-angular.git","_target":"*"},"dependencies":{},"nrDependants":1},"bootstrap":{"endpoint":{"name":"bootstrap","source":"bootstrap","target":"~3.3.1"},"canonicalDir":"d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\bootstrap","pkgMeta":{"name":"bootstrap","description":"The most popular front-end framework for developing responsive, mobile first projects on the web.","version":"3.3.1","keywords":["css","js","less","mobile-first","responsive","front-end","framework","web"],"homepage":"http://getbootstrap.com","main":["less/bootstrap.less","dist/css/bootstrap.css","dist/js/bootstrap.js","dist/fonts/glyphicons-halflings-regular.eot","dist/fonts/glyphicons-halflings-regular.svg","dist/fonts/glyphicons-halflings-regular.ttf","dist/fonts/glyphicons-halflings-regular.woff"],"ignore":["/.*","_config.yml","CNAME","composer.json","CONTRIBUTING.md","docs","js/tests","test-infra"],"dependencies":{"jquery":">= 1.9.1"},"_release":"3.3.1","_resolution":{"type":"version","tag":"v3.3.1","commit":"9a7e365c2c4360335d25246dac11afb1f577210a"},"_source":"git://github.com/twbs/bootstrap.git","_target":"*"},"dependencies":{"jquery":{"endpoint":{"name":"jquery","source":"jquery","target":">= 1.9.1"},"canonicalDir":"d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\jquery","pkgMeta":{"name":"jquery","version":"2.1.1","main":"dist/jquery.js","license":"MIT","ignore":["**/.*","build","speed","test","*.md","AUTHORS.txt","Gruntfile.js","package.json"],"devDependencies":{"sizzle":"1.10.19","requirejs":"2.1.10","qunit":"1.14.0","sinon":"1.8.1"},"keywords":["jquery","javascript","library"],"homepage":"https://github.com/jquery/jquery","_release":"2.1.1","_resolution":{"type":"version","tag":"2.1.1","commit":"4dec426aa2a6cbabb1b064319ba7c272d594a688"},"_source":"git://github.com/jquery/jquery.git","_target":">= 1.9.1"},"dependencies":{},"nrDependants":2}},"nrDependants":1},"jquery":{"endpoint":{"name":"jquery","source":"jquery","target":">= 1.9.1"},"canonicalDir":"d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\jquery","pkgMeta":{"name":"jquery","version":"2.1.1","main":"dist/jquery.js","license":"MIT","ignore":["**/.*","build","speed","test","*.md","AUTHORS.txt","Gruntfile.js","package.json"],"devDependencies":{"sizzle":"1.10.19","requirejs":"2.1.10","qunit":"1.14.0","sinon":"1.8.1"},"keywords":["jquery","javascript","library"],"homepage":"https://github.com/jquery/jquery","_release":"2.1.1","_resolution":{"type":"version","tag":"2.1.1","commit":"4dec426aa2a6cbabb1b064319ba7c272d594a688"},"_source":"git://github.com/jquery/jquery.git","_target":">= 1.9.1"},"dependencies":{},"nrDependants":2}};

  var buildinMeta = require('./bower-meta');
  for(var key in installed) {
    //Notify: `bower install z=zepto#1.1.0`, then key=z, componentName=zepto
    if (installed.hasOwnProperty(key)) {
      var item = installed[key];
      var componentName = item.endpoint.source;
      console.log('[Installer] process %s ...', componentName);
      //merge meta: overrides -> buildinMeta -> own bower
      var meta = _.assign(item.pkgMeta, buildinMeta[componentName], bowerMeta.overrides && bowerMeta.overrides[componentName]);
      syncFiles(key, meta, root);
    }
  }
  console.log('[Installer] finish install: %s', Object.keys(installed).join(', ') || 'nth need to install/update.');
}

/**
 * copy file by `meta.mapping`
 */
function syncFiles(componentName, meta, root){
  root = root || 'component_modules';
  var srcDir = path.join(root, componentName);
  var targetDir = path.join(root, '.' + meta.name);
  var mapping = meta.mapping;

  //use `main` if mapping is null
  if(!mapping && meta.main){
    //move dist outside
    var m = meta.main.match(/(\.\/)?dist\/(.*)/);
    if (m) {
      meta.main = m[2];
      mapping = [{src: meta.main, cwd: 'dist'}];
    } else {
      mapping = [meta.main];
    }
  }

  if(mapping){
    //normalize mapping to glob style
    mapping.unshift('.bower.json', 'bower.json', 'component.json', 'package.json');
    var defaultPattens = ['!**/*.min.*', '!**/*.md'];
    var patterns = mapping.reduce(function (result, item) {
      if (typeof item === 'string') {
        result.push({src: [item].concat(defaultPattens), dest: item, cwd: './'});
      } else if (item.src) {
        item.cwd = item.cwd || './';
        item.src = [].concat(item.src, defaultPattens);
        result.push(item);
      } else {
        console.warn('\tunknown mapping patten: ' + JSON.stringify(item));
      }
      return result;
    }, []);

    //sync files
    patterns.forEach(function (pattern) {
      var cwd = path.join(srcDir, pattern.cwd);
      //expand glob
      var files = globby.sync(pattern.src, {cwd: cwd});
      //copy files
      files.forEach(function (file) {
        var sourceFile = path.join(cwd, file);
        var targetFile = path.join(targetDir, file);
        if (fs.statSync(sourceFile).isFile()) {
          console.log('    copy %s -> %s', path.relative(srcDir, sourceFile), path.relative(targetDir, targetFile));
          fs.copySync(sourceFile, targetFile);
        }
      });
    });

    //write meta
    meta._installedTime = new Date().getTime();
    meta = _.omit(meta, function(v, k){return k.indexOf('_')==0;});
    fs.writeJsonSync(path.join(targetDir, 'bower.json'), meta);

    //remove tmpDir
    fs.removeSync(srcDir);
    //move source to tmpDir
    fs.renameSync(targetDir, srcDir);
  }
}