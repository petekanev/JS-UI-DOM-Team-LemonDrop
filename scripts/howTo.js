var Conjurer = Conjurer || {};

define(function () {
Conjurer.HowTo = function(game) { };

Conjurer.HowTo.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.add.tileSprite(0, 0, 1024, 512, 'wall');
    
    //give it speed in x
    this.background.autoScroll(-20, 0);

    //start game text
    var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    //var t = this.add.text(1024/2, 512/2, text, style);
    //t.anchor.set(0.5);

    //highest score
    text = "Highest score: " + this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.add.text(1024/2, 512/2 + 50, text, style);
    h.anchor.set(0.5);
    //this.playButton = this.add.button(400, 256, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
    this.howTo = this.add.button(400, 300, 'howTo', this.backToMain, this, 'buttonOver', 'buttonOut', 'buttonOver');
  },
  update: function() {
    // if (this.input.activePointer.justPressed()) {
    //   this.state.start('Game');
    // }
  },
  
  backToMain: function (pointer) {
    this.state.start('MainMenu');
  }

};

return { HowTo: Conjurer.HowTo};
});