/**
 * Carousel 轮播组件
 * Deo - denglingbo@126.com
 * Date: 2014.09.02
 *
 */
define('common:udo/ui/carousel', function(require, exports, module) {

	var classes = {
		carousel: 'carousel',
		layout: 'carousel_layout',
		runner: 'carousel_runer',
		index_button: 'carousel_index_button',
		dir_button: 'carousel_dir_button',
		clicked_button: 'carousel_clicked_button',
		disabled_button: 'carousel_disabled_button',
		prev: 'carousel_prev',
		next: 'carousel_next'
	};

	// 函数的默认配置参数
	var getDefault = function() {

		return {

			// 可视区域配置
			// @required
			view: {
				width: undefined,
				height: undefined
			},

			// 轮播步长
			// 如果子项已经设置好了固定高宽，则可以忽略此项，这个条件下横向或纵向的轮播效果可以通过函数内部自动获取步长
			// @type
			//	1. {string} 按照即将播放的元素的 长或宽，该配置下，函数会自动根据view 的设置对子项进行设置
			//	2. {number}
			step: 'auto',

			// 如果没有数据传入，则直接使用指定 element 中的 dom 作为list 数据
			// @required 或者 根据selector 参数中的配置从指向的 element 容器里获取数据
			// @type
			// 	1. {undefined} 从 element 中获取
			//	2. {Array} [{},{},{},...]
			data: undefined,

			// 选择器
			selector: {
				outer: 'ul',
				inner: 'li'
			},

			// 用于传递数据方式时的模板渲染, 使用 selector 的设置进行替换
			template: {
				outer: '<${outer} class="' + classes.carousel + '">',
				inner: '<${inner}>{data}</${inner}>'
			},

			// 索引按钮
			indexButton: true,

			// 方向按钮
			dirButton: true,

			// 方向按钮自动隐藏，鼠标悬停在 element 的时候才显示
			dirButtonAutoHide: true,

			// 动画的执行时间(ms)
			duration: 300,

			// 默认展示的索引元素
			index: 0,

			// 动画类型
			// @allow params:
			//	1.fade 渐隐渐现
			//	2.silde 滑动
			animateType: 'silde',

			// 动画执行方向，该参数在 渐现效果中无效
			// @allow params:
			//	1.hori
			//	2.vert
			animateDir: 'hori',

			// 是否自动播放
			autoPlay: true,

			// 自动播放的切换延迟(ms)
			autoDelay: 4000,

			// 回调函数
			onAnimateBefore: function(runner) {},
			onAnimateComplete: function(runner) {}

		}
	};

	// 主函数
	var carousel = function(selector, options) {

		this.timer = {};

		this.elems = {
			source: $(selector)
		};

		this.selector = selector;

		this.def = getDefault();

		$.extend(this.def, options);

		// 替换 template 参数中的变量
		var temp = this.def.template,
			sr = this.def.selector;

		for (var k in temp) {
			temp[k] = temp[k].replace(/\${(\w*)}/gi, sr[k]);
		}

		pri.init.call(this);

		return this;
	};

	function _throw(selector, detail) {
		throw ('Carousel: selector -> [' + selector + '], details -> ' + detail);
	}

	// 私有函数，不可被修改
	var pri = {};

	// 初始化，绑定一些必需的函数
	pri.init = function() {

		if (this.def.view.width == undefined || this.def.view.height == undefined) {
			_throw(this.selector, 'def.view');
		}

		var arr = this.def.data;

		// 从数组数据中获取
		if (arr && $.isArray(arr)) {
			pri.printDOM.call(this);
		}
		// 从dom 中提取数据
		else {
			this.elems.source.find(this.def.selector.outer).wrap(pri.getWrap.call(this));
		}

		this.elems.source.find('.' + classes.runner).wrap(
			'<div class="' + classes.layout + ' carousel_' + this.def.animateDir + '">'
		);

		pri.storeElems.call(this);

		pri.updateWrapStyle.call(this);

		pri.printButtons.call(this);

		pri.bindEvent.call(this);
	};

	// 通过data 的数据渲染 dom
	pri.printDOM = function() {

		var arr = this.def.data,

			temp = this.def.template,

			dom_arr = [temp.outer];

		for (var i = 0; i < arr.length; i++) {

			dom_arr.push(

				// 替换数据内容
				temp.inner.replace(/{(\w*)}/i, function(w, d) {

					// 跟 data 中的数据进行匹配替换
					return arr[i][d];
				})
			);
		}

		dom_arr.push(temp.outer.replace(/^</, '</'));

		this.elems.source.html(
			pri.getWrap.call(this, dom_arr.join(''))
		);
	};

	// 储存常用元素
	pri.storeElems = function() {
		// 控制可视区域，负责包裹滚动元素的容器
		this.elems.layout = this.elems.source.find('.' + classes.layout);

		// 在滚动状态下，实际发生位移的元素
		this.elems.runner = this.elems.source.find('.' + classes.runner);

		// 展示的元素列表
		this.elems.list = this.elems.runner.find(this.def.selector.inner);

		this.elems.dirButton = null;
		this.elems.indexButton = null;
	};

	// 创建轮播的控制按钮
	pri.printButtons = function() {

		var getter = sizeGetter.call(this, this.def.animateDir),
			dom_arr = [],
			size = this.elems.runner[getter.outer](),
			// 根据总长度除以步长，粗略计算按钮个数
			len = Math.round(size / this.def.step - ((this.def.view[getter.def] - this.def.step) / this.def.step));

		if (isNaN(len)) {
			len = this.elems.list.length
		}

		// 索引按钮，对应子项
		if (!this.elems.source.find('.' + classes.index_button).length) {

			this.elems.layout.append('<div class="' + classes.index_button + '"></div>');

			// 添加该元素到 elems 中
			this.elems.indexButton = this.elems.layout.find('.' + classes.index_button);
		}

		for (var i = 0; i < len; i++) {
			dom_arr.push('<span to="' + i + '"><em>' + (i + 1) + '</em></span>');
		}

		this.elems.indexButton.html(dom_arr.join(''));


		// 轮播方向按钮
		if (!this.elems.source.find('.' + classes.dir_button).length) {

			var hidden_style = this.def.dirButtonAutoHide ? 'style="display: none";' : '';

			this.elems.layout.append('<div '+ hidden_style +' class="' + classes.dir_button + '"></div>');

			// 添加该元素到 elems 中
			this.elems.dirButton = this.elems.layout.find('.' + classes.dir_button);

			this.elems.dirButton.html(
				'<span to="prev" class="' + classes.prev + '"><em></em></span>' +
				'<span to="next" class="' + classes.next + '"><em></em></span>'
			);
		}

		// 隐藏索引按钮
		if (!this.def.indexButton) {
			this.elems.indexButton.hide();
		}

		// 隐藏方向按钮
		if (!this.def.dirButton) {
			this.elems.dirButton.hide();
		}
	};

	// 添加外层包容的 DOM
	pri.getWrap = function(str) {

		return '<div class="' + classes.runner + '">' + (str || '') + '</div>';
	};

	// 设置必备的样式
	pri.updateWrapStyle = function() {

		var getter = sizeGetter.call(this, this.def.animateDir);

		// 非设置步长未传參的统一设置步长
		if (this.def.step == 'auto') {

			// 自动模式下，如果无法通过 style 获取每项的高宽，则使用可视配置进行配置
			var s = this.elems.list.eq(0)[getter.outer]();

			if( isNaN( s ) === true || s == 0 ) {
				this.elems.list.css(this.def.view);
			}

			this.def.step = this.elems.list.eq(0)[getter.outer]();
		}

		// 水平方向的时候设置 runner 高度
		if(this.def.animateDir == 'hori') {

			var runner_size = this.elems.list.eq(0)[getter.outer]() * this.elems.list.length;

			// 为外层动画容器设置size
			this.elems.runner[getter.def](runner_size);
		}


		// 设置 layout 容器高宽
		this.elems.layout.css(this.def.view);
	};

	// 播放组件
	pri.play = {
		start: function() {

			clearInterval(this.timer.play);

			var _this = this;

			this.timer.play = null;

			this.timer.play = setInterval(function() {
				_this.elems.dirButton.find('span.' + classes.next).trigger('click.carousel');
			}, this.def.autoDelay);
		},

		stop: function() {
			clearInterval(this.timer.play);
		}
	}

	// 根据横向或纵向的传參或者要设置或将要使用的相关属性
	function sizeGetter(dir) {
		// 横向
		if (dir == 'hori') {
			return {
				outer: 'outerWidth',
				inner: 'innerWidth',
				def: 'width',
				dir: 'left'
			};
		}
		// 纵向
		else if (dir == 'vert') {
			return {
				outer: 'outerHeight',
				inner: 'innerHeight',
				def: 'height',
				dir: 'top'
			};
		} else {
			_throw(this.selector, 'Function sizeGetter params error');
		}
	};

	// 绑定按钮等交互事件
	// 事件内部根据不同的交互功能实现不同的业务逻辑，然后调用 animate 函数
	pri.bindEvent = function() {
		var _this = this;

		// 索引按钮绑定事件
		this.elems.indexButton.delegate('span', 'click.carousel', function(event) {

			if ($(this).hasClass(classes.clicked_button)) {
				return;
			}

			var // 动画终点元素索引
				to = $(this).attr('to'),

				is_nan = isNaN(Number(to)),
				index = null,
				elem = null;

			// 索引
			if (is_nan == false) {
				index = Number(to);
			} else {
				_throw(_this.selector, 'index button {attr=to} type error');
			}

			elem = _this.elems.list.eq(to)

			// 动画开始之前的回调
			_this.def.onAnimateBefore.call(_this, _this.elems.runner);

			_this.animate(index, elem);

			// 更改按钮样式
			pri.updateButtonStyle.call(_this, this);
		});

		this.elems.indexButton.find('span').eq(this.def.index).trigger('click.carousel');


		// 方向按钮绑定事件
		// 该事件实现业务逻辑之后调用索引按钮的事件
		this.elems.dirButton.delegate('span', 'click.carousel', function(event) {

			var $cur_index_button = _this.elems.indexButton.find('span.' + classes.clicked_button),
				// prev, next
				type = $(this).attr('to'),

				// 即将触发的索引按钮
				$to_index_button = $cur_index_button[type]();

			// 到达最后一个
			if (type == 'next' && !$to_index_button.length) {
				$to_index_button = _this.elems.indexButton.find('span').eq(0);
			}
			// 到达第一个
			if (type == 'prev' && !$to_index_button.length) {
				$to_index_button = _this.elems.indexButton.find('span').eq(_this.elems.indexButton.find('span').length - 1);
			}

			$to_index_button.trigger('click.carousel');
		});

		// 是否自动播放
		// 调用方向按钮的 next 按钮的事件
		if (this.def.autoPlay) {

			pri.play.start.call(this);

			this.elems.layout.hover(function() {
				pri.play.stop.call(_this);
			}, function() {
				pri.play.start.call(_this);
			});
		}

		// 方向按钮交互方式
		if (this.def.dirButton && this.def.dirButtonAutoHide) {

			this.elems.layout.hover(function() {
				pri.button.dir.call(_this, 'fadeIn');
			}, function() {
				pri.button.dir.call(_this, 'fadeOut');
			});

		}

	};

	// 按钮的交互特效
	pri.button = {

		dir: function( type, delay ) {
			
			clearTimeout(this.timer.dirbtn);

			var _this = this, delay = delay || 100;

			this.timer.dirbtn = null;

			this.timer.dirbtn = setTimeout(function() {
				_this.elems.dirButton[ type ](100);
			}, delay);
		}
	};

	// 改变按钮点击后的样式
	pri.updateButtonStyle = function(clicked_button) {
		$(clicked_button).addClass(classes.clicked_button);
		$(clicked_button).siblings().removeClass(classes.clicked_button);
	};

	// 更新相关属性
	pri.update = function() {

		var _this = this;

		return {

			// 更新默认相关配置属性
			def: function(k, v) {
				var _def = _this.def;

				for (var key in _def) {
					if (_def[k]) {
						_def[k] = v;
					} else {
						_throw(_this.selector, 'def params [' + k + '] unkown.');
					}
				}
			}
		};
	};


	// 添加可修改扩展的接口
	var fn = carousel.prototype;

	// 提供修改动画的某些参数
	fn.update = function(method) {

		method.call(pri.update.call(this));
	};

	// 动画接口，该函数允许被修改
	fn.animate = function(index, elem) {

		var method = (this.effect[this.def.animateType]);

		if (method !== undefined) {
			method.call(this, index, elem);
		} else {
			_throw(this.selector, 'animateType [' + this.def.animateType + '] unkown.');
		}
	};

	// 动画特效执行包
	fn.effect = {

		// 渐隐渐现效果
		fade: function(index, elem) {

			var elem = this.elems.list.eq(index);

			elem.fadeIn(this.def.duration);
			elem.siblings().hide();
		},

		// 滑动效果
		silde: function(index, elem) {

			var _this = this,

				end = this.def.step * index * -1,

				getter = sizeGetter.call(this, this.def.animateDir),

				ani_params = {};

			ani_params[getter.dir] = end;

			this.elems.runner.animate(ani_params, {

				duration: this.def.duration,
				complete: function() {
					_this.def.onAnimateComplete.call(_this, _this.elems.runner);
				}
			});
		}
	};


	module.exports = carousel;


});