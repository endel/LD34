import PIXI from 'pixi.js';
import Quad from './Quad';

export default class Track extends PIXI.Container {

  constructor() {
    super();
    this.base = new PIXI.Container();
    this.addChild(this.base);
  }

  setup(data) {
    // first item of data is the number of columns
    var cols = data.shift();
    var tileSize = data.shift();

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
  }
}
