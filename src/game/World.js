import PIXI from 'pixi.js';
import Camera from './Camera';

export default class World extends PIXI.Container {
  constructor() {
    super();
    this.camera = new Camera();
    var i = 6;
    while (i--) {
      this.addChild(new PIXI.Container());
    }

    this.applyFilter();
  }

  add(child, layerIndex) {
    var layer = this.children[layerIndex];
    layer.addChild(child);
  }

  layer(index) {
    return this.children[index];
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

    if (this.water) {
      this.count += 0.1;
      this.filter.scale.x = 10 + Math.sin(this.count)*8;
      this.filter.scale.y = 10 + Math.cos(this.count)*8;
    }
  }

  applyFilter() {
    var sprite = new PIXI.Sprite();
    sprite.texture = PIXI.Texture.fromImage('images/displacement_map.jpg');
	  var filter = new PIXI.filters.DisplacementFilter(sprite);
    filter.scale.x = 50;
    filter.scale.y = 50;
    var layer = this.layer(1);
    layer.filters = [filter];
    this.water = sprite;
    this.filter = filter;
    this.count = 0;
  }
}
