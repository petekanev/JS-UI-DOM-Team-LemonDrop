var Conjurer = Conjurer || {};

//loading the game assets
Conjurer.Preload = function (game) {
  this.splash;
  this.preloadBar;
};

Conjurer.Preload.prototype = {
  preload: function () {
    //show logo in loading screen
    this.splash = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    // Loads game board elements - tilemap and images
    this.load.image('background', 'assets/images/generic_bg.png');
    this.load.tilemap('conjurerLevels', 'levels/levels.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('wall', 'assets/images/walltile.png');
    this.load.image('crate', 'assets/images/crate.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('key', 'assets/images/key.png');
    this.load.image('door', 'assets/images/door.png');
    this.load.image('spikes', 'assets/images/spikes1.png');
    this.load.image('pause', 'assets/images/pause.png');

    this.load.spritesheet('player', 'assets/sprites/wizard_animation.png', 30, 32);

    /* // audio to be loaded for different events within the game
    this.load.audio('coinCollect', 'assets/audio/coin.mp3');
    this.load.audio('playerDied', 'assets/audio/playerDied.mp3');
    this.load.audio('bgMusic', 'assets/audio/bgMusic.mp3');
    this.load.audio('conjureBox', 'assets/audio/conjureBox.mpc');
    */
  },
  create: function () {
    this.state.start('MainMenu');
  }
};