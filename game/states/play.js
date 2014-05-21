
  'use strict';

  var cursors;
  var Sprite = this.sprite;
  function Play() {}
  Play.prototype = {
    create: function() {
      // bgtile = this.game.add.tileSprite(0,0, this.game.stage.bounds.width, this.game.cache.getImage('background').height,'background');
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      Sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      Sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(Sprite);
      Sprite.body.collideWorldBounds = true;
      // x and y components
      Sprite.body.bounce.setTo(1,1);
      Sprite.body.gravity.y=800;
      // Sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      Sprite.body.velocity.x = this.game.rnd.integerInRange(200,200);

      // Sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
      // Sprite.body.velocity.y = this.game.rnd.integerInRange(0,200);


      Sprite.events.onInputDown.add(this.clickListener, this);
     cursors = this.game.input.keyboard.createCursorKeys();
      
    },
    update: function() {
      // bgtile.tilePosition.x -= 1;
      if (cursors.up.isDown)
    {
        Sprite.body.velocity.y = -550;
    }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;