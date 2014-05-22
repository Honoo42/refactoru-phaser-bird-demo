
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
