"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

const TICK_RATE = 30
    , PATCH_RATE = 20

class MatchRoom extends Room {

  constructor (options) {
    options.updateInterval = 1000 / PATCH_RATE

    super(options, {
      players: {},
    })

    this.playerKeys = {}

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    return ( this.clients.length < 10 )
  }

  onJoin (client, options) {
    this.playerProps[client.id] = {
      left: 0,
      right: 0,
      angle: 0,
      velocity: 0
    }
  }

  onMessage (client, data) {
    let key = data[0]
      , keyStatus = data[1]

    if (key === 0) {
      this.playerProps[client.id].left = keyStatus

    } else if (key === 1) {
      this.playerProps[client.id].right = keyStatus
    }
  }

  tick () {
    // update game logic
    this.clock.tick()

    for (var clientId in this.playerProps) {
      this.updatePlayer(clientId, this.playerProps[clientId])
    }
  }

  update () {
    this.broadcast()
  }

  updatePlayer (clientId, props) {
    if (props.left === 1) {
      // accelerate left
    }

    if (props.right === 1) {
      // accelerate right
    }
  }

  dispose () {
    clearInterval(this.tickInterval)
    console.log("dispose MatchRoom", this.roomId)
  }

}

module.exports = MatchRoom
