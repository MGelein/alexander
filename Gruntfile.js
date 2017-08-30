module.exports = function(grunt) {
    
      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
              options: {
                sourceMap: true,
                sourceMapName: 'path/to/sourcemap.map'
              },
              files: {
                'js/alexander.min.js': ['src/lib.js', 'src/loader.js', 'src/documents.js', 
                                        'src/editor.js', 'src/pw.js', 'src/print.js']
              }
            }
          }
      });
    
      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
    
      // Default task(s).
      grunt.registerTask('default', ['uglify']);
    
    };