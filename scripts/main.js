var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-screen');

var aPath = 'assets/';
var spacefield;
var ship;
var scrollVelocity;

var bullets;
var bulletTime = 0;
var fireButton;

var aliens;

var cursors;


var gameState = {
  preload: function () {

    game.load.image('space', aPath + 'space1.png');
    game.load.image('ship', aPath + 'ship.png');
    game.load.image('bullet', aPath + 'bullet.png');
    game.load.image('alien', aPath + 'alien.png');

  },
  create: function() {

    cursors = game.input.keyboard.createCursorKeys();
    scrollVelocity = 5;
    spacefield = game.add.tileSprite(0, 0, 800, 600, 'space');
    ship = game.add.sprite(game.world.centerX, game.world.centerY * 1.9 , 'ship');
    ship.anchor.setTo(0.5);
    ship.scale.setTo(0.1);
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.createEnemies();

  },
  update: function () {

    spacefield.tilePosition.y += scrollVelocity;
    ship.body.velocity.x = 0;

    if (cursors.left.isDown) {
      ship.body.velocity.x = -800;
    }

    if (cursors.right.isDown) {
      ship.body.velocity.x = 800;
    }

    if (fireButton.isDown) {
      this.fireBullet();
    }
  },
  fireBullet: function() {
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);

      if (bullet) {
        bullet.reset(ship.x, ship.y + 150);
        bullet.body.velocity.y = -1500;
        bulletTime = game.time.now + 50;
      }
    }
  },
  createEnemies: function () {
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 10; x++) {
        var alien = aliens.create(x*48, y*50, 'alien');
        alien.anchor.setTo(0.5);
        alien.scale.setTo(0.05);
      }
    }
    aliens.x = 100;
    aliens.y = 500;

    var tween = game.add.tween(aliens).to({
      x: 200
    }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    tween.onLoop.add(this.descent, this);

  },
  descend: function() {
    aliens.y += 10;
  }
}

game.state.add('gameState', gameState);
game.state.start('gameState');
