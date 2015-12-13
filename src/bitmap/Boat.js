import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

export default class Boat extends PIXI.Sprite {
  constructor() {
    super();

    this.bitmap = new Bitmap();
    this.bitmap.tileSize = 4;
    this.bitmap.cols = 8;
    this.bitmap.map = [
      0, 0, 1, 1, 1, 1, 0, 0,
      0, 1, 2, 2, 2, 2, 1, 0,
      0, 1, 2, 3, 3, 2, 1, 0,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 3, 3, 3, 3, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 1,
      0, 1, 1, 1, 1, 1, 1, 0,
    ];

    this.bitmap.colors = [
      null,
      '#4B3C21',
      '#6E5831',
      '#43341D'
    ];

    this.bitmap.draw();
    this.texture = this.bitmap.getTexture();
    this.anchor.set(0.5);
  }
}
