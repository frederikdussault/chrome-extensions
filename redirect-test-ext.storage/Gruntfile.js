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
        eslint: {
            options: {
                configFile: '.eslintrc.json',
                format: 'html',
                outputFile: '',
                fix: true
            },
            target: [
                'package.json',
                'Gruntfile.js',
                'src/*.js*',
            ],
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
            dist: {
                files: {
                    'src/ui.css': 'src/ui.scss'
                }
            }            
        },
        watch: {
            scripts: {
                files: ['<%= eslint.target %>'], 
                tasks: ['newer:eslint', 'concat']
            },
            styles: {
                files: ['src/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build',   ['newer:eslint', 'concat', 'sass']);
    grunt.registerTask('default', ['build', 'watch']);    
};