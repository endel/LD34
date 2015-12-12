import PIXI from 'pixi.js';
import Network from './Network'
import Physics from './Physics';
import Quad from './Quad';
import Player from './Player';

export default class Game extends PIXI.Container {
  constructor() {
    super();

    this.network = new Network();
    this.physics = new Physics();

    this.world = new PIXI.Container();
    this.addChild(this.world);

    this.scenario = new PIXI.Container();
    this.world.addChild(this.scenario);

    this.camera = {x:0, y:0};
    this.entities = [];

    this.network = new Network();
    this.network.on('setup', this.onSetup.bind(this))
    this.network.on('update', this.onUpdateState.bind(this))

    this.playersByClientId = {}
  }

  onSetup (data) {
    this.loadMap(data.map)

    if (data.players) {
      for (var clientId in data.players) {
        this.playersByClientId[ clientId ] = new Player()
        this.playersByClientId[ clientId ].position.x = data.players[ clientId ].x
        this.playersByClientId[ clientId ].position.y = data.players[ clientId ].y
        this.playersByClientId[ clientId ].rotation = data.players[ clientId ].angle

        if (clientId == this.network.clientId) {
          this.player = this.playersByClientId[ clientId ]
        }

        this.addEntity(this.playersByClientId[ clientId ])
      }
    }
  }

  onUpdateState (newState) {
    for (var clientId in newState.players) {
      this.playersByClientId[ clientId ].position.x = newState.players[ clientId ].x
      this.playersByClientId[ clientId ].position.y = newState.players[ clientId ].y
      this.playersByClientId[ clientId ].rotation = newState.players[ clientId ].angle
    }
  }

  addEntity(entity) {
    this.world.addChild(entity);
    this.entities.push(entity);
  }

  loadMap(map) {
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
    // player may not have connected yet
    if (this.player) {
      this.camera.x -= (this.camera.x - this.player.position.x)*0.5;
      this.camera.y -= (this.camera.y - this.player.position.y)*0.5;
    }

    var i = this.entities.length;
    while (i--) {
      this.entities[i].update(delta);
    }
  }

  keyDown(name) {
    var key = null

    if (name == "LEFT" || name == "A") {
      key = 0
    } else if (name == "RIGHT" || name == "D") {
      key = 1
    }

    if (key) {
      console.log('down', name);
      this.network.send([key, 1])
    }
  }

  keyUp(name) {
    var key = null

    if (name == "LEFT" || name == "A") {
      key = 0
    } else if (name == "RIGHT" || name == "D") {
      key = 1
    }

    if (key) {
      console.log('up', name);
      this.network.send([key, 0])
    }

  }
}
