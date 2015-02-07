var plugins = {
  define : require('../lib/postprocessor/define.js'),
  annotate : require('../lib/postprocessor/annotate.js'),
  //uaeConf : require('../lib/prepackager/uae-conf.js'),
  frameworkConf : require('../lib/postpackager/framework-conf.js')
};

module.exports = {
  project: {
    fileType: {},
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
    prepackager: [],
    postpackager: [
      plugins.frameworkConf
    ],
    //deploy: []
  },
  urlPrefix: '',
  framework: {
    cache: true,
    urlPattern: '/%s',
    comboPattern: '/co??%s'
  },
  roadmap: {
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
        reg : /^\/components\/(.*\.js)$/i,
        id : '$1',
        isMod : true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1',
        release : '/public/${name}/${version}/lib/$1'
      },
      {
        reg : /^\/components\/(.*)\.(styl|css)$/i,
        id : '$1.css',
        isMod : true,
        useSprite : true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1.$2',
        release : '/public/${name}/${version}/lib/$1.$2'
      },
      {
        reg : /^\/components\/(.*)\.tpl\.html$/i,
        id : '$1',
        isMod : true,
        isTemplate : true,
        isHtmlLike: true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1.tpl.html',
        release : '/public/${name}/${version}/lib/$1.tpl.html'
      },
      {
        reg : /^\/components\/(.*)$/i,
        url : '${urlPrefix}/${name}/${version}/lib/$1',
        release : '/public/${name}/${version}/lib/$1'
      },
      {
        reg : /^\/component_modules\/(.*\.js)$/i,
        id : '$1',
        isMod : true,
        isComponentModule: true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1',
        release : '/public/${name}/${version}/lib/$1'
      },
      {
        reg : /^\/component_modules\/(.*)\.(styl|css)$/i,
        id : '$1.css',
        isMod : true,
        isComponentModule: true,
        useSprite : true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1.$2',
        release : '/public/${name}/${version}/lib/$1.$2'
      },
      {
        reg : /^\/component_modules\/(.*)\.tpl\.html$/i,
        id : '$1',
        isMod : true,
        isComponentModule: true,
        isTemplate : true,
        isHtmlLike: true,
        useHash : false,
        url : '${urlPrefix}/${name}/${version}/lib/$1.tpl.html',
        release : '/public/${name}/${version}/lib/$1.tpl.html'
      },
      {
        reg : /^\/component_modules\/(.*)$/i,
        url : '${urlPrefix}/${name}/${version}/lib/$1',
        release : '/public/${name}/${version}/lib/$1'
      },
      {
        reg : /^\/views\/(.*\.(?:html?|js))$/,
        useCache : false,
        isViews : true,
        isHtmlLike: true,
        url : '${urlPrefix}/${name}/${version}/$1',
        release : '/public/${name}/${version}/$1'
      },
      {
        reg : /^\/views\/(.*)$/,
        useSprite : true,
        isViews : true,
        url : '${urlPrefix}/${name}/${version}/$1',
        release : '/public/${name}/${version}/$1'
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
    command: {
      install: {
        directory: 'component_modules'
      }
    }
  }
};