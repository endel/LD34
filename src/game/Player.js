import Entity from './Entity';
import lerp from 'lerp'

export default class Player extends Entity {

  constructor(data) {
    super();

    this.entity = new Entity(0xFFFF00, 32, 40)
    this.addChild(this.entity)

    this.name = data.name || "Guest 1"
    this.position.x = this.targetX = data.x
    this.position.y = this.targetY = data.y;
    this.entity.rotation = this.targetAngle = (data.rotation || 0);

    this.playerName = new PIXI.Text(this.name, {
      font : '14px Arial',
      fill : 0xffffff,
      align : 'center'
    })
    this.playerName.position.x = -this.playerName.width / 2
    this.playerName.position.y = this.height + this.playerName.height + 10
    this.addChild(this.playerName)
  }

  set x (targetX) { this.targetX = targetX }
  set y (targetY) { this.targetY = targetY  }
  set angle (targetAngle) { this.targetAngle = targetAngle }

  update(delta) {
    this.position.x = lerp(this.position.x, this.targetX, 0.2)
    this.position.y = lerp(this.position.y, this.targetY, 0.2)
    this.entity.rotation = lerp(this.entity.rotation, this.targetAngle, 0.2)
  }

}
