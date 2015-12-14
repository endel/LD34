import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

var bitmap = new Bitmap();
var ctx = bitmap.ctx;
var r = 26;
var size = r*2 + 6;
bitmap.canvas.width = size;
bitmap.canvas.height = size;

ctx.lineWidth = 2;

ctx.beginPath();
ctx.strokeStyle = '#FFFFFF';
ctx.arc(size/2, size/2, r*0.65, 0, 360);
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.strokeStyle = '#000000';
ctx.arc(size/2, size/2, r, 0, 360);
ctx.stroke();
ctx.closePath();

export default class WaterCircle extends PIXI.Sprite {
  constructor() {
    super();
    this.texture = bitmap.getTexture();
    this.anchor.set(0.5);
  }
}
