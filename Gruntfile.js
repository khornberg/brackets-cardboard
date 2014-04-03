module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    clean : ['docs'],
    jsdoc : {
      docstrap : {
        src : ['main.js', 'modules/**/*.js', 'tests/managers/template.js', 'CONTRIBUTING.md'],
        options : {
          destination: 'docs',
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          configure : 'jsdoc.conf.json'
        }
      }
    },
    'gh-pages': {
        options: {
            base: 'docs'
        },
        src: ['**']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task.
  grunt.registerTask('default', ['clean', 'jsdoc:docstrap', 'gh-pages']);
};