var Conjurer = Conjurer || {};

define(['constants', 'uiUpdater', 'tiles'], function (CONSTANTS, uiUpdater, tiles) {
    Conjurer.Game = function (game) {
        this.bg;
        this.player;
        this.enemy;
        this.levelCounter;
        this.crate = null;
        this.playerAirborne = false;
        this.playerHasKey = false;
        this.playerCoinsCollected;
        this.playerPlacedCrates;
        this.playerSpeed = CONSTANTS.PLAYER_SPEED;
        this.playerLives;
        this.playerCounterWeight = 0;
        this.shadowTexture;
        this.lightSprite;
        this.tileUnderPlayer;
        this.levelMaps;
        this.levelLayer;
        this.inputController;
        this.pausedText;
        this.pausedButton;
        this.startTime;
        this.prevSpeed;    
        this.spaceBar;
        this.localScore;
    };

    Conjurer.Game.prototype = {
        create: function () {
            this.levelCounter = 1;
            this.playerCoinsCollected = 0;
            this.playerPlacedCrates = 0;
            this.playerLives = CONSTANTS.PLAYER_STARTING_LIFE_POINTS;

            this.levelMaps = this.add.tilemap('conjurerLevels');
            this.levelMaps.addTilesetImage('wall');
            this.levelMaps.addTilesetImage('crate');
            this.levelMaps.addTilesetImage('spikes');
            this.levelMaps.addTilesetImage('coin');
            this.levelMaps.addTilesetImage('key');
            this.levelMaps.addTilesetImage('door');

            this.levelMaps.setCollision([1, 2], true, 'level1');
            this.levelMaps.setCollision([1, 2], true, 'level2');
            this.levelMaps.setCollision([1, 2], true, 'level3');
            this.levelLayer = this.drawLevel();
            this.spaceBar = this.game.input.keyboard.addKey(32);

            this.player = this.createPlayer();

            this.input.onUp.add(this.placeCrate, this);
            this.input.onDown.add(function () {
                if (this.game.paused) {
                    this.game.paused = false;
                    this.pausedText.destroy();
                }
            }, this);

            this.pauseButton.inputEnabled = true;
            this.pauseButton.events.onInputUp.add(function () {
                this.game.paused = true;
                this.pausedText = this.add.text(this.world.centerX,
                    this.world.centerY, CONSTANTS.PAUSED_TEXT,
                    { font: "65px Impact", fill: "#fff", align: "center" });
                this.pausedText.anchor.setTo(0.5);
            }, this);

            this.startTime = new Date();
            uiUpdater.updateLives(this.playerLives);
            uiUpdater.updateScore(this.playerCoinsCollected);
        },

        update: function () {
            if (this.playerAirborne) {
                this.player.body.velocity.x = this.playerSpeed / 1.5;
            } else {
                this.player.body.velocity.x = 0;
                this.playerCounterWeight = 0;
            }

        // check for collision between the player and the level, and call "movePlayer" if there's a collision
        this.tileUnderPlayer = this.levelMaps.getTileWorldXY(this.player.x, this.player.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, this.levelLayer);

        if (this.tileUnderPlayer !== null) {
            switch (this.tileUnderPlayer.index) {
                case tiles.crate:
                case tiles.spikes: this.killPlayer();
                break;
                case tiles.coin: this.collectCoin();
                break;
                case tiles.key: this.collectKey();
                break;
                case tiles.door: this.tryEnterDoor();
                break;
            }
        }

        // Applies physics ot the player
        this.physics.arcade.collide(this.player, this.levelLayer, this.move, null, this);

        // Checks if player and enemy current positions overlap
        if (this.enemy) {
            if (this.crate) {
                if (this.boxOverlap(this.enemy, this.crate)) {
                    this.removeTileFromPosition(this.crate);
                    this.crate = null;
                }
            }

            this.physics.arcade.overlap(this.player, this.enemy, this.killPlayer, null, this);
        }

        // Character emits light to reveal the map
        this.lightSprite.reset(this.camera.x, this.camera.y);
        this.shadowTexture = this.updateShadowTexture(this.shadowTexture, this.player);
        uiUpdater.updateTime(this.startTime);
    },

    boxOverlap: function(a, b) {
        var a = this.enemy.getBounds();
        var b = new Phaser.Rectangle(this.crate.x-16, this.crate.y, 24, 32);

        return Phaser.Rectangle.intersects(b, a);
    },

    move: function () {
        this.processKeyboardInput();
        this.processPlayerMovement();
    },

    drawLevel: function () {
        this.bg = this.add.sprite(0, 0, 'background');
        var levelLayer = this.levelMaps.createLayer('level' + this.levelCounter.toString());
        // resets crate placed by the conjurer
        this.crate = null;

        // creates enemy flames from an array
        if (CONSTANTS.ENEMY_MOVE_FROM[this.levelCounter - 1]) {
            this.enemy = this.createEnemy(this);
        }

        // applies a black mask over the game stage
        this.setLighting();
        // redraw pause button sprite, as it is hidden because of the freshly drawn layers of bg and tilemap
        this.pauseButton = this.add.sprite(8, 8, 'pause');

        return levelLayer;
    },

    setLighting: function () {
        this.shadowTexture = this.add.bitmapData(CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);
        this.lightSprite = this.add.image(this.camera.x, this.camera.y, this.shadowTexture);
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    },

    createPlayer: function () {
        var player = this.add.sprite(CONSTANTS.PLAYER_HORIZONTAL_STARTING_POSITION, CONSTANTS.PLAYER_VERTICAL_STARTING_POSITION, 'player');
        // sets the anchor of the player object to the middle of the picture
        player.anchor.setTo(0.5, 0.5);
        // sets player gravity and allows collision with other objects
        this.physics.enable(player, Phaser.Physics.ARCADE);
        // sets gravity in the vertical context
        player.body.gravity.y = CONSTANTS.PLAYER_BODY_GRAVITY;
        // parameters are placeholder values until a spritesheet is made
        player.animations.add('left', [0, 1, 2, 3], CONSTANTS.FRAME_RATE, true);
        player.animations.add('right', [4, 5, 6, 7], CONSTANTS.FRAME_RATE, true);
        player.animations.add('cast', [9], 1, true);
        player.animations.add('castleft', [10], 1, true);

        return player;
    },

    createEnemy: function () {
        var enemy = this.add.sprite(CONSTANTS.ENEMY_MOVE_FROM[this.levelCounter - 1].x, CONSTANTS.ENEMY_MOVE_TO[this.levelCounter - 1].y, 'enemy');
        enemy.anchor.setTo(0.5, 0.5);
        this.physics.enable(enemy, Phaser.Physics.ARCADE);
        this.add.tween(enemy).to({x: CONSTANTS.ENEMY_MOVE_TO[this.levelCounter - 1].x}, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);

        return enemy;
    },

    placeCrate: function (pos) {
        var velocityBeforeCast = this.playerSpeed;

        // Prevents putting crate over the player
        if (!this.getCurrentTile(pos.x, pos.y) && !this.player.body.hitTest(pos.x, pos.y)) {
            // Removes a previously placed crate
            if (this.crate) {
                this.removeTileFromPosition(this.crate);
            }

            // Place the crate on the mouse position
            this.placeTileOnPosition(2, pos.x, pos.y);

            // Saves placed crate position
            this.crate = new Phaser.Point(pos.x, pos.y);

            this.playerSpeed = 0;
            this.playerPlacedCrates += 1;

            if (velocityBeforeCast >= 0) {
                this.player.animations.play('cast');
            }
            else {
                this.player.animations.play('castleft');
            }

            //Save the 'this' context to a variable
            var that = this;
            // Restart the mooving animation
            setTimeout(function() {
                that.playerSpeed = velocityBeforeCast;
            }, CONSTANTS.CASTING_TIMEOUT);
        }
    },

    processPlayerMovement: function () {

        // Is the player blocked down, that is: is the player on the floor or on the crate?
        if (this.player.body.blocked.down) {
            this.player.body.velocity.x = this.playerSpeed;
            if (this.playerSpeed < 0) {
                this.player.animations.play('left');
            }
            if (this.playerSpeed > 0) {
                this.player.animations.play('right');
            }
            this.playerAirborne = false;
        }

        if (this.player.body.blocked.right && this.playerSpeed > 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore
            // tile if its a coin or key
            if (this.allowedToJump('right')) {
                this.jump();
            } else {
                this.player.animations.play('right');
                this.playerSpeed *= -1;
            }
        } else if (this.player.body.blocked.left && this.playerSpeed < 0) {
            // performs check if tile above and diagonally of the player is empty (according to the tilemap), ignore
            // tile if its a coin or key
            if (this.allowedToJump('left')) {
                this.jump();
            }
            else {
                this.player.animations.play('left');
                this.playerSpeed *= -1;
            }
        }
    },

    processKeyboardInput: function () {
        if (this.spaceBar.justDown) {
            if (this.playerSpeed !== 0) {
                this.player.animations.stop();
                this.prevSpeed = this.playerSpeed;

                if (this.prevSpeed >= 0) {
                    this.player.frame = 8;
                }
                else {
                    this.player.frame = 11;
                }
                this.playerSpeed = 0;
            } else {
                this.playerSpeed = this.prevSpeed;
            }
        }
    },

    allowedToJump: function (direction) {
        var tileDiagonalToPlayer,
        tileAbovePlayer = this.getCurrentTile(this.player.x, this.player.y - CONSTANTS.TILE_SIZE);

        if (direction === 'right') {
            tileDiagonalToPlayer = this.getCurrentTile(this.player.x + CONSTANTS.TILE_SIZE, this.player.y - CONSTANTS.TILE_SIZE);
        } else {
            tileDiagonalToPlayer = this.getCurrentTile(this.player.x - CONSTANTS.TILE_SIZE, this.player.y - CONSTANTS.TILE_SIZE);

        }

        if (!tileDiagonalToPlayer && !tileAbovePlayer) {
            return true;
        }
        if (tileAbovePlayer && (tileAbovePlayer.index === tiles.coin || tileAbovePlayer.index === tiles.key)) {
            return true;
        }
        if (tileDiagonalToPlayer && (tileDiagonalToPlayer.index === tiles.coin || tileDiagonalToPlayer.index === tiles.key)) {
            return true;
        }
        if (this.playerAirborne) {
            return true;
        }
        return false;
    },

    jump: function () {
        // setting player vertical velocity
        this.player.body.velocity.y = CONSTANTS.JUMP_VELOCITY_STOPPER + this.playerCounterWeight * CONSTANTS.COUNTERWEIGHT_FORCE;
        this.player.animations.stop();

        if (this.playerSpeed > 0) {
            this.player.frame = 5;
        } else if (this.playerSpeed < 0) {
            this.player.frame = 1;
        }

        this.playerAirborne = true;
        this.playerCounterWeight += 1;
    },

    killPlayer: function () {
        if (this.playerLives > 1) {
            this.playerLives -= 1;
            uiUpdater.updateLives(this.playerLives);

            this.respawnPlayer();
        } else {
            this.gameOver();
        }
    },

    respawnPlayer: function () {
        this.player.x = CONSTANTS.PLAYER_HORIZONTAL_STARTING_POSITION;
        this.player.y = CONSTANTS.PLAYER_VERTICAL_STARTING_POSITION;
        this.game.paused = true;
        this.pausedText = this.add.text(this.world.centerX, this.world.centerY, CONSTANTS.PAUSED_TEXT_PLAYER_DIED + this.playerLives, { font: "25px Impact", fill: "#fff", align: "center" });
        this.pausedText.anchor.setTo(0.5);
    },

    gameOver: function () {
        this.game.paused = true;

        this.getHighScore();

        this.pausedText = this.add.text(this.world.centerX, this.world.centerY, CONSTANTS.GAME_OVER, { font: "25px Impact", fill: "#f31", align: "center" });
        this.pausedText.anchor.setTo(0.5);
        this.state.start('Game');
    },

    getHighScore: function() {
        this.localScore = localStorage.getItem('ConjurerScore');
        var currentHighScore; 

        if (this.localScore) {
            currentHighScore = this.localScore || 0;
            if (currentHighScore * 1 < this.playerCoinsCollected) {
                currentHighScore = this.playerCoinsCollected.toString();
                localStorage.setItem('ConjurerScore', currentHighScore);               
            }
        }
        else {
            currentHighScore = this.playerCoinsCollected.toString();
            localStorage.setItem('ConjurerScore', currentHighScore);
        }
        var scoreText = this.add.text(this.world.centerX, this.world.centerY - 100, 'Highscore: ' + currentHighScore, { font: "25px Impact", fill: "#fff", align: "center" });
        scoreText.anchor.setTo(0.5);
    },

    collectCoin: function () {
        this.playerCoinsCollected += 1;
        uiUpdater.updateScore(this.playerCoinsCollected);
        this.removeTileFromPosition(this.player);
    },

    collectKey: function () {
        this.playerHasKey = true;
        this.removeTileFromPosition(this.player);
    },

    tryEnterDoor: function () {
        if (this.playerHasKey) {
            this.levelCounter += 1;
            if (this.levelCounter <= CONSTANTS.AVAILABLE_LEVELS) {
                this.levelLayer.destroy();
                // generates a level depending on the level indicator, redraws background, tilemap and light
                this.levelLayer = this.drawLevel();
                // resets player and re-generates sprites to reduce background not-updating bugging
                this.player.destroy();
                this.player = this.createPlayer(this);
                this.playerHasKey = false;
            }
        }
    },

    updateShadowTexture: function (shadowTexture, player) {
        var gradient,
        radius = CONSTANTS.SHADOW_RADIUS + this.rnd.integerInRange(1, 10);

        shadowTexture.context.fillStyle = 'rgba(10, 10, 10, 1)';
        shadowTexture.context.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT);

        // Draw circle of light with a soft edge
        gradient = shadowTexture.context.createRadialGradient(
            player.x, player.y, 100 * 0.75,
            player.x, player.y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 220, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 30, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(player.x, player.y, radius, 0, Math.PI * 2, false);
        shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        shadowTexture.dirty = true;

        return shadowTexture;
    },

    getCurrentTile: function (x, y) {
        var result = this.levelMaps.getTileWorldXY(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, this.levelLayer);
        return result;
    },

    removeTileFromPosition: function (tile) {
        this.levelMaps.removeTileWorldXY(tile.x, tile.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, this.levelLayer);
    },

    placeTileOnPosition: function (tileType, x, y) {
        this.levelMaps.putTileWorldXY(tileType, x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, this.levelLayer);
    }
};

return {
    Game: Conjurer.Game
};
});



