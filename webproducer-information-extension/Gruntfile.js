/**
 * 
 * @param {*} grunt 
 * 
 * NOTE:
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
        newer: {
            options: {
              tolerance: 1000
            }
        },
        eslint: {
            all: ['**/*.js', '**/*.json', '!node_modules/*']
        },      
        watch: {
            scripts: {
                files: ['**/*.js', '**/*.json'], 
                tasks: ['newer:eslint']
            },
        }
    });

    grunt.loadNpmTasks('eslint-grunt');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['newer:eslint', 'watch']);
    
};