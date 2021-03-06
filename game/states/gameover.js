
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
