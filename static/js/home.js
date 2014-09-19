/**
 * 主页面模块加载
 *
 */

define(function(require) {

	var $ = require('jquery');

	var $menus = $('.sidemenu').find('a'),

		$main = $('#J_main-data');

	/* 更新左侧导航样式 */
	function updateMenuStyle(key) {

		var m = $menus.filter('name'),

			matcher = $menus.filter(function() {
				return new RegExp(key).test($(this).prop('href'));
			});

		if (matcher.length) {

			var $li = $(matcher).parent();

			$li.addClass('current');
			$li.siblings().removeClass('current');
		}
	}

	/* 根据page key 展示相应模块 */
	function getContent(key) {

		var $elem = $('#' + key);

		// $elem.fadeIn(120);
		// $elem.siblings().hide();

		$('.main').load('/tsm-ui/demo/' + key + '/index.html');

		updateMenuStyle(key);
	}

	$menus.on('click', function() {

		var key = $(this).attr('href').split('#')[1];

		getContent(key);

	});


	!(function pageLoaded() {
		var hash = $.trim(window.location.hash),
			key_arr = [],
			key = $menus.eq(0).attr('href').split('#')[1];

		if (hash.length && (key_arr = hash.split('#')).length) {
			
			key = key_arr[1];
		}

		getContent(key);

	})();

});