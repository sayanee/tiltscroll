module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    bump: {
      options: {
        files: [
          'bower.json',
          'package.json',
          'src/tiltscroll.js'
        ],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
          'bower.json',
          'package.json',
          'src/tiltscroll.js'
        ],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1'
      }
    },

    clean: {
      all: [
        'dist/*.js'
      ]
    },

    copy: {
     main: {
       files: [
        {
          expand: true,
          cwd: 'src',
          src: [ 'tiltscroll.js' ],
          dest: 'dist/'
        },
        {
          expand: true,
          cwd: 'src',
          src: [ 'tiltscroll.js' ],
          dest: 'example/'
        }
      ]
     }
   },

    jscs: {
      src: [
        'Gruntfile.js',
        'src/tiltscroll.js'
      ],
      options: {
        config: '.jscsrc'
      }
    },

    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'Gruntfile.js',
          'src/tiltscroll.js'
        ]
      }
    },

    jsonlint: {
      all: {
        src: [
          'bower.json',
          '.jscs.json',
          '.jshintrc'
        ]
      }
    },

    uglify: {
      production: {
        options: {
          mangle: true,
          compress: true,
          beautify: false,
          preserveComments: 'some'
        },
        files: {
          'dist/tiltscroll.min.js': [ 'dist/tiltscroll.js' ]
        }
      }

    }

  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'clean',
    'jsonlint',
    'jscs',
    'jshint',
    'copy',
    'uglify'
  ]);

  grunt.registerTask('check', [
    'jsonlint',
    'jscs',
    'jshint'
  ]);

};
