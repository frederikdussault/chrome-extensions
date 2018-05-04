/**
 * 
 * @param {*} grunt 
 * 
 */
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        newer: {
            options: {
              tolerance: 1000
            }
        },
        jshint: {
            files: [
                'package.json',
                'Gruntfile.js',
                'src/*.js*',
            ],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console: true,
                    document: true,
                    latedef: true,
                    curly:true,
                    nonbsp: true,
                    nonew: true,
                },
                esversion: 6
            }
        },
        concat: {
            options: {
                separator: '\n\n',
            },
            scripts: {
            },
            styles: {
            },
        },
        sass: {
            options: {
                sourceMap: true
            },
            files: { 'src/ui.css': 'src/ui.scss' }  // does not find that
        },
        watch: {
            scripts: {
                files: ['<%= jshint.files %>'], 
                tasks: ['newer:jshint', 'concat']            },
            styles: {
                files: ['src/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build',      [
        'newer:jshint', 'concat', 'sass'
    ]);
    grunt.registerTask('default',     ['build', 'watch']);    
};