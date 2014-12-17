'use strict';

var util = require('util');
var fs = require('fs-extra');
var path = require('path');
var shelljs = require('shelljs');
var bower = require('bower');
var inquirer = require('inquirer');
var globby = require('globby');
var mkdirp = require('mkdirp');
var merge = require('merge');

exports.name = 'install';
exports.usage = '[name#version] [options]';
exports.desc = 'install bower modules';
exports.register = function (commander){
  commander
    .option('-S, --no-save', 'not save dependencies into json file', Boolean)
    .option('-c, --clean', 'clean install cache', Boolean)
    .option('-d, --directory [path]', 'install destination', String, 'src/component_modules')
    .action(function (name){
      var repo = name.split(/\s+/);

      if (commander.clean){
        bower.commands.cache.clean();
      }

      bower.commands.install(repo, {
        'save': commander.save,
        'force-latest': true,
        'production': true
      }, {
        directory: commander.directory,
        interactive: false
      }).on('log', function (data){
        var endpoint = data.data.endpoint;
        var targetMsg = data.data.endpoint ? util.format('%s#%s', endpoint.name, endpoint.target) : '';
        var str = util.format('[Installer] bower %s  %s %s', targetMsg, data.id, data.message);
        console.log(str);
      }).on('prompt', function (prompts, callback) {
        inquirer.prompt(prompts, callback);
      })
      .on("error", function (data){
        fis.log.error(data);
      })
      .on("end", function (installed) {
        simplify(installed, commander.directory);
      });
    });
};

