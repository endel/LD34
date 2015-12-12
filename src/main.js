import Stage from './tools/Stage';
import Game from './game/Game';
import Colyseus from 'colyseus.js'


var lastTime = 0;
var stage = new Stage({
  targetWidth: 800,
  targetHeight: 500,
  width: 800,
  height: 500
});

var game = new Game();
stage.container.addChild(game);
game.setup([
  0, 0, 0, 0, 0,
  0, 1, 1, 1, 0,
  0, 1, 0, 1, 0,
  0, 1, 1, 1, 0,
  0, 0, 0, 0, 0
]);

render(0);

function render(time) {
  'use strict';
  var delta = time - lastTime;
  game.update(delta);
  stage.render();
  lastTime = time;
  requestAnimationFrame(render);
}
