import Stage from './tools/Stage';
import Game from './game/Game';
import keycode from 'keycode.js';
import ClockTimer from 'clock-timer.js'

var stage;
var game;
var keyNameMap;

window.DEFAULT_FONT = { font : '12px BitBold', fill : 0xffffff, align : 'left' }
window.PLAYER_FONT = { font : '12px BitBold', fill : 0xffffff, align : 'center' }

init();

function init() {
  'use strict';
  stage = new Stage({
    targetWidth: 800,
    targetHeight: 500,
    width: 800,
    height: 500
  });
  window.stage = stage

  game = new Game();
  stage.container.addChild(game);

  window.game = game
  window.clock = new ClockTimer()

  keyNameMap = [];
  for (var f in keycode) {
    keyNameMap[keycode[f]] = f;
  }

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchend', onTouchEnd);
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
    for (var i=0; i<e.touches.length; i++) {
      if (0.5 < e.touches[i].clientX / window.innerWidth) {
        game.keyDown("RIGHT");
      } else {
        game.keyDown("LEFT");
      }
    }
  }
}

function onTouchEnd(e) {
  game.keyUp("LEFT");
  game.keyUp("RIGHT");
}

function render(time) {
  'use strict';
  clock.tick()
  game.update(clock.deltaTime);
  stage.render();
  requestAnimationFrame(render);
}
