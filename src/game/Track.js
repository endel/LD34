import PIXI from 'pixi.js';
import Quad from './Quad';

var tileSize = 32;

export default class Track extends PIXI.Container {
  constructor(id) {
    super();
    console.log('new track', id);
    this.base = new PIXI.Container();
    this.addChild(this.base);
  }

  setup(data) {
    var cols = data.shift();
    var map = data;
    var size = tileSize*cols;
    for (var i = 0, len = data.length; i < len; i++) {
      var type = map[i];
      var px = Math.floor(i%cols);
      var py = Math.floor(i/cols);
      var color = type ? 0x3333FF : 0x33FF33;
      var quad = new Quad(color, size, size, 0, 0);
      this.base.addChild(quad);
      quad.position.x = px*size;
      quad.position.y = py*size;
    }

    this.position.x = -this.width/2;
    this.position.y = -this.height/2;
  }
}
