import Entity from './Entity';
import lerp from 'lerp';

export default class Player extends Entity {
  constructor() {
    super(0xFFFF00, 32, 40);
    this.targetX = 0;
    this.targetY = 0;
    this.targetAngle = 0;
    this.ease = 0.2;
  }

  update(delta) {
    this.position.x = lerp(this.position.x, this.targetX, this.ease);
    this.position.y = lerp(this.position.y, this.targetY, this.ease);
    this.rotation = lerp(this.rotation || 0, this.targetAngle, this.ease);
  }
}
