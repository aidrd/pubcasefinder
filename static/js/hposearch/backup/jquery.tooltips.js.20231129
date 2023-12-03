/* =============================================================================
	jQuery Tool Tips ver2.0.1
	Copyright(c) 2015, ShanaBrian
	Dual licensed under the MIT and GPL licenses.
============================================================================= */
(function($) {
	$.toolTips = function() {
		this.init.apply(this, arguments);
		return this;
	};

	$.toolTips.prototype = {

		settings : {},
		data     : {},

		init : function(settings) {
			/*
				targetElement    : ツールチップを適用する要素
				setDocument      : ツールチップに表示する内容 [ DOM Node | text | title | alt | rel ]
				className        : ツールチップのクラス名
				animation        : アニメーションの有無
				duration         : アニメーションの速度
				positionX        : マウスカーソルからの位置（X座標）
				positionY        : マウスカーソルからの位置（Y座標）
				insert           : ツールチップ要素の出力先（要素の位置）
				insertAppendMode : 出力の仕方 [ append | after | before | html ]
				mouseMove        : マウスカーソルの位置（動き）と合わせるかどうか
			*/
			settings = $.extend({
				targetElement    : {},
				setDocument      : 'title',
				className        : 'tooltop',
				animation        : false,
				duration         : 300,
				positionX        : 10,
				positionY        : 0,
				insert           : 'body',
				insertAppendMode : 'append',
				mouseMove        : false
			}, settings);

			this.settings = settings;

			this.createElement();
			this.addEvent();

		},

		createElement : function() {
			var self           = this;
			var $targetElement = $(this.settings.targetElement);
			var setDocument    = self.settings.setDocument;

			if ($targetElement.length > 0) {
				self.data.elements = [];
				if (typeof(setDocument) !== 'string') {
					setDocument.show();
				}
				$.each($targetElement, function() {
					var $box = $('<div>');
					if (typeof(setDocument) === 'string' && setDocument.match(/^(title|alt|rel)$/)) {
						$(this).attr('data-' + setDocument, $(this).attr(setDocument));
						$box.html($(this).attr(setDocument));
						$(this).removeAttr(setDocument);
					} else {
						$box.html(setDocument);
					}
					$box.addClass(self.settings.className).css('position', 'absolute').hide();
					self.data.elements.push({
						$obj     : $(this),
						$toolTip : $box
					});
				});

				if (this.data.elements && this.data.elements.length) {
					$.each(this.data.elements, function(key, data) {
						if (self.settings.insert) {
							var $insertObj = {};
							if (typeof(self.settings.insert) === 'string') {
								$insertObj = $(self.settings.insert);
							} else {
								$insertObj = self.settings.insert;
							}
							if (self.settings.insertAppendMode === 'append') {
								$insertObj.append(data.$toolTip);
							} else if (self.settings.insertAppendMode === 'after') {
								$insertObj.after(data.$toolTip);
							} else if (self.settings.insertAppendMode === 'before') {
								$insertObj.before(data.$toolTip);
							} else if (self.settings.insertAppendMode === 'html') {
								$insertObj.html(data.$toolTip);
							}
						}
					});
				}
			}
		},

		addEvent : function() {
			var self = this;
			if (this.data.elements && this.data.elements.length) {
				$.each(this.data.elements, function(key, element) {
					element.$obj.on({
						'mouseenter' : function(e) {
							self.setPosition(
								element.$toolTip,
								e.pageX + self.settings.positionX,
								e.pageY + self.settings.positionY
							);
							self.show(element.$toolTip);
						},
						'mouseleave' : function() {
							self.hide(element.$toolTip);
						}
					});
					if (self.settings.mouseMove) {
						element.$obj.on('mousemove', function(e) {
							self.setPosition(
								element.$toolTip,
								e.pageX + self.settings.positionX,
								e.pageY + self.settings.positionY
							);
						});
					}
				});
			}
		},

		setPosition : function($targetObj, x, y) {
			$targetObj.css({
				top  : y,
				left : x
			});
			return this;
		},

		show : function($targetObj) {
			if ($targetObj && $targetObj.length > 0) {
				if (this.settings.animation) {
					$targetObj.stop().fadeTo(this.settings.duration, 1);
				} else {
					$targetObj.show();
				}
			}
			return this;
		},

		hide : function($targetObj) {
			if ($targetObj && $targetObj.length > 0) {
				if (this.settings.animation) {
					var self = this;
					$targetObj.stop().fadeTo(this.settings.duration, 0, function() {
						self.setPosition($(this), 0, 0);
						$(this).hide();
					});
				} else {
					$targetObj.hide().css({
						top  : 0,
						left : 0
					});
				}
			}
			return this;
		}

	};

})(jQuery);
