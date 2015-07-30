var Conjurer = Conjurer || {};

define(['constants'], function (CONSTANTS) {
Conjurer.MainMenu = function(game) { 
	this.titleBg;
};

Conjurer.MainMenu.prototype = {
  create: function() {
    this.stage.setBackgroundColor(0x000000);
    this.titleBg = this.add.sprite(0, 0, 'background');
    this.titleBg.alpha = 0;
   
    this.generateBg();
    this.animateTitle();

    this.playButton = this.add.button((CONSTANTS.GAME_WIDTH/2)-64, 326, 'playButton', this.startGame, this);

    this.howTo = this.add.button((CONSTANTS.GAME_WIDTH/2)-64, 390, 'howTo', this.startHowTo, this);
  },
  generateBg: function() {
    var gems = this.add.group();
    for(var i = 0; i < 50; i+=1){
      var c = gems.create(this.world.randomX, Math.random()*500, 'coin');
      c.alpha = 0;
    }
    var that = this;
    gems.forEach(function (child) {
      var tween = that.add.tween(child).to({alpha: 1}, 1000+that.rnd.integerInRange(0, 2000), "Linear", true, 0, -1);
      tween.yoyo(true, 1000);
    }, this);
  },

  animateTitle: function () {
    var title = this.add.sprite(CONSTANTS.GAME_WIDTH/2, (CONSTANTS.GAME_HEIGHT/2)-150, 'title');
    title.anchor.setTo(0.5);
    title.scale.set(1.4);
    title.alpha = 0;
  	
    var wizzard = this.add.sprite(100, 250, 'player');
    wizzard.anchor.setTo(0.5);
    wizzard.scale.setTo(3);
    wizzard.animations.add('right', [4, 5, 6, 7], CONSTANTS.FRAME_RATE, true);
    wizzard.animations.add('cast', [9], 1, true);
    wizzard.animations.play('right');
    this.add.tween(wizzard).to({x: 512}, 4000, Phaser.Easing.Linear.None, true, 0, 0, false);

    var that = this;
    setTimeout(function() {
      wizzard.animations.play('cast');
      that.add.tween(title).to({alpha: 1}, 2400, "Linear", true, 0, 0);
      that.add.tween(that.titleBg).to({alpha: 1}, 3200, "Linear", true, 0 , 0);
    }, 4000);
  },

  startGame: function (pointer) {
    this.state.start('Game');

  },
  startHowTo: function (pointer) {
    this.state.start('HowTo');
  }

};

return { MainMenu: Conjurer.MainMenu};
});