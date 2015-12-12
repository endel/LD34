import Stage from './tools/Stage';
import Game from './game/Game';
import Colyseus from 'colyseus.js';
import keycode from 'keycode.js';

var colyseus = new Colyseus("ws://localhost:3553")

// console.log(Ammo)

var room = colyseus.join('map1')
room.on('setup', function(data) {
  console.log("initial data!", data)
})
room.on('patch', function(patches) {
  console.log("patched ", patches)
})

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
  game.setup([
    0, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 1, 0, 1, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0
  ]);

  keyNameMap = [];
  for (var f in keycode) {
    keyNameMap[keycode[f]] = f;
  }

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

function render(time) {
  'use strict';
  var delta = time - lastTime;
  game.update(delta);
  stage.render();
  lastTime = time;
  requestAnimationFrame(render);
}
