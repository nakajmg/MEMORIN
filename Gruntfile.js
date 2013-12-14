module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      dist: {
        options: {
          port: 8000,
          base: '.',
          open: 'http://localhost:8000/index.html'
        }
      }
    },
    sass: {
      dist: {
        files: [{
        expand: true,
        cwd: 'sass',
        src: ['*.scss'],
        dest: './css',
        ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
      browsers: ['ios >= 5', 'android >= 2.3', 'ff 15']
      },
      dist: {
      src: './css/memorin.css'
      },
    },
    csso: {
      dist: {
        files: {
          './css/memorin.min.css': ['./css/memorin.css']
        }
      }
    },
    // uglify: {
    //   my_target: {
    //   files: { 'dest/output.min.js': ['src/input1.js', 'src/input2.js'] }
    //   }
    // },
    watch: {
      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass','autoprefixer'],
        options: {
          livereload: true
        }
      },
      reload: {
        files: ['*.html','./js/*.js'],
        options: {
            livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-autoprefixer');


  //Default task.
  grunt.registerTask('default',['develop']);
  grunt.registerTask('develop',['connect','watch']);
  grunt.registerTask('publish',['sass','autoprefixer','csso']);

};