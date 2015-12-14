import Entity from './Entity';
import lerp from 'lerp';
import Boat from '../bitmap/Boat';
import Hat from '../bitmap/Hat';
import Paddle from '../bitmap/Paddle';
import WaterTrail from '../bitmap/WaterTrail';
import WaterCircle from '../bitmap/WaterCircle';
import ParticleSystem from './ParticleSystem';
import * as math from '../tools/math';

export default class Player extends Entity {
  constructor(data) {
    super();

    this.entity = new Entity()
    this.addChild(this.entity)

    this.bestLap = data.bestLap
    this.lapCount = data.lapCount
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
    this.leftAct = false;
    this.rightAct = false;
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

    var wc = new WaterCircle();
    this.circles = new ParticleSystem(50, wc.texture);
    this.circles.rate = 0;
    this.particles.addChild(this.circles);
    this.circles.alpha = 0.02;
    this.circles.params.life = 100;
    this.circles.params.scaleX = 0.1;
    this.circles.params.scaleY = 0.1;
    this.circles.params.growthX = 0.02;
    this.circles.params.growthY = 0.02;

    var wt = new WaterTrail();
    this.trail = new ParticleSystem(200, wt.texture);
    this.particles.addChild(this.trail);
    this.trail.alpha = 0.03;
    this.trail.params.life = 60;
    this.trail.params.scaleX = 0.25;
    this.trail.params.scaleY = 0.5;
    this.trail.params.growthX = 0.005;
    this.trail.params.growthY = 0.02;
  }

  set name (name) {
    this.playerName.text = name
    this.playerName.position.x = -this.playerName.width / 2
  }

  update(delta) {
    var leftActDetected = false;
    var rightActDetected = false;

    this.position.x = lerp(this.position.x, this.targetX, this.ease);
    this.position.y = lerp(this.position.y, this.targetY, this.ease);
    this.entity.rotation = lerp(this.entity.rotation || 0, this.targetAngle, this.ease);
    this.movementRange = math.distance(this.position.x, this.position.y, this.lastPosition.x, this.lastPosition.y);

    if (this.left) {
      this.paddleRightAngle = Math.PI*0.25;
      this.hatPosition.x = 2;
      this.hatPosition.y = 2;
      this.leftAct = true;
    } else {
      this.paddleRightAngle = -Math.PI*0.25;
      if (this.leftAct) {
        this.leftAct = false;
        leftActDetected = true;
      }
    }

    if (this.right) {
      this.paddleLeftAngle = -Math.PI*0.25;
      this.hatPosition.x = -2;
      this.hatPosition.y = 2;
      this.rightAct = true;
    } else {
      this.paddleLeftAngle = Math.PI*0.25;
      if (this.rightAct) {
        this.rightAct = false;
        rightActDetected = true;
      }
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

    var range = 30;
    var ox = 0;
    var oy = 0;

    if (leftActDetected || rightActDetected) {
      ox = Math.cos(this.entity.rotation)*range;
      oy = Math.sin(this.entity.rotation)*range;
    }

    if (leftActDetected) {
      this.emitCircles(-ox, -oy);
    }

    if (rightActDetected) {
      this.emitCircles(ox, oy);
    }

    this.trail.params.life = 5 + 60*this.movementRange;
    this.trail.params.angle = this.entity.rotation;
    this.trail.params.x = this.position.x;
    this.trail.params.y = this.position.y;
    this.trail.update(1);

    this.circles.update(1);

    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;
  }

  emitCircles(ox, oy) {
    var r = 10;
    var i = 8;
    while (i--) {
      var sc = 0.05 + Math.random()*0.2;
      this.circles.params.scaleX = sc;
      this.circles.params.scaleY = sc;
      this.circles.params.life = 30 + Math.random()*100;
      this.circles.params.x = this.position.x + ox + (Math.random()*r - r/2);
      this.circles.params.y = this.position.y + oy + (Math.random()*r - r/2);
      this.circles.emit();
    }
  }
}
