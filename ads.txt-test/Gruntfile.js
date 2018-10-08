/**
 * 
 * @param {*} grunt 
 * 
 */
module.exports = function (grunt) {

    const sass = require('node-sass');
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        newer: {
            options: {
                tolerance: 1000
            }
        },
        eslint: {
            target: [
                'package.json',
                'Gruntfile.js',
                'src/**/*.js*',
                '!src/**/~~*.js*',
                '!dist/**/*.*',
                '!node_modules/**/*.*',
                '!ext-packages/**/*.*',
            ]
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + 
                        '<%= grunt.template.today("yyyy-mm-dd") %> */',
                process: function(src, filepath) {
                    return  '\n\n/* ====================================\n' + 
                            ' * Source: ' + filepath + '\n' +
                            ' * ==================================== */\n\n' + 
                            src;
                    },
            },
            scripts: {
                src: ['src/data/*.js', 'src/classes/*.js', 'src/popup.js'],
                dest: 'dist/popup.js',
            },
            styles: {},
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/main.css': 'src/main.scss'
                }
            }
        },
        // copy but does not clean files (remove obsolete)
        copy: {
            html: {
                expand: true,
                cwd: 'src/',
                src: ['*.html, *.png, manifest.json'],
                dest: 'dist/',
                flatten: true,
                filter: 'isFile',
            },
        },
        watch: {
            scripts: {
                files: ['<%= eslint.target %>'],
                tasks: ['newer:eslint', 'concat', 'copy']
            },
            styles: {
                files: ['src/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'newer:eslint', 'concat', 'sass', 'copy'
    ]);
    grunt.registerTask('default', ['build', 'watch']);
};