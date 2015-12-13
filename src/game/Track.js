import PIXI from 'pixi.js';
import Quad from './Quad';
import Water from '../bitmap/Water';
import Grass from '../bitmap/Grass';

var tileSize = 32;
var chunkSize = 9;

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
    var size = tileSize*chunkSize;
    for (var i = 0, len = data.length; i < len; i++) {
      var type = map[i];
      var px = Math.floor(i%cols);
      var py = Math.floor(i/cols);
      var quad = null;

      if (type) {
        quad = new Water();
        quad.width = size;
        quad.height = size;
      } else {
        quad = new Grass();
        quad.width = size;
        quad.height = size;
      }

      this.base.addChild(quad);
      quad.position.x = px*size;
      quad.position.y = py*size;
    }

    this.position.x = -this.width/2;
    this.position.y = -this.height/2;
  }
}
