import Stage from './tools/Stage';
import Game from './game/Game';
import keycode from 'keycode.js';

var lastTime;
var stage;
var game;
var keyNameMap;

init();

function init() {
  'use strict';
  lastTime = 0;
  stage = new Stage({
    targetWidth: 800,
    targetHeight: 500,
    width: 800,
    height: 500
  });

  game = new Game();
  stage.container.addChild(game);

  window.game = game
  window.stage = stage

  keyNameMap = [];
  for (var f in keycode) {
    keyNameMap[keycode[f]] = f;
  }

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  render(0);
}

function onKeyDown(e) {
  'use strict';
  var name = keyNameMap[e.which];
  if (name !== undefined) {
    game.keyDown(name);
  }
}

function onKeyUp(e) {
  'use strict';
  var name = keyNameMap[e.which];
  if (name !== undefined) {
    game.keyUp(name);
  }
}

function onTouchStart(e) {
  if (e.touches && e.touches[0]) {
    if (0.5 < e.touches[0].clientX / window.innerWidth) {
      game.keyUp("LEFT");
    } else {
      game.keyUp("RIGHT");
    }
  }
}

function render(time) {
  'use strict';
  var delta = time - lastTime;
  game.update(delta);
  stage.render();
  lastTime = time;
  requestAnimationFrame(render);
}
