import PIXI from 'pixi.js';
import Physics from './Physics';
import Quad from './Quad';
import Player from './Player';

export default class Game extends PIXI.Container {
  constructor() {
    super();
    this.physics = new Physics();

    this.world = new PIXI.Container();
    this.addChild(this.world);

    this.scenario = new PIXI.Container();
    this.world.addChild(this.scenario);

    this.camera = {x:0, y:0};
    this.entities = [];

    this.player = new Player();
    this.addEntity(this.player);
    this.player.position.x = this.camera.x = 0;
    this.player.position.y = this.camera.y = 0;
  }

  addEntity(entity) {
    this.world.addChild(entity);
    this.entities.push(entity);
  }

  setup(map) {
    var len = map.length;
    var cols = Math.sqrt(len);
    var size = 128;
    for (var i = 0; i < len; i++) {
      var type = map[i];
      var px = Math.floor(i%cols);
      var py = Math.floor(i/cols);
      var color = type ? 0x3333FF : 0x33FF33;
      var quad = new Quad(color, size, size, 0, 0);
      this.scenario.addChild(quad);
      quad.position.x = px*size;
      quad.position.y = py*size;
    }
    this.scenario.position.x = -this.scenario.width/2;
    this.scenario.position.y = -this.scenario.height/2;
  }

  update(delta) {
    this.camera.x -= (this.camera.x - this.player.position.x)*0.5;
    this.camera.y -= (this.camera.y - this.player.position.y)*0.5;
    var i = this.entities.length;
    while (i--) {
      this.entities[i].update(delta);
    }
  }

  keyDown(name) {
    console.log('down', name);
  }

  keyUp(name) {
    console.log('up', name);
  }
}
