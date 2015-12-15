import Bitmap from './Bitmap';
import PIXI from 'pixi.js';

var colorSchemes = [
  [null, '#F6ECA2', '#C2A24D'],
  [null, '#C4B6AF', '#B1A994'],
  [null, '#888899', '#444455'],
  [null, '#A89557', '#694E31'],
  [null, '#EB389E', '#AF1F6D'],
  [null, '#3B5383', '#AC443B'],
  [null, '#FBF294', '#BDA738'],
  [null, '#E56852', '#B74432'],
  [null, '#85788A', '#2E3351'],
  [null, '#BFD0D7', '#97A9B1'],
]

export default class Hat extends PIXI.Sprite {
  constructor() {
    super();

    this.bitmap = new Bitmap();
    this.bitmap.tileSize = 4;
    this.bitmap.cols = 6;
    this.bitmap.map = [
      0, 1, 1, 1, 1, 0,
      1, 2, 2, 2, 2, 1,
      1, 2, 1, 1, 2, 1,
      1, 2, 1, 1, 2, 1,
      1, 2, 2, 2, 2, 1,
      0, 1, 1, 1, 1, 0,
    ];

    var l = colorSchemes.length;
    var i = Math.floor(Math.random()*l);
    this.bitmap.colors = colorSchemes[i];

    this.bitmap.draw();
    this.texture = this.bitmap.getTexture();
    this.anchor.set(0.5);
  }
}
