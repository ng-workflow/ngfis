'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs-extra');

var bower = require('bower');
var inquirer = require('inquirer');
var globby = require('globby');
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
      var componentRoot = path.join(root, options.directory);
      var projectMeta = getProjectMeta(root, options.directory);
      projectMeta.overrides = _.defaults(projectMeta.overrides || {}, require('./bower-meta'));

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

      console.log('[Installer] bower install %s to: %s', repo, componentRoot);

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
        simplify(installed, projectMeta, componentRoot);
      });
    });
};

/**
 * read bower.json, if not exsit, create one using pkgInfo.
 */
function getProjectMeta(root, directory){
  var metaPath = path.join(root, 'bower.json');
  var projectMeta = fs.readJsonSync(metaPath, {throws: false});
  if(!projectMeta){
    var pkgMeta = fs.readJsonSync(path.join(root, 'package.json'));
    projectMeta = {
      name: pkgMeta.name,
      private: true
    };
    console.log('[Installer] create bower.json');
    fs.writeJsonSync(metaPath, projectMeta);
    fs.writeJsonSync(path.join(root, '.bowerrc'), {"directory": directory});
  }
  return projectMeta;
}

/**
 * simplify component deps, using `meta.mapping`
 */
function simplify(installed, projectMeta, componentRoot){
  var ignore = projectMeta.ignoreDependencies || [];
  for(var key in installed) {
    //Notify: `bower install z=zepto#1.1.0`, then key=z, componentName=zepto
    if (installed.hasOwnProperty(key)) {
      if(ignore.indexOf(key) !== -1){
        console.log('[Installer] remove ignore: %s ...', key);
        fs.removeSync(path.join(componentRoot, key));
      }else{
        var item = installed[key];
        var componentName = item.endpoint.source;
        console.log('[Installer] simplify %s ...', componentName);
        //merge meta: overrides -> buildinMeta -> own bower
        var meta = _.assign(item.pkgMeta, projectMeta.overrides && projectMeta.overrides[componentName]);
        syncFiles(key, meta, componentRoot);
      }
    }
  }
  console.log('[Installer] finish install: %s', _.difference(Object.keys(installed), ignore).join(', ') || 'nth need to install/update.');
}

/**
 * copy file by `meta.mapping`
 */
function syncFiles(componentName, meta, componentRoot){
  var srcDir = path.join(componentRoot, componentName);
  var targetDir = path.join(componentRoot, '.' + meta.name);
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
