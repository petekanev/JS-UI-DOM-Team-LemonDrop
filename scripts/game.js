//window.onLoad = ConjurerGame;

var CONSTANTS = {
    SPEED: 100,
    TILE_SIZE : 32,
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 512
};

var ConjurerGame = (function () {
    var player,
        playerAirborne = false,
        playerState,
        playerSpeed =100,
        placedCrates = 0;

    var coinsCollected = 0,
        hasKey = false,
        timeElapsed = 0,
        deads = 0;

    var levelMap,
        levelLayer;

    var controller;

    var lightSprite,
        shadowTexture;

    var game = new Phaser.Game(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT, Phaser.Canvas, 'ConjurerGame');   
    var ConjurerGame = function (game) {};

    ConjurerGame.prototype = {
        preload: preload,
        create: create,
        update: update
    };

    function preload() {
        //??add a background image???

        // Loads game board elements - tilrmap and images
        this.load.tilemap('level1', 'level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('wall', 'assets\\images\\wall.png');
        this.load.image('crate', 'assets\\images\\crate.png');
        this.load.image('coin', 'assets\\images\\coin.png');
        this.load.image('key', 'assets\\images\\key.png');
        this.load.image('door', 'assets\\images\\door.png');
        this.load.image('spikes', 'assets\\images\\spikes.png');

        // preloads the player spritesheet with key 'player', width 30, height 32, -1 as
        // as the following parameter means that we allow the engine to decide the amount
        // of frames the spritesheet contains; 5px by 5px is the spacing and margin between frames
        this.load.spritesheet('player', 'assets/sprites/player.png', 30, 32);

        // audio to be loaded for different events within the game
        // game.load.audio('coinCollect', 'assets\\sounds\\coin.mp3');
        // game.load.audio('playerDied', 'assets\\sounds\\playerDied.mp3');
        // game.load.audio('bgMusic', 'assets\\sounds\\bgMusic.mp3');
    }

    function create() {
        // ???? reset statistics ????

        // Initiates arcade physics (objects can collide)
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // Creates the tilemap and the objects on the map using the loaded sources
        levelMap = createLevelMap(this);
        // Defines current level layer
        levelLayer = levelMap.createLayer('myLevel1');
        levelLayer.cratePos = null;

        // Adds a key input controllerto the game
        controller = this.input.keyboard.createCursorKeys();

        // Creates player
        player = createPlayer(this);

        //player.animations.add('right', [], 1, true);
        // waits for input, either touch or mouse click to call provided method
        // adds an onDown event to be referred to later on
        this.input.onUp.add(placeCrate, this);

        // Character emits light to reveal the map ???? Check how to extract it in a method!!!
        shadowTexture = this.add.bitmapData(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);
        lightSprite = this.add.image(this.camera.x, this.camera.y, shadowTexture);
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    }

    function update() {
        var tileUnderPlayer;
        player.body.velocity.x = 0;

        // check for collision between the player and the level, and call "movePlayer" if there's a collision
        tileUnderPlayer = levelMap.getTileWorldXY(player.x, player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

        if (tileUnderPlayer !== null) {
            switch (tileUnderPlayer.index) {
                case 2: 
                case 3: killPlayer(game);
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
        game.physics.arcade.collide(player, levelLayer, move);

        // Character emits light to reveal the map
        lightSprite.reset(game.camera.x, game.camera.y);
        shadowTexture = updateShadowTexture(game, shadowTexture, player);
    }

    function placeCrate(pos) {
        var velocityBeforeCast = playerSpeed,
            facingStateBeforeCast = player.facing;

        // Prevents to put crate over the player
        if (!levelMap.getTileWorldXY(pos.x, pos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer) && !player.body.hitTest(pos.x, pos.y)) {
            // Is there already a crate placed by the player?
            if (levelLayer.cratePos) {
                levelMap.removeTileWorldXY(levelLayer.cratePos.x, levelLayer.cratePos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
            }

            // Place the crate on the mouse position
            levelMap.putTileWorldXY(2, pos.x, pos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

            // Saves placed crate position
            levelLayer.cratePos = new Phaser.Point(pos.x, pos.y);

            // Cast the magic
            playerSpeed = 0;
            player.animations.play('cast');
            playerState = 'cast';

            // Restart the mooving animation
            setTimeout(function () {
                playerSpeed = velocityBeforeCast;
                playerState = facingStateBeforeCast;
            }, 200);
        }

    }

    function move() {
        // walks automatically (or until a button is pressed to resume)
        // changes direction on collision
        // updates sprite when necessary
        processKeyboardInput();
        processPlayerMovement();
    }

    function processKeyboardInput() {
        if (controller.down.isDown) {
            player.animations.stop();
            player.frame = 4;
            playerSpeed = 0;
        }

        if (controller.left.isDown) {
            playerSpeed = -CONSTANTS.SPEED;
            player.animations.play('left');
        }

        if (controller.right.isDown) {
            playerSpeed = CONSTANTS.SPEED;
            player.animations.play('right');
        }
    }

    function processPlayerMovement() {
        // Is the player blocked down, that is: is the player on the floor or on the crate?
        if (player.body.blocked.down) {
            player.body.velocity.x = playerSpeed;
            if (playerSpeed < 0) {
                player.animations.play('left');
            }
            if (playerSpeed > 0) {
                player.animations.play('right');
            }
            playerAirborne = false;
        }

        if (player.body.blocked.right && playerSpeed > 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore tile if its a coin or key
            if (allowedToJump('left')) {
                jump();
            } else {
                player.animations.play('left');
                playerSpeed *= -1;
            }
        } else if (player.body.blocked.left && playerSpeed < 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore tile if its a coin or key
            if (allowedToJump('right')) {
                jump();
            }
            else {
                player.animations.play('right');
                playerSpeed *= -1;
            }
        }
    }

    function allowedToJump (direction) {
        var tileDiagonalToPlayer,
            tileAbovePlayer = levelMap.getTileWorldXY(player.x, player.y - CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

        if (direction === 'left') {
            tileDiagonalToPlayer = levelMap.getTileWorldXY(player.x + CONSTANTS.TILE_SIZE, player.y - CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
        } else {
            tileDiagonalToPlayer = levelMap.getTileWorldXY(player.x - CONSTANTS.TILE_SIZE, player.y - CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);

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
        if (playerAirborne) {
            return true;
        }
        return false;
    }

    function jump() {
        // setting player vertical velocity
        player.body.velocity.y = -100;
        player.body.velocity.x = playerSpeed / 2;
        player.animations.stop();

        if (playerSpeed > 0) {
            player.frame = 4;
        } else if (playerSpeed < 0) {
            player.frame = 2;
        }

        playerAirborne = true;
    }

    function collectCoin() {
        coinsCollected += 1;
        levelMap.removeTileWorldXY(player.x, player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function collectKey() {
        hasKey = true;
        levelMap.removeTileWorldXY(player.x, player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, levelLayer);
    }

    function tryEnterTheDoor() {
        if (hasKey) {
            game.paused = true;
        }
    }


    // function initLevel() {
    //     // loads initial data for the level, everything sans resetting statistics

    // }

    game.state.add('ConjurerGame', ConjurerGame);
    game.state.start('ConjurerGame');

}());

function createPlayer(game) {
    var player = game.add.sprite(80, 464, 'player');
    // sets the anchor of the player object to the middle of the picture
    player.anchor.setTo(0.5, 0.5);
    // sets player gravity and allows collision with other objects
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // sets gravity in the vertical context
    player.body.gravity.y = 500;
    // playerSpeed = CONSTANTS.SPEED;
    // playerState = 'right';
    // parameters are placeholder values until a spritesheet is made
    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('right', [4, 5, 6], 10, true);
    player.animations.add('cast', [3], 1, true);

    return player;
}

function createLevelMap(game) {
    var levelMap = game.add.tilemap('level1');
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


function killPlayer(game) {
    // Kill the magician!
    game.paused = true;
}

function updateShadowTexture(game, shadowTexture, player) {
    // Drow shadow
    var radius,
        heroX,
        heroY,
        gradient;

    shadowTexture.context.fillStyle = 'rgba(10, 10, 10, 1)';
    shadowTexture.context.fillRect(0, 0, game.width, game.height);

    radius = 250 + game.rnd.integerInRange(1, 10);
    heroX = player.x - game.camera.x;
    heroY = player.y - game.camera.y;

    // Draw circle of light with a soft edge
    gradient = shadowTexture.context.createRadialGradient(
        heroX, heroY, 100 * 0.75,
        heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 220, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 30, 0.0)');

    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradient;
    shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
    shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    shadowTexture.dirty = true;

    return shadowTexture;
}