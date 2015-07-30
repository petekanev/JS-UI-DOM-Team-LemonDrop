var Conjurer = Conjurer || {};

require(['game', 'mainMenu', 'boot', 'preload', 'howTo', 'gameOver'],
function (Game, MainMenu, Boot, Preload, HowTo, GameOver) {
	var game = new Phaser.Game(1024, 512, Phaser.AUTO, '');

	game.state.add('Boot', Boot.Boot);
	game.state.add('Preload', Preload.Preload);
	game.state.add('MainMenu', MainMenu.MainMenu);
	game.state.add('HowTo', HowTo.HowTo);
	game.state.add('Game', Game.Game);
	game.state.add('GameOver', GameOver.GameOver);

	game.state.start('Boot');

	return game;
});