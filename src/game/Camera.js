import * as math from '../tools/math';

export default class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.ease = 0.1;
    this.clamp = 4;
    this._target = null;
  }

  set target (target) {
    this.x = target.position.x;
    this.y = target.position.y;
    this._target = target
  }

  update() {
    if (this._target) {
      var vx = (this.x - this._target.position.x)*this.ease;
      var vy = (this.y - this._target.position.y)*this.ease;
      vx = math.clamp(vx, -this.clamp, this.clamp);
      vy = math.clamp(vy, -this.clamp, this.clamp);
      this.x -= vx;
      this.y -= vy;
    }
  }
}
