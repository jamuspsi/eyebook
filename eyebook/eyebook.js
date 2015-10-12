EyebookScene = Ice.$extend('EyebookScene', {
	__init__: function() {
		var self = this;
		self.$super();

		self.left_page = new EyebookPage('left');
		self.right_page = new EyebookPage('right');
	}
});

EyebookPage = Ice.$extend('EyebookPage', {
	__init__: function(side) {
		var self = this;
		self.$super();

		self.side = ko.observable(side);

		self.lines = ko.observableArray([]);

		self.lines.push(new EyebookLine('LordHamster', 'Sup d00ds.'));
		self.lines.push(new EyebookLine('CharlsNChrg', "Don't d00d me."));
	}
});

EyebookLine = Ice.$extend('EyebookLine', {
	__init__: function(name, text) {
		var self = this;
		self.$super();

		self.name = ko.observable(name || null);
		self.text = ko.observable(text || '');
	}
});

EyebookApp = Ice.$extend('EyebookApp', {
	__init__: function() {
		var self = this;
		self.scenes = ko.observableArray([]);

		self.scenes.push(new EyebookScene());

		self.names = {
			'LordHamster': 'rgba(201, 128, 77, 1)',
			'CharlsNChrg': 'rgba(64, 134, 196, 1)'
		};
	}
});

$(function() {
	window.eyebook_app = EyebookApp();

	ko.applyBindings({app: window.eyebook_app}, $('.eyebook_app')[0]);
});