// require([''])
var expect = chai.expect;

describe('Test for game', function() {
	var Game;
	beforeEach(function(done) {
		require(['../scripts/phaser.min','../scripts/game'], function(game) {
			Game = Conjurer.Game;
			MainMenu = Conjurer.MainMenu;
			done();
		});
	});

	it('expect Conjurer to exist', function() {
		console.log(Conjurer);
		console.log('---');
		expect(Conjurer).to.exist;
	});

	it('expect Game to be a function', function() {
		expect(Game).to.be.a('function');
	});

	it('expect new Game() to be an object', function(){
		console.log(new Game());
		expect(new Game()).to.an('object');
	});

	it('expect new Game().create() to exist and to be a function', function(){
		var game = new Game();
		expect(game.create).to.exist;
		expect(game.create).to.be.a('function');
	});
	it('expect new Game().update() to exist and to be a function', function(){
		var game = new Game();
		expect(game.update).to.exist;
		expect(game.update).to.be.a('function');
	});
	it('expect new Game().boxOverlap() to exist and to be a function', function() {
		var game = new Game();
		expect(game.boxOverlap).to.exist;
		expect(game.boxOverlap).to.be.a('function');
	});
	it('expect new Game().move() to exist and to be a function', function(){
		var game = new Game();
		expect(game.move).to.exist;
		expect(game.move).to.be.a('function');
	});
	it('expect new Game().drawLevel() to exist and to be a function', function(){
		var game = new Game();
		expect(game.drawLevel).to.exist;
		expect(game.drawLevel).to.be.a('function');
	});
	it('expect new Game().setLighting() to exist and to be a function', function(){
		var game = new Game();
		expect(game.setLighting).to.exist;
		expect(game.setLighting).to.be.a('function');
	});
	it('expect new Game().createPlayer() to exist and to be a function', function(){
		var game = new Game();
		expect(game.createPlayer).to.exist;
		expect(game.createPlayer).to.be.a('function');
	});
	it('expect new Game().createEnemy() to exist and to be a function', function(){
		var game = new Game();
		expect(game.createEnemy).to.exist;
		expect(game.createEnemy).to.be.a('function');
	});
	it('expect new Game().placeCrate() to exist and to be a function', function(){
		var game = new Game();
		expect(game.placeCrate).to.exist;
		expect(game.placeCrate).to.be.a('function');
	});
	it('expect new Game().processPlayerMovement() to exist and to be a function', function(){
		var game = new Game();
		expect(game.processPlayerMovement).to.exist;
		expect(game.processPlayerMovement).to.be.a('function');
	});
	it('expect new Game().processKeyboardInput() to exist and to be a function', function(){
		var game = new Game();
		expect(game.processKeyboardInput).to.exist;
		expect(game.processKeyboardInput).to.be.a('function');
	});
	it('expect new Game().allowedToJump() to exist and to be a function', function(){
		var game = new Game();
		expect(game.allowedToJump).to.exist;
		expect(game.allowedToJump).to.be.a('function');
	});
	it('expect new Game().jump() to exist and to be a function', function(){
		var game = new Game();
		expect(game.jump).to.exist;
		expect(game.jump).to.be.a('function');
	});
	it('expect new Game().killPlayer() to exist and to be a function', function(){
		var game = new Game();
		expect(game.killPlayer).to.exist;
		expect(game.killPlayer).to.be.a('function');
	});
	it('expect new Game().respawnPlayer() to exist and to be a function', function(){
		var game = new Game();
		expect(game.respawnPlayer).to.exist;
		expect(game.respawnPlayer).to.be.a('function');
	});
	it('expect new Game().gameOver() to exist and to be a function', function(){
		var game = new Game();
		expect(game.gameOver).to.exist;
		expect(game.gameOver).to.be.a('function');
	});
	it('expect new Game().getHighScore() to exist and to be a function', function(){
		var game = new Game();
		expect(game.getHighScore).to.exist;
		expect(game.getHighScore).to.be.a('function');
	});
	it('expect new Game().collectCoin() to exist and to be a function', function(){
		var game = new Game();
		expect(game.collectCoin).to.exist;
		expect(game.collectCoin).to.be.a('function');
	});
	it('expect new Game().collectKey() to exist and to be a function', function(){
		var game = new Game();
		expect(game.collectKey).to.exist;
		expect(game.collectKey).to.be.a('function');
	});
	it('expect new Game().tryEnterDoor() to exist and to be a function', function(){
		var game = new Game();
		expect(game.tryEnterDoor).to.exist;
		expect(game.tryEnterDoor).to.be.a('function');
	});
	it('expect new Game().updateShadowTexture() to exist and to be a function', function(){
		var game = new Game();
		expect(game.updateShadowTexture).to.exist;
		expect(game.updateShadowTexture).to.be.a('function');
	});
	it('expect new Game().getCurrentTile() to exist and to be a function', function(){
		var game = new Game();
		expect(game.getCurrentTile).to.exist;
		expect(game.getCurrentTile).to.be.a('function');
	});
	it('expect new Game().removeTileFromPosition() to exist and to be a function', function(){
		var game = new Game();
		expect(game.removeTileFromPosition).to.exist;
		expect(game.removeTileFromPosition).to.be.a('function');
	});
	it('expect new Game().placeTileOnPosition() to exist and to be a function', function(){
		var game = new Game();
		expect(game.placeTileOnPosition).to.exist;
		expect(game.placeTileOnPosition).to.be.a('function');
	});
	it('expect new Game().playerSpeed to be a Number (100)', function(){
		var game = new Game();
		expect(game.playerSpeed).to.be.a('number');
	});
	it('expect new Game().playerHasKey to initially be false', function(){
		var game = new Game();
		expect(game.playerHasKey).to.eql(false);
	});
	it('expect new Game() to have property \'crate\' that is initially null', function(){
		var game = new Game();
		expect(game).to.have.property('crate');
		expect(game.crate).to.eql(null);
	});

	it('expect new MainMenu().generateBg to exist and to be a function', function(){
		var game = new MainMenu();
		expect(game.generateBg).to.exist;
		expect(game.generateBg).to.be.a('function');
	});
	it('expect new MainMenu().animateTitle to exist and to be a function', function(){
		var game = new MainMenu();
		expect(game.animateTitle).to.exist;
		expect(game.animateTitle).to.be.a('function');
	});
	it('expect new MainMenu().startGame to exist and to be a function', function(){
		var game = new MainMenu();
		expect(game.startGame).to.exist;
		expect(game.startGame).to.be.a('function');
	});
	it('expect new MainMenu().startHowTo to exist and to be a function', function(){
		var game = new MainMenu();
		expect(game.startHowTo).to.exist;
		expect(game.startHowTo).to.be.a('function');
	});


});