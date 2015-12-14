import PIXI from 'pixi.js';
import Quad from './Quad';
import Water from '../bitmap/Water';
import Grass from '../bitmap/Grass';

var chunkSize = 9;

export default class Track {

  constructor() {
    this.water = new PIXI.Container();
    this.grass = new PIXI.Container();
  }

  setup(data) {
    // first item of data is the number of columns
    var cols = data.shift();
    var tileSize = data.shift();

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
        this.water.addChild(quad);
      } else {
        quad = new Grass();
        quad.width = size;
        quad.height = size;
        this.grass.addChild(quad);
      }

      quad.position.x = px*size;
      quad.position.y = py*size;
    }
  }
}
