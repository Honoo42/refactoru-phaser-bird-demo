
  'use strict';
// enables keyboard interaction
  var cursors;
  // the sprite of the player controlled objects
  var Sprite = this.sprite;
  var Enemy;
  var Ground;
  var PipeGroup = require('../prefabs/pipeGroup.js');
 // var pipeGroup;
  
  // condition to make sure that the  up key is tapped
  var keyWasPressed = false;

  function Play() {}

  Play.prototype = {
    create: function() {
      
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
      Sprite.animations.add('flap');  
      Sprite.animations.play('flap', 12, true);

      this.game.physics.arcade.enable(Sprite);
      
      this.game.physics.arcade.enable(Enemy);

      this.game.physics.arcade.enable(Ground);

      


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
     cursors = this.game.input.keyboard.createCursorKeys();

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
      });
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