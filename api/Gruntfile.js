var path = require('path'),
    expressConfig = require('./config/expressConfig').config;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js','config/**/*.js', 'src/**/*.js']
    },
    express: {
      prodServer: {
        options: {
          port: expressConfig.port,
          hostname: expressConfig.hostname,
          server: path.resolve('./src/server')
        }
      },
      devServer: {
        options: {
          port: expressConfig.port,
          hostname: expressConfig.hostname,
          server: path.resolve('./src/server'),
          serverreload: true,
          showStack: true,
          watcherOptions: {
            files: ['config/**/*.js', 'src/**/*.js']
          }
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express');

  // Servers
  grunt.registerTask('server', "Run REST server auto-rebuilding when files change.", [
    'jshint:all',
    'express:devServer'
  ]);

  grunt.registerTask('server:dist', ['express:prodServer', 'express-keepalive']);

  grunt.registerTask('default', ['server']);
};