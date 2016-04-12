"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

  // , Leaderboard = require('../db/leaderboard')
  , Player = require('../entities/Player')
  , Track = require('../entities/Track')
  , chunks = require('../data/chunks')
  , math = require('../utils/math')
  , get_random_name = require('../utils/get_random_name')

const TICK_RATE = 30

class MatchRoom extends Room {

  constructor (options) {
    super(options)

    // Send cols as first element in MAP array
    var map = options.track.map.slice(0) // clone array
    map.unshift(options.track.tileSize)
    map.unshift(options.track.cols)

    this.setState({
      map: map,
      players: {}
    })

    this.track = new Track(options.track)
    this.players = {}

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    return ( this.clients.length < 20 )
  }

  onJoin (client, options) {
    console.log(client.id, 'joined')

    this.players[ client.id ] = new Player(this.track.spawnPosition)
    this.players[ client.id ].on('lap-completed', this.onLapCompleted.bind(this, client, this.players[ client.id ]))

    this.state.players[ client.id ] = {
      name: get_random_name()
    }

    this.updatePlayer(client.id, this.players[ client.id ])

    this.sendState(client)
  }

  onLapCompleted (client, player) {
    // Leaderboard.insert(client.id, this.roomName, this.state.players[ client.id ].name, 10000)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]

    if (key == 'name') {
      this.state.players[ client.id ].name = value

    } else if (key == 'start') {
      // set player start time
      this.players[ client.id ].start()
      this.send(client, 'start')

    } else if (typeof(key)==="number" && typeof(value)==="number") {
      this.players[ client.id ].left = key
      this.players[ client.id ].right = value

    }
  }

  onLeave (client) {
    console.log(client.id, "leaved")

    // remove player references
    delete this.state.players[ client.id ]
    delete this.players[ client.id ]
  }

  tick () {
    // update game logic
    this.clock.tick()
    var array = [];

    for (var clientId in this.players) {
      var player = this.players[clientId];

      this.track.collide(player) // check collision with track
      this.track.checkCheckpoints(player)

      this.updatePlayer(clientId, player);
      this.updateCollision(player, array);
      array.push(player);
    }
  }

  updateCollision(a, array) {
    for (var i in array) {
      var b = array[i];
      var ax = a.position.x;
      var ay = a.position.y;
      var bx = b.position.x;
      var by = b.position.y;
      var distance = math.distance(ax, ay, bx, by);
      if (distance < 32) {
        var angle = Math.atan2(ay - by, ax - bx);
        var fx = Math.cos(angle)*5;
        var fy = Math.sin(angle)*5;
        a.force.x += fx;
        a.force.y += fy;
        b.force.x -= fx;
        b.force.y -= fy;
      }
    }
  }

  updatePlayer (clientId, player) {
    if (player.left !== -1) { this.state.players[ clientId ].left = player.left }
    if (player.right !== -1) { this.state.players[ clientId ].right = player.right }

    // only move player when it's game has started
    player.update()

    this.state.players[ clientId ].lapCount = player.lapCount
    this.state.players[ clientId ].bestLap = player.bestLap
    this.state.players[ clientId ].targetX = player.position.x
    this.state.players[ clientId ].targetY = player.position.y
    this.state.players[ clientId ].targetAngle = player.rotation
  }

  dispose () {
    clearInterval(this.tickInterval)
    console.log("dispose MatchRoom", this.roomId)
  }

}

module.exports = MatchRoom
