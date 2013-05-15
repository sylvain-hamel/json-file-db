/*global module:false*/
module.exports = function (grunt) {
  "use strict";

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.initConfig({
    watch: {
      all:{
        files: ['**/*.js', '!node_modules/**/*.js'],
        tasks: 'default'
      }
    },
    simplemocha: {
      test: {
        src: 'test/test.js'
      },
      options: {
        reporter:"spec" //list, dot, min
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['simplemocha']);

};