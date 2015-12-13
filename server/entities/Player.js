'use strict';

var math = require('../utils/math')

class Player {

  constructor (spawnPosition) {
    // player started running?
    this.started = false

    this.position = { x: spawnPosition.x, y: spawnPosition.y }
    this.rotation = spawnPosition.rotation;
    this.velocity = { x:0, y:0 };
    this.acceleration = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.torque = 0;
    this.laps = []

    this._left = 0
    this._right = 0
  }

  set left (left) {
    if (left !== this._left && left === 0) {
      this.impulse(1)
    }
    this._left = left
  }

  set right (right) {
    if (right !== this._right && right === 0) {
      this.impulse(-1)
    }
    this._right = right
  }

  get left () { return this._left }
  get right () { return this._right }

  update() {
    this.rotation += this.torque;
		this.velocity.x = Math.sin(this.rotation)*this.accelerationX;
		this.velocity.y = -Math.cos(this.rotation)*this.accelerationY;

    if (this.torque < -0.001 || this.torque > 0.001) {
			this.torque *= 0.95;
		} else {
			this.torque = 0;
		}

    // acceleration x/y
		if (this.acceleration > 0.01) { this.acceleration *= 0.98; } else { this.acceleration = 0; }
		if (this.accelerationX > 0.01) { this.accelerationX *= 0.98; } else { this.accelerationX = 0; }
		if (this.accelerationY > 0.01) { this.accelerationY *= 0.98; } else { this.accelerationY = 0; }

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

  getNextPosition () {
		var velocityX = Math.sin(this.rotation)*this.acceleration
      , velocityY = -Math.cos(this.rotation)*this.acceleration

    return {
      x: this.position.x + velocityX,
      y: this.position.y + velocityY
    }
  }

  impulse(side) {
		this.torque += side*0.03;
		this.torque = math.clamp(this.torque, -0.12, 0.12);

		this.acceleration += 1;
		this.accelerationX += 1;
		this.accelerationY += 1;
		this.acceleration = math.clamp(this.acceleration, -5, 5);
		this.accelerationX = math.clamp(this.accelerationX, -5, 5);
		this.accelerationY = math.clamp(this.accelerationY, -5, 5);
	}
}

module.exports = Player
