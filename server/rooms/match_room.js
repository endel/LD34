"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

  // , Leaderboard = require('../db/leaderboard')
  , Player = require('../entities/Player')
  , Track = require('../entities/Track')
  , chunks = require('../data/chunks')

const TICK_RATE = 30
    , PATCH_RATE = 20

class MatchRoom extends Room {

  constructor (options) {
    options.updateInterval = 1000 / PATCH_RATE

    // Send cols as first element in MAP array
    var map = options.track.map.slice(0) // clone array
    map.unshift(options.track.tileSize)
    map.unshift(options.track.cols)

    super(options, {
      map: map,
      players: {}
    })

    this.track = new Track(options.track)
    this.players = {}

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    return ( this.clients.length < 10 )
  }

  onJoin (client, options) {
    console.log(client.id, 'joined')

    this.players[ client.id ] = new Player(this.track.spawnPosition)
    this.state.players[ client.id ] = {
      name: `Guest ${ this.clients.length }`
    }
    this.updatePlayer(client.id, this.players[ client.id ])

    // TODO: remove me
    this.players[ client.id ].lapInterval = this.clock.setInterval(this.logUserLap.bind(this, client), 10000)

    this.sendState(client)
  }

  logUserLap (client) {
    // Leaderboard.insert(client.id, this.roomName, this.state.players[ client.id ].name, 10000)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]

    if (key == 'name') {
      this.state.players[ client.id ].name = value

    } else if (key == 'start') {
      // set player start time
      this.players[ client.id ].started = true
      this.players[ client.id ].startTime = this.clock.currentTime
      this.send(client, 'start')

    } else if (typeof(key)==="number" && typeof(value)==="number") {
      this.players[ client.id ].left = key
      this.players[ client.id ].right = value
      console.log("left: ", key, "right: ", value)

    }
  }

  onLeave (client) {
    console.log(client.id, "leaved")

    // TODO: remove me
    this.players[ client.id ].lapInterval.clear()

    // remove player references
    delete this.state.players[ client.id ]
    delete this.players[ client.id ]
  }

  tick () {
    // update game logic
    this.clock.tick()

    for (var clientId in this.players) {
      this.updatePlayer(clientId, this.players[clientId])
    }
  }

  update () {
    this.broadcast()
  }

  updatePlayer (clientId, player) {
    if (player.left !== -1) { this.state.players[ clientId ].left = player.left }
    if (player.right !== -1) { this.state.players[ clientId ].right = player.right }

    // check collision with grass
    this.track.collide(player)

    // only move player when it's game has started
    player.update()

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
