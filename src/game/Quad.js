import PIXI from 'pixi.js';

export default class Quad extends PIXI.Graphics {
  constructor(color, width, height, ax = 0.5, ay = 0.5) {
    super();
    if (color !== undefined && color !== null) {
      this.beginFill(color);
      this.drawRect(0, 0, width, height);
      this.endFill();
    }
  }
}
