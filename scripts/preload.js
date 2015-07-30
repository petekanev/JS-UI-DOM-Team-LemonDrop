var Conjurer = Conjurer || {};

define(function () {
Conjurer.Preload = function (game) {
  this.splash;
  this.preloadBar;
};

Conjurer.Preload.prototype = {
  preload: function () {
    // Loads game board elements - tilemap and images
    this.load.image('background', 'assets/images/brick_bg.png');
    this.load.tilemap('conjurerLevels', 'levels/levels.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('wall', 'assets/images/walltile.png');
    this.load.image('crate', 'assets/images/crate.png');
    this.load.image('coin', 'assets/images/gem.png');
    this.load.image('key', 'assets/images/key.png');
    this.load.image('door', 'assets/images/door.png');
    this.load.image('spikes', 'assets/images/spikes1.png');
    this.load.image('pause', 'assets/images/pause.png');
    this.load.image('sound', 'assets/images/sound.png');
    this.load.image('menu', 'assets/images/menu.png');
    this.load.image('playButton', 'assets/images/playButton.png');
    this.load.image('title', 'assets/images/gameTitle.png');

    this.load.spritesheet('enemy', 'assets/sprites/flame_animation.png', 30, 32);
    this.load.spritesheet('player', 'assets/sprites/wizard_animation.png', 30, 32);

    // audio to be loaded for different events within the game
    //this.load.audio('coinCollect', 'assets/audio/coin.mp3');
    //this.load.audio('playerDied', 'assets/audio/playerDied.mp3');
    this.load.audio('bgMusic', 'assets/audio/bgMusic.mp3');
    //this.load.audio('conjureBox', 'assets/audio/conjureBox.mpc');
    
  },
  create: function () {
    this.state.start('MainMenu');
  }
};

return {Preload: Conjurer.Preload};
});