//window.onLoad = ConjurerGame;

var CONSTANTS = {
    TILE_SIZE : 32,
    PLAYER_TILE_WIDTH: 30,
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 512,
    PLAYER_SPEED: 100,
    SHADOW_RADIUS: 250,
    PLAYER_BODY_GRAVITY: 500,
    FRAME_RATE: 5,
    CASTING_TIMEOUT: 200,
    JUMP_VELOCITY_STOPPER: -150,
    COUNTERWEIGHT_FORCE: 6,
    PLAYER_HORIZONTAL_STARTING_POSITION: 80,
    PLAYER_VERTICAL_STARTING_POSITION: 460,
    PLAYER_STARTING_LIFE_POINTS: 10,
    AVAILABLE_LEVELS: 3,
    PAUSED_TEXT: 'Click to resume game!',
    PAUSED_TEXT_PLAYER_DIED: 'Oh no, you lost a life point!\nClick to continue!\nLives left: ',
    GAME_OVER: 'lel, you just died...' 
};

var ConjurerGame = (function () {
    var player,
    playerAssets,
    levelMaps,
    levelLayer,
    inputController,
    pauseButton,
    pausedText,
    bg,
    levelCounter = 1,
    game = new Phaser.Game(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT, Phaser.Canvas, 'ConjurerGame'),
    ConjurerGame = function (game) {};

    ConjurerGame.prototype = {
        preload: preload,
        create: create,
        update: update
    };

    function preload() {
        // Loads game board elements - tilrmap and images
        this.load.image('background', 'assets/images/generic_bg.png');
        this.load.tilemap('conjurerLevels', 'levels/levels.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('wall', 'assets/images/walltile.png');
        this.load.image('crate', 'assets/images/crate.png');
        this.load.image('coin', 'assets/images/coin.png');
        this.load.image('key', 'assets/images/key.png');
        this.load.image('door', 'assets/images/door.png');
        this.load.image('spikes', 'assets/images/spikes.png');
        this.load.image('pause', 'assets/images/pause.png');

        this.load.spritesheet('player', 'assets/sprites/wizard_animation.png', CONSTANTS.PLAYER_TILE_WIDTH, CONSTANTS.TILE_SIZE);

        // audio to be loaded for different events within the game
        // game.load.audio('coinCollect', 'assets\\sounds\\coin.mp3');
        // game.load.audio('playerDied', 'assets\\sounds\\playerDied.mp3');
        // game.load.audio('bgMusic', 'assets\\sounds/bgMusic.mp3');
        // game.load.audio('conjureBox', 'assets\\sounds\\conjureBox.mpc');
    }



    function create() {
        // Initiates arcade physics (objects can collide)
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Loads level maps and passes on the layer (level)
        levelMaps = createlevelMaps(game);
        levelMaps.setCollision([1, 2], true, 'level3');
        levelMaps.setCollision([1, 2], true, 'level2');
        levelMaps.setCollision([1, 2], true, 'level1');
        levelLayer = drawLevel();

        // Adds a key input controller to the game
        inputController = game.input.keyboard.createCursorKeys();

        // Creates player
        player = createPlayer(game);

        playerAssets = initializePlayerAssets();

        // Adds events to the game stage
        game.input.onUp.add(placeCrate, game);
        game.input.onDown.add(function () {
            if (game.paused) {
                game.paused = false;
                pausedText.destroy();
            }
        }, game);

        // Adds a functional pause button, sprite is added in the drawLevel method
        pauseButton.inputEnabled = true;
        pauseButton.events.onInputUp.add(function () {
            game.paused = true;
            pausedText = game.add.text(game.world.centerX, game.world.centerY, CONSTANTS.PAUSED_TEXT, { font: "65px Impact", fill: "#fff", align: "center" });
            pausedText.anchor.setTo(0.5);
        }, game);
    }

    function drawLevel() {
    	bg = game.add.sprite(0, 0, 'background');
    	var levelLayer = levelMaps.createLayer('level' + levelCounter.toString());
    	// resets crate placed by the conjurer
        crate = null;
        // applies a black mask over the game stage
        setLighting();
        //redraw pause button sprite, as it is hidden because of the freshly drawn layers of bg and tilemap
        pauseButton = game.add.sprite(8, 8, 'pause');
        
        return levelLayer;
    }

    function setLighting() {
    	shadowTexture = game.add.bitmapData(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);
        lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    }

    function update() {
        var tileUnderPlayer;
        
        if (playerAssets.playerAirborne) {
            player.body.velocity.x = playerAssets.playerSpeed/1.5;
        } else {
            player.body.velocity.x = 0;
            playerAssets.counterWeight = 0;
        }

        // check for collision between the player and the level, and call "movePlayer" if there's a collision
        tileUnderPlayer = levelMaps.getTileWorldXY(player.x, player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

        if (tileUnderPlayer !== null) {
            switch (tileUnderPlayer.index) {
                case 2: 
                case 3: killPlayer();
                break;
                case 4: collectCoin();
                break;
                case 5: collectKey();
                break;
                case 6: tryEnterDoor();
                break;
            }
        }

        // Applies physics ot the player
        this.physics.arcade.collide(player, levelLayer, move);

        // Character emits light to reveal the map
        lightSprite.reset(game.camera.x, game.camera.y);
        shadowTexture = updateShadowTexture(game, shadowTexture, player);
    }

    function createPlayer(game) {
        var player = game.add.sprite(CONSTANTS.PLAYER_HORIZONTAL_STARTING_POSITION, CONSTANTS.PLAYER_VERTICAL_STARTING_POSITION, 'player');
        // sets the anchor of the player object to the middle of the picture
        player.anchor.setTo(0.5, 0.5);
        // sets player gravity and allows collision with other objects
        game.physics.enable(player, Phaser.Physics.ARCADE);
        // sets gravity in the vertical context
        player.body.gravity.y = CONSTANTS.PLAYER_BODY_GRAVITY;
        // parameters are placeholder values until a spritesheet is made
        player.animations.add('left', [0, 1, 2, 3], CONSTANTS.FRAME_RATE, true);
        player.animations.add('right', [4, 5, 6, 7], CONSTANTS.FRAME_RATE, true);
        player.animations.add('cast', [9], 1, true);
        player.animations.add('castleft', [10], 1, true);

        return player;
    }

    function createlevelMaps(game) {
        var levelMaps = game.add.tilemap('conjurerLevels');
        levelMaps.addTilesetImage('wall');
        levelMaps.addTilesetImage('crate');
        levelMaps.addTilesetImage('spikes');
        levelMaps.addTilesetImage('coin');
        levelMaps.addTilesetImage('key');
        levelMaps.addTilesetImage('door');
        // Define which objects are solid - '1' (bricks) and '2' box in the tilemap arrays
        levelMaps.setCollisionBetween(1, 2);

        return levelMaps;
    }

    function initializePlayerAssets() {
        var playerAssets = {
            playerState: 'left',
            playerAirborne: false,
            playerSpeed: CONSTANTS.PLAYER_SPEED,
            coinsCollected: 0,
            hasKey: false,
            placedCrates: 0,
            timeElapsed: 0,
            lives: CONSTANTS.PLAYER_STARTING_LIFE_POINTS,
            counterWeight: 0
        };
        return playerAssets;
    }

    function updateShadowTexture(game, shadowTexture, player) {
        var gradient;

        shadowTexture.context.fillStyle = 'rgba(10, 10, 10, 1)';
        shadowTexture.context.fillRect(0, 0, game.width, game.height);

        // Draw circle of light with a soft edge
        gradient = shadowTexture.context.createRadialGradient(
        player.x, player.y, 100 * 0.75,
        player.x, player.y, CONSTANTS.SHADOW_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 220, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 30, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(player.x, player.y, CONSTANTS.SHADOW_RADIUS, 0, Math.PI * 2, false);
        shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        shadowTexture.dirty = true;

        return shadowTexture;
    }

    function placeCrate(pos) {
        var velocityBeforeCast = playerAssets.playerSpeed,
        	facingStateBeforeCast = player.facing;

        // Prevents putting crate over the player
        if (!getCurrentTile(pos.x, pos.y) && !player.body.hitTest(pos.x, pos.y)) {
            // Removes a previously placed crate
            if (crate) {
                removeTileFromPosition(crate);
            }

            // Place the crate on the mouse position
            placeTileOnPosition(2, pos.x, pos.y);

            // Saves placed crate position
            crate = new Phaser.Point(pos.x, pos.y);

            playerAssets.playerSpeed = 0;
            playerAssets.placedCrates += 1;

            if (velocityBeforeCast > 0) {
                player.animations.play('cast');
            }
            else {
                player.animations.play('castleft');
            }
            playerAssets.playerState = 'cast';
        
            // Restart the mooving animation
            setTimeout(function () {
                playerAssets.playerSpeed = velocityBeforeCast;
                playerAssets.playerState = facingStateBeforeCast;
            }, CONSTANTS.CASTING_TIMEOUT);
        }
    }

    function getCurrentTile(x, y) {
        var result = levelMaps.getTileWorldXY(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
        return result;
    }

    function removeTileFromPosition(tile) {
        levelMaps.removeTileWorldXY(tile.x, tile.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function placeTileOnPosition (tileType, x, y) {
        levelMaps.putTileWorldXY(tileType, x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function move() {
        // walks automatically (or until a button is pressed to stop)
        // changes direction on collision
        // updates sprite when necessary
        processKeyboardInput();
        processPlayerMovement();
    }

    function processKeyboardInput() {
        if (inputController.down.isDown) {
            player.animations.stop();
            player.frame = 4;
            playerAssets.playerSpeed = 0;
        }

        if (inputController.left.isDown) {
            playerAssets.playerSpeed = -CONSTANTS.PLAYER_SPEED;
            player.animations.play('left');
        }

        if (inputController.right.isDown) {
            playerAssets.playerSpeed = CONSTANTS.PLAYER_SPEED;
            player.animations.play('right');
        }
    }

    function processPlayerMovement() {
        // Is the player blocked down, that is: is the player on the floor or on the crate?
        if (player.body.blocked.down) {
            player.body.velocity.x = playerAssets.playerSpeed;
            if (playerAssets.playerSpeed < 0) {
                player.animations.play('left');
            }
            if (playerAssets.playerSpeed > 0) {
                player.animations.play('right');
            }
            playerAssets.playerAirborne = false;
        }

        if (player.body.blocked.right && playerAssets.playerSpeed > 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore tile if its a coin or key
            if (allowedToJump('left')) {
                jump();
            } else {
                player.animations.play('left');
                playerAssets.playerSpeed *= -1;
            }
        } else if (player.body.blocked.left && playerAssets.playerSpeed < 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore tile if its a coin or key
            if (allowedToJump('right')) {
                jump();
            }
            else {
                player.animations.play('right');
                playerAssets.playerSpeed *= -1;
            }
        }
    }

    function allowedToJump (direction) {
        var tileDiagonalToPlayer,
        tileAbovePlayer = getCurrentTile(player.x, player.y - CONSTANTS.TILE_SIZE);

        if (direction === 'left') {
            tileDiagonalToPlayer = getCurrentTile(player.x + CONSTANTS.TILE_SIZE, player.y - CONSTANTS.TILE_SIZE);
        } else {
            tileDiagonalToPlayer = getCurrentTile(player.x - CONSTANTS.TILE_SIZE, player.y - CONSTANTS.TILE_SIZE);

        }

        if (!tileDiagonalToPlayer && !tileAbovePlayer) {
            return true;
        }
        if (tileAbovePlayer && (tileAbovePlayer.index === 4 || tileAbovePlayer.index === 5)) {
            return true;
        }
        if (tileDiagonalToPlayer && (tileDiagonalToPlayer.index === 4 || tileDiagonalToPlayer.index === 5)) {
            return true;
        }
        if (playerAssets.playerAirborne) {
            return true;
        }
        return false;
    }

    function jump() {
        // setting player vertical velocity
        player.body.velocity.y = CONSTANTS.JUMP_VELOCITY_STOPPER + playerAssets.counterWeight*CONSTANTS.COUNTERWEIGHT_FORCE;
        player.animations.stop();

        if (playerAssets.playerSpeed > 0) {
            player.frame = 5;
        } else if (playerAssets.playerSpeed < 0) {
            player.frame = 1;
        }

        playerAssets.playerAirborne = true;
        playerAssets.counterWeight += 1;
    }

    function collectCoin() {
        playerAssets.coinsCollected += 1;
        removeTileFromPosition(player);
    }

    function collectKey() {
        playerAssets.hasKey = true;
        removeTileFromPosition(player);
    }

    function tryEnterDoor() {
        if (playerAssets.hasKey) {
            levelCounter += 1;
            if (levelCounter <= CONSTANTS.AVAILABLE_LEVELS) {
        		levelLayer.destroy();
        		// generates a level depending on the level indicator, redraws background, tilemap and light
        		levelLayer = drawLevel();
        		// swaps background sprite with player sprite, so that the player appears in the front
        		game.world.swap(bg, player);
        		// sets player starting positions of the respective level
            	player.x = CONSTANTS.PLAYER_HORIZONTAL_STARTING_POSITION;
        		player.y = CONSTANTS.PLAYER_VERTICAL_STARTING_POSITION;
        	}
        }
    }

    function killPlayer() {
        if (playerAssets.lives > 1) {
            playerAssets.lives -= 1;

            console.log('Player died, lives left: ' + playerAssets.lives + 
                ' - coins: ' + playerAssets.coinsCollected + ' - placed crates: ' + playerAssets.placedCrates);
            console.log(playerAssets.timeElapsed);
            respawnPlayer();
        } else {
            gameOver();
        }
    }

    function respawnPlayer() {
        player.x = CONSTANTS.PLAYER_HORIZONTAL_STARTING_POSITION;
        player.y = CONSTANTS.PLAYER_VERTICAL_STARTING_POSITION;
        game.paused = true;
        pausedText = game.add.text(game.world.centerX, game.world.centerY, CONSTANTS.PAUSED_TEXT_PLAYER_DIED + playerAssets.lives, { font: "25px Impact", fill: "#fff", align: "center" });
        pausedText.anchor.setTo(0.5); 
    }

    function gameOver() {
        //console.log('Time elapsed: ' + (Date.now() - playerAssets.timeElapsed)/1000 + ' seconds!');
        player.destroy();
        game.paused = true;

        console.log('Player died...FOR GOOD THIS TIME!, lives left: ' + playerAssets.lives + 
                ' - coins: ' + playerAssets.coinsCollected + ' - placed crates: ' + playerAssets.placedCrates);

        pausedText = game.add.text(game.world.centerX, game.world.centerY, CONSTANTS.GAME_OVER, { font: "25px Impact", fill: "#f31", align: "center" });
        pausedText.anchor.setTo(0.5);
        game.state.start('ConjurerGame'); 
    }

    game.state.add('ConjurerGame', ConjurerGame);
    game.state.start('ConjurerGame');
}());