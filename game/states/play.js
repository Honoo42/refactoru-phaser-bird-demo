
  'use strict';

  var cursors;
  var Sprite = this.sprite;
  var Enemy;
  var bgtile;
  function Play() {}
  Play.prototype = {
    create: function() {
      
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // bgtile = this.game.add.tileSprite(0,0, 800,600,'background');
      bgtile = this.game.add.tileSprite(0,0, this.game.stage.bounds.width, this.game.stage.bounds.height,'background');

      Sprite = this.game.add.sprite(this.game.width/4, this.game.height/2, 'flappy');
      Enemy = this.game.add.sprite(this.game.width/2, this.game.height/4, 'redPlane');

      Sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(Sprite);
      this.game.physics.arcade.enable(Enemy);

      Sprite.body.collideWorldBounds = true;
      // x and y components
      Sprite.body.bounce.setTo(0,0);
      Sprite.body.gravity.y=800;
      // Sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      Sprite.body.velocity.x = 0;
// this.game.rnd.integerInRange(0,5);
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(0,200);


      Sprite.events.onInputDown.add(this.clickListener, this);
     cursors = this.game.input.keyboard.createCursorKeys();
      
    },
    update: function() {
      bgtile.tilePosition.x -= 5;
      if (cursors.up.isDown)
    {
        Sprite.body.velocity.y = -350;
    }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;