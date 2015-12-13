import PIXI from 'pixi.js';

export default class Quad extends PIXI.Graphics {
  constructor(color, width, height, ax = 0.5, ay = 0.5) {
    super();
    if (color !== undefined) {
      this.beginFill(color);
      this.drawRect(-width*ax, -height*ay, width, height);
      this.endFill();
    }
  }
}
