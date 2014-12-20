module.exports = {
  "angular": {
    "exports": "window.angular"
  },
  "bootstrap1": {
    //"main":  "js/bootstrap.js",
    "mapping": [
      {"cwd": "dist", "src": [ "css/**.css", "js/bootstrap.js", "fonts/**", "!**/*.min.*", "!**/*theme.*"]}
    ]
  }
};