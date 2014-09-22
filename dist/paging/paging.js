/**
 * Paging
 * Deo - denglingbo@126.com
 * Date: 2014.09.09
 *
 */
define('common:udo/ui/paging', function(require, exports, module) {

	var classes = {
		tab: 'upaging',
		clicked: 'upaging_clicked'
	};

	// 函数的默认配置参数
	var getDefault = function() {

		return {
			view: 3
		}
	};

	// 主函数
	var paging = function(list, options) {

		this.elems = {
			list: $(list)
		};

		this.def = getDefault();

		$.extend(this.def, options);

		pri.init.call(this);

		return this;
	};

	// 私有函数，不可被修改
	var pri = {};

	$.extend( pri, {

		init: function() {
			
		}
	});


	// 添加可修改扩展的接口
	$.extend( paging.prototype, {

		

	});



	module.exports = paging;
});