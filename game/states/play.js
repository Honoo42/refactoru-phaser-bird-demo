
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

      Sprite.body.collideWorldBounds = true;
      // x and y components
      Sprite.body.bounce.setTo(0,0);
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
    console.log(Sprite.body.velocity);
    // if the up key is not down, set keyWasPressed back to false
    if (!cursors.up.isDown) keyWasPressed = false;


    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;