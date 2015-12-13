import PIXI from 'pixi.js';
import Network from './Network';
import Quad from './Quad';
import Player from './Player';
import Track from './Track';
import Camera from './Camera';
import Leaderboard from './Leaderboard';

export default class Game extends PIXI.Container {

  constructor() {
    super();

    this.world = new PIXI.Container();
    this.addChild(this.world);

    this.camera = new Camera();
    this.entities = [];

    this.leaderboard = new Leaderboard();
    this.leaderboard.x = stage.width/2 - this.leaderboard.width;
    this.leaderboard.y = -stage.height/2;
    this.addChild(this.leaderboard)

    this.lapTime = new PIXI.Text("0:00", {
      font : '14px Arial',
      fill : 0xffffff,
      align : 'center'
    })
    this.lapTime.y = -stage.height/2 + 20;
    this.addChild(this.lapTime)

    this.playersByClientId = {};
    this.network = new Network(this.playersByClientId);
    this.network.on('setup', this.onSetup.bind(this));
    this.network.on('update', this.onUpdateState.bind(this));
    this.network.on('new-player', this.addNewPlayer.bind(this));
    this.network.on('start', this.onStartGame.bind(this));
    this.network.on('lap', this.onLapCompleted.bind(this));

    this.keys = [0, 0]
  }

  onSetup (data) {
    this.track = new Track();
    this.track.setup(data.map)
    this.world.addChild(this.track);

    // this.loadMap(data.map)
    if (data.players) {
      for (var clientId in data.players) {
        this.addNewPlayer(clientId, data.players[ clientId ])
      }
    }
  }

  onStartGame () {
    clock.start()
    clock.setInterval(() => {
      var elapsedSeconds = Math.floor(clock.elapsedTime / 1000)
        , minutes = Math.floor(elapsedSeconds / 60)
        , seconds = '0' + (elapsedSeconds - (minutes * 60))
      this.lapTime.text = `${ minutes }:${ seconds.substr(seconds.length - 2) }`
    }, 1000)
  }

  onLapCompleted () {
    console.log("Lap completed!")
    clock.start()
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

    if (this.keys[0] !== 0 || this.keys[1] !== 0) {
      this.network.send(this.keys)
      this.keys[0] = 0
      this.keys[1] = 0
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

    // if (key !== null) {
    //   this.keys[key] = 0
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
      this.keys[key] = 1
    }
  }
}