function simplify(installed, root){
  installed = installed || {
    "zepto": {
      "endpoint": {
        "name": "zepto",
        "source": "zepto",
        "target": "~1.1.6"
      },
      "canonicalDir": "d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\zepto",
      "pkgMeta": {
        "name": "zepto",
        "description": "Shim repository for the Zepto.js JavaScript library.",
        "version": "1.1.6",
        "main": "./zepto.js",
        "ignore": [
          "*.md",
          ".gitignore",
          "Makefile"
        ],
        "homepage": "https://github.com/components/zepto",
        "_release": "1.1.6",
        "_resolution": {
          "type": "version",
          "tag": "1.1.6",
          "commit": "508d1a05bde2454251a86273ccef7a3368857719"
        },
        "_source": "git://github.com/components/zepto.git",
        "_target": "*"
      },
      "dependencies": {},
      "nrDependants": 0
    },
    "angular": {
      "endpoint": {
        "name": "angular",
        "source": "angular",
        "target": "~1.3.7"
      },
      "canonicalDir": "d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\angular",
      "pkgMeta": {
        "name": "angular",
        "version": "1.3.7",
        "main": "./angular.js",
        "ignore": [],
        "dependencies": {},
        "homepage": "https://github.com/angular/bower-angular",
        "_release": "1.3.7",
        "_resolution": {
          "type": "version",
          "tag": "v1.3.7",
          "commit": "6bede464de3d762812b1a64a931b5b828e833b9d"
        },
        "_source": "git://github.com/angular/bower-angular.git",
        "_target": "*"
      },
      "dependencies": {},
      "nrDependants": 0
    },
    "bootstrap": {
      "endpoint": {
        "name": "bootstrap",
        "source": "bootstrap",
        "target": "~3.3.1"
      },
      "canonicalDir": "d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\bootstrap",
      "pkgMeta": {
        "name": "bootstrap",
        "description": "The most popular front-end framework for developing responsive, mobile first projects on the web.",
        "version": "3.3.1",
        "keywords": [
          "css",
          "js",
          "less",
          "mobile-first",
          "responsive",
          "front-end",
          "framework",
          "web"
        ],
        "homepage": "http://getbootstrap.com",
        "main": [
          "less/bootstrap.less",
          "dist/css/bootstrap.css",
          "dist/js/bootstrap.js",
          "dist/fonts/glyphicons-halflings-regular.eot",
          "dist/fonts/glyphicons-halflings-regular.svg",
          "dist/fonts/glyphicons-halflings-regular.ttf",
          "dist/fonts/glyphicons-halflings-regular.woff"
        ],
        "ignore": [
          "/.*",
          "_config.yml",
          "CNAME",
          "composer.json",
          "CONTRIBUTING.md",
          "docs",
          "js/tests",
          "test-infra"
        ],
        "dependencies": {
          "jquery": ">= 1.9.1"
        },
        "_release": "3.3.1",
        "_resolution": {
          "type": "version",
          "tag": "v3.3.1",
          "commit": "9a7e365c2c4360335d25246dac11afb1f577210a"
        },
        "_source": "git://github.com/twbs/bootstrap.git",
        "_target": "*"
      },
      "dependencies": {
        "jquery": {
          "endpoint": {
            "name": "jquery",
            "source": "jquery",
            "target": ">= 1.9.1"
          },
          "canonicalDir": "d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\jquery",
          "pkgMeta": {
            "name": "jquery",
            "version": "2.1.1",
            "main": "dist/jquery.js",
            "license": "MIT",
            "ignore": [
              "**/.*",
              "build",
              "speed",
              "test",
              "*.md",
              "AUTHORS.txt",
              "Gruntfile.js",
              "package.json"
            ],
            "devDependencies": {
              "sizzle": "1.10.19",
              "requirejs": "2.1.10",
              "qunit": "1.14.0",
              "sinon": "1.8.1"
            },
            "keywords": [
              "jquery",
              "javascript",
              "library"
            ],
            "homepage": "https://github.com/jquery/jquery",
            "_release": "2.1.1",
            "_resolution": {
              "type": "version",
              "tag": "2.1.1",
              "commit": "4dec426aa2a6cbabb1b064319ba7c272d594a688"
            },
            "_source": "git://github.com/jquery/jquery.git",
            "_target": ">= 1.9.1"
          },
          "dependencies": {},
          "nrDependants": 1
        }
      },
      "nrDependants": 0
    },
    "jquery": {
      "endpoint": {
        "name": "jquery",
        "source": "jquery",
        "target": ">= 1.9.1"
      },
      "canonicalDir": "d:\\Workspace\\Code\\ng-workflow\\ngfis\\dist\\jquery",
      "pkgMeta": {
        "name": "jquery",
        "version": "2.1.1",
        "main": "dist/jquery.js",
        "license": "MIT",
        "ignore": [
          "**/.*",
          "build",
          "speed",
          "test",
          "*.md",
          "AUTHORS.txt",
          "Gruntfile.js",
          "package.json"
        ],
        "devDependencies": {
          "sizzle": "1.10.19",
          "requirejs": "2.1.10",
          "qunit": "1.14.0",
          "sinon": "1.8.1"
        },
        "keywords": [
          "jquery",
          "javascript",
          "library"
        ],
        "homepage": "https://github.com/jquery/jquery",
        "_release": "2.1.1",
        "_resolution": {
          "type": "version",
          "tag": "2.1.1",
          "commit": "4dec426aa2a6cbabb1b064319ba7c272d594a688"
        },
        "_source": "git://github.com/jquery/jquery.git",
        "_target": ">= 1.9.1"
      },
      "dependencies": {},
      "nrDependants": 1
    }
  };

  var buildinMeta = require('./bower-meta');
  var componentMeta = require(process.cwd() + '/bower.json');
  for(var key in installed) {
    if (installed.hasOwnProperty(key)) {
      console.log('[Installer] process %s ...', key);
      var item = installed[key];
      //overrides -> buildinMeta -> own bower
      var meta = componentMeta.overrides && componentMeta.overrides[key];
      meta = meta || buildinMeta[key] || item.pkgMeta;
      syncFiles(key, meta, root);
    }
  }
  console.log('[Installer] finish install: %s', Object.keys(installed).join(', ') || 'nth need to install/update.');
}

function syncFiles(componentName, meta, root){
  var mapping = meta.mapping;
  if(!mapping && meta.main){
    meta.main = meta.main.replace(/(\.\/)?dist\/(.*)/, '$2');
    mapping = [meta.main];
  }
  root = root || 'component_modules';
  var srcDir = path.join(root, componentName);
  var targetDir = path.join(root, '.' + componentName);

  //normalize mapping to glob style
  mapping.splice(0, 0, '.bower.json', 'bower.json', 'component.json', 'package.json');
  var patterns = mapping.reduce(function (result, item) {
    if (typeof item === 'string'){
      result.push({src: item, dest: item, cwd: './'});
    } else if (item.src) {
      item.cwd = item.cwd || './';
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
        console.log('\tcopy %s -> %s', path.relative(srcDir, sourceFile), path.relative(targetDir, targetFile));
        fs.copySync(sourceFile, targetFile);
      }
    });
  });

  //remove tmpDir
  fs.removeSync(srcDir);
  //move source to tmpDir
  fs.renameSync(targetDir, srcDir);
}