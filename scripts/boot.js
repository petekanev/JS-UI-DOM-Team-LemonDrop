var Conjurer = Conjurer || {};

define(function () {
    Conjurer.Boot = function (game) { };

    Conjurer.Boot.prototype = {
      preload: function () {
        this.load.image('playButton', 'assets/images/playButton.png');
        this.load.image('howTo', 'assets/images/howTo.png');
        this.load.image('backButton', 'assets/images/backButton.png');
        this.load.image('tutorialForCollectibles', 'assets/tutorial/tutorialForCollectibles.png');
        this.load.image('tutorialForCrate', 'assets/tutorial/tutorialForCrate.png');
        this.load.image('tutorialForFlame', 'assets/tutorial/tutorialForFlame.png');
        this.load.image('tutorialForKey', 'assets/tutorial/tutorialForKey.png');
        this.load.image('tutorialForPassableWall', 'assets/tutorial/tutorialForPassableWall.png');
        this.load.image('tutorialForSpikes', 'assets/tutorial/tutorialForSpikes.png');
        this.load.image('tutorialForUnpassableWall', 'assets/tutorial/tutorialForUnpassableWall.png');
    },
    create: function () {
    // loading screen will have a gray background
    this.stage.backgroundColor = '#000';

    //physics system for movement
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
}
};

return {Boot: Conjurer.Boot};
});