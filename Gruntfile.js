module.exports = function(grunt) {
    
      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
          uglify: {
            my_target: {
              options: {
                mangle: false
              },
              files: [{
                expand: true,
                src: 'js/*.js',
                dest: 'dist/',
                ext: '.min.js'
            }]
            }
          },
          concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['dist/js/alexander.min.js', 'dist/js/util.min.js', 'dist/js/select.min.js', 
                    'dist/js/event.min.js', 'dist/js/account.min.js', 'dist/js/ajax.min.js',
                    
                    'dist/js/text.min.js', 'dist/js/global.min.js'],//keep global.min.js as last file!
              dest: 'dist/alexander.min.comp.js',
            },
          }
      });
    
      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-concat');
    
      // Default task(s).
      grunt.registerTask('default', ['uglify', 'concat']);
    
    };