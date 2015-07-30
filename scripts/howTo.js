var Conjurer = Conjurer || {};

define(function () {
Conjurer.HowTo = function(game) { };

Conjurer.HowTo.prototype = {
  create: function() {
    this.background = this.add.tileSprite(0, 0, 1024, 512, 'background');
    
    var text = "How To Play:";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.add.text(170, 52, text, style);

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