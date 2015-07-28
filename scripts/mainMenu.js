Conjurer.MainMenu = function(game) { };

Conjurer.MainMenu.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.add.tileSprite(0, 0, this.width, this.height, 'wall');
    
    //give it speed in x
    this.background.autoScroll(-20, 0);

    //start game text
    var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.add.text(this.width/2, this.height/2, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "Highest score: " + this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.add.text(this.width/2, this.height/2 + 50, text, style);
    h.anchor.set(0.5);
  },
  update: function() {
    if (this.input.activePointer.justPressed()) {
      this.state.start('Game');
    }
  }
};