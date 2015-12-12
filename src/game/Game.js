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

    this.playersByClientId = {};
    this.network = new Network(this.playersByClientId);
    this.network.on('setup', this.onSetup.bind(this));
    this.network.on('update', this.onUpdateState.bind(this));
    this.network.on('new-player', this.addNewPlayer.bind(this));

    this.track = new Track('long');
    this.world.addChild(this.track);
  }

  onSetup (data) {
    this.track = new Track('long');
    this.world.addChild(this.track);

    // this.loadMap(data.map)
    if (data.players) {
      for (var clientId in data.players) {
        this.addNewPlayer(clientId, data.players[ clientId ])
      }
    }
  }

  onUpdateState (newState) {
  }

  addEntity (entity) {
    console.log("Add entity!")
    this.world.addChild(entity);
    // this.entities.push(entity);
  }

  addNewPlayer (clientId, data) {
    if (this.playersByClientId[clientId]) {
      return this.playersByClientId[clientId];
    }

    var player = new Player(data);

    this.addEntity(player);
    this.playersByClientId[ clientId ] = player

    if (clientId === this.network.clientId) {
      this.player = player;
      this.camera.target = this.player;
    }
  }

  update(delta) {
    this.camera.update(delta);
    this.world.position.x = -this.camera.x;
    this.world.position.y = -this.camera.y;

    for (var clientId in this.playersByClientId) {
      this.playersByClientId[ clientId ].update(delta)
    }
    // var i = this.entities.length;
    // while (i--) {
    //   this.entities[i].update(delta);
    // }
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
