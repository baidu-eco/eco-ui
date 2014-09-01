/**
 * Carousel 轮播组件
 *
 */

var carousel = function(selector, options) {

	this.elems = {
		source: $(selector)
	};

	// 点击的准备进行动画的参数
	// this.params = {};

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


var pri = {};

pri.classes = {
	layout: 'carousel_layout',
	carousel: 'carousel',
	runner: 'carousel_runer',
	buttons: 'carousel_buttons'
};

// 初始化，绑定一些必需的函数
pri.init = function() {

	var arr = this.def.data;

	if (arr && $.isArray(arr)) {

		pri.printDOM.call(this);
	} else {
		// 原始的 dom
		var $outer = this.elems.source.find(this.def.selector.outer);

		$outer.wrap(pri.getWrap());
	}

	pri.store.call(this);

	if (this.def.isbuttons) {
		pri.printButtons.call(this);
	}

	pri.setStyles.call(this);

	pri.bindEvent.call(this);
};

// 通过data 的数据渲染dom
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
		pri.getWrap(dom_arr.join(''))
	);
};

// 添加外层包容的 DOM
pri.getWrap = function(str) {

	return '<div class="' + pri.classes.layout + '">\
			<div class="' + pri.classes.runner + '">' + (str || '') + '</div>\
		</div>';
};

pri.store = function() {
	this.elems.layout = this.elems.source.find('.' + pri.classes.layout);
	this.elems.runner = this.elems.source.find('.' + pri.classes.runner);

	this.elems.list = this.elems.runner.find(this.def.selector.inner);
};

// 创建轮播按钮
pri.printButtons = function() {

	if (!this.elems.source.find('.' + pri.classes.buttons).length) {

		this.elems.layout.append('<div class="' + pri.classes.buttons + '"></div>');

		// 添加该元素到 elems 中
		this.elems.buttons = this.elems.layout.find('.' + pri.classes.buttons);
	}

	var dom_arr = [];

	for (var i = 0; i < this.elems.list.length; i++) {
		dom_arr.push('<span to="' + i + '">' + (i + 1) + '</span>');
	}

	this.elems.buttons.html(dom_arr.join(''));
};

// 设置必备参数
pri.setStyles = function() {
	// 非设置步长未传參的统一设置步长
	if (typeof this.def.step !== 'number') {

		var items = this.elems.list;

		this.def.step = items.eq(0).outerWidth();
	}

	var layout_size = this.def.step * items.length;

	// 为外层容器设置size
	this.elems.runner.width(layout_size);

	// 设置 layout 容器高宽
	this.elems.layout.css(this.def.view);
};

// 绑定按钮等交互事件
pri.bindEvent = function() {
	var _this = this;

	this.elems.buttons.delegate('span', 'click', function(event) {

		var // 动画终点元素
			end_elem = null,
			to = $(event.target).attr('to');

		// 播放到 指定 Element
		if (/[#\.]/.test(to)) {
			end_elem = $(to);
		}
		// 播放到 当前滚动列表的某索引项
		else {
			end_elem = _this.elems.list.eq(to);
		}

		// 动画开始之前的回调
		_this.def.onAnimateBefore.call(_this, _this.elems.runner);

		_this.animate(end_elem);
	});
};


// 添加可修改扩展的接口
var fn = carousel.prototype;

fn.def = {
	// 用于传递数据方式时的模板渲染
	template: {
		outer: '<${outer} class="' + pri.classes.carousel + '">',
		inner: '<${inner}><img src="{url}" /></${inner}>'
	},

	// 选择器
	selector: {
		outer: 'ul',
		inner: 'li'
	},

	// 如果没有数据传入，则直接使用指定 element 中的 dom 作为list 数据
	// @type - #default: 1
	// 	1. {boolean, ...} false, null, '', ...
	//	2. {Array} [{},{},{},...]
	data: false,

	// 轮播步长
	// @type - #defualt: 1
	//	1. {boolean} 按照即将播放的元素的 长或宽
	//	2. {number}
	step: false,

	isbuttons: true,

	// 可视区域配置
	view: {
		width: 'auto',
		height: 'auto'
	},

	// 动画的执行时间(ms)
	duration: 400,

	// 回调函数
	onAnimateBefore: function() {},
	onAnimateComplete: function() {}
};

// 提供修改动画的某些参数
fn.update = function(callback) {

	
};

// 动画接口，该函数允许被修改
fn.animate = function(end_elem) {

	var _this = this,
		end = end_elem.position().left * -1;

	var anmi_params = {
		left: end
	};

	this.elems.runner.animate(anmi_params, {

		duration: this.def.duration,
		complete: function() {
			_this.def.onAnimateComplete.call(_this, _this.elems.runner);
		}
	});
};


module.exports = carousel;