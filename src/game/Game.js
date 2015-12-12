import PIXI from 'pixi.js';
import Network from './Network';
import Physics from './Physics';
import Quad from './Quad';
import Player from './Player';
import Track from './Track';
import Camera from './Camera';

export default class Game extends PIXI.Container {
  constructor() {
    super();

    this.world = new PIXI.Container();
    this.addChild(this.world);

    this.camera = new Camera();
    this.entities = [];

    this.network = new Network();
    this.network.on('setup', this.onSetup.bind(this));
    this.network.on('update', this.onUpdateState.bind(this));
    this.playersByClientId = {};

    this.track = new Track('long');
    this.world.addChild(this.track);
  }

  onSetup (data) {
    this.track = new Track('long');
    this.world.addChild(this.track);

    // this.loadMap(data.map)
    if (data.players) {
      for (var clientId in data.players) {
        this.playersByClientId[ clientId ] = new Player();
        this.playersByClientId[ clientId ].x = data.players[ clientId ].x;
        this.playersByClientId[ clientId ].y = data.players[ clientId ].y;
        this.playersByClientId[ clientId ].rotation = data.players[ clientId ].rotation;

        if (clientId === this.network.clientId) {
          this.player = this.playersByClientId[ clientId ];
          this.camera.target = this.player;
        }

        this.addEntity(this.playersByClientId[ clientId ]);
      }
    }
  }

  onUpdateState (newState) {
    for (var clientId in newState.players) {
      var player = this.playersByClientId[ clientId ];
      var state = newState.players[ clientId ];
      player.targetX = state.x;
      player.targetY = state.y;
      player.targetAngle = state.rotation;
    }
    console.log("update state");
  }

  addEntity(entity) {
    console.log("Add entity!")
    this.world.addChild(entity);
    this.entities.push(entity);
  }

  update(delta) {
    this.camera.update(delta);
    this.world.position.x = -this.camera.x;
    this.world.position.y = -this.camera.y;

    var i = this.entities.length;
    while (i--) {
      this.entities[i].update(delta);
    }
  }

  keyDown(name) {
    var key = null;

    if (name === 'LEFT' || name === 'A') {
      key = 0;
    } else if (name === 'RIGHT' || name === 'D') {
      key = 1;
    }

    // if (key) {
    //   console.log('down', name);
    //   this.network.send([key, 1]);
    // }
  }

  keyUp(name) {
    var key = null;

    if (name === 'LEFT' || name === 'A') {
      key = 0;
    } else if (name === 'RIGHT' || name === 'D') {
      key = 1;
    }

    if (key !== null) {
      this.network.send([key, 1]);
    }
  }
}
