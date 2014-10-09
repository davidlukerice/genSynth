
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
          env: {
            NODE_ENV: 'development'
          },
          nodeArgs: ['--debug'],
          ignore: ['node_modules/**']
        }
      },
      prod: {
        script: 'server.js',
        options: {
          env: {
            NODE_ENV: 'production'
          },
          watch: []
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      prod: {
        tasks: ['nodemon:prod'],
        options: {
          logConcurrentOutput: true
        }
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
    'concurrent:dev'
  ]);

  grunt.registerTask('prod', [
    'clean:server',
    'concurrent:prod'
  ]);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
