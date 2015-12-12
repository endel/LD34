module.exports.clamp = function clamp (value, min, max) {
  'use strict';
  if (value < min) {
      value = min;
  } else if (value > max) {
      value = max;
  }
  return value;
}

module.exports.sign = function sign(value) {
  'use strict';
  value = +value;
  if (value === 0 || isNaN(value)) {
    return 1;
  } else {
    return value > 0 ? 1 : -1;
  }
}

module.exports.distance = function distance(ax, ay, bx, by) {
  'use strict';
  var xs = 0;
  var ys = 0;
  xs = bx - ax;
  xs = xs * xs;
  ys = by - ay;
  ys = ys * ys;
  return Math.sqrt(xs + ys);
}

