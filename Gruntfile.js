/**
 * 
 * @param {*} grunt 
 * 
 */

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['package.json', 'Gruntfile.js', 
                    '**/*.js', '**/*.json', '!**/node_modules/**/*.js*',
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
        watch: {
            jshint: {
                files: ['<%= jshint.files %>'],
                tasks: ['newer:jshint']
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['newer:jshint','watch']);
    
};