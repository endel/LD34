import PIXI from 'pixi.js';

export default class ParticleSystem {
  constructor(images) {
    this.particles = [];
    this.count = 0;
    this.rate = 5;
    this.emissions = 1;
    this.params = new Params();

    for (var i in images) {
      var p = new Particle(images[i]);
      this.particles.push(p);
    }
  }

  update(delta) {
    this.count -= delta;
    if (this.count === 0) {
      let i = this.emissions;
      while (i--) {
        this.emit();
      }
    }

    let i = this.particles;
    while (i--) {
      let p = this.particles[i];
      if (p.params.life > 0) {
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
    var i = this.particles.length;
    while (i--) {
      var p = this.particles[i];
      if (p.params.life <= 0) {
        return p;
      }
    }
    return null;
  }
}

class Particle {
  constructor(image) {
    this.image = image;
    this.image.visible = false;
    this.params = new Params();
  }

  spawn(params) {
    this.image.visible = true;
    this.params.copy(params);
    this.image.position.set(this.params.x, this.params.y);
    this.image.rotation = this.params.angle;
  }

  dismiss() {
    this.params.life = 0;
    this.image.visible = false;
  }

  update(delta) {
    this.params.life -= delta;
    if (this.params.life <= 0) {
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
  }

  copy(params) {
    for (var f in params) {
      this[f] = f;
    }
  }
}
