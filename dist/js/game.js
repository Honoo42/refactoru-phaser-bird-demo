(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'flappy-u-bird');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'flappy');
    // this.sprite = this.game.add.sprite(this.game.world.centerX, 260, 'redPlane');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
// enables keyboard interaction
  var cursors;
  // the sprite of the player controlled objects
  var Sprite = this.sprite;
  var Enemy;
  var bgtile;
  // condition to make sure that the  up key is tapped
  var keyWasPressed = false;
  function Play() {}
  Play.prototype = {
    create: function() {
      
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //displays the background of the level set to the limits of the game area 
      bgtile = this.game.add.tileSprite(0,0, this.game.stage.bounds.width, this.game.stage.bounds.height,'background');
     // sets the image of the player sprite and its starting location on load
      Sprite = this.game.add.sprite(this.game.width/4, this.game.height/2, 'flappy');
      

      Enemy = this.game.add.sprite(this.game.width/2, this.game.height/4, 'redPlane');

      Sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(Sprite);
      this.game.physics.arcade.enable(Enemy);
      Enemy.body.velocity.x = -100
      Sprite.body.collideWorldBounds = true;
      Enemy.body.collideWorldBounds = true;

      // x and y components
      Sprite.body.bounce.setTo(0,0);
      Enemy.body.bounce.setTo(1,1);

      Sprite.body.gravity.y=800;
      Sprite.body.allowRotation= true;
      Sprite.body.angularDrag=10;
      // Sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      Sprite.body.velocity.x = 0;
      Sprite.body.rotation= 30;
      Sprite.angle = 0;
     // this.game.add.tween(Sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
// this.game.rnd.integerInRange(0,5);
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(0,200);


      Sprite.events.onInputDown.add(this.clickListener, this);
     cursors = this.game.input.keyboard.createCursorKeys();
      
    },
    update: function() {
      bgtile.tilePosition.x -= 5;
      // adds collision detection between the player character and an "enemy", when the collision happens, the move to the gameover state 
      var collisionHandler = function(){this.game.state.start('gameover');}
      this.game.physics.arcade.collide(Sprite,Enemy,collisionHandler,null,this);
      // when up key is pressed and it was not recently pressed, than jump the character and set keyWasPressed to true

      // if (Sprite.body.velocity.y > 0) Sprite.angle=45;
      // else Sprite.angle=-45;
      // sets the player character's angle relative to its velocity to simulate a natural arc when it jumps
      Sprite.angle= Math.atan(Sprite.body.velocity.y/250)*180/Math.PI;
      // when the up key pressed the pc jumps
      if (cursors.up.isDown && keyWasPressed === false)


    {
        Sprite.body.velocity.y = -350;
        
        keyWasPressed = true;
    }
    // if the up key is not down, set keyWasPressed back to false
    if (!cursors.up.isDown) keyWasPressed = false;


    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}
 var bgtile;

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('redPlane', 'assets/planeRed1.png');
    this.load.image('background','assets/background.png');
    this.load.image('flappy','assets/flappy.png',100,100);


  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }

  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])