var Conjurer = Conjurer || {};

define(function () {
Conjurer.GameOver = function(game) { };

Conjurer.GameOver.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.add.tileSprite(0, 0, 1024, 512, 'wall');

    //start game text
    var text = "Game Over";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.add.text(512, 256, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "This screen is unfinished...duh, click to go back, now! ";
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.add.text(512, 316, text, style);
    h.anchor.set(0.5);
  },
  update: function() {
    if (this.input.activePointer.justPressed()) {
       this.state.start('MainMenu');
     }
  },
  
  backToMain: function (pointer) {
    this.state.start('MainMenu');
  }

};

return { GameOver: Conjurer.GameOver};
});