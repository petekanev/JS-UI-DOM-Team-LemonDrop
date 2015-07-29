define(function () {
    return {
        TILE_SIZE : 32,
        PLAYER_TILE_WIDTH: 30,
        GAME_WIDTH: 1024,
        GAME_HEIGHT: 512,
        PLAYER_SPEED: 100,
        SHADOW_RADIUS: 250,
        PLAYER_BODY_GRAVITY: 500,
        FRAME_RATE: 5,
        CASTING_TIMEOUT: 250,
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
});
