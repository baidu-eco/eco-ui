/**
 * tab
 * Deo - denglingbo@126.com
 * Date: 2014.09.09
 *
 */
define('common:udo/ui/tab', function(require, exports, module) {

	var classes = {
		tab: 'utab',
		clicked: 'utab_clicked'
	};

	// 当启用了缓存ajax 的请求内容时，第一次点击之后缓存
	var _ajax_cache = {};

	var rand = function(front_str) {
		return (front_str || '') + (new Date).getTime() * Math.round(1 + Math.random(999));
	}

	// 函数的默认配置参数
	var getDefault = function() {

		return {
			// 事件触发类型
			eventType: "click",
			selector: "a",
			dataType: "dom",
			related: null,
			// handler 当前样式
			selectedClass: classes.clicked,
			index: 0,

			onClick: function(clicked_element, related_element) {},

			isAjaxCache: false,
			onAjaxError: function(context, err_state) {},
			onAjaxSuccess: function(context, data) {}
		}
	};

	// 主函数
	var tab = function(selector, options) {

		this.elems = {
			context: $(selector)
		};

		this.def = getDefault();

		$.extend(this.def, options);

		pri.init.call(this);

		this.elems.context.addClass(classes.tab);

		return this;
	};

	// 私有函数，不可被修改
	var pri = {};

	$.extend( pri, {

		init: function() {

			pri.store.call(this);

			pri.bindEvent.call(this);
		},

		// 保存相应元素
		store: function() {

			this.elems.handlers = this.elems.context.find(this.def.selector);

			var related = this.def.related;

			// 没有该值，<a href="#id"></a>
			if (!related) {
				var cid = rand('tab-selector-');

				this.elems.handlers.each(function() {
					$($(this).attr('tab-related')).addClass(cid);
				});

				this.elems.relateds = $('.' + cid);
			}
			// function(context) { return ...; }
			else if ($.isFunction(related)) {
				this.elems.relateds = this.def.related.call(this, this.elems.context);
			}
			// .class, #id, ...
			else if (typeof related === 'string') {
				this.elems.relateds = $(this.def.related);
			}
			// error
			else {
				throw ('related error.');
			}

		},

		// 点击项触发后的事件
		open: function(target, event) {

			// 已经点击过的不再次触发点击功能
			if (!$(this).hasClass(classes.clicked)) {

				var params = pri.getParams.call(this, target);

				params.clicked.addClass(classes.clicked);
				params.other_clicked.removeClass(classes.clicked);

				this.onclick(params);
			}

			event.preventDefault();
		},

		// 绑定事件
		bindEvent: function() {

			var _this = this,
				context = this.elems.context,
				et = this.def.eventType;

			context.delegate(this.def.selector, et + '.tab', function(event) {
				pri.open.call(_this, this, event);
			});

			// 默认触发
			this.elems.handlers.eq(this.def.index).trigger(et + '.tab');
		},

		// 获取点击的属性，以及对应的内容
		getParams: function(target) {

			var $hs = this.elems.handlers,
				$rs = this.elems.relateds;

			// 通过索引或指定selector 进行切换
			if ($hs.length === $rs.length) {

				var $r_cur = pri.findCurrent(
					this.elems.relateds,
					$(target).attr('tab-related') || $(target).index()
				);

				return {
					clicked: $(target),
					related: $r_cur,
					other_clicked: $(target).siblings($hs.selector),
					other_related: $r_cur.siblings($r_cur.prevObject.selector),

					data_type: $(target).attr('data-type')
				}
			} else {

				return {
					clicked: $(target),
					related: this.elems.relateds,
					other_clicked: $(target).siblings($hs.selector),

					data_type: $(target).attr('data-type')
				}
			}

		},

		// 获取当前点击项对应的内容元素
		findCurrent: function(list, s) {

			// 选择器
			if (isNaN(Number(s))) {

				return list.filter(function() {
					return this === $(s)[0];
				});
			}
			// 索引
			else {
				return list.eq(s);
			}
		}
	});

	

	// 添加可修改扩展的接口
	$.extend( tab.prototype, {

		ajaxFun: function(params, action) {

			var _this = this;

			// 从缓存中获取
			if (this.def.isAjaxCache) {

				// 如果缓存对象中存在对应项，则直接取出
				if (_ajax_cache[params.clicked.attr('tab-cid')] !== undefined) {
					_this.def.onAjaxSuccess.call(_this, params, _ajax_cache[params.clicked.attr('tab-cid')], true);

					return;
				}
			}

			$.ajax({
				url: action,
				error: function(state, txt) {
					throw ('ajax error.');

					_this.def.onAjaxError.call(_this, params, state);
				},
				success: function(data, txt, state) {

					_this.def.onAjaxSuccess.call(_this, params, data, false);

					var rid = rand('tab-cacheid-');

					if (_this.def.isAjaxCache && _ajax_cache[rid] === undefined) {
						_ajax_cache[rid] = data;
						params.clicked.attr('tab-cid', rid);
					}
				}
			});
		},

		onclick: function(params) {

			var dt = this.def.dataType,
				t_r = params.clicked.attr('tab-related');

			// img
			if (dt === 'img') {
				params.related.html('<img src="' + t_r + '" />');
			}
			// ajax
			else if (dt === 'ajax') {

				this.ajaxFun(params, t_r);
			}
			// dom
			else if (dt === 'dom') {
				params.related.fadeIn(100);
				params.other_related.hide();
			}

			this.def.onClick.call(this, params.clicked, params.related, params);
		}
	});


	module.exports = tab;

});