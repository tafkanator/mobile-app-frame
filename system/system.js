/**
 * events:
 * maf.pageChange - triggers every time, when any page starts changing
 * maf.beforeFocus - triggers every time, before specific page starts animating in
 * maf.focus - triggers every time, when specific page is finished animating
 * maf.blur - triggers every time, before specific page starty animating out
 */

var MAF = function(config) {
	this.config = {
		activeClass: config.activeClass,
		preActiveClass: config.preActiveClass,
		navActiveClass: config.navActiveClass,
		pageWrap: config.pageWrap,
		pageClass: config.pageClass,
		navId: config.navId,
		inlineNavLinks: config.inlineNavLinks,
		animations: {
			'-1': 'slide-to-right',
			'1': 'slide-to-left'
		}
	};

	//runtime vars
	this.wrap = null;
	this.navLinks = {};
	this.pages = {};
	this.activeId = null;
	this.lastActiveId = null;
	this.dir = 1;
	this.isAnimating = false;
	this.pageWrapId = null;


	this.init();
};

MAF.prototype.init = function() {
	var self = this,
		pageId;

	this.wrap = $(this.config.pageWrap);

	//cache all pages
	this.initPages();

	//set active page, if it is not set yet
	if (this.activeId === null) {
		for (pageId in this.pages) {
			this.activeId = pageId;
			break;
		}
	}

	//cache sitenav
	this.initNav();

	//bind nav behaviour to links inside page
	$(document.body).on('click', this.config.inlineNavLinks, function(event) {
		self.onLinkClick($(this).attr('href').substring(1), event);
	});

	//create transition callback
	this.wrap.on( 'webkitTransitionEnd oTransitionEnd transitionend', function(event) {
		if (event.target.id != self.config.pageWrap.substring(1)) {
			return false;
		};

		self.endPageChange();
	});

	//create custom events

	//set up loading and show content after its ready. defferds maybe?
};

MAF.prototype.initPages = function() {
	var self = this,
		elem,
		id;

	this.wrap.find('.' + this.config.pageClass).each(function(index) {
		var elem = $(this),
			id = elem.attr('id');

		self.pages[id] = elem;
		if (elem.hasClass(self.config.activeClass)) {
			self.activeId = id;
		}
	});
};

MAF.prototype.initNav = function() {
	var self = this,
		elem,
		pageId,
		parent;

	$(this.config.navId).find('a').each(function(index) {
		elem = $(this);
		pageId = elem.attr('href').substring(1);
		parent = elem.parent();

		elem.data({
			index: index,
			id: pageId
		})
		self.navLinks[pageId] = elem;

		elem.on('click', function(event) {
			var id = $(this).attr('href').substring(1);
			self.onNavClick(self.navLinks[id], event);
		});

	});
};

MAF.prototype.onLinkClick = function(id, event) {
	event.preventDefault();

	if (id === this.activeId || this.isAnimating) {
		return;
	}
	if (typeof this.pages[id] == 'undefined') {
		console.error('page named "' + id + '" does not exist!');
		return;
	}

	this.triggerEventsBeforeChange(id);

	this.lastActiveId = this.activeId;
	this.activeId = id;

	if (this.lastActiveId < this.activeId ) {
		this.dir = 1;
	} else {
		this.dir = -1;
	}



	this.startPageChange();
};

MAF.prototype.onNavClick = function(object, event) {
	if (object.data('id') === this.activeId || this.isAnimating) {
		event.preventDefault();
		return;
	}

	this.navLinks[this.activeId]
		.parent().removeClass(this.config.navActiveClass);

	object.parent().addClass(this.config.navActiveClass);

	this.onLinkClick(object.data('id'), event)
};

MAF.prototype.startPageChange = function() {

	this.isAnimating = true;

	this.pages[this.activeId]
		.addClass(this.config.preActiveClass);

	this.wrap.addClass(this.config.animations[this.dir]);
};

MAF.prototype.endPageChange = function() {
	this.pages[this.activeId]
		.removeClass(this.config.preActiveClass)
		.addClass(this.config.activeClass);

	this.pages[this.lastActiveId]
		.removeClass(this.config.activeClass);

	this.wrap.removeClass(this.config.animations[this.dir]);
	this.isAnimating = false;

	this.triggerEventsAfterChange();
};

MAF.prototype.triggerEventsBeforeChange = function(newPageId) {
	this.wrap.trigger('maf.pageChange');
	this.pages[this.activeId].trigger('maf.blur');
	this.pages[newPageId].trigger('maf.beforeFocus');
};

MAF.prototype.triggerEventsAfterChange = function() {
	this.pages[this.activeId].trigger('maf.focus');
};