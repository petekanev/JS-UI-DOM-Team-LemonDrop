var Conjurer = Conjurer || {};

define(function () {
Conjurer.MainMenu = function(game) { };

Conjurer.MainMenu.prototype = {
  create: function() {
  	//show the space tile, repeated
    //this.background = this.add.tileSprite(0, 0, 1024, 512, 'wall');
    this.stage.setBackgroundColor(0x483F32);
    //give it speed in x
   // this.background.autoScroll(-20, 0);

    //start game text
    var text = "Conjurer Puzzle Game";
    var style = { font: "50px 'Harrington'", fill: "#fff", align: "center" };
    var t = this.add.text(1024/2, 100, text, style);
    t.anchor.set(0.5);
    
    var gems = this.add.group();

    for(var i = 0; i < 50; i+=1){
      var c = gems.create(this.world.randomX, Math.random()*500, 'coin');
      c.alpha = 0;
    }
    var that = this;
    gems.forEach(function (child) {
      console.log(child);
      var tween = that.add.tween(child).to({alpha: 1}, 1000+that.rnd.integerInRange(0, 2000), "Linear", true, 0, -1);
      tween.yoyo(true, 1000);
    }, this)

    //highest score
    //text = "Highest score: " + this.highestScore;
    //style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    //var h = this.add.text(1024/2, 512/2 + 50, text, style);
    //h.anchor.set(0.5);
    this.playButton = this.add.button(512-64, 256, 'playButton', this.startGame, this);

    this.howTo = this.add.button(512-64, 320, 'howTo', this.startHowTo, this);
  },
  update: function() {
    // if (this.input.activePointer.justPressed()) {
    //   this.state.start('Game');
    // }
  },
  startGame: function (pointer) {

    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  },
  startHowTo: function (pointer) {
    this.state.start('HowTo');
  }

};

return { MainMenu: Conjurer.MainMenu};
});