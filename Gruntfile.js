module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Mocha
		mocha: {
			all: {
				src: ['tests/testrunner.html'],
			},
			options: {
				run: true,
				reporter: 'Spec'
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('default', ['mocha']);
};