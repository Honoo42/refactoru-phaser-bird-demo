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
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);

  // initialize your prefab here

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;
  
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Pipe;

},{}],3:[function(require,module,exports){
'use strict';
var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // initialize your prefab here
  this.topPipe = new Pipe(this.game,0,0,0);
  this.add(this.topPipe);

  this.bottomPipe = new Pipe(this.game, 0, 600, 1);
    this.add(this.bottomPipe);

   this.hasScored=false;

   this.setAll('body.velocity.x',-250);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  
  // write your prefab's specific update code here

};

module.exports = PipeGroup;

},{"./pipe":2}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {
    this.deathSound = this.game.add.audio('death');
  },
  create: function () {
    this.deathSound.play();
    
    var style = { font: '65px Arial', fill: '#FCB614', align: 'center'};

    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, "How'd You Like It?", { font: '32px Arial', fill: '#FCB614', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#FCB614', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '55px Arial', fill: '#FCB614', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'flappy');
    // this.sprite = this.game.add.sprite(this.game.world.centerX, 260, 'redPlane');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Welcome ReFactorU Friends!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play the 100 Billionth version of Flappy Bird', { font: '16px Arial', fill: '#FCB614', align: 'center'});
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

},{}],7:[function(require,module,exports){

  'use strict';
// enables keyboard interaction

  var spaceKey;

  // the sprite of the player controlled objects
  var Sprite = this.sprite;
  var Enemy;
  var Ground;
  var PipeGroup = require('../prefabs/pipeGroup.js');
  
  // sets the variables for the enemy planes input keys
  var flyLeft;
  var flyRight;
  
  // condition to make sure that the  space key is pumped for flight and can't just be held down
  var keyWasPressed = false;


  function Play() {}

  Play.prototype = {
    create: function() {
      this.score=0;
      // defines the physics engine that the game will run under
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //displays the background of the level set to the limits of the game area 
      var bgTile = this.game.add.tileSprite(0,0, this.game.stage.bounds.width, this.game.stage.bounds.height,'background');
      // sets the speed of the stage scroll by x and y values
      bgTile.autoScroll(-250, 0);
     // sets the image of the player sprite and its starting location on load
      Sprite = this.game.add.sprite(this.game.width/4, this.game.height/2, 'flappy');
      console.log(Sprite);


      // add in the sounds of the game

      this.scoreSound = this.game.add.audio('score');
      this.flapSound = this.game.add.audio('flap');
      this.themeSound = this.game.add.audio('theme', 0.4, true);
      this.themeSound.play();

      // sets the image of the enemy, in this case a red plane
      Enemy = this.game.add.sprite(this.game.width/2, this.game.height/4, 'redPlane');

      // adds a scrolling ground
      Ground = this.game.add.tileSprite(0,530,this.game.stage.bounds.width, 0,'ground');
      Ground.autoScroll(-250, 0);      

      // instantiates the scrolling pipes
      this.pipes = this.game.add.group();
      console.log("Activate!",this.pipes)

      // Allows player input for the flapping bird and the enemy plane
      Sprite.inputEnabled = true;
      Enemy.inputEnabled = true;

      // adds the flapping animation to the bird and keeps it on a continual loop
      Sprite.animations.add('flapWings');  
      Sprite.animations.play('flapWings', 12, true);

      // ENABLE PHYSICS ON THE PLAYER, ENEMY, and GROUND
      this.game.physics.arcade.enable(Sprite);
      
      this.game.physics.arcade.enable(Enemy);

      this.game.physics.arcade.enable(Ground);

      // Adds the text for updating the score, with css attributes of font size and color
      this.scoreText = this.game.add.text(20, 20, 'score: 0', { fontSize: '40px', fill: 'salmon' });

      // Sets the enemy plane to always start the game by flying backwards
      Enemy.body.velocity.x = -100;

      //Sets the characters to bounce off the edge of the screens if they make contact 
      Sprite.body.collideWorldBounds = true;
      Enemy.body.collideWorldBounds = true;

      // Let's the characters bounce; The x and y components set the ration of the speed for the bounce
      // i.e. (1,1) means that the sprite will continue bouncing at the same velocity vertically and horizontally
      // while (1,0.5) would mean that the vertical velocity would decrease by 1/2 on every bounce until it reached 0
      Sprite.body.bounce.setTo(0,0);
      Enemy.body.bounce.setTo(1,1);

      // Specifies values of the physics engine such as enabling gravity on the player and allowing the sprite to rotate 
      Sprite.body.gravity.y=800;
      Sprite.body.allowRotation= true;
      Sprite.body.angularDrag=10;
      // The bird itself has no horizontal movement, the appearance of movement is created by having the background, ground,
      // and pipes scroll past the bird at a set speed.
      Sprite.body.velocity.x = 0;
      Sprite.body.rotation= 30;
      Sprite.angle = 0;

      // If we wanted to randomize the starting velocity, this is the code;takes the lower and upper limit
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);


      // Adds an event handler to the bird
      // Sprite.events.onInputDown.add(this.clickListener, this);

      // KEYBOARD INPUTS DECLARATION
      spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

     
     // Sets the inputs keys for the plane movement to A and D
      flyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      flyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

      // Starts the generation of the pipes set to create a new pair every 2 seconds
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generatePipes, this);
      this.pipeGenerator.timer.start();
      
    },
    update: function() {
  
      // adds collision detection between the player character and an "enemy", when the collision happens, the move to the gameover state 
      var collisionHandler = function(){
        this.game.state.start('gameover');
        this.themeSound.stop();

      }
      // sets the collision handler function between the bird and the plane and the bird and the ground

    // }

      this.game.physics.arcade.collide(Sprite,Enemy,collisionHandler,null,this);
      this.game.physics.arcade.collide(Sprite,Ground,collisionHandler,null,this);
      
      // sets playThis to refer to the game state in order to make 'this' useful inside of the for loop function
      var playThis = this;
      // Creates a for loop so that collisionHandler is applied to each child pipeGroup generated
      this.pipes.forEach(function(pipeGroup){
        playThis.game.physics.arcade.collide(Sprite,pipeGroup,collisionHandler,null,playThis);
       
      // Creates the logic for scoring;if the top pipe of an existing pipe (i.e. a pipe pair that is one the screen)
      // has an x corrodinate less than the birds current x position on the screen and the hasScored method is still false,
      // than set hasScored on this instance of pipeGroup to true, increment the score by one, and play the score sounds
        if (pipeGroup.topPipe.x + playThis.game.stage.bounds.width < Sprite.body.x && !pipeGroup.hasScored) {
          playThis.score++;
          pipeGroup.hasScored = true;
          playThis.scoreSound.play();
        }

      });
      // Keeps the score updated in game
      this.scoreText.setText(this.score.toString());

      // sets the player character's angle relative to its velocity to simulate a natural arc when it jumps
      Sprite.angle= Math.atan(Sprite.body.velocity.y/250)*180/Math.PI;

     

      // when the space key is pressed the player character jumps and plays a sound; changes the state of the
      // key press so that velocity is only boosted per pump of the key instead of being related to the key being held
      // down
      if (spaceKey.isDown && keyWasPressed === false){
        Sprite.body.velocity.y = -350;
        this.flapSound.play();
        keyWasPressed = true;
      }
    
    // if the up key is not down, set keyWasPressed back to false
    if (!spaceKey.isDown) keyWasPressed = false;

    // Enemy Control!
    if(flyLeft.isDown) {
        Enemy.body.velocity.x = -350;
    }
    if(flyRight.isDown) {
        Enemy.body.velocity.x = 350;
    }

    },
    // clickListener: function() {
    //   this.game.state.start('gameover');
    //   this.themeSound.stop();
    // },
    generatePipes: function() {  
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = new PipeGroup(this.game,this.pipes);
    
    

    pipeGroup.y = pipeY;
    pipeGroup.x = this.game.width;


    console.log('generating pipes!');
},
  };
  
  module.exports = Play;
},{"../prefabs/pipeGroup.js":3}],8:[function(require,module,exports){

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
    this.load.spritesheet('flappy','assets/flappySheet.png',53, 36, 3);
    this.load.image('ground','assets/groundRock.png');
    this.load.spritesheet('pipe','assets/Pipe_green.png', 80, 400, 2);
    this.load.audio('score', 'assets/coin10.wav');
    this.load.audio('flap', 'assets/swish-9.wav');
    this.load.audio('death', 'assets/death.wav');
    this.load.audio('theme', 'assets/airship.mp3');
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