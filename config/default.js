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
      js: []
    },
    prepackager: [],
    postpackager: [],
    deploy: []
  },
  urlPrefix: '',
  framework: {
    //cache: true,
    urlPattern: '/%s',
    comboPattern: '/co??%s'
  },
  roadmap: {
    path: []
  }
};