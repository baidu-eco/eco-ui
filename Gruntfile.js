module.exports = function(grunt) {

	'use strict';

	grunt.file.defaultEncoding = 'utf8';
	grunt.file.preserveBOM = false;



	var _Release = {

		replace: {

			// Javascript 替换方式
			script: function(str) {

				return str
					.replace(/define\(.+,\s*function\s*\(.+\)\s*{/, '')
					.replace(/\}\);(?=(?:(?!\}\);)[\s\S])*$)/ig, '');
			}
		}
	};



	// 读取发布配置
	var _rConf = grunt.file.readJSON('Release-Config.json'),
		_rArr = _rConf.releaseMap;


	for (var i = 0; i < _rArr.length; i++) {

		var name = _rArr[i].name,
			task = _rArr[i].task;

		readProduct(_rArr[i]);
	}

	// 遍历项目
	function readProduct(json) {

		var task = json.task;

		if( json.release ) {

			for (var i = 0; i < task.length; i++) {
				var item = task[i];

				reader(item);
			}
		}
	}


	// 遍历项目配置
	function reader(conf) {

		grunt.file.recurse(

			conf.src,

			function(abspath, rootdir, subdir, filename) {

				var is_f = isFilter(conf, abspath);

				// 不在过滤器中
				if( !is_f ) {

					var npath = getNewPath(subdir, filename);

					// js 需要进行特殊处理
					if (/.*\.(?:js)/.test(filename)) {

						// 读取文件内容
						var cont = readFiles(conf, abspath, rootdir, subdir, filename);
						
						releasePush(conf, function(dest) {
							grunt.file.write(dest + npath, cont);
						});
					}

					// 其他文件直接进行 copy
					else {

						releasePush(conf, function(dest) {
							grunt.file.copy(abspath, dest + npath);
						});
					}
 				}
			}
		);
	}

	// 获取新的路径名
	function getNewPath(dir, filename) {

		var npath = '';

		if (dir !== undefined) {
			npath += dir + "/";
		}

		return npath += filename;
	}

	// 过滤器
	function isFilter(conf, abspath) {

		if (conf.filter) {

			for (var i = 0; i < conf.filter.length; i++) {
				var fr = conf.filter[i];

				if( new RegExp( fr ).test( abspath ) ) {
					
					return true;
				}
			}
		}

		return false;
	}

	// 读取文件
	function readFiles(conf, abspath, rootdir, subdir, filename) {

		var cont = grunt.file.read(abspath);

		// 根据 json 配置 replace 文件之后输出
		if (conf.replace == true) {
			cont = _Release.replace.script(cont);
		}

		return cont;
	}

	// 输出文件
	function releasePush(conf, callback) {

		for (var i = 0; i < conf.dest.length; i++) {
			callback(conf.dest[i]);
		}
	}


	// 打包配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
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


	// 加载包含 "uglify" 任务的插件。
	grunt.loadNpmTasks('grunt-contrib-uglify');


	// 默认被执行的任务列表。
	grunt.registerTask('default', ["uglify:all"]);

};