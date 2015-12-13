import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

var bitmap = new Bitmap();
bitmap.tileSize = 4;
bitmap.cols = 8;

bitmap.map = [
  0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0,
];

bitmap.colors = [
  '#2222FF',
  '#3232FF'
];

bitmap.draw();

export default class Water extends PIXI.Sprite {
  constructor() {
    super();
    this.texture = bitmap.getTexture();
    // var shader = new PIXI.RGBSplitFilter();
    // this.shader = shader;
  }
}
