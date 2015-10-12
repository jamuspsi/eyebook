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

		//self.lines.push(new EyebookLine('LordHamster', 'Sup d00ds.'));
		//self.lines.push(new EyebookLine('CharlsNChrg', "Don't d00d me."));
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
		if(self.pages().length === 1) {
			return;  //Don't delete the last page.
		}
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
	function il(n, t) {
		eyebook_app.pages()[eyebook_app.pages().length-1].lines.push(new EyebookLine(n, t));
	}
	il('LordHamster', 'So is that your offer?  full reimbursement for our lost cities and troops if we let her go?');
	il("CharlsNChrg", "That's an offer.  How much is it, exactly?");
	il("LordHamster", "Bracer says $221,540 if we get our remaining prisoners back.");
	il("CharlsNChrg", "I can't make deals for Faq, but I'll make sure she lets your people go.");
	il("LordHamster", "And the figure doesn't bother you.");
	il("CharlsNChrg", "It's steep, but I can pay it.");
	il("LordHamster", "Okay, \"my people\" are saying nfw.");
	il("LordHamster", "And I'm thinking no, too.  Just because this is something you want.");
	il("CharlsNChrg", "*sigh*");
	il("CharlsNChrg", "Parson...I want her for reasons that don't have anything to do with you.");
	eyebook_app.insert_page(1);

	il("CharlsNChrg", "If that offer doesn't interest you, then name something that does.");
	il("LordHamster", "How bout you give up the calculations I owe you?  All of them.");
	il("CharlsNChrg", "Done.");
	il("LordHamster", "And tell me what Jojo's spell does.");
	il("CharlsNChrg", "I already have.  It sends you home.");
	il("LordHamster", "No, I want a full technical explanation.");
	il("LordHamster", "Who created it, why, and what are its specifications?  Its \"underpinnings.\".");
	il("CharlsNChrg", "Dione.  What else?");
	il("LordHamster", "Get us our Archon prisoner back from Jetstone.");
	eyebook_app.insert_page(2);
	il("CharlsNChrg", "I said I can't make deals for other sides.  Jetstone won't even talk to me.  Name something else.");
	il("LordHamster", "Tell me why you want the Queen so bad.");
	il("LordHamster", "I mean, you're not even saying \"take her prisoner and hand her over,\" you still want her to be running her side.  Why?");
	il("CharlsNChrg", "To fulfill another contractual obligation that doesn't concern you.");



	ko.applyBindings({app: window.eyebook_app}, $('.eyebook_app')[0]);
});