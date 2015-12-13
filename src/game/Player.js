import Entity from './Entity';
import lerp from 'lerp';

export default class Player extends Entity {
  constructor(data) {
    super();

    this.entity = new Entity(0xFFFF00, 32, 40)
    this.addChild(this.entity)

    this.position.x = this.targetX = data.x
    this.position.y = this.targetY = data.y;
    this.entity.rotation = this.targetAngle = (data.rotation || 0);

    this.playerName = new PIXI.Text("", {
      font : '14px Arial',
      fill : 0xffffff,
      align : 'center'
    })
    this.playerName.position.y = this.height + this.playerName.height + 10
    this.addChild(this.playerName)

    this.targetX = data.x;
    this.targetY = data.y;
    this.targetAngle = data.angle;
    this.name = data.name || "Guest 1"

    this.ease = 0.2;
  }

  set name (name) {
    this.playerName.text = name
    this.playerName.position.x = -this.playerName.width / 2
  }

  update(delta) {
    this.position.x = lerp(this.position.x, this.targetX, this.ease);
    this.position.y = lerp(this.position.y, this.targetY, this.ease);
    this.entity.rotation = lerp(this.entity.rotation || 0, this.targetAngle, this.ease);
  }
}
