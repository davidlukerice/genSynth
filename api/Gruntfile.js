var path = require('path'),
    expressConfig = require('./config/expressConfig').config;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'Gruntfile.js',
        'config/**/*.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
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
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      lint: {
        files: ['<%= jshint.files %>'],
        tasks: [
          'jshint',
          //'qunit'
        ]        
      },
      build: {
        files: ['src/**/*.js'],
        tasks: ['express:devServer']
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watches: {
        tasks: ["watch:lint"]//, "watch:build"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-express');

  // Servers
  grunt.registerTask('server', "Run REST server auto-rebuilding when files change.", [
    'jshint',
    //'qunit',
    'express:devServer',
    'concurrent:watches'
  ]);

  grunt.registerTask('server:dist', ['express:prodServer', 'express-keepalive']);

  grunt.registerTask('default', ['server']);
};