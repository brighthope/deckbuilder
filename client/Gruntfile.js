module.exports = function(grunt) {

  var path = require('path');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'http-server': {
      dev: {
        root: 'src',
        host: 'localhost',
        port: 8080,
        showDir: true,
        runInBackground: false,
        openBrowser: true
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist'
          ]
        }]
      }
    },
    dojo: {
      dist: {
        options: {
          dojo: path.join('src', 'dojo', 'dojo.js'),
          profile: path.join('profiles', 'app.profile.js'),
          releaseDir: path.join('..', 'dist'),
          dojoConfig: path.join('src', 'dojoConfig.js'),
          basePath: path.join(__dirname, 'src')
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-dojo');

  grunt.registerTask('run', ['http-server:dev']);
  grunt.registerTask('build', [ 'clean', 'dojo:dist']);

};