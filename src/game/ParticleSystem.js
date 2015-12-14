import PIXI from 'pixi.js';

export default class ParticleSystem extends PIXI.Container {
  constructor(amount, texture, container) {
    super();
    this.particles = [];
    this.count = 0;
    this.rate = 1;
    this.emissions = 1;
    this.params = new Params();
    this.container = this;
    if (container) {
      this.container = container;
    }

    var i = amount;
    while (i--) {
      var p = new Particle(texture);
      this.container.addChild(p);
      this.particles.push(p);
    }
  }

  update(delta) {
    if (this.rate > 0) {
      this.count -= delta;
      if (this.count <= 0) {
        this.count = this.rate;
        let i = this.emissions;
        while (i--) {
          this.emit();
        }
      }
    }


    let i = this.particles.length;
    while (i--) {
      let p = this.particles[i];
      if (p.visible) {
        p.update(delta);
      }
    }
  }

  emit() {
    var p = this.get();
    if (p) {
      p.spawn(this.params);
    }
  }

  get() {
    let i = this.particles.length;
    while (i--) {
      let p = this.particles[i];
      if (!p.visible) {
        return p;
      }
    }
    return null;
  }
}

class Particle extends PIXI.Sprite {
  constructor(texture, params) {
    super();
    this.params = new Params();
    this.texture = texture;
    this.visible = false;
    this.anchor.set(0.5);
    this.life = 0;
  }

  spawn(params) {
    this.params.copy(params);
    this.visible = true;
    this.life = this.params.life;
    this.position.x = this.params.x;
    this.position.y = this.params.y;
    this.rotation = this.params.angle;
    this.scale.x = this.params.scaleX;
    this.scale.y = this.params.scaleY;
    this.alpha = 1;
  }

  dismiss() {
    this.life = 0;
    this.visible = false;
  }

  update(delta) {
    this.life -= delta;
    this.alpha = this.life/this.params.life;
    this.scale.x += this.params.growthX;
    this.scale.y += this.params.growthY;
    if (this.life <= 0) {
      this.dismiss();
    }
  }
}

class Params {
  constructor() {
    this.life = 10;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.growthX = 0;
    this.growthY = 0;
  }

  copy(params) {
    for (var f in params) {
      this[f] = params[f];
    }
  }
}
