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

  },
  create: function () {
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
  
  // condition to make sure that the  up key is tapped
  var keyWasPressed = false;


  function Play() {}

  Play.prototype = {
    create: function() {
      this.score=0;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //displays the background of the level set to the limits of the game area 
      var bgTile = this.game.add.tileSprite(0,0, this.game.stage.bounds.width, this.game.stage.bounds.height,'background');
      bgTile.autoScroll(-250, 0);
     // sets the image of the player sprite and its starting location on load
      Sprite = this.game.add.sprite(this.game.width/4, this.game.height/2, 'flappy');
      console.log(Sprite);

      

      Enemy = this.game.add.sprite(this.game.width/2, this.game.height/4, 'redPlane');

      // adds a scrolling ground
      Ground = this.game.add.tileSprite(0,530,this.game.stage.bounds.width, 0,'ground');
      Ground.autoScroll(-250, 0);      

      this.pipes = this.game.add.group();
      console.log("Activate!",this.pipes)

      Sprite.inputEnabled = true;
      Enemy.inputEnabled = true;


      Sprite.animations.add('flap');  
      Sprite.animations.play('flap', 12, true);

      this.game.physics.arcade.enable(Sprite);
      
      this.game.physics.arcade.enable(Enemy);

      this.game.physics.arcade.enable(Ground);

      this.scoreText = this.game.add.text(20, 20, 'score: 0', { fontSize: '40px', fill: 'salmon' });


      Enemy.body.velocity.x = -100;
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
<<<<<<< HEAD
     cursors = this.game.input.keyboard.createCursorKeys();
=======

      spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

>>>>>>> a692fdaabd3646e6566d41c58008d0275abf8a42
     
     // Sets the inputs keys for the plane movement to A and D
      flyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      flyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generatePipes, this);
      this.pipeGenerator.timer.start();
      
    },
    update: function() {
     // bgtile.tilePosition.x -= 5;
      // adds collision detection between the player character and an "enemy", when the collision happens, the move to the gameover state 
      var collisionHandler = function(){this.game.state.start('gameover');}
      this.game.physics.arcade.collide(Sprite,Enemy,collisionHandler,null,this);
      this.game.physics.arcade.collide(Sprite,Ground,collisionHandler,null,this);
      var playThis = this;
      
      this.pipes.forEach(function(pipeGroup){
        playThis.game.physics.arcade.collide(Sprite,pipeGroup,collisionHandler,null,playThis);
       
        if (pipeGroup.topPipe.x + playThis.game.stage.bounds.width < Sprite.body.x && !pipeGroup.hasScored) {
          playThis.score++;
          pipeGroup.hasScored = true;
        }

      });
     
      this.scoreText.setText(this.score.toString());
      // when up key is pressed and it was not recently pressed, than jump the character and set keyWasPressed to true

      // if (Sprite.body.velocity.y > 0) Sprite.angle=45;
      // else Sprite.angle=-45;
      // sets the player character's angle relative to its velocity to simulate a natural arc when it jumps
      Sprite.angle= Math.atan(Sprite.body.velocity.y/250)*180/Math.PI;

     

      // when the up key pressed the pc jumps
      if (spaceKey.isDown && keyWasPressed === false)


    {
        Sprite.body.velocity.y = -350;
        
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
    clickListener: function() {
      this.game.state.start('gameover');
    },
    generatePipes: function() {  
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = new PipeGroup(this.game,this.pipes);
    
     
      // var pipeGroup = this.pipes.getFirstExists(false);

    pipeGroup.y = pipeY;
    pipeGroup.x = this.game.width;

    //  if(!pipeGroup) {
    //     pipeGroup = new PipeGroup(this.game, this.pipes);  
    // }
    // pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);
    // this.game.physics.arcade.enable(pipeGroup);
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