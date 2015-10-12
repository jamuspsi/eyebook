EyebookScene = Ice.$extend('EyebookScene', {
	__init__: function(left, right) {
		var self = this;
		self.$super();

		self.left_page = ko.observable(null);
		self.right_page = ko.observable(null);
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
	},
	insert_line: function(pos) {
		var self = this;
		self.lines.splice(pos, 0, new EyebookLine());
	},
	remove_line: function(line) {
		var self = this;
		self.lines.remove(line);
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
		// self.scenes = ko.observableArray([]);

		// self.scenes.push(new EyebookScene());
		self.pages = ko.observableArray([]);
		self.show_editor = ko.observable(true);
		// self.sync_scenes();
		self.mode = ko.observable('edit');
		self.mode.subscribe(_.bind(self.on_mode_change, self));

		for(var x = 0;x<2;x++) {
			var page = new EyebookPage();
			self.pages.push(page);
		}

		self.names = {
			'LordHamster': 'rgba(201, 128, 77, 1)',
			'CharlsNChrg': 'rgba(64, 134, 196, 1)'
		};
	},
	scenes: Ice.kocomputed(function() {
		var self = this;

		var scenes = [];
		var scene = null;
		_.each(self.pages(), function(page) {
			if(!scene || scene.right_page()) {
				scene = new EyebookScene();
				scenes.push(scene);
			}
			side = scene.left_page() ? 'right' : 'left';
			scene[side + '_page'](page);
			page.side(side);
		});

		return scenes;
	}),
	remove_page: function(page) {
		var self = this;
		self.pages.remove(page);
	},
	insert_page: function(pos) {
		var self = this;

		self.pages.splice(pos, 0, new EyebookPage());
	},
	toggle_editor: function() {
		var self = this;
		self.show_editor(!self.show_editor());

		$('.eyebook_editor')[self.show_editor() ? 'show' : 'hide']();
	},
	on_mode_change: function() {
		var self = this;
		console.log("mode change: ", self.mode());
		if(self.mode() === 'images') {
			// When switching to this mode, we need to render all the eyebook_render divs into canvases.
			var renders = $('.eyebook_render');
			$('.eyebook_image').empty();

			_.each(renders, function(r) {
				console.log("Rendering ", r);
				html2canvas(r, {
					'height': 550,
					'width': 900,
					'onrendered': function(canvas) {
						var image_holder = $(r).parent('.eyebook_scene').find('.eyebook_image');

						image_holder.append(canvas);

					}
				})
			})
		}
	}
});

$(function() {
	window.eyebook_app = EyebookApp();

	ko.applyBindings({app: window.eyebook_app}, $('.eyebook_app')[0]);
});