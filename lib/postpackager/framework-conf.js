var path = require('path');
var fs = require('fs');
var shelljs = require('shelljs');
var moment = require('moment');

module.exports = function (ret, conf, settings, opt){
  var pkgFile = ret.src['/package.json'];
  var pkgInfo = readJSON(pkgFile._content, '/package.json');
  var map = fis.config.get('framework', {});
  map.name = fis.config.get('name') || pkgInfo.name;
  map.version = fis.config.get('version') || pkgInfo.version;
  map.prefix = '__' + map.name.toUpperCase() + '__';
  map.combo = map.hasOwnProperty('combo') ? map.combo : !!opt.pack;
  map.domain = opt.domain && fis.config.get('roadmap.domain');
  map.urlPrefix = map.urlPrefix || ('/' + (fis.config.get('projectPrefix') || '') + '/lib').replace(/^\/\//, '/');
  map.urlPattern = map.urlPattern || '/%s';
  map.comboPattern = map.comboPattern || '/??%s';
  map.hash = fis.util.md5(Date.now() + '-' + Math.random());


  //临时缓存用户声明, 避免被覆盖.
  var tmpAlias = map.alias || {};
  map.alias = {};
  map.deps = {};

  //package.json 增加buildDate
  addBuildInfo(map, ret);

  //测试文件转换
  transformTest(map, ret, opt);

  //模板文件转换
  transformTemplate(map, ret, opt);

  //map.cache=true时, 转换css为js,以便缓存
  transformCSS(map, ret, opt);

  //分析生态模块的别名
  //checkComponentModule(ret.src['/component.json']);
  analysisComponentModulesAlias(ret.src['/component.json'], map, ret);

  //用户声明的别名
  fis.util.map(tmpAlias, function(name, subpath){
    var file = ret.src['/' + subpath.replace(/^\//, '')];
    if(file){
      map.alias[name] = file.getId();
    } else {
      map.alias[name] = subpath;
    }
  });

  //反置别名key/value, 便于分析依赖用
  tmpAlias = {};
  fis.util.map(map.alias, function(alias, id){
    tmpAlias[id] = alias;
  });

  //临时变量收集依赖
  var tmpDeps = {};
  fis.util.map(map.deps, function(id, deps){
    tmpDeps[id] = deps;
  });

  //分析生态/工程模块的别名和依赖
  fis.util.map(ret.src, function(subpath, file){
    var id = file.getId();
    if(file.isMod && (file.isJsLike || file.isCssLike)){
      //TODO: css不视为主模块?
      if(file.isJsLike){
        //文件名=目录名, 则视为工程模块的主模块, 设置别名
        var match = file.subpath.match(/^\/components\/(.*?([^\/]+))\/\2\.(js|jsx)$/i);
        if(match && match[1] && !map.alias.hasOwnProperty(match[1])){
          map.alias[match[1]] = id;
          tmpAlias[id] = match[1];
        }
      }
      if(file.requires.length > 0){
        tmpDeps[id] = file;
      }
    }else if(id in tmpAlias){
      //不是模块化文件, 但有声明别名, 那也收集依赖
      if(file.requires.length > 0){
        tmpDeps[id] = file;
      }
    }
  });

  //收集文件依赖的ID或别名
  fis.util.map(tmpDeps, function(id, file){
    var deps = [];
    file.requires.forEach(function(depId){
      if(map.alias.hasOwnProperty(depId)){
        deps.push(depId);
      } else if(tmpAlias.hasOwnProperty(depId)){
        deps.push(tmpAlias[depId]);
      } else if(ret.ids.hasOwnProperty(depId)) {
        deps.push(depId);
      } else {
        fis.log.warning('undefined module [' + depId + '] require from [' + file.subpath + ']');
      }
    });
    if(deps.length){
      map.deps[id] = deps;
    }else{
      delete map.deps[id];
    }
  });

  //替换View文件里面的资源依赖表
  transformView(map, ret, opt);
};

/**
 * 把tpl.html转换为js，以便依赖
 * @param {Object} map 框架配置文件对象
 * @param {Object} ret 系统整理的文件对象
 * @param {Object} opt 命令参数
 */
function transformTemplate(map, ret, opt){
  var jsCallback = map.defineJSCallback || 'define';
  ret.tpl = ret.tpl || {};
  fis.util.map(ret.src, function (subpath, file) {
    if(file.isMod && file.isTemplate) {
      //文件名=目录名, 则视为工程模块的主模块, 设置别名
      //var match = file.subpath.match(/^\/components\/(.*?([^\/]+))\/\2\.(tpl|tpl\.html)$/);
      //var jsPath = file.subpath.replace(/\.tpl\.html$/i, '.js');
      //if(!ret.src[jsPath] && match && match[1]){
      //  var newId = file.getId() + '.js';
      //  var alias = match[1];
      //  //TODO: scrat添加defineTemplate方法, 不耦合require('app'), 并测试模板中依赖模板
      //  var content = jsCallback + "('" + newId + "', function(require, exports, module){\n\nexports.template = "
      //              + JSON.stringify(file.getContent()) + ";\n"
      //              + "require('app').template('" + alias + "', exports.template);"
      //              +"\n\n});";
      //  var f = fis.file(file.realpath);
      //  f.id = newId;
      //  f.setContent(content);
      //  //f.basename = f.basename.replace(/\.tpl\.html$/, '.js');
      //  //f.fullname = f.fullname.replace(/\.tpl\.html$/, '.js');
      //  //f.ext = f.rExt = '.js';
      //  //f.filename = 'gameList';
      //  f.compiled = true;
      //  f.isJsLike = true;
      //  f.isHtmlLike = false;
      //  f.release = file.release.replace(/\.tpl\.html$/, '.js');
      //  ret.pkg[subpath + '.js'] = f;
      //  map.alias[alias] = f.id;
      //  delete ret.src[subpath];
      //}
      file.release = false;
    }
  });
}

/**
 * 把css转换为js，以便可以缓存到localstorage
 * @param {Object} map 框架配置文件对象
 * @param {Object} ret 系统整理的文件对象
 * @param {Object} opt 命令参数
 */
function transformCSS(map, ret, opt){
  if(map.cache) {
    var cssCallback = map.defineCSSCallback || 'defineCSS';
    fis.util.map(ret.src, function (subpath, file) {
      if(file.isMod && file.isCssLike) {
        //把css转换为js，以便可以缓存到localstorage
        var content = cssCallback + "('" + file.getId() + "', " + JSON.stringify(file.getContent()) + ');';
        var f = fis.file(file.realpath);
        f.setContent(content);
        f.compiled = true;
        f.release = file.release + '.js';
        ret.pkg[subpath + '.js'] = f;
        //原css不发布取决于framework.releaseCss
        if(!map.releaseCss){
          file.release = false;
        }
      }
    });
  }
}

/**
 * 替换View页面文件中的资源依赖表
 * @param {Object} map 框架配置文件对象
 * @param {Object} ret 系统整理的文件对象
 * @param {Object} opt 命令参数
 */
function transformView(map, ret, opt){
  var stringify = JSON.stringify(map, null, opt.optimize ? null : 2);
  fis.util.map(ret.src, function(subpath, file){
    if(['component.json', 'bower.json', '.bower.json'].indexOf(file.basename.toLowerCase()) !== -1){
      //不输出这些文件
      file.release = false;
      delete ret.src[subpath];
    }else if(file.isViews && file.isText()){
      //替换View页面文件中的资源依赖表
      var content = file.getContent();
      var hasChange = false;
      content = content.replace(/\b__FRAMEWORK_CONFIG__\b/g, function(){
        hasChange = true;
        return stringify;
      });
      if(hasChange){
        file.setContent(content);
        opt.beforeCompile(file);
      }
    }
  });
}

/**
 * 为component_modules目录下的模块建立别名
 * @param {fis.file.File} componentFile 模块的component.json文件对象
 * @param {Object} map 框架配置文件对象
 * @param {Object} ret 系统整理的文件对象
 */
function analysisComponentModulesAlias(componentFile, map, ret){
  var componentRoot = (fis.config.get('component.dir')|| 'component_modules').replace(/\\/g, '/').replace(/\/$/, '').replace(/^\//, '');
  if(componentFile && componentFile.exists()){
    var json = readJSON(componentFile.getContent(), componentFile.subpath);
    //遍历bower.json中的dependencies字段
    var dependencies = json.dependencies || [];

    //兼容json.dependencies是对象的情况
    if(!Array.isArray(json.dependencies) && typeof json.dependencies === 'object'){
      dependencies = Object.keys(json.dependencies).map(function(name){
        return name + '@' + json.dependencies[name];
      });
    }

    //遍历
    dependencies.forEach(function(deps){
      var name = deps.replace(/^[^\/]*\//g, '').replace(/@.*/, '');
      //提取模块名称 /^(?:(.+):)?(?:(.+)\/)?(.+?)(?:@(.+))?$/
      //记录alias，默认跟模块名一致
      var alias = name;
      //获取模块的component.json文件
      var dirname = '/' + componentRoot + '/' + name + '/';
      var file = componentFile = ret.src[dirname + 'component.json'];
      if (file) {
        //读取当前模块的component.json文件，解析内容
        var json = readJSON(file.getContent(), file.subpath);
        //如果定义了name字段，就用name字段作为alias
        alias = json.name || alias;
        //开始寻找主文件，建立别名映射
        if(json.main){
          var mainFile = json.main;
          //main为数组时
          if(Array.isArray(mainFile)){
            fis.log.error('missing meta.componentMain where meta.main is array of module [' + name + ']');
          }
          //判断main文件
          if(file = ret.src[dirname + mainFile.replace(/^\.\//, '')]) {
            map.alias[alias] = file.getId();
          } else {
            fis.log.error('missing main file [' + mainFile + '] of module [' + name + ']');
          }
        }
        //还没找到时
        if (!map.alias[alias]) {
          if (file = ret.src[dirname + 'index.js']) {
            //index.js文件
            map.alias[alias] = file.getId();
          } else if (file = ret.src[dirname + name + '.js']) {
            //同名JS文件
            map.alias[alias] = file.getId();
          } else if (file = ret.src[dirname + 'index.css']) {
            //index.css文件
            map.alias[alias] = file.getId();
          } else if (file = ret.src[dirname + name + '.css']) {
            //同名CSS文件
            map.alias[alias] = file.getId();
          } else if(json.scripts && json.scripts.length === 1 && (file = ret.src[dirname + json.scripts[0]])){
            //仅有一个scripts时
            map.alias[alias] = file.getId();
          } else if(json.styles && json.styles.length === 1 && (file = ret.src[dirname + json.styles[0]])){
            //仅有一个styles时
            map.alias[alias] = file.getId();
          } else {
            fis.log.warning('can`t find module [' + name + '@' + version + '] in [/component.json]');
          }
        }
        //递归分析依赖的别名
        analysisComponentModulesAlias(componentFile, map, ret);
      }
    });
  }
}

/**
 * 检查component.json声明的依赖和生态模块目录是否匹配
 * @param {fis.file.File} componentFile 模块的component.json文件对象
 */
//function checkComponentModule(componentFile){
  //var componentRoot = (fis.config.get('component.dir')|| 'component_modules').replace(/\\/g, '/').replace(/\/$/, '').replace(/^\//, '');
  //if(componentFile && componentFile.exists()){
  //  var json = readJSON(componentFile.getContent(), componentFile.subpath);
  //  var dependencies = JSON.stringify(json.dependencies.map(function(deps){
  //    return deps.replace(/^[^\/]*\//g, '').replace(/@.*/, '');
  //  }).sort());
  //  var files = JSON.stringify(fs.readdirSync('./' + componentRoot).sort());
  //  if(dependencies !== files){
  //    fis.log.warning('dependencies not match, require ' + dependencies + ' in /component.json but got ' + files + ' in disk.');
  //  }
  //}else{
  //  fis.log.warning('missing project\'s /component.json');
  //}
//}

/**
 * 增加构建信息
 */
function addBuildInfo(map, ret){
  var pkgFile = ret.src['/package.json'];
  var pkgInfo = readJSON(pkgFile._content, '/package.json');
  map.buildInfo = pkgInfo.buildInfo = {
    user: shelljs.exec('git config user.name', {silent: true}).output.replace(/\r?\n/g, ''),
    email: shelljs.exec('git config user.email', {silent: true}).output.replace(/\r?\n/g, ''),
    modifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    ngfisVersion: fis.cli.info.version
  };
  pkgFile._content = JSON.stringify(pkgInfo, null, '  ');
}

/**
 * 未提供 -t 参数则不发布测试文件
 */
function transformTest(map, ret, opt){
  fis.util.map(ret.src, function(subpath, file){
    if(!opt.test && file.isTest){
      file.release = false;
    }
  });
}

/**
 * 读取json内容，加一个统一的错误处理
 * @param {String} content
 * @param {String} path
 * @returns {*}
 */
function readJSON(content, path){
  try {
    return JSON.parse(content);
  } catch (e){
    fis.log.error('invalid json file [' + path + '] : ' + e.message);
  }
}
