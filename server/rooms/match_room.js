"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

  , Leaderboard = require('../db/leaderboard')
  , Player = require('../entities/Player')

const TICK_RATE = 30
    , PATCH_RATE = 20

class MatchRoom extends Room {

  constructor (options) {
    options.updateInterval = 1000 / PATCH_RATE

    super(options, {
      map: [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 0, 1, 0,
        0, 1, 1, 1, 0,
        0, 0, 0, 0, 0
      ],
      players: {},
      leaderboard: [],
      items: []
    })

    this.players = {}

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    return ( this.clients.length < 10 )
  }

  onJoin (client, options) {
    console.log(client.id, 'joined')


    var x = 10, y = 10

    this.players[ client.id ] = new Player(x, y)

    // TODO: remove me
    this.players[ client.id ].lapInterval = this.clock.setInterval(this.logUserLap.bind(this, client), 10000)

    this.state.players[ client.id ] = {
      x: x,
      y: y,
      angle: 0,
      name: `Guest ${ this.clients.length }`
    }

    this.sendState(client)
  }

  logUserLap (client) {
    Leaderboard.insert(client.id, this.roomName, this.state.players[ client.id ].name, 10000)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]

    if (key == 'name') {
      this.state.players[ client.id ].name = value

    } else if (typeof(key)==="number" && typeof(value)==="number") {
      this.players[ client.id ].left = key
      this.players[ client.id ].right = value

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
    if (player.left === 1) {
      player.impulse(1)
      player.left = 0
    }

    if (player.right === 1) {
      player.impulse(-1)
      player.right = 0
    }

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
