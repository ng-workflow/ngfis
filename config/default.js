var plugins = {
  define : require('../lib/postprocessor/define.js'),
  annotate : require('../lib/postprocessor/annotate.js'),
  vender : require('../lib/prepackager/vender.js'),
  //uaeConf : require('../lib/prepackager/uae-conf.js'),
  frameworkConf : require('../lib/postpackager/framework-conf.js')
};

//console.log(fis.config.get('name'), fis.config.get('version'))

module.exports = {
  project: {
    fileType: {
      text : 'handlebars, jade, ejs, jsx, styl, tag'
    },
    exclude: /(node_modules\/.*)|(bower_modules\/.*)|(dist\/.*)/
  },
  modules: {
    parser: {
    },
    lint: {
      js: 'jshint'
    },
    postprocessor: {
      js: [
        plugins.define,
        plugins.annotate
      ]
    },
    prepackager: [
      plugins.vender
    ],
    postpackager: [
      plugins.frameworkConf
    ],
    optimizer: {
      png: 'pngcrush',
      json: function(content){
        return JSON.stringify(JSON.parse(content));
      }
    },
    deploy: ['default', 'compress']
  },
  component: {
    dir: '/component_modules'
  },
  projectPrefix: '',
  framework: {
    cache: true,
    urlPattern: '/%s',
    comboPattern: '/co??%s'
  },
  roadmap: {
    ext: {
    },
    path: [
      //{
      //  reg: /.*\.tpl\.html$/,
      //  release: false
      //},
      {
        reg : '**.md',
        isHtmlLike : true,
        release : false
      },
      {
        reg : /\.inline\.\w+$/i,
        release : false
      },
      {
        reg: /^\/test\/test-main\.js$/,
        isViews: true,
        isTest: true,
        useHash : false,
        release: '/test/test-main.js'
      },
      {
        reg: /^\/test\/(.*\.spec\.js)$/,
        id : '$1',
        isJsLike: true,
        isMod : true,
        isTest: true,
        useHash : false,
        release: '/test/${projectPrefix}/$1'
      },
      {
        reg: /^\/components\/(.*\.spec\.js)$/,
        id : '$1',
        isJsLike: true,
        isMod : true,
        isTest: true,
        useHash : false,
        release: '/test/${projectPrefix}/$1'
      },
      {
        reg : /^\/components\/(.*\.js)$/i,
        id : '$1',
        isMod : true,
        useHash : false,
        url : '${projectPrefix}/lib/$1',
        release : '/public/${projectPrefix}/lib/$1'
      },
      {
        reg : /^\/components\/(.*)\.(styl|css)$/i,
        id : '$1.css',
        isMod : true,
        useSprite : true,
        useHash : false,
        url : '${projectPrefix}/lib/$1.$2',
        release : '/public/${projectPrefix}/lib/$1.$2'
      },
      {
        reg : /^\/components\/(.*)\.tpl\.html$/i,
        id : '$1',
        isMod : true,
        isTemplate : true,
        isHtmlLike: true,
        useHash : false,
        url : '${projectPrefix}/lib/$1.tpl.html',
        release : '/public/${projectPrefix}/lib/$1.tpl.html'
      },
      {
        reg : /^\/components\/(.*)\.json$/i,
        url : '${projectPrefix}/lib/$1',
        useHash : false,
        release : '/public/${projectPrefix}/lib/$1'
      },
      {
        reg : /^\/components\/(.*)$/i,
        url : '${projectPrefix}/lib/$1',
        release : '/public/${projectPrefix}/lib/$1'
      },
      {
        reg : /^\/component_modules\/(.*\.js)$/i,
        id : 'c/$1',
        isMod : true,
        useHash : false,
        url : '${projectPrefix}/lib/c/$1',
        release : '/public/${projectPrefix}/lib/c/$1'
      },
      {
        reg : /^\/component_modules\/(.*)\.(styl|css)$/i,
        id : 'c/$1.css',
        isMod : true,
        useSprite : true,
        useHash : false,
        url : '${projectPrefix}/lib/c/$1.$2',
        release : '/public/${projectPrefix}/lib/c/$1.$2'
      },
      {
        reg : /^\/component_modules\/(.*)\.tpl\.html$/i,
        id : 'c/$1',
        isMod : true,
        isTemplate : true,
        isHtmlLike: true,
        useHash : false,
        url : '${projectPrefix}/lib/c/$1.tpl.html',
        release : '/public/${projectPrefix}/lib/c/$1.tpl.html'
      },
      {
        reg : /^\/component_modules\/(.*)$/i,
        url : '${projectPrefix}/lib/c/$1',
        useHash : false,
        release : '/public/${projectPrefix}/lib/c/$1'
      },
      {
        reg : /^\/views\/(favicon\.(?:png|ico))$/,
        useHash : false,
        url : '/$1',
        release : '/public/$1'
      },
      {
        reg : /^\/views\/(.*\.(?:html?|js))$/,
        useCache : false,
        //useHash : false,
        isViews : true,
        isHtmlLike: true,
        url : '${projectPrefix}/$1',
        release : '/public/${projectPrefix}/$1'
      },
      {
        reg : /^\/views\/(.*)$/,
        useSprite : true,
        //useHash : false,
        isViews : true,
        url : '${projectPrefix}/$1',
        release : '/public/${projectPrefix}/$1'
      },
      {
        reg : 'map.json',
        release : false
      },
      {
        reg : '**',
        useHash : false,
        useCompile : false
      }
    ]
  },
  settings: {
    vender: {

    },
    optimizer : {
      "uglify-js" : {
        mangle: {
          except: ["require", "exports", "module", "window"]
        },
        compress: {
          "global_defs": {
            PROD: true
          },
          "dead_code": true,
          "pure_funcs": [
            "console.log",
            //"console.info",
            //"console.warn",
            //"console.error",
            "console.assert",
            "console.count",
            "console.clear",
            "console.group",
            "console.groupEnd",
            "console.groupCollapsed",
            "console.trace",
            "console.debug",
            "console.dir",
            "console.dirxml",
            "console.profile",
            "console.profileEnd",
            "console.time",
            "console.timeEnd",
            "console.timeStamp",
            "console.table",
            "console.exception"
          ]
        }
      }
    },
    deploy: {
      default: {
        //ngfis release -d local
        local: {
          to: '../dist'
        }
      },
      //ngfis release -d zip
      compress: {
        zip: {
        }
      }
    }
  }
};