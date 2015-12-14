import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

var bitmap = new Bitmap();
bitmap.tileSize = 8;
bitmap.cols = 10;

bitmap.map = [
  1, 0, 2, 0, 0, 0, 0, 1, 0, 2
];

bitmap.colors = [
  null,
  '#000000',
  '#FFFFFF'
];

bitmap.draw();

export default class WaterTrail extends PIXI.Sprite {
  constructor() {
    super();
    this.texture = bitmap.getTexture();
    this.anchor.set(0.5);
  }
}
