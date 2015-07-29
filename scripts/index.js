var Conjurer = Conjurer || {};

require(['game', 'mainMenu', 'boot', 'preload'],
function (Game, MainMenu, Boot, Preload) {
	var game = new Phaser.Game(1024, 512, Phaser.CANVAS, '');

	game.state.add('Boot', Boot.Boot);
	game.state.add('Preload', Preload.Preload);
	game.state.add('MainMenu', MainMenu.MainMenu);
	game.state.add('Game', Game.Game);

	game.state.start('Boot');

	return game;
});