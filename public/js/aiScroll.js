var AiScroll = function(param) {
		// param { body: 'body', menuContainer: '.qa-menu', articleContainer: '.qa-detail', deepth: 2}

		var A = this;
		A.isPhone = /iphone|android/.test(navigator.userAgent.toLowerCase());
		A.menuPos = {
			itemIndex: 0,
			childIndex: 0
		}
		A.scrollConfig = {
			step: 20,
			func: function(t, b, c, d) { // Quad.easeOut
				return -c * (t /= d) * (t - 2) + b;
			}
		}
		A.scrollTimer = null;
		A.isSliding = false;
		A.currentTop = 0;
		A.isFixed = false;
		A.offsetTop = 0; // 主体与顶部的距离
		A.offHeight = 100;
		A.deepth = param.deepth || 1;
		A.body = $(param.body);
		A.menu_container = $(param.menuContainer);
		A.menu_wrapper = A.menu_container.find('.wrapper');
		A.menu_item = A.menu_wrapper.find('.item');
		A.beforeInit = function (){};
		A.onScroll = function (){};
		A.item_length = A.menu_item.length;

		A.article_container = $(param.articleContainer);
		A.article_wrapper = A.article_container.find('.wrapper');
		A.article_item = A.article_wrapper.find('.item');

		if (A.deepth === 2) {
			A.menu_itemList = [];
			A.menu_item.each(function(index, item) {
				console.log($(item).find('li'))
				var _obj = {
					active: 0,
					isActive: false,
					title: $(item).find('.item-title'),
					dom: $(item).find('li'),
					length: $(item).find('li').length
				}
				A.menu_itemList[index] = _obj;
			});

			A.article_itemList = [];
			A.article_item.each(function(index, item) {
				var _obj = {
					active: 0,
					isActive: false,
					title: $(item).find('.item-title'),
					dom: $(item).find('li'),
					length: $(item).find('li').length
				}
				A.article_itemList[index] = _obj;
			});
		}
	}
