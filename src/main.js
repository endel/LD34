import Stage from './tools/Stage';
import Game from './game/Game';
import keycode from 'keycode.js';
import ClockTimer from 'clock-timer.js'

var stage;
var game;
var keyNameMap;

init();

function init() {
  'use strict';
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
  window.clock = new ClockTimer()

  keyNameMap = [];
  for (var f in keycode) {
    keyNameMap[keycode[f]] = f;
  }

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  clock.start()
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
  clock.tick()
  game.update(clock.deltaTime);
  stage.render();
  requestAnimationFrame(render);
}
