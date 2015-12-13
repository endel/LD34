class Rect {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  centralize() {
  	this.x = -this.w*0.5;
  	this.y = -this.h*0.5;
  }

  scale(value) {
    this.x *= value;
    this.y *= value;
    this.w *= value;
    this.h *= value;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  set(obj) {
    if (obj.x) this.x = obj.x;
    if (obj.y) this.y = obj.y;
    if (obj.w) this.w = obj.w;
    if (obj.h) this.h = obj.h;
  }

  left() {
  	return this.x;
  }

  right() {
  	return this.x + this.w;
  }

  top() {
  	return this.y;
  }

  bottom() {
  	return this.y + this.h;
  }

  centerX() {
  	return this.x + this.w*0.5;
  }

  centerY() {
  	return this.y + this.h*0.5;
  }

  getIntersection(rect, intersection) {
  	var r1 = this;
  	var r2 = rect;
  	var r3 = intersection || Rect._intersection;

  	var areIntersected = !(r2.left() > r1.right() || r2.right() < r1.left() || r2.top() > r1.bottom() || r2.bottom() < r1.top());

  	if (areIntersected) {
  		r3.x = Math.max(r1.left(), r2.left());
  		r3.y = Math.max(r1.top(), r2.top());
  		r3.w = Math.min(r1.right(), r2.right()) - r3.x;
  		r3.h = Math.min(r1.bottom(), r2.bottom()) - r3.y;
  	} else {
  		r3.x = 0.0;
  		r3.y = 0.0;
  		r3.w = 0.0;
  		r3.h = 0.0;
  	}

  	return r3;
  }
}

Rect._intersection = new Rect();
module.export = Rect;