AiScroll.prototype = {
	init: function() {
		if(this.isPhone) return false;
		var A = this;
		if(A.beforeInit instanceof Function) {
			A.beforeInit();
		}
		A.offsetTop = this.body[0].offsetTop;

		A.currentTop = document.documentElement.scrollTop || document.body.scrollTop;
		// 初始化滚动匹配
		$(window).on('scroll', function(e) {
			var e = e || event;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			A.onScroll(scrollTop);
			A.watch(scrollTop);
			
		});
		$(window).on('resize', function (){
			A.isFixed = false;
			A.fixMenuPos(document.documentElement.scrollTop || document.body.scrollTop)
		})
		// 初始化点击匹配
		var item = child = 0;
		if (A.deepth == 1) {
			A.menu_item.find('h6').on('click', function() {
				if (A.isSliding) return false;
				item = $(this).parent().parent().index();
				A._fixToArticle(item, child);
				A.menu_item.eq(item).addClass('active').siblings().removeClass('active');
			})
		} else if (this.deepth == 2) {
			if (A.isSliding) return false;
			A.menu_item.find('h6').on('click', function() {
				if($(this).hasClass('open')) {
					$(this).removeClass('open').parent().parent().css('height', $(this).height() + 'px');
				} else {
					$(this).addClass('open').parent().parent().css('height', $(this).parent().height() + 'px');
				}
			})
			A.menu_item.find('li').on('click', function() {
				child = $(this).index();
				item = $(this).parent().parent().parent().index();
				A.menu_item.eq(item).addClass('active').siblings().removeClass('active').end().find('li').eq(child).addClass('active').siblings().removeClass('active');
				A._fixToArticle(item, child);
			})
		}
	},
	watch: function(scrollTop) {
		this.fixMenuPos(scrollTop);
		this.fixMenuItem(scrollTop);
	},
	fixMenuPos: function(scrollTop) {
		if (this.isSliding) return false;
		
		if (scrollTop >= this.offsetTop - this.offHeight && !this.isFixed) {
			var A = this;
			A.isFixed = true;
			A.menu_container.css({
				'position': 'relative',
				'left': 'auto',
				'top': 'auto',
				'width': ''
			})
			var width = A.menu_container.width();
			A.menu_container.css({
				'position': 'fixed',
				'left': A.menu_container.offset().left + 'px',
				'top': A.offHeight + 'px',
				'width': width + 'px'
			})
		} else if (scrollTop < this.offsetTop - this.offHeight && this.isFixed) {
			var A = this;
			A.isFixed = false;
			A.menu_container.css({
				'position': 'relative',
				'left': 'auto',
				'top': 'auto',
				'width': ''
			})
		}
	},
	fixMenuItem: function(scrollTop) {
		if (this.isSliding) return false;
		var item = child = 0;

		if (scrollTop <= this.offsetTop) {
			return this._fixToMenu(item, child);
		}

		for (var i = 0; i < this.item_length; i++) {
			if (i < this.item_length - 1) {
				if (scrollTop >= this.article_item.eq(i).offset().top - this.offHeight && scrollTop < this.article_item.eq(i + 1).offset().top - this.offHeight) {
					if (this.deepth == 2) {
						for (var j = 0; j < this.article_itemList[i].length; j++) {
							if (scrollTop >= this.article_itemList[i].dom.eq(j).offset().top - this.offHeight) child = j;
						}
					}
					item = i;
					break;
				}
			} else {
				if (this.deepth == 2) {
					for (var j = 0; j < this.article_itemList[i].length; j++) {
						if (scrollTop >= this.article_itemList[i].dom.eq(j).offset().top - this.offHeight) child = j;
					}
				}
				item = this.item_length - 1;
			}
		}
		return this._fixToMenu(item, child);
	},
	_fixToMenu: function(item, child) { // item 对应某个item， child 该item下的某个li
		
		if (this.menuPos.itemIndex == item && this.menuPos.childIndex == child) return false;

		if (this.deepth == 1) {

			if (this.menuPos.itemIndex == item) return false;
			this.menu_item.eq(item).addClass('active').siblings().removeClass('active');
			this.menuPos.itemIndex = item;
		} else if (this.deepth == 2) {
			this.menu_item.eq(item).addClass('active').css('height', this.menu_item.eq(item).find('.js-wrap').eq(0).height() + 'px').siblings().removeClass('active').css('height', this.menu_item.eq(item).find('h6').eq(0).height() + 'px');
			this.menu_itemList[item].dom.eq(child).addClass('active').siblings().removeClass('active');

			this.menuPos.itemIndex = item;
			this.menuPos.childIndex = child;
		}
	},

	_fixToArticle: function(item, child) {
		if (this.isSliding) return false;
		if (this.menuPos.itemIndex == item && this.menuPos.childIndex == child) return false;
		this.isSliding = true;
		var A = this;
		clearInterval(A.scrollTimer);
		var offsetH;
		if (A.deepth == 1) {
			if (A.article_item.eq(item).length === 0) return false;
			offsetH = A.article_item.eq(item).offset().top - A.offHeight;
		} else if (A.deepth == 2) {
			if (A.article_itemList[item].dom.eq(child).length === 0) return false;
			offsetH = A.article_itemList[item].dom.eq(child).offset().top - A.offHeight
		}
		var holdTop = A.currentTop = document.documentElement.scrollTop || document.body.scrollTop;
		offsetH = offsetH - A.currentTop;
		var i = 0;
		this.scrollTimer = setInterval(function() {
			i++;
			holdTop = A.scrollConfig.func(i, A.currentTop, offsetH, A.scrollConfig.step);
			window.scrollTo(0, holdTop);
			if (i >= A.scrollConfig.step) {
				clearInterval(A.scrollTimer);
				A.currentTop = holdTop;
				A.isSliding = false;
			}
		}, 16.7)
	}
}