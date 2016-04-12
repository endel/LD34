import Colyseus from 'colyseus.js';
import EventEmitter from 'tiny-emitter'

import NameForm from '../dom/NameForm';

export default class Network extends EventEmitter {

  constructor (players) {
    super()

    if (location.hostname.match(/\.com/)) {
      var protocol = location.protocol.replace('http', 'ws')
      this.colyseus = new Colyseus(protocol + '//' + location.hostname);

    } else if (location.hostname.match(/\.zone/)) {
      var protocol = location.protocol.replace('http', 'ws')
      this.colyseus = new Colyseus(protocol + '//redneck-river-race.herokuapp.com');

    } else {
      this.colyseus = new Colyseus(`ws://${ location.hostname }:3553`)
    }

    // remove loading
    this.colyseus.onopen = function () {
      document.querySelector('section.overlay').classList.remove('loading')
    }

    this.players = players

    // Read room name from query string
    // - ?room=long
    // - ?room=square
    var roomName = location.href.match(/room=([^&|$]+)/)
    roomName = (!roomName || !roomName[1]) ? 'long' : roomName[1]

    this.room = this.colyseus.join(roomName)

    // this.onSetupRoom.bind(this)
    this.room.on('setup', this.onSetup.bind(this))
    this.room.on('data', this.onData.bind(this))
    this.room.on('patch', this.onPatchState.bind(this))

    // this.onUpdateRoom.bind(this)
    this.room.on('update', newState => this.emit('update', newState))
  }

  get clientId () {
    return this.colyseus.id
  }

  onData (data) {
    if (data === "start") {
      this.emit('start')
    } else if (data === "lap") {
      this.emit('lap')
    }
  }

  onSetup (initialState) {
    for (var clientId in initialState.players) {
      if (clientId == this.clientId) {
        this.nameForm = new NameForm(this, initialState.players[ clientId ].name)
      }
    }
    this.emit('setup', initialState)
  }

  onPatchState (patches) {
    patches.forEach(patch => {
      if (patch.op=="add" && patch.path.indexOf("/players/") === 0) {
        let [_, clientId] = patch.path.match(/\/players\/(.*)/)
        this.emit('new-player', clientId, patch.value)

      } else if (patch.op==='replace' && patch.path.indexOf("/players/") === 0) {
        let [_, clientId, property] = patch.path.match(/\/players\/(.*)\/(.*)/)
        this.players[ clientId ][ property ] = patch.value

        // TODO: refactor me
        if (property === "lapCount" || property === "bestLap") {
          console.log(property, this.players[ clientId ][ property ])
          this.players[ clientId ].emit('lap-update')
          this.emit('update-leaderboard')
        }

        // close name change modal
        if (clientId === this.clientId && property === 'name') {
          // TODO: refactor me
          this.players[ clientId ].emit('lap-update')
          this.emit('update-leaderboard')
          this.nameForm.close()
        }

      } else if (patch.op==='remove' && patch.path.indexOf("/players/") === 0) {
        // on user disconnect
        let [_, clientId] = patch.path.match(/\/players\/(.*)/)
        this.players[ clientId ].disconnect()
      }
    })
  }

  send (data) {
    this.colyseus.send(data)
  }

}
