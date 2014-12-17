'use strict';

var util = require('util');
var fs = require('fs-extra');
var path = require('path');
var shelljs = require('shelljs');
var bower = require('bower');
var inquirer = require('inquirer');
var globby = require('globby');
var mkdirp = require('mkdirp');

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

    //  bower.commands.install(repo, {
    //    'save': commander.save,
    //    'force-latest': true,
    //    'production': true
    //  }, {
    //    directory: commander.directory,
    //    interactive: true
    //  }).on('log', function (data){
    //    var endpoint = data.data.endpoint;
    //    var targetMsg = data.data.endpoint ? util.format('%s#%s', endpoint.name, endpoint.target) : '';
    //    var str = util.format('bower %s  %s %s', targetMsg, data.id, data.message);
    //    fis.log.notice(str)
    //  }).on('prompt', function (prompts, callback) {
    //    inquirer.prompt(prompts, callback);
    //  })
    //  .on("error", function (data){
    //    fis.log.error(data);
    //  })
    //  .on("end", function (data) {
    //    simplify(data);
    //  });
      //simplify();
      var metaMapping = require('./bower-meta');
      syncFiles('bootstrap', metaMapping.bootstrap.mapping, 'component_modules')

    });
    function simplify(installed){
      shelljs.config.fatal = true;
      console.log(installed);
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
      var metaMapping = require('./bower-meta');
      for(var key in installed){
        if(installed.hasOwnProperty(key)){
          var item = installed[key];
          //TODO: 读取根目录bower, merge
          var meta = fis.util.merge(item.pkgMeta, metaMapping[key] || {});
          var targetDir = installed[key].canonicalDir;
          var tmpDir = path.join(targetDir, '../.' + key);

          var files = meta.files || {};

          fis.util.map(files, function(key, value){
            //shelljs.mkdir('-p', path.dirname(path.join(targetDir, value)));
            fis.util.copy(path.join(targetDir, value), path.join(tmpDir, key));
            //shelljs.cat(path.join(targetDir, value)).to(path.join(tmpDir, key));
          });
          fis.util.write(path.join(tmpDir, 'bower.json'), JSON.stringify(meta, null, '  '));
          //console.log(meta)
        }
      }
    }
};

function syncFiles(componentName, mapping, root){
  root = root || 'component_modules';
  var targetDir = path.join(root, componentName);
  var tmpDir = path.join(root, '.' + componentName);

  //move source to tmpDir
  fs.renameSync(targetDir, tmpDir);

  //normalize mapping to glob style
  mapping.splice(0, 0, 'bower.json', 'component.json', 'package.json');
  var patterns = mapping.map(function(item){
    if((typeof item === 'string') || item instanceof String){
      return {src: item, dest: item, cwd: './'};
    }else if(item.src){
      item.cwd = item.cwd || './';
      return item;
    }else{
      console.warn('unknown mapping patten: ' + JSON.stringify(item));
    }
  }).filter(function(item){
    return !!item;
  });

  patterns.forEach(function(pattern){
    var cwd = path.join(tmpDir, pattern.cwd);
    //expand glob
    var files = globby.sync(pattern.src, {cwd: cwd});
    //copy files
    files.forEach(function(file){
      var sourceFile = path.join(cwd, file);
      var targetFile = path.join(targetDir, file);
      if(fs.statSync(sourceFile).isFile()){
        console.log('[copy] %s -> %s', path.relative(tmpDir, sourceFile), path.relative(targetDir, targetFile));
        fs.copySync(sourceFile, targetFile);
      }
    });
  });

  //remove tmpDir
  fs.removeSync(tmpDir);
}