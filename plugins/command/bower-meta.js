module.exports = {
  angular: {
    main: 'angular.js',
    filter: {

    }
  },
  bootstrap: {
    "main":  "js/bootstrap.js",
    "mapping": [
      {cwd: 'dist', src: ['css/**.css', "js/bootstrap.js", 'fonts/**', '!**/*.min.*', '!**/*theme.*']}
    ]
  },
  zepto: {

  }
};