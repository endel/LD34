import Colyseus from 'colyseus.js';
import EventEmitter from 'tiny-emitter'

export default class Network extends EventEmitter {

  constructor (players) {
    super()

    this.colyseus = new Colyseus("ws://localhost:3553")
    this.players = players

    this.room = this.colyseus.join('map1')

    // this.onSetupRoom.bind(this)
    this.room.on('setup', initialState => this.emit('setup', initialState))
    this.room.on('patch', this.onPatchState.bind(this))

    // this.onUpdateRoom.bind(this)
    this.room.on('update', newState => this.emit('update', newState))

  }

  get clientId () {
    return this.colyseus.id
  }

  onPatchState (patches) {
    patches.forEach(patch => {
      if (patch.op=="add" && patch.path.indexOf("/players/") === 0) {
        let [_, clientId] = patch.path.match(/\/players\/(.*)/)
        this.emit('new-player', clientId, patch.value)

      } else if (patch.op==='replace' && patch.path.indexOf("/players/") === 0) {
        let [_, clientId, property] = patch.path.match(/\/players\/(.*)\/(.*)/)
        this.players[ clientId ][ property ] = patch.value

      } else if (patch.op==='remove' && patch.path.indexOf("/players/") === 0) {
        // on user disconnect
        let [_, clientId] = patch.path.match(/\/players\/(.*)/)
        this.players[ clientId ].parent.removeChild(this.players[ clientId ])
      }
    })
  }

  send (data) {
    this.colyseus.send(data)
  }

}
