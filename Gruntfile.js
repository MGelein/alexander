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
                src: '*.js',
                dest: '../js/',
                cwd: 'src',
                ext: '.min.js'
            }]
            }
          }
      });
    
      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
    
      // Default task(s).
      grunt.registerTask('default', ['uglify']);
    
    };