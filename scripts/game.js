window.onLoad = function() {
	//useful game. functions -
	//onBlur, onPause, onResume, onFocus, paused (boolean property), 

	// generates either a WebGL or Canvas, depending on client
	var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'ConjurerGame'),
	player,
	playerAirborne = false,
	coinsCollected = 0,
	hasKey = false,
	timeElapsed = 0,
	placedCrates = 0,
	deads = 0,
	tileSize = 32,
	cratePos = null,
	level1Map,
	level2Map,
	level3Map,
	levelMap,
	levelLayer,
	controller;

	var ConjurerGame = function(game){};

	ConjurerGame.prototype = {
		preload: preload,
		create: create,
		update: update
	};

	function preload() {
		game.load.tilemap('level1', 'sample.json', null, Phaser.Tilemap.TILED_JSON);
		// game.load.tilemap('level2', 'levels\\level2map.json', null, Phaser.Tilemap.TILED_JSON);
		// game.load.tilemap('level3', 'levels\\level3map.json', null, Phaser.Tilemap.TILED_JSON);
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
		// place doors, coins, keys, set collision
		// reset statistics

		//initiates arcade physics (objects can collide)
		game.physics.startSystem(Phaser.Physics.ARCADE);
		levelMap = game.add.tilemap('level1');
		levelMap.addTilesetImage('wall');
		levelMap.addTilesetImage('crate');
		levelMap.addTilesetImage('spikes');
		levelMap.addTilesetImage('coin');
		levelMap.addTilesetImage('key');
		levelMap.addTilesetImage('door');
		// adds collision (objects are solid) to all objects with '1' in the tilemap array
		levelMap.setCollisionBetween(1, 3);

		// removes collision from objects which are meant to be operated with (coins, keys),
		// indexes(numbers) are provided in the array or as a number
		// levelMap.setCollision([], false);
		// alternative:
		// levelMap.setCollisionByExclusion(indexes(ids/numbers in the tilemap) to not collide),
		// false);

levelLayer = levelMap.createLayer('myLevel1');
console.log(levelLayer);

player = game.add.sprite(80, 464, 'testPlayer');
		// sets the anchor of the player object to the middle of the picture
		player.anchor.setTo(0.5, 0.5);
		// sets player gravity and allows collision with other objects
		game.physics.enable(player, Phaser.Physics.ARCADE);
		// sets gravity in the vertical context
		player.body.gravity.y = 500;
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
		   // setting player x speed to zero
		   player.body.velocity.x = 0;
           // check for collision between the player and the level, and call "movePlayer" if there's a collision
           game.physics.arcade.collide(player, levelLayer, move);
       }

       function placeCrate(pos) {
		// performs check whether placement at a position is possible
		// check whether crate is placed anywhere on top of the player
		// updates sprite
		// player stops moving for 1/2 second to 'conjure' the crate
		// remove old crate if one already exists
		// updates sprite, walking resumes

		var velocityX = player.speed,
		facingState = player.facing;

		player.speed = 0;
		player.facing = 'cast';

      // performs checks for diagonally adjascent tiles and tiles directly above the player
      if (!levelMap.getTileWorldXY(pos.x, pos.y, tileSize, tileSize, levelLayer)) {
               // is there already a tile placed by the player?
               if (cratePos){
                    // remove the tile placed by the player
                    levelMap.removeTileWorldXY(cratePos.x, cratePos.y, tileSize, tileSize, levelLayer);	
                }
               // place the tile on mouse/touch position
               levelMap.putTileWorldXY(2, pos.x, pos.y, tileSize, tileSize, levelLayer);
               // save placed tile position
               cratePos = new Phaser.Point(pos.x,pos.y); 		
           }

       setTimeout(function() {
       	player.speed = velocityX;
       	player.facing = facingState;
       }, 500);

   }

   function move() {
		// walks automatically (or until a button is pressed to resume)
		// alternative: walks using the left and right arrows
		// changes direction on collision
		// updates sprite when necessary

  		// is the player blocked down, that is: is the player on the floor?
  		if (player.body.blocked.down){
               // set player horizontal velocity
               player.body.velocity.x = player.speed;
               // the player is definitively not jumping
               playerAirborne = false;
           }
          // is player speed greater than zero and the player is blocked right, that is the player is against a wall on the right?
          if (player.body.blocked.right && player.speed > 0){
               // is the tile on player upper right diagonal empty, as well as the tile immediately above the player, or is the player already jumping?
               if ((!levelMap.getTileWorldXY(player.x + tileSize,player.y - tileSize, tileSize, tileSize, levelLayer) && 
               	!levelMap.getTileWorldXY(player.x, player.y - tileSize, tileSize, tileSize, levelLayer)) || playerAirborne) {
                    // jump
                jump();
            }
            else {
                    // invert player speed
                    player.speed *= -1;
                }
            }
          // the same concept is applied to collisions on the left side of the player
          if (player.body.blocked.left && player.speed < 0){
          	if ((!levelMap.getTileWorldXY(player.x - tileSize, player.y - tileSize, tileSize, tileSize, levelLayer) && 
          		!levelMap.getTileWorldXY(player.x, player.y - tileSize, tileSize, tileSize, levelLayer)) || playerAirborne) {
          		jump();
          }
          else {
          	player.speed *= -1;
          }
      }
  }

  function jump() {
		// ..

  		// setting player vertical velocity        
  		player.body.velocity.x = player.speed / 4;

  		player.body.velocity.y = -100;
  		playerAirborne = true;		
  	}

  	function collect() {
		// collects coins and keys
		// updates info
	}

	game.state.add('ConjurerGame', ConjurerGame);
	game.state.start('ConjurerGame');

}();