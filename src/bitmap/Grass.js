import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

var bitmap = new Bitmap();
bitmap.tileSize = 4;
bitmap.cols = 2;

bitmap.map = [
  0, 1,
  1, 0,
];

bitmap.colors = [
  '#22CC22',
  '#00CC00'
];

bitmap.draw();

export default class Grass extends PIXI.Sprite {
  constructor() {
    super();
    this.texture = bitmap.getTexture();
  }
}
