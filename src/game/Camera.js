import * as math from '../tools/math';

export default class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.ease = 0.1;
    this.clamp = 4;
    this.target = null;
  }

  update() {
    if (this.target) {
      var vx = (this.x - this.target.position.x)*this.ease;
      var vy = (this.y - this.target.position.y)*this.ease;
      vx = math.clamp(vx, -this.clamp, this.clamp);
      vy = math.clamp(vy, -this.clamp, this.clamp);
      this.x -= vx;
      this.y -= vy;
    }
  }
}
