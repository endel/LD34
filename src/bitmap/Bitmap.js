import PIXI from 'pixi.js';

export default class Bitmap {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tileSize = 4;
    this.cols = 8;
    this.map = [];
    this.colors = [];
    this._texture = null;
  }

  draw() {
    this.clear();
    var len = this.map.length;
    var cols = this.cols;
    var rows = Math.floor(len/cols);
    this.canvas.width = cols*this.tileSize;
    this.canvas.height = rows*this.tileSize;
    var i = len;
    while (i--) {
      var tile = this.map[i];
      var px = Math.floor(i%cols)*this.tileSize;
      var py = Math.floor(i/cols)*this.tileSize;
      var color = this.colors[tile];
      if (color !== null) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getTexture() {
    if (!this._texture) {
      this._texture = PIXI.Texture.fromCanvas(this.canvas, PIXI.SCALE_MODES.NEAREST);
    }
    return this._texture;
  }
}
