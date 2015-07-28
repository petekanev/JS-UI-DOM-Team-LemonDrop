var Conjurer = Conjurer || {};

define(function () {
Conjurer.Boot = function (game) { };

Conjurer.Boot.prototype = {
  preload: function () {
    // assets we'll use in the loading screen
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function () {
    // loading screen will have a gray background
    this.stage.backgroundColor = '#aaa';

    //scaling options
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	
    //have the game centered horizontally
    //this.scale.pageAlignHorizontally = true;

    //screen size will be set automatically
    //this.scale.setScreenSize(true);

    //physics system for movement
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};

return {Boot: Conjurer.Boot};
});