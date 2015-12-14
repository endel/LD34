import PIXI from 'pixi.js';
import Camera from './Camera';

export default class World extends PIXI.Container {
  constructor() {
    super();
    this.camera = new Camera();
    var i = 5;
    while (i--) {
      this.addChild(new PIXI.Container());
    }
  }

  add(child, layerIndex) {
    var layer = this.children[layerIndex];
    layer.addChild(child);
  }

  remove(child) {
    var i = this.children.length;
    while (i--) {
      var layer = this.children[i];
      if (layer === child.parent) {
        layer.removeChild(child);
      }
    }
  }

  update(delta) {
    this.camera.update(delta);
    this.position.x = -this.camera.x;
    this.position.y = -this.camera.y;
  }
}
