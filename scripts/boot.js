var Conjurer = Conjurer || {};

define(function () {
Conjurer.Boot = function (game) { };

Conjurer.Boot.prototype = {
  preload: function () {
    // assets we'll use in the loading screen
    /*
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    */
    this.load.image('playButton', 'assets/images/playButton.png');
    this.load.image('howTo', 'assets/images/howTo.png');
  },
  create: function () {
    // loading screen will have a gray background
    this.stage.backgroundColor = '#aaa';

    //physics system for movement
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};

return {Boot: Conjurer.Boot};
});