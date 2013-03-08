$(document).ready(function() {
	system.init();
});

var system = {
	config: {
		activeClass: 'app5-page-active',
		pageWrap: '#pages',
		pageClass: 'app5-page',
		navId: '#sitenav'
	},
	
	vars: {
		navLinks: {},
		pages: {},
		activeId: null
	},
	
	init: function() {
		var self = this,
			pageId;
		//cache all pages
		this.cachePages();
		
		//set active page, if it is not set yet
		if (this.vars.activeId === null) {
			for (pageId in this.vars.pages) {
				this.vars.activeId = pageId;
				break;
			}
		}
		
		//cache nav
		//bind click event
		//change classes
		//create callback
		//create custom events11111
	},
	
	cachePages: function() {
		var self = this,
			elem,
			id;
		
		$(this.config.pageWrap).find('.' + this.config.pageClass).each(function() {
			elem = $(this),
			id = elem.attr('id');
			self.vars.pages[id] = elem;
			if (elem.hasClass(self.config.activeClass)) {
				self.vars.activeId = id;
			}
		});
	}
};


