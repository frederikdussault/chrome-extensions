/**
 * 
 * @param {*} grunt 
 * 
 */
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    let fileDefs = {
        dist: {
            codeFolder: 'src/app/',
            script: {
                toHint: [
                    'src/js/*.js',// sources scripts
                ],
                toClean: '',
                toConcat: [],
                toCopy: [''],
                dest: '', 
                final: '', // === dest
            },
            style: {
                toWatch: ['src/css/*.scss', '!src/css/style.scss'],
                toLint: [],
                toClean: '',
                toConcat: ['src/css/style.scss'],
                toCopy: [],
                dest: 'src/css/main.scss',
                final: 'src/css/main.css'
            },
            html: {
                toCopy: [],
            },
            image: {
                toCopy: [],
            },
        },
        dev: {
            codeFolder: '/test/',
            script: {
                toWatch: ['test/js/*', 'test/libs/**', '!test/js/test.js'],
                toHint: [
                    'package.json', 'Gruntfile.js',         // packages
                    'test/**/*.js',                         // test file scripts
                    '!test/libs/**', '!test/js/test.js'
                ],
                toClean: '',
                toCopy: [],
                toConcat: [
                    'test/libs/qunit/*.js', 'test/js/suite.js'
                ],
                dest: 'test/js/test.js',
                final: 'test/js/test.js',
            },
            style: {
                toWatch: ['test/css/dev.scss', 'test/libs/qunit/*.*css', '!test/css/test.scss'],
                toLint: [],
                toClean: '',
                toCopy: [],
                toConcat: ['test/libs/qunit/*.*css', 'test/css/dev.scss'],
                dest: 'test/css/test.scss',
                final: 'test/css/test.css'
            },
            html: {
                toCopy: [],
            },
            image: {
                toCopy: '',
            },
        },
        app: {
            codeFolder: 'src/',
            toClean:  [], // 'app/**', 
        },
        test: {
            codeFolder: 'test/',
            toClean:  [], // 'app/**', 
        },
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        fileDefs: fileDefs,
        newer: {
            options: {
              tolerance: 1000
            }
        },
        jshint: {
            files: [
                '<%= fileDefs.dist.script.toHint %>',
                '<%= fileDefs.dev.script.toHint %>',
            ],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    latedef: true,
                    curly:true,
                    nonbsp: true,
                    nonew: true,
                },
                esversion: 6
            }
        },
        clean: [
            '<%= fileDefs.app.toClean %>', '<%= fileDefs.dev.style.dest %>', 
        ],
        concat: {
            options: {
                separator: '\n\n',
            },
            scripts: {
            },
            styles: {
            },
            dev_scripts: {
                src: ['<%= fileDefs.dev.script.toConcat %>'],
                dest: '<%= fileDefs.dev.script.dest %>',
            },
            dev_styles: {
                src: ['<%= fileDefs.dev.style.toConcat %>'],
                dest: '<%= fileDefs.dev.style.dest %>',
            },
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    '<%= fileDefs.dist.style.final %>': '<%= fileDefs.dist.style.dest %>'
                }
            },
            dev: {
                files: {
                    '<%= fileDefs.dev.style.final %>': '<%= fileDefs.dev.style.dest %>'
                }
            },
        },
        copy: {
            dist: {
            },
            dev: {
            },
        },
        watch: {
            scripts: {
                files: ['<%= jshint.files %>'], 
                tasks: ['newer:jshint', 'clean', 'concat', 'copy']            },
            styles: {
                files: [
                    '<%= fileDefs.dist.style.toWatch %>',
                    '<%= fileDefs.dev.style.toWatch %>',
                ],
                tasks: ['clean', 'concat', 'sass', 'copy']
            },
            others: {
                files: [
                    '<%= fileDefs.dist.codeFolder %>*',  
                    '<%= fileDefs.dev.codeFolder %>*',  
                    '!<%= watch.scripts.files %>', '!<%= watch.styles.files %>'
                ],
                tasks: ['copy']
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build-dist', [
        'newer:jshint', 'clean', 
        'concat:scripts', 'concat:styles', 'sass:dist', 'copy:dist',
    ]);
    grunt.registerTask('build',      [
        'newer:jshint', 'clean',
        'concat:scripts', 'concat:styles', 'sass:dist', 'copy:dist', 
        'concat:dev_scripts', 'concat:dev_styles', 'sass:dev', 'copy:dev',
    ]);
    grunt.registerTask('dist',    ['build-dist', 'watch']);
    grunt.registerTask('dev',     ['build', 'watch']);
    grunt.registerTask('default', ['dev']);
    
};