import Colyseus from 'colyseus.js';
import EventEmitter from 'tiny-emitter'

export default class Network extends EventEmitter {

  constructor () {
    super()

    this.colyseus = new Colyseus("ws://localhost:3553")

    this.room = this.colyseus.join('map1')

    // this.onSetupRoom.bind(this)
    this.room.on('setup', initialState => this.emit('setup', initialState))

    //  this.onPatchRoom.bind(this)
    this.room.on('patch', patches => this.emit('patch', patches))

    // this.onUpdateRoom.bind(this)
    this.room.on('update', newState => this.emit('update', newState))
  }

  get clientId () {
    return this.colyseus.id
  }

  send (data) {
    this.colyseus.send(data)
  }

}
