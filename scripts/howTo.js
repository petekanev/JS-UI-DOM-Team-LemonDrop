var Conjurer = Conjurer || {};

define(function () {
	Conjurer.HowTo = function(game) { };

	Conjurer.HowTo.prototype = {
		create: function() {
			this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
			
			var text = "'You're a wizard, Harry!'\n\nYou can jump over 1-tile\nhigh obstacles!";
			var style = { font: "16px Arial", fill: "#fff", align: "center" };
			var t = this.add.text(165, 52, text, style);
			t.anchor.setTo(0);

			text = "However you CANNOT\njump over 2-tile high\nor higher obstacles!";
			t = this.add.text(165, 224, text, style);

			text = "Conjure crates to\novercome obstacles and\nreach high places!";
			t = this.add.text(165, 386, text, style);

			text = "Collect gems and\ntry to reach better\nscore than the other\npuny wizards!";
			t = this.add.text(495, 52, text, style);

			text = "BEWARE of SPIKES - \nthey will kill you instantly\non contact!";
			t = this.add.text(495, 224, text, style);

			text = "BEWARE of... flames - \nthem rivaling wizards put\nthem there for a reason!";
			t = this.add.text(495, 386, text, style);

			text = "Find a key to move on...\nto a level harder than\nthe one you just played!!!";
			t = this.add.text(825, 224, text, style);

			var tutGroup = this.add.group();
			var tutorialForPassableWall = tutGroup.create(32, 32, 'tutorialForPassableWall');
			var tutorialForUnpassableWall = tutGroup.create(32, 192, 'tutorialForUnpassableWall');
			var tutorialForCrate = tutGroup.create(32, 352, 'tutorialForCrate');

			var tutorialForCollectibles = tutGroup.create(352, 32, 'tutorialForCollectibles');
			var tutorialForSpikes = tutGroup.create(352, 192, 'tutorialForSpikes');
			var tutorialForFlame = tutGroup.create(352, 352, 'tutorialForFlame');
			var tutorialForKey = tutGroup.create(672, 192, 'tutorialForKey');
			
			this.back = this.add.button(864, 424, 'backButton', this.backToMain, this);},
			
			backToMain: function (pointer) {
				this.state.start('MainMenu');
			}

		};

		return { HowTo: Conjurer.HowTo};
	});