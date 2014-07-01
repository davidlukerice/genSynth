'use strict';

var config = {
  app: 'public',
  dist: 'dist'
};

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      neuter: {
        files: ['<%= config.app %>/ember/{,*/}*.js'],
        tasks: ['neuter', 'replace:sourceMap']
      },
      serverTemplates: {
        files: ['server/views/**'],
        options: {
          livereload: true,
        }
      },
      js: {
        files: ['server/**/*.js'],
        // tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    },
    nodemon: {
      dev: {
        script: 'server.js'
      },
      options: {
        ignore: ['node_modules/**'],
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    mochaTest: {
      src: ['test/**/*.js'],
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    clean: {
      server: '.tmp'
    }
  });

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');

  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', [
    'clean:server',
    'concurrent'
  ]);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
