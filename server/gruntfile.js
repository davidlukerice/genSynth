
var config = {
  app: 'public',
  dist: 'dist'
};

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'gruntfile.js',
        'server/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      scripts: {
        files: ['server/**/*.js'],
        tasks: ['jshint'],
        options: {
        }
      },
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ignore: ['node_modules/**']
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
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
  grunt.loadNpmTasks('grunt-node-inspector');

  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'clean:server',
    'concurrent'
  ]);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
