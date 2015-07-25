window.onLoad = function () {
    //useful game. functions -
    //onBlur, onPause, onResume, onFocus, paused (boolean property),

    //useful Body. functions -
    //bottom (same as Body.y + Body.height)
    //right (same as Body.x + Body.width)
    //hitTest(x, y) (Boolean) - may help to prevent player placing box on top of character
    //onFloor() (Boolean) - tests if character collides with another solid object underneath
    //onWall()

    // generates either a WebGL or Canvas, depending on client
    var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'ConjurerGame'),
        player,
        playerAirborne = false,
        playerState = 'right',
        playerSpeed,
        SPEED = 100,
        coinsCollected = 0,
        hasKey = false,
        timeElapsed = 0,
        placedCrates = 0,
        deads = 0,
        tileSize = 32,
        cratePos = null,
        tileUnderPlayer,
        tileAbovePlayer,
        tileRightDiagonalToPlayer,
        tileLeftDiagonalToPlayer,
        level1Map,
        level2Map,
        level3Map,
        levelMap,
        levelLayer,
        controller;


    var lightSprite,
        shadowTexture;

    var ConjurerGame = function (game) {
    };

    ConjurerGame.prototype = {
        preload: preload,
        create: create,
        update: update,
        onLeft: function () {
            playerSpeed = 20;
        }
    };

    function preload() {
        //add a background image

        game.load.tilemap('level1', 'level2.json', null, Phaser.Tilemap.TILED_JSON);
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
        //game.load.image('testPlayer', 'assets\\images\\testPlayer.png');
        game.load.spritesheet('player', 'assets/sprites/player.png', 30, 32);

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

        controller = game.input.keyboard.createCursorKeys();

        // removes collision from objects which are meant to be operated with (coins, keys),
        // indexes(numbers) are provided in the array or as a number
        // levelMap.setCollision([], false);
        // alternative:
        // levelMap.setCollisionByExclusion(indexes(ids/numbers in the tilemap) to not collide),
        // false);

        levelLayer = levelMap.createLayer('myLevel1');
        console.log(levelLayer);

        //player = game.add.sprite(80, 464, 'testPlayer');
        player = game.add.sprite(80, 464, 'player');
        // sets the anchor of the player object to the middle of the picture
        player.anchor.setTo(0.5, 0.5);
        // sets player gravity and allows collision with other objects
        game.physics.enable(player, Phaser.Physics.ARCADE);
        // sets gravity in the vertical context
        player.body.gravity.y = 500;
        playerSpeed = SPEED;
        playerState = 'right';

        // parameters are placeholder values until a spritesheet is made
        player.animations.add('left', [0, 1, 2], 10, true);
        player.animations.add('right', [4, 5, 6], 10, true);
        //player.animations.add('left', [], 1, true);
        player.animations.add('cast', [3], 1, true);
        //player.animations.add('right', [], 1, true);
        // waits for input, either touch or mouse click to call provided method
        // adds an onDown event to be referred to later on
        game.input.onUp.add(placeCrate, this);

        // character emits light to reveal the map
        shadowTexture = game.add.bitmapData(game.width, game.height);
        lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture)

        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    }

    function update() {
        // move player
        // perform checks whether the player can jump
        // setting player x speed to zero
        player.body.velocity.x = 0;
        // check for collision between the player and the level, and call "movePlayer" if there's a collision
        game.physics.arcade.collide(player, levelLayer, move);

        // character emits light to reveal the map
        lightSprite.reset(game.camera.x, game.camera.y);
        updateShadowTexture();
    }

    function updateShadowTexture() {
        // Draw shadow
        shadowTexture.context.fillStyle = 'rgba(10, 10, 10, 1)';
        shadowTexture.context.fillRect(0, 0, game.width, game.height);

        var radius = 250 + game.rnd.integerInRange(1, 10),
            heroX = player.x - game.camera.x,
            heroY = player.y - game.camera.y;

        // Draw circle of light with a soft edge
        var gradient = shadowTexture.context.createRadialGradient(
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
    }

    function placeCrate(pos) {
        // performs check whether placement at a position is possible
        // check whether crate is placed anywhere on top of the player
        // updates sprite
        // player stops moving for 1/2 second to 'conjure' the crate
        // remove old crate if one already exists
        // updates sprite, walking resumes

        var velocityX = playerSpeed,
            facingState = player.facing;

        // performs checks for diagonally adjascent tiles and tiles directly above the player
        if (!levelMap.getTileWorldXY(pos.x, pos.y, tileSize, tileSize, levelLayer) && !player.body.hitTest(pos.x, pos.y)) {
            // is there already a tile placed by the player?
            if (cratePos) {
                // remove the tile placed by the player
                levelMap.removeTileWorldXY(cratePos.x, cratePos.y, tileSize, tileSize, levelLayer);
            }
            // place the tile on mouse/touch position
            levelMap.putTileWorldXY(2, pos.x, pos.y, tileSize, tileSize, levelLayer);
            // save placed tile position
            cratePos = new Phaser.Point(pos.x, pos.y);


            playerSpeed = 0;
            player.animations.play('cast');
            playerState = 'cast';

            setTimeout(function () {
                playerSpeed = velocityX;
                playerState = facingState;
            }, 500);
        }

    }

    function move() {
        // walks automatically (or until a button is pressed to resume)
        // alternative: walks using the left and right arrows
        // changes direction on collision
        // updates sprite when necessary

        tileUnderPlayer = levelMap.getTileWorldXY(player.x, player.y, tileSize, tileSize, levelLayer);
        tileAbovePlayer = levelMap.getTileWorldXY(player.x, player.y - tileSize, tileSize, tileSize, levelLayer);
        tileRightDiagonalToPlayer = levelMap.getTileWorldXY(player.x + tileSize, player.y - tileSize, tileSize, tileSize, levelLayer);
        tileLeftDiagonalToPlayer = levelMap.getTileWorldXY(player.x - tileSize, player.y - tileSize, tileSize, tileSize, levelLayer);
        // is the player blocked down, that is: is the player on the floor?
        if (controller.down.isDown) {
            player.animations.stop();
            player.frame = 4;
            playerSpeed = 0;
        }

        if (controller.left.isDown) {
            playerSpeed = -SPEED;
            player.animations.play('left');
        }

        if (controller.right.isDown) {
            playerSpeed = SPEED;
            player.animations.play('right');
        }

        if (player.body.blocked.down) {
            // set player horizontal velocity
            player.body.velocity.x = playerSpeed;
            // the player is definitively not jumping
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
            if ((!tileRightDiagonalToPlayer && !tileAbovePlayer) ||
                (tileAbovePlayer && (tileAbovePlayer.index === 4 || tileAbovePlayer.index === 5)) ||
                (tileRightDiagonalToPlayer && (tileRightDiagonalToPlayer.index === 4 || tileRightDiagonalToPlayer.index === 5)) ||
                playerAirborne) {
                // jump
                jump();
            }
            else {
                player.animations.play('left');
                playerSpeed *= -1;
            }
        }
        if (player.body.blocked.left && playerSpeed < 0) {
            // performs checks just as above but instead for the left diagonal
            if ((!tileLeftDiagonalToPlayer && !tileAbovePlayer) ||
                (tileAbovePlayer && (tileAbovePlayer.index === 4 || tileAbovePlayer.index === 5)) ||
                (tileLeftDiagonalToPlayer && (tileLeftDiagonalToPlayer.index === 4 || tileLeftDiagonalToPlayer.index === 5)) ||
                playerAirborne) {
                jump();
            }
            else {
                player.animations.play('right');
                playerSpeed *= -1;
            }
        }

        if (tileUnderPlayer !== null) {
            collect();

            if (hasKey) {
                enterDoor();
            }
        }

        updateSprite();
    }

    function updateSprite() {
        // ..
    }

    function jump() {
        // ..

        // setting player vertical velocity

        player.body.velocity.y = -100;

        player.body.velocity.x = playerSpeed / 2;
        player.animations.stop();
        if (playerSpeed > 0) {
            player.frame = 4;
        }
        if (playerSpeed < 0) {
            player.frame = 2;
        }
        playerAirborne = true;
    }

    function collect() {
        // collects coins and keys

        if (tileUnderPlayer.index === 4) {
            coinsCollected += 1;
            levelMap.removeTileWorldXY(player.x, player.y, tileSize, tileSize, levelLayer);
        }
        if (tileUnderPlayer.index === 5) {
            hasKey = true;
            levelMap.removeTileWorldXY(player.x, player.y, tileSize, tileSize, levelLayer);
        }
    }

    function enterDoor() {
        if (tileUnderPlayer.index === 6) {
            game.paused = true;
        }
    }


    function initLevel() {
        // loads initial data for the level, everything sans resetting statistics

    }

    game.state.add('ConjurerGame', ConjurerGame);
    game.state.start('ConjurerGame');

}();