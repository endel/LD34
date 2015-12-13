import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

export default class Paddle extends PIXI.Sprite {
  constructor() {
    super();

    this.bitmap = new Bitmap();
    this.bitmap.tileSize = 4;
    this.bitmap.cols = 6;
    this.bitmap.map = [
      0, 0, 0, 1, 1, 1,
      1, 1, 1, 2, 2, 1,
      0, 0, 0, 1, 1, 1,
    ];

    this.bitmap.colors = [
      null,
      '#43341D',
      '#4B3C21'
    ];

    this.bitmap.draw();
    this.texture = this.bitmap.getTexture();
    this.anchor.set(0, 0.5);
  }
}
