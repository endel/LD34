import Entity from './Entity';
import lerp from 'lerp';
import Boat from '../bitmap/Boat';
import Hat from '../bitmap/Hat';
import Paddle from '../bitmap/Paddle';

export default class Player extends Entity {
  constructor(data) {
    super();

    this.entity = new Entity()
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

    this.createView();

    this.ease = 0.2;
  }

  createView() {
    var container = this.entity;
    var paddleDistance = 8;

    this.boat = new Boat();
    container.addChild(this.boat);

    this.char = new PIXI.Container();
    container.addChild(this.char);
    this.char.position.y = 4;

    this.paddleLeft = new Paddle();
    this.char.addChild(this.paddleLeft);
    this.paddleLeft.position.x = paddleDistance;

    this.paddleRight = new Paddle();
    this.char.addChild(this.paddleRight);
    this.paddleRight.scale.x = -1;
    this.paddleRight.position.x = -paddleDistance;

    this.hat = new Hat();
    this.char.addChild(this.hat);
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
