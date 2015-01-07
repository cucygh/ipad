module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		requirejs : {
			js_compile_all : {
				options : {
					appDir : 'js/',
					baseUrl : "./",
					dir : './online/js',
					mainConfigFile : 'js/config/con-default.js',
					optimize : "uglify",
					uglify : {
						toplevel : true,
						ascii_only : true,
						beautify : false,
						max_line_length : 1000,

						//How to pass uglifyjs defined symbols for AST symbol replacement,
						//see "defines" options for ast_mangle in the uglifys docs.
						defines : {
							DEBUG : ['name', 'false']
						},

						//Custom value supported by r.js but done differently
						//in uglifyjs directly:
						//Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
						no_mangle : true
					},
					modules : [{
							name : "lot/ssq/run-ssq"
						}
					],
					preserveLicenseComments : false
				}
			}
		},
		copy : {
			main : {
				src : 'css/img/*',
				dest : 'online/',
			}
		},
		handlebars : {
			compile : {
				options : {
					amd : true,
					namespace : false,
					partialsUseNamespace : true,
					expand : true
				},
				files : [{
						expand : true,
						cwd : 'js/lot/',
						src : '**/*.handlebars',
						dest : 'js/lot/',
						filter : 'isFile',
						ext : '-tpl.js'
					}
				]
			}
		},
		'grunt-iconv-lite' : {
			main : {
				options : {},
				files : {
					'js/lot/pub/user-tpl.js' : 'js/lot/pub/user-tpl.js',
					'js/lot/pub/pay-tpl.js' : 'js/lot/pub/pay-tpl.js'
				}
			}
		},
	});
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-iconv-lite');
	grunt.registerTask('build', ['requirejs:js_compile_all']);
	grunt.registerTask('template', ['handlebars:compile']);
	grunt.registerTask('css', ['requirejs:css_compile_test', 'requirejs:css_compile_test2', 'copy:main']);
	grunt.registerTask('gbk', ['grunt-iconv-lite:main']);
};
