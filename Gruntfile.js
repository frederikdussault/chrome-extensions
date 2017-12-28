/**
 * 
 * @param {*} grunt 
 * 
 * notes:
 * https://gruntjs.com/api/grunt.option
 * https://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/
 * https://www.sitepoint.com/writing-awesome-build-script-grunt/
 * https://aarontgrogg.com/blog/2016/03/04/how-to-use-dynamic-variables-in-a-grunt-config-file/
 * 
 * https://www.npmjs.com/package/grunt-sass
 * https://stackoverflow.com/questions/24001043/how-to-debug-a-gruntfile-with-breakpoints-using-node-inspector-windows-7 
 * 
 * Command line: grunt [task] [--tmpl=herobanner|null]

 * npm list -g --depth=0
 */

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['package.json', 'Gruntfile.js', 
                    'app/js/*.js', '!app/js/main.js',
                    'app/test/**/*.js', '!app/test/qunit/*.js',
                    'test-server/*.js', '!test-server/app/**/*.js',
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
        concat: {
            options: {
                separator: '\n\n',
            },
            dev_scripts: {
                src: ['node_modules/jquery/dist/jquery.min.js', 'app/libs/qunit/*.js', 'app/js/utils.js', 'app/js/appConfigs.js', 'app/js/herobanner.js', 'app/js/modules.js', 'app/js/view.js', 'app/js/output.js', 'app/js/controler.js', 'app/js/suite.js'],
                dest: 'app/test.js',
            },
            dev_styles: {
                src: ['app/libs/qunit/*.css', 'app/css/style.scss'],
                dest: 'app/css/test.scss',
            },
            scripts: {
                src: ['node_modules/jquery/dist/jquery.min.js', 'app/js/utils.js', 'app/js/appConfigs.js', 'app/js/herobanner.js', 'app/js/modules.js', 'app/js/view.js', 'app/js/output.js', 'app/js/controler.js', 'app/js/entry.js'],
                dest: 'app/main.js',
            },
            styles: {
                src: ['app/css/style.scss'],
                dest: 'app/css/main.scss',
            },
        },
        sass: {
            options: {
                sourceMap: true
            },
            test: {
                files: {
                    'app/test.css': 'app/css/test.scss'
                }
            },
            dist: {
                files: {
                    'app/main.css': 'app/css/main.scss'
                }
            },
        },
        clean: ['test-server/app/**'],
        copy: {
            test: {
                expand: true,
                src: ['app/*','!app/js','!app/css','!app/libs'],
                dest: 'test-server',
            },
            dist: {
                expand: true,
                src: ['app/*', '!app/test.*','!app/js','!app/css','!app/libs'],
                dest: 'test-server',
            },
        },
        watch: {
            scripts: {
                files: ['<%= jshint.files %>'],
                tasks: ['newer:jshint','concat','clean','copy']
            },
            styles: {
                files: ['app/css/*.scss', '!app/css/main.scss'],
                tasks: ['concat', 'sass','clean','copy']
            },
            others: {
                files: ['app/**', '!<%= watch.scripts.files %>', '!<%= watch.styles.files %>'],
                tasks: ['clean','copy']
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dist',    ['newer:jshint','concat:scripts','concat:styles','sass:dist','clean','copy:dist','watch']);
    grunt.registerTask('default', ['newer:jshint','concat:dev_scripts','concat:dev_styles','sass:test','clean','copy:test','watch']);
    
};