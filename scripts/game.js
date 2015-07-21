window.onLoad = function() {
	//useful game. functions -
	//onBlur, onPause, onResume, onFocus, paused (boolean property), 

	// generates either a WebGL or Canvas, depending on client, creates a STATE object with
	// properties preload, create, update, render, false on transparent canvas, and false 
	// modifier on anti-aliasing - smoothing of the edges
	var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'TracerGame'),
		player,
		playerAirborne = false,
		coinsCollected = 0,
		hasKey = false,
		timeElapsed = 0,
		placedCrates = 0,
		tileSize = 32,
		tileCoords = null,
		level1Map,
		level2Map,
		level3Map,
		levelLayer,
		controller;

	var ConjurerGame = function(game){};

	ConjurerGame.prototype = {
		preload: preload,
		create: create,
		update: update
	}

	function preload() {
		game.load.tilemap('level1', 'level1map.json', null, Phaser.Tilemap.TILED_JSON);
		// game.load.tilemap('level2', 'level2map.json', null, Phaser.Tilemap.TILED_JSON);
		// game.load.tilemap('level3', 'level3map.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('wall', 'assets\\images\\wall.png');
		game.load.image('crate', 'assets\\images\\crate.png');
		game.load.image('coin', 'assets\\images\\coin.png');
		game.load.image('key', 'assets\\images\\key.png');
		game.load.image('door', 'assets\\images\\door.png');
		game.load.image('spikes', 'assets\\images\\spikes.png');

		// preloads the player spritesheet with key 'player', width 24, height 32, -1 as
		// as the following parameter means that we allow the engine to decide the amount
		// of frames the spritesheet contains; 5px by 5px is the spacing and margin between frames
		game.load.image('testPlayer', 'assets\\images\\testPlayer.png');
		// game.load.spritesheet('player', 'assets\\sprites\\player.png', 24, 32, -1, 5);

		// audio to be loaded for different events within the game
		// game.load.audio('coinCollect', 'assets\\sounds\\coin.mp3');
		// game.load.audio('playerDied', 'assets\\sounds\\playerDied.mp3');
		// game.load.audio('bgMusic', 'assets\\sounds\\bgMusic.mp3');
	}

	function create() {
		//initiates arcade physics (objects can collide)
		game.physics.startSystem(Phaser.Physics.ARCADE);
		level1Map = game.add.tilemap('level1');
		level1Map.addTilesetImage('wall');
		level1Map.addTilesetImage('crate');
		//level1Map.addTilesetImage('coin');
		//level1Map.addTilesetImage('door');
		//level1Map.addTilesetImage('key');

		// adds collision (objects are solid) to all objects with '1' in the tilemap array
		level1Map.setCollisionBetween(1, 2);

		// removes collision from objects which are meant to be operated with (coins, keys),
		// indexes(numbers) are provided in the array or as a number
		// level1Map.setCollision([], false);
		// alternative:
		// level1Map.setCollisionByExclusion(indexes(ids/numbers in the tilemap) to not collide),
		// false);

		levelLayer = level1Map.createLayer('level');

		player.sprite = game.add.sprite(48, 226, 'testPlayer');
		// sets the anchor of the player object to the middle of the picture
		player.anchor.setTo(0.5, 0.5);
		// sets player gravity and allows collision with other objects
		game.physics.enable(player, Phaser.Physics.ARCADE);
		// sets gravity in the vertical context
		player.body.gravity.y = 700;
		player.speed = 100;
		player.facing = 'right';

		// parameters are placeholder values until a spritesheet is made
		player.animations.add('left', [], 1, true);
		player.animations.add('cast', [], 1, true);
		player.animations.add('right', [], 1, true);

		// waits for input, either touch or mouse click to call provided method
		// adds an onDown event to be referred to later on
		game.input.onDown.add(placeCrate, this);
	}

	function update() {
		// move player
		// perform checks whether the player can jump
	}

	function placeCrate(pos) {
		// performs check whether placement at a position is possible
		// updates sprite
		// player stops moving for 1/2 second to 'conjure' the crate
		// remove old crate if one already exists
		// updates sprite, walking resumes
	}

	function move() {
		// walks automatically (or until a button is pressed to resume)
		// alternative: walks using the left and right arrows
		// changes direction on collision
		// updates sprite when necessary
	}

	function jump() {
		// ..
	}

	function collect() {
		// collects coins and keys
		// updates info
	}

	game.state.add('ConjurerGame', ConjurerGame);
	game.state.start('ConjurerGame');

}();