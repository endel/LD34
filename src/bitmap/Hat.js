import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

export default class Hat extends PIXI.Sprite {
  constructor() {
    super();

    this.bitmap = new Bitmap();
    this.bitmap.tileSize = 4;
    this.bitmap.cols = 6;
    this.bitmap.map = [
      0, 1, 1, 1, 1, 0,
      1, 2, 2, 2, 2, 1,
      1, 2, 3, 3, 2, 1,
      1, 2, 3, 3, 2, 1,
      1, 2, 2, 2, 2, 1,
      0, 1, 1, 1, 1, 0,
    ];

    this.bitmap.colors = [
      null,
      '#F1D78C',
      '#C2A24D',
      '#F6ECA2'
    ];

    this.bitmap.draw();
    this.texture = this.bitmap.getTexture();
    this.anchor.set(0.5);
  }
}
