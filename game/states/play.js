
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
      Sprite.animations.add('flap');  
      Sprite.animations.play('flap', 12, true);

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
      Sprite.events.onInputDown.add(this.clickListener, this);

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
    clickListener: function() {
      this.game.state.start('gameover');
      this.themeSound.stop();
    },
    generatePipes: function() {  
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = new PipeGroup(this.game,this.pipes);
    
    

    pipeGroup.y = pipeY;
    pipeGroup.x = this.game.width;


    console.log('generating pipes!');
},
  };
  
  module.exports = Play;