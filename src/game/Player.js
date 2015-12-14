import Entity from './Entity';
import lerp from 'lerp';
import Boat from '../bitmap/Boat';
import Hat from '../bitmap/Hat';
import Paddle from '../bitmap/Paddle';
import WaterTrail from '../bitmap/WaterTrail';
import ParticleSystem from './ParticleSystem';
import * as math from '../tools/math';

export default class Player extends Entity {
  constructor(data) {
    super();

    this.entity = new Entity()
    this.addChild(this.entity)

    this.position.x = this.targetX = data.targetX
    this.position.y = this.targetY = data.targetY
    this.lastPosition = {x:this.position.x, y:this.position.y};
    this.movementRange = 0;
    this.entity.rotation = this.targetAngle = (data.targetAngle || 0);

    this.playerName = new PIXI.Text("", {
      font : '14px Arial',
      fill : 0xffffff,
      align : 'center'
    })
    this.playerName.position.y = this.height + this.playerName.height + 10
    this.addChild(this.playerName)

    this.name = data.name || "Guest 1"

    this.createView();

    this.ease = 0.2;
    this.left = 0;
    this.right = 0;
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
    this.paddleLeftAngle = 0;

    this.paddleRight = new Paddle();
    this.char.addChild(this.paddleRight);
    this.paddleRight.scale.x = -1;
    this.paddleRight.position.x = -paddleDistance;
    this.paddleRightAngle = 0;

    this.hat = new Hat();
    this.char.addChild(this.hat);
    this.hatPosition = {x:0, y:0};

    this.particles = new PIXI.Container();

    var wt = new WaterTrail();
    this.trail = new ParticleSystem(200, wt.texture);
    this.trail.params.life = 60;
    this.trail.alpha = 0.05;
    this.particles.addChild(this.trail);
  }

  set name (name) {
    this.playerName.text = name
    this.playerName.position.x = -this.playerName.width / 2
  }

  update(delta) {
    this.position.x = lerp(this.position.x, this.targetX, this.ease);
    this.position.y = lerp(this.position.y, this.targetY, this.ease);
    this.entity.rotation = lerp(this.entity.rotation || 0, this.targetAngle, this.ease);
    this.movementRange = math.distance(this.position.x, this.position.y, this.lastPosition.x, this.lastPosition.y);

    if (this.left) {
      this.paddleRightAngle = Math.PI*0.25;
      this.hatPosition.x = 2;
      this.hatPosition.y = 2;
    } else {
      this.paddleRightAngle = -Math.PI*0.25;
    }

    if (this.right) {
      this.paddleLeftAngle = -Math.PI*0.25;
      this.hatPosition.x = -2;
      this.hatPosition.y = 2;
    } else {
      this.paddleLeftAngle = Math.PI*0.25;
    }

    if (this.left && this.right) {
      this.hatPosition.x = 0;
      this.hatPosition.y = 3;
    }

    var paddleEase = 0.2;
    this.paddleRight.rotation -= (this.paddleRight.rotation - this.paddleRightAngle)*paddleEase;
    this.paddleLeft.rotation -= (this.paddleLeft.rotation - this.paddleLeftAngle)*paddleEase;

    var hatEase = 0.1;
    this.hat.position.x -= (this.hat.position.x - this.hatPosition.x)*hatEase;
    this.hat.position.y -= (this.hat.position.y - this.hatPosition.y)*hatEase;
    this.hatPosition.x *= hatEase;
    this.hatPosition.y *= hatEase;

    if (this.movementRange > 1) {
      this.trail.rate = 1;
    } else {
      this.trail.rate = 0;
    }

    this.trail.params.life = 40*this.movementRange;
    this.trail.params.angle = this.entity.rotation;
    this.trail.params.x = this.position.x;
    this.trail.params.y = this.position.y;
    this.trail.update(1);

    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;
  }
}
