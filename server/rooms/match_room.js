"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')
  , Simulation = require('../simulation')

const TICK_RATE = 30
    , PATCH_RATE = 20

class MatchRoom extends Room {

  constructor (options) {
    options.updateInterval = 1000 / PATCH_RATE

    super(options, {
      players: {},
      items: []
    })

    this.playerProps = {}
    this.simulation = new Simulation()

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    return ( this.clients.length < 10 )
  }

  onJoin (client, options) {
    var x = 10
      , y = 10

    this.state.players[ client.id ] = {
      x: x,
      y: y,
      angle: 0
    }

    this.playerProps[client.id] = {
      left: 0,
      right: 0,
      speed: 0,
      body: this.simulation.add(x, y)
    }

    this.sendState(client)
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
    this.simulation.simulate(this.clock.deltaTime)

    for (var clientId in this.playerProps) {
      this.updatePlayer(clientId, this.playerProps[clientId])
    }
  }

  update () {
    this.broadcast()
  }

  updatePlayer (clientId, props) {
    // Get data from physics
    var body = props.body
      , transform = new Ammo.btTransform(); // TODO: reuse this instance to reduce leaking

    body.getMotionState().getWorldTransform(transform);

    var origin = transform.getOrigin();
    var rotation = transform.getRotation();
    this.state.players[clientId].x = origin.x()
    this.state.players[clientId].y = origin.y()
    this.state.players[clientId].angle = rotation.z()

    console.log("Update player state: ", origin.x(), origin.y(), rotation.z())

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
