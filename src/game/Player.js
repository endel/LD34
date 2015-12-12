import Entity from './Entity';
import lerp from 'lerp'

export default class Player extends Entity {

  constructor() {
    super(0xFFFF00, 32, 40);

    this.targetX = this.position.x
    this.targetY = this.position.y
    this.targetAngle = 0
  }

  set x (targetX) { this.targetX = targetX }
  set y (targetY) { this.targetY = targetY  }
  set angle (targetAngle) { this.targetAngle = targetAngle }

  update(delta) {
    this.position.x = lerp(this.position.x, this.targetX, 0.2)
    this.position.y = lerp(this.position.y, this.targetY, 0.2)
    this.rotation = lerp(this.rotation || 0, this.targetAngle, 0.2)
  }

}
