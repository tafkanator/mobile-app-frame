$(document).ready(function() {
	
	var appFrame = new AppFrame({
		activeClass: 'app5-page-active',
		preActiveClass: 'page-pre-active',
		navActiveClass: 'active',
		pageWrap: '#pages',
		pageClass: 'app5-page',
		navId: '#sitenav',
		inlineNavLinks: '.app5-nav'
	});
	
});

var AppFrame = function(config) {
	this.config = {
		activeClass: config.activeClass,
		preActiveClass: config.preActiveClass,
		navActiveClass: config.navActiveClass,
		pageWrap: config.pageWrap,
		pageClass: config.pageClass,
		navId: config.navId,
		inlineNavLinks: config.inlineNavLinks
	};
	
	//runtime vars
	this.wrap = null;
	this.navLinks = {};
	this.pages = {};
	this.activeId = null;
	this.lastActiveId = null;
	
	
	this.init();
};

AppFrame.prototype.init = function() {
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
	this.wrap.on('click', this.config.inlineNavLinks, function(event) {
		this.linkOnClick($(this).attr('href').substring(1), event);
	});

	//create transition callback
	this.wrap.on( 'webkitTransitionEnd oTransitionEnd transitionend', function(event) {
		self.endPageChange();
	});

	//create custom events
	
	//set up loading and show content after its ready. defferds maybe?
};

AppFrame.prototype.initPages = function() {
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

AppFrame.prototype.initNav = function() {
	var self = this,
		elem,
		pageId,
		parent;

	$(this.config.navId).find('a').each(function(index) {
		elem = $(this);
		pageId = elem.attr('href').substring(1);
		parent = elem.parent();

		self.navLinks[pageId] = {
			index: index,
			id: pageId,
			elem: elem,
			parent: parent
		};

		elem.on('click', function(event) {
			var id = $(this).attr('href').substring(1);
			self.navOnClick(self.navLinks[id], event);
		});

	});
};

AppFrame.prototype.linkOnClick = function(id, event) {
	event.preventDefault();

	if (id === this.activeId) {
		return;
	}

	this.lastActiveId = this.activeId;
	this.activeId = id;
	this.startPageChange();
};

AppFrame.prototype.navOnClick = function(object, event) {
	if (object.id === this.activeId) {
		event.preventDefault();
		return;
	}

	this.navLinks[this.activeId]
		.parent.removeClass(this.config.navActiveClass);

	object.parent.addClass(this.config.navActiveClass);

	this.linkOnClick(object.id, event)
};

AppFrame.prototype.startPageChange = function() {
	this.pages[this.activeId]
		.addClass(this.config.preActiveClass);

	this.wrap.addClass('slide-to-left');
};

AppFrame.prototype.endPageChange = function() {
	this.pages[this.activeId]
		.removeClass(this.config.preActiveClass)
		.addClass(this.config.activeClass);

	this.pages[this.lastActiveId]
		.removeClass(this.config.activeClass);

	this.wrap.removeClass('slide-to-left');
};


