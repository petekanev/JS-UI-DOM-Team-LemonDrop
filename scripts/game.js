//window.onLoad = ConjurerGame;

var CONSTANTS = {
    SPEED: 100,
    TILE_SIZE : 32,
    PLAYER_TILE_WIDTH: 30,
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 512,
    PLAYER_SPEED: 100,
    SHADOW_RADIUS: 250,
    PLAYER_BODY_GRAVITY: 500,
    FRAME_RATE: 10,
    CASTING_TIMEOUT: 300,
    JUMP_VELOCITY_STOPPER: -150
};

var ConjurerGame = (function () {
    var player,
        playerAssets,
        levelMap,
        levelLayer,
        keyInputController,
        shadowMask,
        levelCounter = 1,
        game = new Phaser.Game(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT, Phaser.Canvas, 'ConjurerGame'),
        ConjurerGame = function (game) {},
        ConjurerGame2 = function(game) {};

    ConjurerGame.prototype = {
        preload: preload,
        create: create,
        update: update
    };

    ConjurerGame2.prototype = {
        preload: preload,
        create: createLevel2,
        update: update
    };

    function preload() {
        //??add a background image???

        // Loads game board elements - tilrmap and images
        this.load.tilemap('conjurerLevels', 'conjurerLevels.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('wall', 'assets\\images\\wall.png');
        this.load.image('crate', 'assets\\images\\crate.png');
        this.load.image('coin', 'assets\\images\\coin.png');
        this.load.image('key', 'assets\\images\\key.png');
        this.load.image('door', 'assets\\images\\door.png');
        this.load.image('spikes', 'assets\\images\\spikes.png');

        // preloads the player spritesheet with key 'player', width 30, height 32, -1 as
        // as the following parameter means that we allow the engine to decide the amount
        // of frames the spritesheet contains; 5px by 5px is the spacing and margin between frames
        this.load.spritesheet('player', 'assets/sprites/player.png', CONSTANTS.PLAYER_TILE_WIDTH, CONSTANTS.TILE_SIZE);

        // audio to be loaded for different events within the game
        // game.load.audio('coinCollect', 'assets\\sounds\\coin.mp3');
        // game.load.audio('playerDied', 'assets\\sounds\\playerDied.mp3');
        // game.load.audio('bgMusic', 'assets\\sounds\\bgMusic.mp3');
    }

    function create() {
        // ???? reset statistics ????

        // Initiates arcade physics (objects can collide)
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Creates the tilemap and the objects on the map using the loaded sources
        levelMap = createLevelMap(game);
        levelLayer = levelMap.createLayer('level' + levelCounter.toString());
        levelLayer.cratePos = null;

        // Adds a key input controllerto the game
        keyInputController = game.input.keyboard.createCursorKeys();

        // Creates player
        player = createPlayer(game);

        playerAssets = initializePlayerAssets();

        //player.animations.add('right', [], 1, true);
        // waits for input, either touch or mouse click to call provided method
        // adds an onDown event to be referred to later on
        game.input.onUp.add(placeCrate, game);

        // Character emits light to reveal the map ???? Check how to extract it in a method!!!
        shadowTexture = game.add.bitmapData(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);
        lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;        
    }

    function createLevel2() {
        // ???? reset statistics ????

        // Initiates arcade physics (objects can collide)
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Creates the tilemap and the objects on the map using the loaded sources
        levelMap = createLevelMap(game);
        levelLayer = levelMap.createLayer('level' + levelCounter.toString());
        levelLayer.cratePos = null;

        // Adds a key input controllerto the game
        keyInputController = game.input.keyboard.createCursorKeys();

        // Creates player
        player = createPlayer(game);

        playerAssets = initializePlayerAssets();

        //player.animations.add('right', [], 1, true);
        // waits for input, either touch or mouse click to call provided method
        // adds an onDown event to be referred to later on
        game.input.onUp.add(placeCrate, game);

        // Character emits light to reveal the map ???? Check how to extract it in a method!!!
        shadowTexture = game.add.bitmapData(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);
        lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY; 
    }

    function update() {
        var tileUnderPlayer;
        
        if (playerAssets.playerAirborne) {
            player.body.velocity.x = playerAssets.playerSpeed/2;
        } else {
            player.body.velocity.x = 0;
            playerAssets.counterWeight = 0;
        }

        // check for collision between the player and the level, and call "movePlayer" if there's a collision
        tileUnderPlayer = levelMap.getTileWorldXY(player.x, player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

        if (tileUnderPlayer !== null) {
            switch (tileUnderPlayer.index) {
                case 2: 
                case 3: killPlayer();
                    break;
                case 4: collectCoin();
                    break;
                case 5: collectKey();
                    break;
                case 6: tryEnterTheDoor();
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
        var player = game.add.sprite(80, 464, 'player');
        // sets the anchor of the player object to the middle of the picture
        player.anchor.setTo(0.5, 0.5);
        // sets player gravity and allows collision with other objects
        game.physics.enable(player, Phaser.Physics.ARCADE);
        // sets gravity in the vertical context
        player.body.gravity.y = CONSTANTS.PLAYER_BODY_GRAVITY;
        // parameters are placeholder values until a spritesheet is made
        player.animations.add('left', [0, 1, 2], CONSTANTS.FRAME_RATE, true);
        player.animations.add('right', [4, 5, 6], CONSTANTS.FRAME_RATE, true);
        player.animations.add('cast', [3], 1, true);

        return player;
    }

    function createLevelMap(game) {
        var levelMap = game.add.tilemap('conjurerLevels');
        levelMap.addTilesetImage('wall');
        levelMap.addTilesetImage('crate');
        levelMap.addTilesetImage('spikes');
        levelMap.addTilesetImage('coin');
        levelMap.addTilesetImage('key');
        levelMap.addTilesetImage('door');
        // Define which objects are solid - '1' (bricks) and '2' box in the tilemap array
        levelMap.setCollisionBetween(1, 2);

        return levelMap;
    }

    function initializePlayerAssets() {
        var playerAssets = {
            playerState: 'left',
            playerAirborne: false,
            playerSpeed: CONSTANTS.PLAYER_SPEED,
            coinsCollected: 0,
            hasKey: false,
            timeElapsed: 0,
            lifes: 0,
            counterWeight: 0
        };
        return playerAssets;
    }

    function updateShadowTexture(game, shadowTexture, player) {
        // Drow shadow
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

        // Prevents to put crate over the player
        if (!getCurrentTile(pos.x, pos.y) && !player.body.hitTest(pos.x, pos.y)) {
            // Is there already a crate placed by the player?
            if (levelLayer.cratePos) {
                removeTileFromPosition(levelLayer.cratePos);
            }

            // Place the crate on the mouse position
            placeTileOnPosition(2, pos.x, pos.y);

            // Saves placed crate position
            levelLayer.cratePos = new Phaser.Point(pos.x, pos.y);

            // Cast the magic
            playerAssets.playerSpeed = 0;
            player.animations.play('cast');
            playerAssets.playerState = 'cast';

            // Restart the mooving animation
            setTimeout(function () {
                playerAssets.playerSpeed = velocityBeforeCast;
                playerAssets.playerState = facingStateBeforeCast;
            }, CONSTANTS.CASTING_TIMEOUT);
        }
    }

    function getCurrentTile(x, y) {
        var result = levelMap.getTileWorldXY(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
        return result;
    }

    function removeTileFromPosition(tile) {
        levelMap.removeTileWorldXY(tile.x, tile.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function placeTileOnPosition (tileType, x, y) {
        levelMap.putTileWorldXY(tileType, x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function move() {
        // walks automatically (or until a button is pressed to resume)
        // changes direction on collision
        // updates sprite when necessary
        processKeyboardInput();
        processPlayerMovement();
    }

    function processKeyboardInput() {
        if (keyInputController.down.isDown) {
            player.animations.stop();
            player.frame = 4;
            playerAssets.playerSpeed = 0;
        }

        if (keyInputController.left.isDown) {
            playerAssets.playerSpeed = -CONSTANTS.SPEED;
            player.animations.play('left');
        }

        if (keyInputController.right.isDown) {
            playerAssets.playerSpeed = CONSTANTS.SPEED;
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
        player.body.velocity.y = CONSTANTS.JUMP_VELOCITY_STOPPER + playerAssets.counterWeight*2;
        player.animations.stop();

        if (playerAssets.playerSpeed > 0) {
            player.frame = 4;
        } else if (playerAssets.playerSpeed < 0) {
            player.frame = 2;
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

    function tryEnterTheDoor() {
        if (playerAssets.hasKey) {
            levelCounter += 1;
            game.state.start('ConjurerGame2');
        }
    }

    function killPlayer() {
        // Kill the magician!
        game.paused = true;
    }

    game.state.add('ConjurerGame', ConjurerGame);
    game.state.add('ConjurerGame2', ConjurerGame2);
    game.state.start('ConjurerGame');
}());