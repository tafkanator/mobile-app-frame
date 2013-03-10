$(document).ready(function() {
	system.init();
});

var system = {
	config: {
		activeClass: 'app5-page-active',
		preActiveClass: 'page-pre-active',
		navActiveClass: 'active',
		pageWrap: '#pages',
		pageClass: 'app5-page',
		navId: '#sitenav',
		inlineNavLinks: '.app5-nav'
	},
	
	vars: {
		wrap: null,
		navLinks: {},
		pages: {},
		activeId: null,
		lastActiveId: null
	},
	
	init: function() {
		var self = this,
			pageId;
		
		this.vars.wrap = $(this.config.pageWrap);
		
		//cache all pages
		this.initPages();
		
		//set active page, if it is not set yet
		if (this.vars.activeId === null) {
			for (pageId in this.vars.pages) {
				this.vars.activeId = pageId;
				break;
			}
		}
		
		//cache sitenav
		this.initNav();
		
		//bind nav behaviour to links inside page
		this.vars.wrap.on('click', this.config.inlineNavLinks, function(event) {
			this.linkOnClick($(this).attr('href').substring(1), event);
		});
		
		//create transition callback
		this.vars.wrap.on( 'webkitTransitionEnd', function(event) {
			self.endPageChange();
		});
		
		//create custom events
	},
	
	initPages: function() {
		var self = this,
			elem,
			id;
		
		this.vars.wrap.find('.' + this.config.pageClass).each(function(index) {
			var elem = $(this),
				id = elem.attr('id');
				
			self.vars.pages[id] = elem;
			if (elem.hasClass(self.config.activeClass)) {
				self.vars.activeId = id;
			}
		});
	},
	
	initNav: function() {
		var self = this,
			elem,
			pageId,
			parent;
		
		$(this.config.navId).find('a').each(function(index) {
			elem = $(this);
			pageId = elem.attr('href').substring(1);
			parent = elem.parent();
			
			self.vars.navLinks[pageId] = {
				index: index,
				id: pageId,
				elem: elem,
				parent: parent
			};
			
			elem.on('click', function(event) {
				var id = $(this).attr('href').substring(1);
				self.navOnClick(self.vars.navLinks[id], event);
			});
			
		});
	},
	
	linkOnClick: function(id, event) {
		event.preventDefault();
		
		if (id === this.vars.activeId) {
			return;
		}
		
		this.vars.lastActiveId = this.vars.activeId;
		this.vars.activeId = id;
		this.startPageChange();
	},
	
	navOnClick: function(object, event) {
		if (object.id === this.vars.activeId) {
			event.preventDefault();
			return;
		}
		
		this.vars.navLinks[this.vars.activeId]
			.parent.removeClass(this.config.navActiveClass);
		
		object.parent.addClass(this.config.navActiveClass);
		
		this.linkOnClick(object.id, event)
	},
	
	startPageChange: function() {
		this.vars.pages[this.vars.activeId]
			.addClass(this.config.preActiveClass);
			
		this.vars.wrap.addClass('slide-to-left');
	},
	
	endPageChange: function() {
		this.vars.pages[this.vars.activeId]
			.removeClass(this.config.preActiveClass)
			.addClass(this.config.activeClass);
		
		this.vars.pages[this.vars.lastActiveId]
			.removeClass(this.config.activeClass);
			
		this.vars.wrap.removeClass('slide-to-left');
	}
};


