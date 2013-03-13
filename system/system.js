var AppFrame = function(config) {
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
		this.onLinkClick($(this).attr('href').substring(1), event);
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

AppFrame.prototype.onLinkClick = function(id, event) {
	event.preventDefault();

	if (id === this.activeId || this.isAnimating) {
		return;
	}
	
	this.lastActiveId = this.activeId;
	this.activeId = id;
	
	if (this.lastActiveId < this.activeId ) {
		this.dir = 1;
	} else {
		this.dir = -1;
	}
	
	this.startPageChange();
};

AppFrame.prototype.onNavClick = function(object, event) {
	if (object.data('id') === this.activeId || this.isAnimating) {
		event.preventDefault();
		return;
	}

	this.navLinks[this.activeId]
		.parent().removeClass(this.config.navActiveClass);

	object.parent().addClass(this.config.navActiveClass);

	this.onLinkClick(object.data('id'), event)
};

AppFrame.prototype.startPageChange = function() {
	
	this.isAnimating = true;
	
	this.pages[this.activeId]
		.addClass(this.config.preActiveClass);
	
	this.wrap.addClass(this.config.animations[this.dir]);
};

AppFrame.prototype.endPageChange = function() {
	this.pages[this.activeId]
		.removeClass(this.config.preActiveClass)
		.addClass(this.config.activeClass);

	this.pages[this.lastActiveId]
		.removeClass(this.config.activeClass);

	this.wrap.removeClass(this.config.animations[this.dir]);
	this.isAnimating = false;
};


