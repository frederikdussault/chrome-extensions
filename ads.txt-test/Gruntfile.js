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
        vars: {
            build: [
                'src/**/*.js*',
                '!src/**/~~*.js*',
            ],
            test: [
                'test/classes/*.js*',
            ],
        },
        newer: {
            options: {
                tolerance: 1000
            }
        },
        eslint: {
            target: [
                'package.json',
                'Gruntfile.js',
                '<%= vars.build %>',
                '<%= vars.test %>',
                '!dist/**/*.*',
                '!node_modules/**/*.*',
                '!ext-packages/**/*.*',
                '!.donotuse/**/*.*',
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
            scripts_test_suite: {
                src: ['test/js/classes/utils.js', 'test/js/classes/data.js', 'test/js/classes/sitemetas.js', 'test/js/classes/ui.js', 'test/js/classes/popup.js',],
                dest: 'test/suite.js',
            },
            scripts_test_js: {
                src: ['src/data/*.js', 'src/classes/*.js',],
                dest: 'test/classes.js',
            },
            styles: {},
            styles_test: {},
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            build: {
                files: {
                    'dist/main.css': 'src/styles/main.scss',
                }
            },
            test: {
                files: {
                    'test/css/test.css': 'test/css/test.scss',
                }
            }
        },
        // copy but does not clean files (remove obsolete)
        copy: {
            html: {
                expand: true,
                src: ['src/*'],
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
                files: ['src/styles/*.scss'],
                tasks: ['sass']
            },
            styles_test: {
                files: ['test/css/*.scss'],
                tasks: ['sass']
            },
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'newer:eslint', 'concat:scripts', 'sass:build', 'copy'
    ]);
    grunt.registerTask('test', [
        'build', 'concat:scripts_test', 'sass:test', 'watch'
    ]);
    grunt.registerTask('default', ['build', 'watch']);
};