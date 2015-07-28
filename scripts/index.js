var Conjurer = Conjurer || {};

var game = new Phaser.Game(1024, 512, Phaser.AUTO, '');

game.state.add('Boot', Conjurer.Boot);
game.state.add('Preload', Conjurer.Preload);
game.state.add('MainMenu', Conjurer.MainMenu);
game.state.add('Game', Conjurer.Game);

game.state.start('Boot');