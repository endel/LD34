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
      map: [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 0, 1, 0,
        0, 1, 1, 1, 0,
        0, 0, 0, 0, 0
      ],
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
    console.log(client.id, 'joined')

    var x = 10
      , y = 10

    this.state.players[ client.id ] = {
      x: x,
      y: y,
      angle: 0
    }

    this.playerProps[ client.id ] = {
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
      this.playerProps[ client.id ].left = keyStatus

    } else if (key === 1) {
      this.playerProps[ client.id ].right = keyStatus
    }
  }

  onLeave (client) {
    console.log(client.id, "leaved")

    // remove rigid body from simulation
    this.simulation.remove(this.playerProps[ client.id ].body)

    // remove player references
    delete this.state.players[ client.id ]
    delete this.playerProps[ client.id ]
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

    // update state for next broadcast
    this.state.players[clientId].x = origin.x()
    this.state.players[clientId].y = origin.y()
    this.state.players[clientId].angle = rotation.z()

    if (props.left === 1) {
      // accelerate left
      this.simulation.applyForce(body, {x: 10, y: 5}, {x: 10, y: 10})
      console.log("Apply force left")
    }

    if (props.right === 1) {
      // accelerate right
      console.log("Apply force right")
      this.simulation.applyForce(body, {x: -10, y: 5}, {x: -10, y: 10})
    }
  }

  dispose () {
    clearInterval(this.tickInterval)
    console.log("dispose MatchRoom", this.roomId)
  }

}

module.exports = MatchRoom
