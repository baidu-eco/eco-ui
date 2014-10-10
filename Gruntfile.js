// var path = require("path");

module.exports = function(grunt) {

	'use strict';

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;


	// 项目配置
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		rmod: {

			baidu_ui: {
				src: "src/",
				dest: [ "D:/workspace/brand-common/widget/ui/" ],
				filters: ["src/paging/"],
				rule: "head-foot:null"// head_foot:window, head_foot:null
			},

			git_release: {
				src: "D:/dev/tsm-ui/",
				dest: "D:/git-pro/tsm-ui/",
				filters: ["node_modules/", "dist/"]
			}
		}

		,uglify: {
			all: {
				files: [{
					expand: true,
					cwd: 'dist/', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'dist/', //输出到此目录下
					ext: '.min.js' // 修改后缀
				}],
				options: {
					mangle: false
					// ,banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				}
			}
		}


	});

	// 加载我自己搞的一个插件....
	grunt.loadNpmTasks('rmod');

	// 加载包含 "uglify" 任务的插件。, 'uglify:all'
	// grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['rmod']);
};